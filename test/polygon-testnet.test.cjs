const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Student Innovation Trust - Polygon zkEVM Testnet", function () {
  let costToken;
  let projectEscrow;
  let owner;
  let student;
  let investor;
  let addrs;

  const INITIAL_SUPPLY = ethers.parseEther("12000000000"); // 12B tokens
  const MAX_SUPPLY = ethers.parseEther("100000000000"); // 100B tokens

  beforeEach(async function () {
    // Get signers
    [owner, student, investor, ...addrs] = await ethers.getSigners();

    // Deploy COST Token
    const COSTToken = await ethers.getContractFactory("COSTToken");
    costToken = await COSTToken.deploy();
    await costToken.waitForDeployment();

    // Deploy Project Escrow
    const ProjectEscrow = await ethers.getContractFactory("ProjectEscrow");
    projectEscrow = await ProjectEscrow.deploy(
      await costToken.getAddress(),
      owner.address
    );
    await projectEscrow.waitForDeployment();

    console.log("COST Token deployed to:", await costToken.getAddress());
    console.log("Project Escrow deployed to:", await projectEscrow.getAddress());
  });

  describe("COST Token Tests", function () {
    it("Should have correct initial parameters", async function () {
      expect(await costToken.name()).to.equal("Commuteshare Technologies Token");
      expect(await costToken.symbol()).to.equal("COST");
      expect(await costToken.decimals()).to.equal(18);
      expect(await costToken.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await costToken.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });

    it("Should mint tokens to owner", async function () {
      const mintAmount = ethers.parseEther("1000");
      await costToken.mint(student.address, mintAmount);
      
      expect(await costToken.balanceOf(student.address)).to.equal(mintAmount);
    });

    it("Should allow token transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      
      // Transfer from owner to student
      await costToken.transfer(student.address, transferAmount);
      expect(await costToken.balanceOf(student.address)).to.equal(transferAmount);
      
      // Transfer from student to investor
      await costToken.connect(student).transfer(investor.address, transferAmount);
      expect(await costToken.balanceOf(investor.address)).to.equal(transferAmount);
      expect(await costToken.balanceOf(student.address)).to.equal(0);
    });

    it("Should handle batch transfers", async function () {
      const recipients = [student.address, investor.address];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];
      
      await costToken.batchTransfer(recipients, amounts);
      
      expect(await costToken.balanceOf(student.address)).to.equal(amounts[0]);
      expect(await costToken.balanceOf(investor.address)).to.equal(amounts[1]);
    });

    it("Should pause and unpause token transfers", async function () {
      await costToken.pause();
      expect(await costToken.paused()).to.be.true;
      
      // Should revert when paused
      await expect(
        costToken.transfer(student.address, ethers.parseEther("100"))
      ).to.be.reverted;
      
      await costToken.unpause();
      expect(await costToken.paused()).to.be.false;
      
      // Should work after unpause
      await costToken.transfer(student.address, ethers.parseEther("100"));
      expect(await costToken.balanceOf(student.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should burn tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialSupply = await costToken.totalSupply();
      
      await costToken.burn(burnAmount);
      
      expect(await costToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Project Escrow Tests", function () {
    beforeEach(async function () {
      // Mint tokens to investor for testing
      await costToken.mint(investor.address, ethers.parseEther("10000"));
      
      // Approve escrow contract to spend investor's tokens
      await costToken.connect(investor).approve(
        await projectEscrow.getAddress(),
        ethers.parseEther("10000")
      );
    });

    it("Should create a project", async function () {
      const title = "AI Learning Platform";
      const description = "Revolutionary AI-powered learning platform for students";
      const category = "Education";
      const targetAmount = ethers.parseEther("1000");
      const duration = 30 * 24 * 60 * 60; // 30 days
      const metadataURI = "ipfs://QmTest123";

      const tx = await projectEscrow.connect(student).createProject(
        title,
        description,
        category,
        targetAmount,
        duration,
        metadataURI
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = projectEscrow.interface.parseLog(log);
          return parsed?.name === 'ProjectCreated';
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      
      const projectId = 0;
      const project = await projectEscrow.getProject(projectId);
      
      expect(project[0]).to.equal(student.address); // creator
      expect(project[1]).to.equal(title);
      expect(project[2]).to.equal(description);
      expect(project[3]).to.equal(category);
      expect(project[4]).to.equal(targetAmount);
      expect(project[7]).to.equal(0); // status: Active
    });

    it("Should allow contributions to projects", async function () {
      // Create project first
      await projectEscrow.connect(student).createProject(
        "Test Project",
        "Test Description",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;
      const contributionAmount = ethers.parseEther("500");

      // Contribute to project
      await projectEscrow.connect(investor).contribute(projectId, contributionAmount);

      // Check project current amount
      const project = await projectEscrow.getProject(projectId);
      expect(project[5]).to.equal(contributionAmount); // currentAmount

      // Check contributor's contribution
      const contribution = await projectEscrow.getContribution(projectId, investor.address);
      expect(contribution).to.equal(contributionAmount);
    });

    it("Should handle project milestones", async function () {
      // Create project first
      await projectEscrow.connect(student).createProject(
        "Milestone Project",
        "Project with milestones",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;

      // Add milestone before funding (when project is still Active)
      const milestoneDescription = "Complete MVP";
      const milestoneAmount = ethers.parseEther("500");
      const milestoneDeadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days

      await projectEscrow.connect(student).addMilestone(
        projectId,
        milestoneDescription,
        milestoneAmount,
        milestoneDeadline
      );

      // Get milestone
      const milestone = await projectEscrow.getMilestone(projectId, 0);
      expect(milestone[0]).to.equal(milestoneDescription);
      expect(milestone[1]).to.equal(milestoneAmount);
      expect(milestone[3]).to.be.false; // not completed
      expect(milestone[4]).to.be.false; // not approved

      // Now fund the project
      await projectEscrow.connect(investor).contribute(projectId, ethers.parseEther("1000"));
    });

    it("Should complete and approve milestones", async function () {
      // Setup project with milestone
      await projectEscrow.connect(student).createProject(
        "Milestone Project",
        "Project with milestones",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;
      
      // Add milestone before funding
      await projectEscrow.connect(student).addMilestone(
        projectId,
        "Complete MVP",
        ethers.parseEther("500"),
        Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      );

      // Now fund the project
      await projectEscrow.connect(investor).contribute(projectId, ethers.parseEther("1000"));

      // Complete milestone
      await projectEscrow.connect(student).completeMilestone(projectId, 0);
      
      let milestone = await projectEscrow.getMilestone(projectId, 0);
      expect(milestone[3]).to.be.true; // completed

      // Approve milestone (as investor/contributor)
      await projectEscrow.connect(investor).approveMilestone(projectId, 0);
      
      milestone = await projectEscrow.getMilestone(projectId, 0);
      expect(milestone[4]).to.be.true; // approved
    });

    it("Should handle disputes", async function () {
      // Setup project
      await projectEscrow.connect(student).createProject(
        "Dispute Project",
        "Project that will have disputes",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;
      await projectEscrow.connect(investor).contribute(projectId, ethers.parseEther("1000"));

      // Raise dispute
      const disputeReason = "Project not delivered as promised";
      await projectEscrow.connect(investor).raiseDispute(projectId, disputeReason);

      // Check project status
      const project = await projectEscrow.getProject(projectId);
      expect(project[7]).to.equal(4); // status: Disputed
    });

    it("Should allow project cancellation", async function () {
      // Create project
      await projectEscrow.connect(student).createProject(
        "Cancel Project",
        "Project to be cancelled",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;

      // Cancel project
      await projectEscrow.connect(student).cancelProject(projectId);

      // Check project status
      const project = await projectEscrow.getProject(projectId);
      expect(project[7]).to.equal(5); // status: Cancelled
    });

    it("Should handle refunds", async function () {
      // Setup project
      await projectEscrow.connect(student).createProject(
        "Refund Project",
        "Project that will be refunded",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;
      const contributionAmount = ethers.parseEther("500");
      
      await projectEscrow.connect(investor).contribute(projectId, contributionAmount);

      const initialBalance = await costToken.balanceOf(investor.address);

      // Cancel project to enable refunds
      await projectEscrow.connect(student).cancelProject(projectId);

      // Check refund (should happen automatically when project is cancelled)
      const finalBalance = await costToken.balanceOf(investor.address);
      expect(finalBalance).to.equal(initialBalance + contributionAmount);
    });

    it("Should track user projects and contributions", async function () {
      // Create multiple projects
      await projectEscrow.connect(student).createProject(
        "Project 1",
        "First project",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      await projectEscrow.connect(student).createProject(
        "Project 2",
        "Second project",
        "Education",
        ethers.parseEther("2000"),
        30 * 24 * 60 * 60,
        ""
      );

      // Contribute to projects
      await projectEscrow.connect(investor).contribute(0, ethers.parseEther("500"));
      await projectEscrow.connect(investor).contribute(1, ethers.parseEther("1000"));

      // Check user projects
      const userProjects = await projectEscrow.getUserProjects(student.address);
      expect(userProjects.length).to.equal(2);
      expect(Number(userProjects[0])).to.equal(0);
      expect(Number(userProjects[1])).to.equal(1);

      // Check user contributions
      const userContributions = await projectEscrow.getUserContributions(investor.address);
      expect(userContributions.length).to.equal(2);
      expect(Number(userContributions[0])).to.equal(0);
      expect(Number(userContributions[1])).to.equal(1);
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete project lifecycle", async function () {
      // Mint tokens to investor
      await costToken.mint(investor.address, ethers.parseEther("5000"));
      await costToken.connect(investor).approve(
        await projectEscrow.getAddress(),
        ethers.parseEther("5000")
      );

      // 1. Create project
      await projectEscrow.connect(student).createProject(
        "Complete Lifecycle Project",
        "Full project lifecycle test",
        "Technology",
        ethers.parseEther("2000"),
        30 * 24 * 60 * 60,
        "ipfs://QmComplete123"
      );

      const projectId = 0;

      // 2. Add milestones before funding
      await projectEscrow.connect(student).addMilestone(
        projectId,
        "Phase 1: Research",
        ethers.parseEther("800"),
        Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      );

      await projectEscrow.connect(student).addMilestone(
        projectId,
        "Phase 2: Development",
        ethers.parseEther("1200"),
        Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60)
      );

      // 3. Contribute to project
      await projectEscrow.connect(investor).contribute(projectId, ethers.parseEther("2000"));

      // 4. Complete and approve first milestone
      await projectEscrow.connect(student).completeMilestone(projectId, 0);
      await projectEscrow.connect(investor).approveMilestone(projectId, 0);

      // 5. Complete and approve second milestone
      await projectEscrow.connect(student).completeMilestone(projectId, 1);
      await projectEscrow.connect(investor).approveMilestone(projectId, 1);

      // Verify project completion
      const project = await projectEscrow.getProject(projectId);
      expect(project[7]).to.equal(3); // status: Completed
    });

    it("Should calculate platform fees correctly", async function () {
      // Setup
      await costToken.mint(investor.address, ethers.parseEther("1000"));
      await costToken.connect(investor).approve(
        await projectEscrow.getAddress(),
        ethers.parseEther("1000")
      );

      // Create project
      await projectEscrow.connect(student).createProject(
        "Fee Test Project",
        "Testing platform fees",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );

      const projectId = 0;

      // Add milestone before funding
      await projectEscrow.connect(student).addMilestone(
        projectId,
        "Complete project",
        ethers.parseEther("1000"),
        Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      );

      // Now fund the project
      await projectEscrow.connect(investor).contribute(projectId, ethers.parseEther("1000"));

      const initialOwnerBalance = await costToken.balanceOf(owner.address);
      const initialStudentBalance = await costToken.balanceOf(student.address);

      // Complete and approve milestone
      await projectEscrow.connect(student).completeMilestone(projectId, 0);
      await projectEscrow.connect(investor).approveMilestone(projectId, 0);

      const finalOwnerBalance = await costToken.balanceOf(owner.address);
      const finalStudentBalance = await costToken.balanceOf(student.address);

      // Platform fee should be 2.5% of milestone amount
      const expectedFee = ethers.parseEther("1000") * 25n / 1000n; // 2.5%
      const expectedStudentAmount = ethers.parseEther("1000") - expectedFee;

      expect(finalOwnerBalance - initialOwnerBalance).to.equal(expectedFee);
      expect(finalStudentBalance - initialStudentBalance).to.equal(expectedStudentAmount);
    });
  });

  describe("Gas Usage Tests", function () {
    it("Should track gas usage for major operations", async function () {
      // Mint tokens
      const mintTx = await costToken.mint(investor.address, ethers.parseEther("1000"));
      const mintReceipt = await mintTx.wait();
      console.log("Gas used for minting:", mintReceipt.gasUsed.toString());

      // Approve tokens
      const approveTx = await costToken.connect(investor).approve(
        await projectEscrow.getAddress(),
        ethers.parseEther("1000")
      );
      const approveReceipt = await approveTx.wait();
      console.log("Gas used for approval:", approveReceipt.gasUsed.toString());

      // Create project
      const createTx = await projectEscrow.connect(student).createProject(
        "Gas Test Project",
        "Testing gas usage",
        "Technology",
        ethers.parseEther("1000"),
        30 * 24 * 60 * 60,
        ""
      );
      const createReceipt = await createTx.wait();
      console.log("Gas used for project creation:", createReceipt.gasUsed.toString());

      // Contribute to project
      const contributeTx = await projectEscrow.connect(investor).contribute(0, ethers.parseEther("500"));
      const contributeReceipt = await contributeTx.wait();
      console.log("Gas used for contribution:", contributeReceipt.gasUsed.toString());
    });
  });
});
