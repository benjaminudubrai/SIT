import { ethers, BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';

// Project Escrow ABI
const PROJECT_ESCROW_ABI = [
  "function createProject(string title, string description, string category, uint256 targetAmount, uint256 duration, string metadataURI) returns (uint256)",
  "function contribute(uint256 projectId, uint256 amount)",
  "function addMilestone(uint256 projectId, string description, uint256 amount, uint256 deadline)",
  "function completeMilestone(uint256 projectId, uint256 milestoneId)",
  "function approveMilestone(uint256 projectId, uint256 milestoneId)",
  "function raiseDispute(uint256 projectId, string reason)",
  "function refundProject(uint256 projectId)",
  "function cancelProject(uint256 projectId)",
  "function getProject(uint256 projectId) view returns (address, string, string, string, uint256, uint256, uint256, uint8, string, uint256, uint256)",
  "function getMilestone(uint256 projectId, uint256 milestoneId) view returns (string, uint256, uint256, bool, bool)",
  "function getContributors(uint256 projectId) view returns (address[])",
  "function getUserProjects(address user) view returns (uint256[])",
  "function getUserContributions(address user) view returns (uint256[])",
  "function getContribution(uint256 projectId, address contributor) view returns (uint256)",
  "function projectCounter() view returns (uint256)",
  "function cshareToken() view returns (address)",
  "event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 targetAmount, uint256 deadline)",
  "event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount, uint256 totalRaised)",
  "event ProjectFunded(uint256 indexed projectId, uint256 totalAmount, uint256 contributorCount)",
  "event MilestoneAdded(uint256 indexed projectId, uint256 milestoneId, string description, uint256 amount)",
  "event MilestoneCompleted(uint256 indexed projectId, uint256 milestoneId, uint256 amountReleased)",
  "event FundsReleased(uint256 indexed projectId, address indexed creator, uint256 amount, uint256 milestone)",
  "event DisputeRaised(uint256 indexed projectId, address indexed raiser, string reason)",
  "event ProjectRefunded(uint256 indexed projectId, uint256 totalRefunded, uint256 contributorCount)"
];

export enum ProjectStatus {
  Active = 0,
  Funded = 1,
  InProgress = 2,
  Completed = 3,
  Disputed = 4,
  Cancelled = 5,
  Refunded = 6
}

export interface ProjectData {
  creator: string;
  title: string;
  description: string;
  category: string;
  targetAmount: string;
  currentAmount: string;
  deadline: number;
  status: ProjectStatus;
  metadataURI: string;
  createdAt: number;
  milestoneCount: number;
}

export interface MilestoneData {
  description: string;
  amount: string;
  deadline: number;
  completed: boolean;
  approved: boolean;
}

export interface ContributionData {
  projectId: number;
  contributor: string;
  amount: string;
  timestamp: number;
}

/**
 * Create a new project on the escrow contract
 */
export const createProject = async (
  contractAddress: string,
  signer: ethers.Signer,
  title: string,
  description: string,
  category: string,
  targetAmount: string,
  durationDays: number,
  metadataURI: string = ''
): Promise<{ projectId: number; tx: ethers.ContractTransactionResponse }> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const targetAmountWei = parseUnits(targetAmount, 18);
    const durationSeconds = durationDays * 24 * 60 * 60;
    
    const tx = await contract.createProject(
      title,
      description,
      category,
      targetAmountWei,
      durationSeconds,
      metadataURI
    );
    
    const receipt = await tx.wait();
    
    // Extract project ID from the event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'ProjectCreated';
      } catch {
        return false;
      }
    });
    
    let projectId = 0;
    if (event) {
      const parsed = contract.interface.parseLog(event);
      projectId = Number(parsed?.args?.projectId || 0);
    }
    
    return { projectId, tx };
  } catch (error: any) {
    console.error('Error creating project:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

/**
 * Contribute to a project
 */
export const contributeToProject = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number,
  amount: string
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const amountWei = parseUnits(amount, 18);
    
    const tx = await contract.contribute(projectId, amountWei);
    return tx;
  } catch (error: any) {
    console.error('Error contributing to project:', error);
    throw new Error(`Failed to contribute to project: ${error.message}`);
  }
};

