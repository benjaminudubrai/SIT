import { ethers } from 'ethers';
import logger from '../config/logger.js';

// Initialize provider based on environment
const getRpcUrl = () => {
  if (process.env.POLYGON_ZKEVM_RPC_URL) {
    return process.env.POLYGON_ZKEVM_RPC_URL;
  }
  if (process.env.POLYGON_RPC_URL) {
    return process.env.POLYGON_RPC_URL;
  }
  // Default to Polygon zkEVM mainnet
  return 'https://zkevm-rpc.com';
};

const provider = new ethers.JsonRpcProvider(getRpcUrl());

// Initialize wallet (for server-side transactions)
let wallet = null;
if (process.env.PRIVATE_KEY) {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
}

// CShare Token ABI (enhanced)
const cshareTokenABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function burnFrom(address from, uint256 amount)",
  "function pause()",
  "function unpause()",
  "function paused() view returns (bool)",
  "function getTokenInfo() view returns (string, string, uint8, uint256, uint256, bool)",
  "function batchTransfer(address[] recipients, uint256[] amounts)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event TokensMinted(address indexed to, uint256 amount)",
  "event TokensBurned(address indexed from, uint256 amount)"
];

// Project Escrow ABI
const projectEscrowABI = [
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

// Legacy token ABI for backward compatibility
const tokenABI = cshareTokenABI;

// Initialize contract instances
let cshareContract = null;
let escrowContract = null;

if (process.env.CSHARE_CONTRACT_ADDRESS && wallet) {
  cshareContract = new ethers.Contract(process.env.CSHARE_CONTRACT_ADDRESS, cshareTokenABI, wallet);
}

if (process.env.ESCROW_CONTRACT_ADDRESS && wallet) {
  escrowContract = new ethers.Contract(process.env.ESCROW_CONTRACT_ADDRESS, projectEscrowABI, wallet);
}

// Legacy contract for backward compatibility
let contract = cshareContract;

// Utility functions
export const getProvider = () => provider;

export const getWallet = () => wallet;

export const getContract = () => contract;

export const getCShareContract = () => cshareContract;

export const getEscrowContract = () => escrowContract;

export const getNetworkInfo = async () => {
  try {
    const network = await provider.getNetwork();
    const feeData = await provider.getFeeData();
    const blockNumber = await provider.getBlockNumber();
    
    return {
      chainId: Number(network.chainId),
      name: network.name,
      gasPrice: ethers.formatUnits(feeData.gasPrice || 0n, 'gwei'),
      blockNumber
    };
  } catch (error) {
    logger.error('Error getting network info:', error);
    throw error;
  }
};

export const getTokenBalance = async (address) => {
  try {
    if (!cshareContract) {
      throw new Error('CShare contract not initialized');
    }
    
    const balance = await cshareContract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    logger.error('Error getting token balance:', error);
    throw error;
  }
};

export const getCShareTokenInfo = async () => {
  try {
    if (!cshareContract) {
      throw new Error('CShare contract not initialized');
    }
    
    const tokenInfo = await cshareContract.getTokenInfo();
    return {
      name: tokenInfo[0],
      symbol: tokenInfo[1],
      decimals: Number(tokenInfo[2]),
      totalSupply: ethers.formatEther(tokenInfo[3]),
      maxSupply: ethers.formatEther(tokenInfo[4]),
      isPaused: tokenInfo[5]
    };
  } catch (error) {
    logger.error('Error getting CShare token info:', error);
    throw error;
  }
};

export const transferTokens = async (to, amount) => {
  try {
    if (!cshareContract) {
      throw new Error('CShare contract not initialized');
    }
    
    const amountWei = ethers.parseEther(amount.toString());
    const tx = await cshareContract.transfer(to, amountWei);
    
    logger.info(`Token transfer initiated: ${tx.hash}`);
    
    const receipt = await tx.wait();
    logger.info(`Token transfer confirmed: ${receipt.hash}`);
    
    return {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    logger.error('Error transferring tokens:', error);
    throw error;
  }
};

export const mintTokens = async (to, amount) => {
  try {
    if (!cshareContract) {
      throw new Error('CShare contract not initialized');
    }
    
    const amountWei = ethers.parseEther(amount.toString());
    const tx = await cshareContract.mint(to, amountWei);
    
    logger.info(`Token minting initiated: ${tx.hash}`);
    
    const receipt = await tx.wait();
    logger.info(`Token minting confirmed: ${receipt.hash}`);
    
    return {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    logger.error('Error minting tokens:', error);
    throw error;
  }
};

export const getTransactionHistory = async (address, fromBlock = 0) => {
  try {
    if (!cshareContract) {
      throw new Error('CShare contract not initialized');
    }
    
    const filter = cshareContract.filters.Transfer(address, null);
    const events = await cshareContract.queryFilter(filter, fromBlock);
    
    return events.map(event => ({
      hash: event.transactionHash,
      from: event.args.from,
      to: event.args.to,
      amount: ethers.formatEther(event.args.value),
      blockNumber: event.blockNumber
    }));
  } catch (error) {
    logger.error('Error getting transaction history:', error);
    throw error;
  }
};

// Project Escrow Functions
export const createProject = async (title, description, category, targetAmount, durationDays, metadataURI = '') => {
  try {
    if (!escrowContract) {
      throw new Error('Escrow contract not initialized');
    }
    
    const targetAmountWei = ethers.parseEther(targetAmount.toString());
    const durationSeconds = durationDays * 24 * 60 * 60;
    
    const tx = await escrowContract.createProject(
      title,
      description,
      category,
      targetAmountWei,
      durationSeconds,
      metadataURI
    );
    
    logger.info(`Project creation initiated: ${tx.hash}`);
    
    const receipt = await tx.wait();
    logger.info(`Project creation confirmed: ${receipt.hash}`);
    
    // Extract project ID from events
    const event = receipt.logs.find(log => {
      try {
        const parsed = escrowContract.interface.parseLog(log);
        return parsed?.name === 'ProjectCreated';
      } catch {
        return false;
      }
    });
    
    let projectId = 0;
    if (event) {
      const parsed = escrowContract.interface.parseLog(event);
      projectId = Number(parsed?.args?.projectId || 0);
    }
    
    return {
      projectId,
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    logger.error('Error creating project:', error);
    throw error;
  }
};

export const getProject = async (projectId) => {
  try {
    if (!escrowContract) {
      throw new Error('Escrow contract not initialized');
    }
    
    const result = await escrowContract.getProject(projectId);
    
    return {
      creator: result[0],
      title: result[1],
      description: result[2],
      category: result[3],
      targetAmount: ethers.formatEther(result[4]),
      currentAmount: ethers.formatEther(result[5]),
      deadline: Number(result[6]),
      status: Number(result[7]),
      metadataURI: result[8],
      createdAt: Number(result[9]),
      milestoneCount: Number(result[10])
    };
  } catch (error) {
    logger.error('Error getting project:', error);
    throw error;
  }
};

export const getAllProjects = async (startId = 0, limit = 10) => {
  try {
    if (!escrowContract) {
      throw new Error('Escrow contract not initialized');
    }
    
    const totalCount = await escrowContract.projectCounter();
    const endId = Math.min(startId + limit, Number(totalCount));
    
    const projects = [];
    
    for (let i = startId; i < endId; i++) {
      try {
        const project = await getProject(i);
        projects.push({ id: i, ...project });
      } catch (error) {
        logger.warn(`Failed to fetch project ${i}:`, error);
        // Continue with next project
      }
    }
    
    return {
      projects,
      totalCount: Number(totalCount),
      hasMore: endId < Number(totalCount)
    };
  } catch (error) {
    logger.error('Error getting all projects:', error);
    throw error;
  }
};

export const validateAddress = (address) => {
  return ethers.isAddress(address);
};

export const formatEther = (value) => {
  return ethers.formatEther(value);
};

export const parseEther = (value) => {
  return ethers.parseEther(value.toString());
};

// Health check for blockchain connection
export const checkBlockchainHealth = async () => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    return {
      status: 'healthy',
      network: network.name,
      chainId: Number(network.chainId),
      blockNumber,
      contracts: {
        cshare: process.env.CSHARE_CONTRACT_ADDRESS || 'Not configured',
        escrow: process.env.ESCROW_CONTRACT_ADDRESS || 'Not configured'
      },
      rpcUrl: getRpcUrl()
    };
  } catch (error) {
    logger.error('Blockchain health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};
