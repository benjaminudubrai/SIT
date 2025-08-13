const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Starting deployment to Polygon zkEVM...\n');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying contracts with account:', deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log('💰 Account balance:', ethers.utils.formatEther(balance), 'ETH\n');

  if (balance.lt(ethers.utils.parseEther('0.01'))) {
    console.error('❌ Insufficient balance for deployment. Need at least 0.01 ETH');
    process.exit(1);
  }

  try {
    // Deploy CShareToken
    console.log('📦 Deploying CShareToken...');
    const CShareToken = await ethers.getContractFactory('CShareToken');
    const cshareToken = await CShareToken.deploy();
    await cshareToken.deployed();
    
    console.log('✅ CShareToken deployed to:', cshareToken.address);
    console.log('🔗 Transaction hash:', cshareToken.deployTransaction.hash);

    // Wait for a few confirmations
    console.log('⏳ Waiting for confirmations...');
    await cshareToken.deployTransaction.wait(3);

    // Deploy ProjectEscrow
    console.log('\n📦 Deploying ProjectEscrow...');
    const ProjectEscrow = await ethers.getContractFactory('ProjectEscrow');
    const projectEscrow = await ProjectEscrow.deploy(
      cshareToken.address,
      deployer.address // Fee recipient
    );
    await projectEscrow.deployed();
    
    console.log('✅ ProjectEscrow deployed to:', projectEscrow.address);
    console.log('🔗 Transaction hash:', projectEscrow.deployTransaction.hash);

    // Wait for confirmations
    console.log('⏳ Waiting for confirmations...');
    await projectEscrow.deployTransaction.wait(3);

    // Get token info
    console.log('\n📊 Token Information:');
    const tokenInfo = await cshareToken.getTokenInfo();
    console.log('- Name:', tokenInfo.tokenName);
    console.log('- Symbol:', tokenInfo.tokenSymbol);
    console.log('- Decimals:', tokenInfo.tokenDecimals.toString());
    console.log('- Total Supply:', ethers.utils.formatEther(tokenInfo.tokenTotalSupply));
    console.log('- Max Supply:', ethers.utils.formatEther(tokenInfo.tokenMaxSupply));

    // Save deployment info
    const deploymentInfo = {
      network: 'polygon-zkevm',
      chainId: (await ethers.provider.getNetwork()).chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        CShareToken: {
          address: cshareToken.address,
          transactionHash: cshareToken.deployTransaction.hash,
          blockNumber: cshareToken.deployTransaction.blockNumber
        },
        ProjectEscrow: {
          address: projectEscrow.address,
          transactionHash: projectEscrow.deployTransaction.hash,
          blockNumber: projectEscrow.deployTransaction.blockNumber
        }
      },
      tokenInfo: {
        name: tokenInfo.tokenName,
        symbol: tokenInfo.tokenSymbol,
        decimals: tokenInfo.tokenDecimals.toString(),
        totalSupply: ethers.utils.formatEther(tokenInfo.tokenTotalSupply),
        maxSupply: ethers.utils.formatEther(tokenInfo.tokenMaxSupply)
      }
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment info to file
    const deploymentFile = path.join(deploymentsDir, `polygon-zkevm-${Date.now()}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    // Also save as latest deployment
    const latestFile = path.join(deploymentsDir, 'latest.json');
    fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));

    console.log('\n💾 Deployment info saved to:', deploymentFile);

    // Generate environment variables
    const envVars = `
# Polygon zkEVM Contract Addresses (Generated on ${new Date().toISOString()})
VITE_CSHARE_CONTRACT_ADDRESS=${cshareToken.address}
VITE_ESCROW_CONTRACT_ADDRESS=${projectEscrow.address}
VITE_NETWORK_CHAIN_ID=1101
VITE_POLYGON_ZKEVM_RPC_URL=https://zkevm-rpc.com

# Backend Contract Addresses
CSHARE_CONTRACT_ADDRESS=${cshareToken.address}
ESCROW_CONTRACT_ADDRESS=${projectEscrow.address}
POLYGON_ZKEVM_RPC_URL=https://zkevm-rpc.com
`;

    const envFile = path.join(__dirname, '..', '.env.contracts');
    fs.writeFileSync(envFile, envVars.trim());
    
    console.log('📝 Environment variables saved to .env.contracts');
    console.log('\n🎉 Deployment completed successfully!');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Copy the contract addresses to your .env file');
    console.log('2. Verify contracts on Polygon zkEVM Explorer');
    console.log('3. Update your frontend configuration');
    console.log('4. Test the contracts with the provided scripts');

    console.log('\n🔍 Verification Commands:');
    console.log(`npx hardhat verify --network polygon-zkevm ${cshareToken.address}`);
    console.log(`npx hardhat verify --network polygon-zkevm ${projectEscrow.address} "${cshareToken.address}" "${deployer.address}"`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment script failed:', error);
    process.exit(1);
  });