/**
 * Add milestone to a project
 */
export const addMilestone = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number,
  description: string,
  amount: string,
  deadlineDays: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const amountWei = parseUnits(amount, 18);
    const deadline = Math.floor(Date.now() / 1000) + (deadlineDays * 24 * 60 * 60);
    
    const tx = await contract.addMilestone(projectId, description, amountWei, deadline);
    return tx;
  } catch (error: any) {
    console.error('Error adding milestone:', error);
    throw new Error(`Failed to add milestone: ${error.message}`);
  }
};

/**
 * Complete a milestone
 */
export const completeMilestone = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number,
  milestoneId: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const tx = await contract.completeMilestone(projectId, milestoneId);
    return tx;
  } catch (error: any) {
    console.error('Error completing milestone:', error);
    throw new Error(`Failed to complete milestone: ${error.message}`);
  }
};

/**
 * Approve a milestone
 */
export const approveMilestone = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number,
  milestoneId: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const tx = await contract.approveMilestone(projectId, milestoneId);
    return tx;
  } catch (error: any) {
    console.error('Error approving milestone:', error);
    throw new Error(`Failed to approve milestone: ${error.message}`);
  }
};

/**
 * Raise a dispute for a project
 */
export const raiseDispute = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number,
  reason: string
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const tx = await contract.raiseDispute(projectId, reason);
    return tx;
  } catch (error: any) {
    console.error('Error raising dispute:', error);
    throw new Error(`Failed to raise dispute: ${error.message}`);
  }
};

/**
 * Cancel a project
 */
export const cancelProject = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const tx = await contract.cancelProject(projectId);
    return tx;
  } catch (error: any) {
    console.error('Error cancelling project:', error);
    throw new Error(`Failed to cancel project: ${error.message}`);
  }
};

/**
 * Request refund for a project
 */
export const refundProject = async (
  contractAddress: string,
  signer: ethers.Signer,
  projectId: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, signer);
    const tx = await contract.refundProject(projectId);
    return tx;
  } catch (error: any) {
    console.error('Error requesting refund:', error);
    throw new Error(`Failed to request refund: ${error.message}`);
  }
};

/**
 * Get project details
 */
export const getProject = async (
  contractAddress: string,
  provider: BrowserProvider,
  projectId: number
): Promise<ProjectData> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const result = await contract.getProject(projectId);
    
    return {
      creator: result[0],
      title: result[1],
      description: result[2],
      category: result[3],
      targetAmount: formatUnits(result[4], 18),
      currentAmount: formatUnits(result[5], 18),
      deadline: Number(result[6]),
      status: Number(result[7]) as ProjectStatus,
      metadataURI: result[8],
      createdAt: Number(result[9]),
      milestoneCount: Number(result[10])
    };
  } catch (error: any) {
    console.error('Error getting project:', error);
    throw new Error(`Failed to get project: ${error.message}`);
  }
};

/**
 * Get milestone details
 */
export const getMilestone = async (
  contractAddress: string,
  provider: BrowserProvider,
  projectId: number,
  milestoneId: number
): Promise<MilestoneData> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const result = await contract.getMilestone(projectId, milestoneId);
    
    return {
      description: result[0],
      amount: formatUnits(result[1], 18),
      deadline: Number(result[2]),
      completed: result[3],
      approved: result[4]
    };
  } catch (error: any) {
    console.error('Error getting milestone:', error);
    throw new Error(`Failed to get milestone: ${error.message}`);
  }
};

/**
 * Get project contributors
 */
export const getProjectContributors = async (
  contractAddress: string,
  provider: BrowserProvider,
  projectId: number
): Promise<string[]> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const contributors = await contract.getContributors(projectId);
    return contributors;
  } catch (error: any) {
    console.error('Error getting contributors:', error);
    throw new Error(`Failed to get contributors: ${error.message}`);
  }
};

/**
 * Get user's projects
 */
