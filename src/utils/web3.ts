import { ethers, BrowserProvider, Contract, formatUnits, parseUnits, isAddress } from 'ethers';

// Polygon zkEVM Mainnet configuration
export const POLYGON_ZKEVM_CONFIG = {
  chainId: '0x44D', // 1101 in hex
  chainName: 'Polygon zkEVM',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://zkevm-rpc.com'],
  blockExplorerUrls: ['https://zkevm.polygonscan.com/']
};

// Polygon zkEVM Testnet configuration
export const POLYGON_ZKEVM_TESTNET_CONFIG = {
  chainId: '0x5A2', // 1442 in hex
  chainName: 'Polygon zkEVM Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://rpc.public.zkevm-test.net'],
  blockExplorerUrls: ['https://testnet-zkevm.polygonscan.com/']
};

// Polygon Mumbai Testnet configuration (for fallback testing)
export const POLYGON_MUMBAI_CONFIG = {
  chainId: '0x13881', // 80001 in hex
  chainName: 'Polygon Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};

// CShare Token ABI (enhanced)
const CSHARE_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
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

export interface WalletConnection {
  provider: BrowserProvider;
  signer: ethers.Signer;
  address: string;
  chainId: number;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Connect to MetaMask wallet
export const connectWallet = async (): Promise<WalletConnection> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    await window.ethereum!.request({ method: 'eth_requestAccounts' });
    
    const provider = new BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return {
      provider,
      signer,
      address,
      chainId: Number(network.chainId)
    };
  } catch (error: any) {
    console.error('Error connecting wallet:', error);
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

// Switch to Polygon zkEVM
export const switchToPolygonZkEVM = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to the network
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_ZKEVM_CONFIG.chainId }],
    });
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_ZKEVM_CONFIG]
        });
      } catch (addError: any) {
        throw new Error(`Failed to add Polygon zkEVM network: ${addError.message}`);
      }
    } else {
      throw new Error(`Failed to switch to Polygon zkEVM: ${switchError.message}`);
    }
  }
};

// Switch to Polygon zkEVM Testnet
export const switchToPolygonZkEVMTestnet = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to the network
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_ZKEVM_TESTNET_CONFIG.chainId }],
    });
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_ZKEVM_TESTNET_CONFIG]
        });
      } catch (addError: any) {
        throw new Error(`Failed to add Polygon zkEVM Testnet network: ${addError.message}`);
      }
    } else {
      throw new Error(`Failed to switch to Polygon zkEVM Testnet: ${switchError.message}`);
    }
  }
};

// Switch to Polygon Mumbai Testnet (fallback)
export const switchToPolygonMumbai = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to the network
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_MUMBAI_CONFIG.chainId }],
    });
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_MUMBAI_CONFIG]
        });
      } catch (addError: any) {
        throw new Error(`Failed to add Polygon Mumbai network: ${addError.message}`);
      }
    } else {
      throw new Error(`Failed to switch to Polygon Mumbai: ${switchError.message}`);
    }
  }
};

// Get CShare token information
export const getCShareTokenInfo = async (
  contractAddress: string,
  provider: BrowserProvider,
  userAddress: string
): Promise<TokenInfo & { totalSupply: string; maxSupply: string; isPaused: boolean }> => {
  try {
    const contract = new Contract(contractAddress, CSHARE_TOKEN_ABI, provider);
    
    const [tokenInfo, balance] = await Promise.all([
      contract.getTokenInfo(),
      contract.balanceOf(userAddress)
    ]);

    return {
      name: tokenInfo[0],
      symbol: tokenInfo[1],
      decimals: tokenInfo[2],
      balance: formatUnits(balance, tokenInfo[2]),
      totalSupply: formatUnits(tokenInfo[3], tokenInfo[2]),
      maxSupply: formatUnits(tokenInfo[4], tokenInfo[2]),
      isPaused: tokenInfo[5]
    };
  } catch (error: any) {
    console.error('Error getting CShare token info:', error);
    throw new Error(`Failed to get token information: ${error.message}`);
  }
};

// Get token information (legacy support)
export const getTokenInfo = async (
  contractAddress: string,
  provider: BrowserProvider,
  userAddress: string
): Promise<TokenInfo> => {
  const info = await getCShareTokenInfo(contractAddress, provider, userAddress);
  return {
    name: info.name,
    symbol: info.symbol,
    decimals: info.decimals,
    balance: info.balance
  };
};

// Transfer CShare tokens
export const transferCShareTokens = async (
  contractAddress: string,
  signer: ethers.Signer,
  to: string,
  amount: string
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, CSHARE_TOKEN_ABI, signer);
    const decimals = await contract.decimals();
    const amountWei = parseUnits(amount, decimals);
    
    const tx = await contract.transfer(to, amountWei);
    return tx;
  } catch (error: any) {
    console.error('Error transferring CShare tokens:', error);
    throw new Error(`Failed to transfer tokens: ${error.message}`);
  }
};

// Transfer tokens (legacy support)
export const transferTokens = async (
  contractAddress: string,
  signer: ethers.Signer,
  to: string,
  amount: string
): Promise<ethers.ContractTransactionResponse> => {
  return transferCShareTokens(contractAddress, signer, to, amount);
};

