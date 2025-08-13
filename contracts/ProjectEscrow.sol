// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./COSTToken.sol";

/**
 * @title ProjectEscrow
 * @dev Smart contract for managing project funding and escrow on Polygon zkEVM
 * Features:
 * - Project creation and funding
 * - Milestone-based fund release
 * - Dispute resolution mechanism
 * - Automatic refunds for failed projects
 */
contract ProjectEscrow is ReentrancyGuard, Ownable, Pausable {
    COSTToken public immutable costToken;
    
    enum ProjectStatus { 
        Active, 
        Funded, 
        InProgress, 
        Completed, 
        Disputed, 
        Cancelled, 
        Refunded 
    }
    
    enum DisputeStatus {
        None,
        Raised,
        UnderReview,
        Resolved
    }
    
    struct Milestone {
        string description;
        uint256 amount;
        uint256 deadline;
        bool completed;
        bool approved;
    }
    
    struct Project {
        address creator;
        string title;
        string description;
        string category;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        ProjectStatus status;
        string metadataURI;
        uint256 createdAt;
        uint256 milestoneCount;
        mapping(uint256 => Milestone) milestones;
    }
    
    struct Dispute {
        address raiser;
        string reason;
        uint256 raisedAt;
        DisputeStatus status;
        address resolver;
        string resolution;
    }
    
    // State variables
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public contributors;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256[]) public userProjects;
    mapping(address => uint256[]) public userContributions;
    
    uint256 public projectCounter;
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    uint256 public constant MIN_PROJECT_DURATION = 7 days;
    uint256 public constant MAX_PROJECT_DURATION = 365 days;
    uint256 public constant DISPUTE_PERIOD = 7 days;
    
    address public feeRecipient;
    uint256 public totalFeesCollected;
    
    // Events
    event ProjectCreated(
        uint256 indexed projectId, 
        address indexed creator, 
        string title,
        uint256 targetAmount,
        uint256 deadline
    );
    
    event ContributionMade(
        uint256 indexed projectId, 
        address indexed contributor, 
        uint256 amount,
        uint256 totalRaised
    );
    
    event ProjectFunded(
        uint256 indexed projectId, 
        uint256 totalAmount,
        uint256 contributorCount
    );
    
    event MilestoneAdded(
        uint256 indexed projectId,
        uint256 milestoneId,
        string description,
        uint256 amount
    );
    
    event MilestoneCompleted(
        uint256 indexed projectId,
        uint256 milestoneId,
        uint256 amountReleased
    );
    
    event FundsReleased(
        uint256 indexed projectId, 
        address indexed creator, 
        uint256 amount,
        uint256 milestone
    );
    
    event DisputeRaised(
        uint256 indexed projectId, 
        address indexed raiser,
        string reason
    );
    
    event DisputeResolved(
        uint256 indexed projectId,
        address indexed resolver,
        string resolution
    );
    
    event ProjectRefunded(
        uint256 indexed projectId,
        uint256 totalRefunded,
        uint256 contributorCount
    );
    
    event ProjectStatusChanged(
        uint256 indexed projectId,
        ProjectStatus oldStatus,
        ProjectStatus newStatus
    );
    
    constructor(address _costToken, address _feeRecipient) Ownable(msg.sender) {
        require(_costToken != address(0), "Invalid token address");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        costToken = COSTToken(_costToken);
        feeRecipient = _feeRecipient;
    }
    
    modifier validProject(uint256 _projectId) {
        require(_projectId < projectCounter, "Project does not exist");
        _;
    }
    
    modifier onlyProjectCreator(uint256 _projectId) {
        require(projects[_projectId].creator == msg.sender, "Not project creator");
        _;
    }
    
    modifier onlyContributor(uint256 _projectId) {
        require(contributions[_projectId][msg.sender] > 0, "Not a contributor");
        _;
    }
    
    /**
     * @dev Create a new project
     */
    function createProject(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _targetAmount,
        uint256 _duration,
        string memory _metadataURI
    ) external whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetAmount > 0, "Target amount must be positive");
        require(_duration >= MIN_PROJECT_DURATION && _duration <= MAX_PROJECT_DURATION, "Invalid duration");
        
        uint256 projectId = projectCounter++;
        uint256 deadline = block.timestamp + _duration;
        
        Project storage project = projects[projectId];
        project.creator = msg.sender;
        project.title = _title;
        project.description = _description;
        project.category = _category;
        project.targetAmount = _targetAmount;
        project.currentAmount = 0;
        project.deadline = deadline;
        project.status = ProjectStatus.Active;
        project.metadataURI = _metadataURI;
        project.createdAt = block.timestamp;
        project.milestoneCount = 0;
        
        userProjects[msg.sender].push(projectId);
        
        emit ProjectCreated(projectId, msg.sender, _title, _targetAmount, deadline);
        return projectId;
    }
    
    /**
     * @dev Add milestone to project
     */
    function addMilestone(
        uint256 _projectId,
        string memory _description,
        uint256 _amount,
        uint256 _deadline
    ) external validProject(_projectId) onlyProjectCreator(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_amount > 0, "Amount must be positive");
        
        uint256 milestoneId = project.milestoneCount++;
        Milestone storage milestone = project.milestones[milestoneId];
        milestone.description = _description;
        milestone.amount = _amount;
        milestone.deadline = _deadline;
        milestone.completed = false;
        milestone.approved = false;
        
        emit MilestoneAdded(_projectId, milestoneId, _description, _amount);
    }
    
    /**
     * @dev Contribute to a project
     */
    function contribute(uint256 _projectId, uint256 _amount) 
        external 
        validProject(_projectId) 
        nonReentrant 
        whenNotPaused 
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        require(block.timestamp < project.deadline, "Project deadline passed");
        require(_amount > 0, "Amount must be positive");
        require(msg.sender != project.creator, "Creator cannot contribute to own project");
        
        // Transfer tokens from contributor to contract
        require(
            costToken.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );
        
        // Track contribution
        if (contributions[_projectId][msg.sender] == 0) {
            contributors[_projectId].push(msg.sender);
            userContributions[msg.sender].push(_projectId);
        }
        
        contributions[_projectId][msg.sender] += _amount;
        project.currentAmount += _amount;
        
        emit ContributionMade(_projectId, msg.sender, _amount, project.currentAmount);
        
        // Check if project is fully funded
        if (project.currentAmount >= project.targetAmount) {
            _changeProjectStatus(_projectId, ProjectStatus.Funded);
            emit ProjectFunded(_projectId, project.currentAmount, contributors[_projectId].length);
        }
    }
    
    /**
     * @dev Complete milestone and request fund release
     */
    function completeMilestone(uint256 _projectId, uint256 _milestoneId) 
        external 
        validProject(_projectId) 
        onlyProjectCreator(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Funded || project.status == ProjectStatus.InProgress, "Invalid project status");
        require(_milestoneId < project.milestoneCount, "Invalid milestone");
        
        Milestone storage milestone = project.milestones[_milestoneId];
        require(!milestone.completed, "Milestone already completed");
        require(block.timestamp <= milestone.deadline, "Milestone deadline passed");
        
        milestone.completed = true;
        
        if (project.status == ProjectStatus.Funded) {
            _changeProjectStatus(_projectId, ProjectStatus.InProgress);
        }
        
        emit MilestoneCompleted(_projectId, _milestoneId, milestone.amount);
    }
    
    /**
     * @dev Approve milestone completion and release funds
     */
    function approveMilestone(uint256 _projectId, uint256 _milestoneId) 
        external 
        validProject(_projectId) 
        onlyContributor(_projectId) 
    {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        require(milestone.completed, "Milestone not completed");
        require(!milestone.approved, "Milestone already approved");
        
        milestone.approved = true;
        
        // Calculate platform fee
        uint256 platformFee = (milestone.amount * PLATFORM_FEE) / 10000;
        uint256 creatorAmount = milestone.amount - platformFee;
        
        // Transfer funds
        require(costToken.transfer(feeRecipient, platformFee), "Fee transfer failed");
        require(costToken.transfer(project.creator, creatorAmount), "Creator transfer failed");
        
        totalFeesCollected += platformFee;
        
        emit FundsReleased(_projectId, project.creator, creatorAmount, _milestoneId);
        
        // Check if all milestones are completed
        bool allCompleted = true;
        for (uint256 i = 0; i < project.milestoneCount; i++) {
            if (!project.milestones[i].approved) {
                allCompleted = false;
                break;
            }
        }
        
        if (allCompleted) {
            _changeProjectStatus(_projectId, ProjectStatus.Completed);
        }
    }
    
    /**
     * @dev Raise a dispute
     */
    function raiseDispute(uint256 _projectId, string memory _reason) 
        external 
        validProject(_projectId) 
        onlyContributor(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.InProgress || 
            project.status == ProjectStatus.Funded,
            "Cannot dispute this project"
        );
        
        Dispute storage dispute = disputes[_projectId];
        require(dispute.status == DisputeStatus.None, "Dispute already exists");
        
        dispute.raiser = msg.sender;
        dispute.reason = _reason;
        dispute.raisedAt = block.timestamp;
        dispute.status = DisputeStatus.Raised;
        
        _changeProjectStatus(_projectId, ProjectStatus.Disputed);
        
        emit DisputeRaised(_projectId, msg.sender, _reason);
    }
    
    /**
     * @dev Resolve dispute (only owner)
     */
    function resolveDispute(
        uint256 _projectId, 
        string memory _resolution,
        bool _refundContributors
    ) external validProject(_projectId) onlyOwner {
        Dispute storage dispute = disputes[_projectId];
        require(dispute.status == DisputeStatus.Raised, "No active dispute");
        
        dispute.resolver = msg.sender;
        dispute.resolution = _resolution;
        dispute.status = DisputeStatus.Resolved;
        
        if (_refundContributors) {
            _refundProject(_projectId);
        } else {
            _changeProjectStatus(_projectId, ProjectStatus.InProgress);
        }
        
        emit DisputeResolved(_projectId, msg.sender, _resolution);
    }
    
    /**
     * @dev Refund contributors for failed/cancelled projects
     */
    function refundProject(uint256 _projectId) external validProject(_projectId) {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.Cancelled ||
            (block.timestamp > project.deadline && project.status == ProjectStatus.Active) ||
            project.status == ProjectStatus.Disputed,
            "Refund not available"
        );
        
        _refundProject(_projectId);
    }
    
    /**
     * @dev Internal function to handle refunds
     */
    function _refundProject(uint256 _projectId) internal {
        Project storage project = projects[_projectId];
        address[] memory projectContributors = contributors[_projectId];
        uint256 totalRefunded = 0;
        
        for (uint256 i = 0; i < projectContributors.length; i++) {
            address contributor = projectContributors[i];
            uint256 contribution = contributions[_projectId][contributor];
            
            if (contribution > 0) {
                contributions[_projectId][contributor] = 0;
                require(costToken.transfer(contributor, contribution), "Refund transfer failed");
                totalRefunded += contribution;
            }
        }
        
        _changeProjectStatus(_projectId, ProjectStatus.Refunded);
        
        emit ProjectRefunded(_projectId, totalRefunded, projectContributors.length);
    }
    
    /**
     * @dev Cancel project (only creator, before funding)
     */
    function cancelProject(uint256 _projectId) 
        external 
        validProject(_projectId) 
        onlyProjectCreator(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Cannot cancel project");
        
        _changeProjectStatus(_projectId, ProjectStatus.Cancelled);
        
        if (project.currentAmount > 0) {
            _refundProject(_projectId);
        }
    }
    
    /**
     * @dev Internal function to change project status
     */
    function _changeProjectStatus(uint256 _projectId, ProjectStatus _newStatus) internal {
        ProjectStatus oldStatus = projects[_projectId].status;
        projects[_projectId].status = _newStatus;
        emit ProjectStatusChanged(_projectId, oldStatus, _newStatus);
    }
    
    // View functions
    function getProject(uint256 _projectId) external view validProject(_projectId) returns (
        address creator,
        string memory title,
        string memory description,
        string memory category,
        uint256 targetAmount,
        uint256 currentAmount,
        uint256 deadline,
        ProjectStatus status,
        string memory metadataURI,
        uint256 createdAt,
        uint256 milestoneCount
    ) {
        Project storage project = projects[_projectId];
        return (
            project.creator,
            project.title,
            project.description,
            project.category,
            project.targetAmount,
            project.currentAmount,
            project.deadline,
            project.status,
            project.metadataURI,
            project.createdAt,
            project.milestoneCount
        );
    }
    
    function getMilestone(uint256 _projectId, uint256 _milestoneId) external view returns (
        string memory description,
        uint256 amount,
        uint256 deadline,
        bool completed,
        bool approved
    ) {
        Milestone storage milestone = projects[_projectId].milestones[_milestoneId];
        return (
            milestone.description,
            milestone.amount,
            milestone.deadline,
            milestone.completed,
            milestone.approved
        );
    }
    
    function getContributors(uint256 _projectId) external view returns (address[] memory) {
        return contributors[_projectId];
    }
    
    function getUserProjects(address _user) external view returns (uint256[] memory) {
        return userProjects[_user];
    }
    
    function getUserContributions(address _user) external view returns (uint256[] memory) {
        return userContributions[_user];
    }
    
    function getContribution(uint256 _projectId, address _contributor) external view returns (uint256) {
        return contributions[_projectId][_contributor];
    }
    
    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid address");
        feeRecipient = _newRecipient;
    }
    
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        require(_token != address(costToken), "Cannot withdraw COST tokens");
        IERC20(_token).transfer(owner(), _amount);
    }
}