export const getUserProjects = async (
  contractAddress: string,
  provider: BrowserProvider,
  userAddress: string
): Promise<number[]> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const projectIds = await contract.getUserProjects(userAddress);
    return projectIds.map((id: any) => Number(id));
  } catch (error: any) {
    console.error('Error getting user projects:', error);
    throw new Error(`Failed to get user projects: ${error.message}`);
  }
};

/**
 * Get user's contributions
 */
export const getUserContributions = async (
  contractAddress: string,
  provider: BrowserProvider,
  userAddress: string
): Promise<number[]> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const projectIds = await contract.getUserContributions(userAddress);
    return projectIds.map((id: any) => Number(id));
  } catch (error: any) {
    console.error('Error getting user contributions:', error);
    throw new Error(`Failed to get user contributions: ${error.message}`);
  }
};

/**
 * Get contribution amount for a specific project and contributor
 */
export const getContribution = async (
  contractAddress: string,
  provider: BrowserProvider,
  projectId: number,
  contributor: string
): Promise<string> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const amount = await contract.getContribution(projectId, contributor);
    return formatUnits(amount, 18);
  } catch (error: any) {
    console.error('Error getting contribution:', error);
    throw new Error(`Failed to get contribution: ${error.message}`);
  }
};

/**
 * Get total number of projects
 */
export const getProjectCount = async (
  contractAddress: string,
  provider: BrowserProvider
): Promise<number> => {
  try {
    const contract = new Contract(contractAddress, PROJECT_ESCROW_ABI, provider);
    const count = await contract.projectCounter();
    return Number(count);
  } catch (error: any) {
    console.error('Error getting project count:', error);
    throw new Error(`Failed to get project count: ${error.message}`);
  }
};

/**
 * Get all projects (paginated)
 */
export const getAllProjects = async (
  contractAddress: string,
  provider: BrowserProvider,
  startId: number = 0,
  limit: number = 10
): Promise<ProjectData[]> => {
  try {
    const totalCount = await getProjectCount(contractAddress, provider);
    const endId = Math.min(startId + limit, totalCount);
    
    const projects: ProjectData[] = [];
    
    for (let i = startId; i < endId; i++) {
      try {
        const project = await getProject(contractAddress, provider, i);
        projects.push(project);
      } catch (error) {
        console.warn(`Failed to fetch project ${i}:`, error);
        // Continue with next project
      }
    }
    
    return projects;
  } catch (error: any) {
    console.error('Error getting all projects:', error);
    throw new Error(`Failed to get all projects: ${error.message}`);
  }
};

/**
 * Get project status name
 */
export const getProjectStatusName = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.Active:
      return 'Active';
    case ProjectStatus.Funded:
      return 'Funded';
    case ProjectStatus.InProgress:
      return 'In Progress';
    case ProjectStatus.Completed:
      return 'Completed';
    case ProjectStatus.Disputed:
      return 'Disputed';
    case ProjectStatus.Cancelled:
      return 'Cancelled';
    case ProjectStatus.Refunded:
      return 'Refunded';
    default:
      return 'Unknown';
  }
};

/**
 * Calculate project progress percentage
 */
export const calculateProjectProgress = (currentAmount: string, targetAmount: string): number => {
  try {
    const current = parseFloat(currentAmount);
    const target = parseFloat(targetAmount);
    
    if (target === 0) return 0;
    
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0;
  }
};

/**
 * Check if project deadline has passed
 */
export const isProjectExpired = (deadline: number): boolean => {
  return Date.now() / 1000 > deadline;
};

/**
 * Format time remaining until deadline
 */
export const formatTimeRemaining = (deadline: number): string => {
  const now = Date.now() / 1000;
  const remaining = deadline - now;
  
  if (remaining <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(remaining / (24 * 60 * 60));
  const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remaining % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export default {
  createProject,
  contributeToProject,
  addMilestone,
  completeMilestone,
  approveMilestone,
  raiseDispute,
  cancelProject,
  refundProject,
  getProject,
  getMilestone,
  getProjectContributors,
  getUserProjects,
  getUserContributions,
  getContribution,
  getProjectCount,
  getAllProjects,
  getProjectStatusName,
  calculateProjectProgress,
  isProjectExpired,
  formatTimeRemaining
};