// Approve token spending
export const approveTokens = async (
  contractAddress: string,
  signer: ethers.Signer,
  spender: string,
  amount: string
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = new Contract(contractAddress, CSHARE_TOKEN_ABI, signer);
    const decimals = await contract.decimals();
    const amountWei = parseUnits(amount, decimals);
    
    const tx = await contract.approve(spender, amountWei);
    return tx;
  } catch (error: any) {
    console.error('Error approving tokens:', error);
    throw new Error(`Failed to approve tokens: ${error.message}`);
  }
};

// Get token allowance
export const getTokenAllowance = async (
  contractAddress: string,
  provider: BrowserProvider,
  owner: string,
  spender: string
): Promise<string> => {
  try {
    const contract = new Contract(contractAddress, CSHARE_TOKEN_ABI, provider);
    const [allowance, decimals] = await Promise.all([
      contract.allowance(owner, spender),
      contract.decimals()
    ]);
    
    return formatUnits(allowance, decimals);
  } catch (error: any) {
    console.error('Error getting token allowance:', error);
    throw new Error(`Failed to get token allowance: ${error.message}`);
  }
};

// Get transaction receipt
export const waitForTransaction = async (
  provider: BrowserProvider,
  txHash: string
): Promise<ethers.TransactionReceipt | null> => {
  try {
    const receipt = await provider.waitForTransaction(txHash);
    return receipt;
  } catch (error: any) {
    console.error('Error waiting for transaction:', error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format token amount for display
export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  try {
    const formatted = formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    
    if (num === 0) return '0';
    if (num < 0.001) return '<0.001';
    if (num < 1) return num.toFixed(3);
    if (num < 1000) return num.toFixed(2);
    
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

// Get gas price
export const getGasPrice = async (provider: BrowserProvider): Promise<string> => {
  try {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    return formatUnits(gasPrice, 'gwei');
  } catch (error: any) {
    console.error('Error getting gas price:', error);
    throw new Error(`Failed to get gas price: ${error.message}`);
  }
};

// Estimate gas for transaction
export const estimateGas = async (
  contract: Contract,
  method: string,
  params: any[]
): Promise<bigint> => {
  try {
    const gasEstimate = await contract[method].estimateGas(...params);
    return gasEstimate;
  } catch (error: any) {
    console.error('Error estimating gas:', error);
    throw new Error(`Failed to estimate gas: ${error.message}`);
  }
};

// Check if address is valid
export const isValidAddress = (address: string): boolean => {
  return isAddress(address);
};

// Get network name from chain ID
export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 137:
      return 'Polygon Mainnet';
    case 1101:
      return 'Polygon zkEVM';
    case 1442:
      return 'Polygon zkEVM Testnet';
    case 80001:
      return 'Polygon Mumbai Testnet';
    case 5:
      return 'Goerli Testnet';
    case 11155111:
      return 'Sepolia Testnet';
    default:
      return `Unknown Network (${chainId})`;
  }
};

// Listen for account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void): void => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
};

// Listen for network changes
export const onChainChanged = (callback: (chainId: string) => void): void => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
};

// Remove event listeners
export const removeAllListeners = (): void => {
  if (window.ethereum) {
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Get current network
export const getCurrentNetwork = async (): Promise<number | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Error getting current network:', error);
    return null;
  }
};

// Check if connected to Polygon zkEVM
export const isConnectedToPolygonZkEVM = async (): Promise<boolean> => {
  const chainId = await getCurrentNetwork();
  return chainId === 1101;
};

// Check if connected to Polygon zkEVM Testnet
export const isConnectedToPolygonZkEVMTestnet = async (): Promise<boolean> => {
  const chainId = await getCurrentNetwork();
  return chainId === 1442;
};

// Check if connected to correct network (legacy)
export const isConnectedToPolygonMumbai = async (): Promise<boolean> => {
  const chainId = await getCurrentNetwork();
  return chainId === 80001;
};

// Check if connected to any supported network
export const isConnectedToSupportedNetwork = async (): Promise<boolean> => {
  const chainId = await getCurrentNetwork();
  return chainId === 1101 || chainId === 1442 || chainId === 80001;
};

// Disconnect wallet (clear local state)
export const disconnectWallet = (): void => {
  removeAllListeners();
  // Clear any local storage or state related to wallet connection
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('walletAddress');
};

// Save wallet connection state
export const saveWalletConnection = (address: string): void => {
  localStorage.setItem('walletConnected', 'true');
  localStorage.setItem('walletAddress', address);
};

// Check if wallet was previously connected
export const wasWalletConnected = (): boolean => {
  return localStorage.getItem('walletConnected') === 'true';
};

// Get saved wallet address
export const getSavedWalletAddress = (): string | null => {
  return localStorage.getItem('walletAddress');
};

export default {
  isMetaMaskInstalled,
  connectWallet,
  switchToPolygonMumbai,
  getTokenInfo,
  transferTokens,
  waitForTransaction,
  formatAddress,
  formatTokenAmount,
  getGasPrice,
  estimateGas,
  isValidAddress,
  getNetworkName,
  onAccountsChanged,
  onChainChanged,
  removeAllListeners,
  getCurrentAccount,
  getCurrentNetwork,
  isConnectedToPolygonMumbai,
  disconnectWallet,
  saveWalletConnection,
  wasWalletConnected,
  getSavedWalletAddress
};
