const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = network.chainId === 1101 ? 'Polygon zkEVM Mainnet' : 
                     network.chainId === 1442 ? 'Polygon zkEVM Testnet' : 
                     `Network (Chain ID: ${network.chainId})`;
  
  console.log(`🚀 Starting deployment to ${networkName}...\n`);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying contracts with account:', deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log('💰 Account balance:', ethers.formatEther(balance), 'ETH\n');

  const minBalance = network.chainId === 1101 ? '0.05' : '0.01'; // Higher requirement for mainnet
  if (balance < ethers.parseEther(minBalance)) {
    console.error(`❌ Insufficient balance for deployment. Need at least ${minBalance} ETH`);
    process.exit(1);
  }

  try {
    // Deploy CShareToken
    console.log('📦 Deploying CShareToken...');
    const CShareToken = await ethers.getContractFactory('CShareToken');
    const cshareToken = await CShareToken.deploy();
    await cshareToken.waitForDeployment();
    
    const cshareAddress = await cshareToken.getAddress();
    console.log('✅ CShareToken deployed to:', cshareAddress);
    console.log('🔗 Transaction hash:', cshareToken.deploymentTransaction().hash);

    // Wait for confirmations (more for mainnet)
    const confirmations = network.chainId === 1101 ? 5 : 3;
    console.log(`⏳ Waiting for ${confirmations} confirmations...`);
    await cshareToken.deploymentTransaction().wait(confirmations);

    // Deploy ProjectEscrow
    console.log('\n📦 Deploying ProjectEscrow...');
    const ProjectEscrow = await ethers.getContractFactory('ProjectEscrow');
    const projectEscrow = await ProjectEscrow.deploy(
      cshareAddress,
      deployer.address // Fee recipient
    );
    await projectEscrow.waitForDeployment();
    
    const escrowAddress = await projectEscrow.getAddress();
    console.log('✅ ProjectEscrow deployed to:', escrowAddress);
    console.log('🔗 Transaction hash:', projectEscrow.deploymentTransaction().hash);

    // Wait for confirmations
    console.log(`⏳ Waiting for ${confirmations} confirmations...`);
    await projectEscrow.deploymentTransaction().wait(confirmations);

    // Get token info
    console.log('\n📊 Token Information:');
    const tokenInfo = await cshareToken.getTokenInfo();
    console.log('- Name:', tokenInfo.tokenName);
    console.log('- Symbol:', tokenInfo.tokenSymbol);
    console.log('- Decimals:', tokenInfo.tokenDecimals.toString());
    console.log('- Total Supply:', ethers.formatEther(tokenInfo.tokenTotalSupply));
    console.log('- Max Supply:', ethers.formatEther(tokenInfo.tokenMaxSupply));

    // Save deployment info
    const deploymentInfo = {
      network: networkName.toLowerCase().replace(/\s+/g, '-'),
      chainId: network.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        CShareToken: {
          address: cshareAddress,
          transactionHash: cshareToken.deploymentTransaction().hash,
          blockNumber: cshareToken.deploymentTransaction().blockNumber
        },
        ProjectEscrow: {
          address: escrowAddress,
          transactionHash: projectEscrow.deploymentTransaction().hash,
          blockNumber: projectEscrow.deploymentTransaction().blockNumber
        }
      },
      tokenInfo: {
        name: tokenInfo.tokenName,
        symbol: tokenInfo.tokenSymbol,
        decimals: tokenInfo.tokenDecimals.toString(),
        totalSupply: ethers.formatEther(tokenInfo.tokenTotalSupply),
        maxSupply: ethers.formatEther(tokenInfo.tokenMaxSupply)
      }
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment info to file
    const networkSuffix = network.chainId === 1101 ? 'mainnet' : 
                         network.chainId === 1442 ? 'testnet' : 
                         `chain-${network.chainId}`;
    const deploymentFile = path.join(deploymentsDir, `polygon-zkevm-${networkSuffix}-${Date.now()}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    // Also save as latest deployment
    const latestFile = path.join(deploymentsDir, `latest-${networkSuffix}.json`);
    fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));

    console.log('\n💾 Deployment info saved to:', deploymentFile);

    // Generate environment variables
    const rpcUrl = network.chainId === 1101 ? 'https://zkevm-rpc.com' : 'https://rpc.public.zkevm-test.net';
    const envVars = `
# ${networkName} Contract Addresses (Generated on ${new Date().toISOString()})
VITE_CSHARE_CONTRACT_ADDRESS=${cshareAddress}
VITE_ESCROW_CONTRACT_ADDRESS=${escrowAddress}
VITE_NETWORK_CHAIN_ID=${network.chainId}
VITE_POLYGON_ZKEVM_RPC_URL=${rpcUrl}

# Backend Contract Addresses
CSHARE_CONTRACT_ADDRESS=${cshareAddress}
ESCROW_CONTRACT_ADDRESS=${escrowAddress}
POLYGON_ZKEVM_RPC_URL=${rpcUrl}
`;

    const envFile = path.join(__dirname, '..', `.env.contracts.${networkSuffix}`);
    fs.writeFileSync(envFile, envVars.trim());
    
    console.log(`📝 Environment variables saved to .env.contracts.${networkSuffix}`);
    console.log('\n🎉 Deployment completed successfully!');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Copy the contract addresses to your .env file');
    console.log(`2. Verify contracts on ${network.chainId === 1101 ? 'Polygon zkEVM' : 'Polygon zkEVM Testnet'} Explorer`);
    console.log('3. Update your frontend configuration');
    console.log('4. Test the contracts with the provided scripts');

    const networkFlag = network.chainId === 1101 ? 'polygon-zkevm' : 'polygon-zkevm-testnet';
    console.log('\n🔍 Verification Commands:');
    console.log(`npx hardhat verify --network ${networkFlag} ${cshareAddress}`);
    console.log(`npx hardhat verify --network ${networkFlag} ${escrowAddress} "${cshareAddress}" "${deployer.address}"`);

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
