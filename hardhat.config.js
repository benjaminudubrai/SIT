require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Polygon zkEVM Mainnet
    'polygon-zkevm': {
      url: process.env.POLYGON_ZKEVM_RPC_URL || 'https://zkevm-rpc.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1101,
      gasPrice: 'auto',
      gas: 'auto',
    },
    // Polygon zkEVM Testnet
    'polygon-zkevm-testnet': {
      url: process.env.POLYGON_ZKEVM_TESTNET_RPC_URL || 'https://rpc.public.zkevm-test.net',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1442,
      gasPrice: 'auto',
      gas: 'auto',
    },
    // Polygon Mumbai (for testing)
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com/',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      gasPrice: 'auto',
      gas: 'auto',
    },
    // Local development
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      // Polygon zkEVM
      polygonZkEVM: process.env.POLYGONSCAN_API_KEY || '',
      polygonZkEVMTestnet: process.env.POLYGONSCAN_API_KEY || '',
      // Polygon
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'polygonZkEVM',
        chainId: 1101,
        urls: {
          apiURL: 'https://api-zkevm.polygonscan.com/api',
          browserURL: 'https://zkevm.polygonscan.com/',
        },
      },
      {
        network: 'polygonZkEVMTestnet',
        chainId: 1442,
        urls: {
          apiURL: 'https://api-testnet-zkevm.polygonscan.com/api',
          browserURL: 'https://testnet-zkevm.polygonscan.com/',
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
};
