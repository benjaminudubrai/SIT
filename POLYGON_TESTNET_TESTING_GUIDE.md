# 🧪 Polygon zkEVM Testnet Testing Guide

This comprehensive guide will walk you through testing your Student Innovation Trust DApp on Polygon zkEVM testnet before launching on mainnet.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher) installed
2. **MetaMask** browser extension
3. **Git** for version control
4. **Code editor** (VS Code recommended)

## 🔧 Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
# Navigate to your project directory
cd "Student Innovation Trust"

# Install all dependencies
npm install

# Install additional Hardhat dependencies if needed
npm install --save-dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify
```

### 1.2 Configure Environment Variables

Create your `.env` file from the example:

```bash
cp .env.example .env
```

Update your `.env` file with testnet configuration:

```env
# Polygon zkEVM Testnet Configuration
POLYGON_ZKEVM_TESTNET_RPC_URL=https://rpc.public.zkevm-test.net
PRIVATE_KEY=your-wallet-private-key-here

# Optional: For contract verification
POLYGONSCAN_API_KEY=your-polygonscan-api-key

# Database (for backend testing)
MONGODB_URI=mongodb://localhost:27017/sit-testnet
JWT_SECRET=your-jwt-secret-for-testing

# Email (for testing notifications)
EMAIL_USER=your-test-email@gmail.com
EMAIL_PASS=your-app-password
```

⚠️ **Security Note**: Never commit your private key to version control!

## 🌐 Step 2: MetaMask Setup for Testnet

### 2.1 Add Polygon zkEVM Testnet to MetaMask

1. Open MetaMask
2. Click on the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Enter the following details:

```
Network Name: Polygon zkEVM Testnet
New RPC URL: https://rpc.public.zkevm-test.net
Chain ID: 1442
Currency Symbol: ETH
Block Explorer URL: https://testnet-zkevm.polygonscan.com/
```

5. Click "Save"

### 2.2 Get Testnet ETH

You need testnet ETH for gas fees:

1. **Option 1: Polygon zkEVM Testnet Faucet**
   - Visit: https://faucet.polygon.technology/
   - Select "Polygon zkEVM Testnet"
   - Enter your wallet address
   - Request testnet ETH

2. **Option 2: Bridge from Goerli**
   - Get Goerli ETH from https://goerlifaucet.com/
   - Use the Polygon zkEVM testnet bridge
   - Bridge small amounts for testing

## 🔨 Step 3: Smart Contract Testing

### 3.1 Compile Contracts

```bash
# Compile all smart contracts
npx hardhat compile
```

Expected output:
```
Compiled 15 Solidity files successfully
```

### 3.2 Run Local Tests

Before deploying to testnet, run local tests:

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/polygon-testnet.test.cjs

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test
```

### 3.3 Deploy to Testnet

Deploy your contracts to Polygon zkEVM testnet:

```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network polygon-zkevm-testnet
```

Expected output:
```
🚀 Starting deployment to Polygon zkEVM...

📝 Deploying contracts with account: 0x...
💰 Account balance: 0.1 ETH

📦 Deploying CShareToken...
✅ CShareToken deployed to: 0x...
🔗 Transaction hash: 0x...

📦 Deploying ProjectEscrow...
✅ ProjectEscrow deployed to: 0x...
🔗 Transaction hash: 0x...

💾 Deployment info saved to: deployments/polygon-zkevm-testnet-[timestamp].json
📝 Environment variables saved to .env.contracts

🎉 Deployment completed successfully!
```

### 3.4 Update Environment Variables

Copy the contract addresses from `.env.contracts` to your main `.env` file:

```env
# Testnet Contract Addresses
VITE_CSHARE_CONTRACT_ADDRESS=0x...
VITE_ESCROW_CONTRACT_ADDRESS=0x...
VITE_NETWORK_CHAIN_ID=1442
VITE_POLYGON_ZKEVM_RPC_URL=https://rpc.public.zkevm-test.net

# Backend Contract Addresses
CSHARE_CONTRACT_ADDRESS=0x...
ESCROW_CONTRACT_ADDRESS=0x...
POLYGON_ZKEVM_RPC_URL=https://rpc.public.zkevm-test.net
```

### 3.5 Verify Contracts (Optional but Recommended)

```bash
# Verify CShareToken
npx hardhat verify --network polygon-zkevm-testnet [CSHARE_CONTRACT_ADDRESS]

# Verify ProjectEscrow
npx hardhat verify --network polygon-zkevm-testnet [ESCROW_CONTRACT_ADDRESS] "[CSHARE_CONTRACT_ADDRESS]" "[DEPLOYER_ADDRESS]"
```

## 🖥️ Step 4: Frontend Testing

### 4.1 Build and Start Frontend

```bash
# Build the frontend
npm run build

# Start development server
npm run dev
```

The frontend should be available at `http://localhost:5173`

### 4.2 Test Wallet Connection

1. Open your DApp in the browser
2. Click "Connect Wallet"
3. Ensure MetaMask is on Polygon zkEVM Testnet
4. Approve the connection
5. Verify your wallet address appears in the UI

### 4.3 Test Core Features

#### Token Operations:
1. **Check Balance**: Verify your CSHARE token balance displays correctly
2. **Transfer Tokens**: Send tokens to another test address
3. **Approve Spending**: Test token approvals for the escrow contract

#### Project Management:
1. **Create Project**:
   - Fill out project creation form
   - Set reasonable target amount (e.g., 100 CSHARE)
   - Set duration (e.g., 30 days)
   - Submit and confirm transaction

2. **Contribute to Project**:
   - Switch to a different test account
   - Find the created project
   - Make a contribution
   - Verify contribution appears in project details

3. **Milestone Management**:
   - Add milestones to your project
   - Complete milestones as project creator
   - Approve milestones as contributor

## 🔧 Step 5: Backend Testing

### 5.1 Start Backend Server

```bash
# Start the backend server
npm run server

# Or if you have a specific backend start command
node server.js
```

### 5.2 Test API Endpoints

Use tools like Postman or curl to test:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'

# Test project creation via API
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"API Test Project","description":"Testing via API","category":"Technology","targetAmount":"1000"}'
```

## 🧪 Step 6: Comprehensive Testing Scenarios

### 6.1 Happy Path Testing

**Scenario 1: Successful Project Funding**
1. Create a project with target of 1000 CSHARE
2. Add 2 milestones (500 CSHARE each)
3. Have multiple users contribute until target is reached
4. Complete and approve all milestones
5. Verify project completion and fund distribution

**Scenario 2: Token Operations**
1. Mint tokens to test accounts
2. Transfer tokens between accounts
3. Test batch transfers
4. Pause/unpause token (admin only)
5. Burn tokens

### 6.2 Edge Case Testing

**Scenario 3: Project Cancellation**
1. Create a project
2. Receive some contributions
3. Cancel the project
4. Verify automatic refunds to contributors

**Scenario 4: Dispute Handling**
1. Create and fund a project
2. Complete a milestone
3. Raise a dispute as contributor
4. Test dispute resolution process

**Scenario 5: Failed Project**
1. Create a project with short duration
2. Don't reach funding target
3. Let project expire
4. Verify automatic refunds

### 6.3 Security Testing

**Test Access Controls:**
- Try to complete milestones from wrong account
- Attempt to approve own milestones
- Test admin-only functions with regular accounts

**Test Input Validation:**
- Submit projects with invalid data
- Try negative contribution amounts
- Test with extremely large numbers

## 📊 Step 7: Performance and Gas Testing

### 7.1 Monitor Gas Usage

```bash
# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Deploy with gas estimation
npx hardhat run scripts/deploy.js --network polygon-zkevm-testnet
```

### 7.2 Load Testing

Create multiple test accounts and simulate:
- Multiple simultaneous project creations
- High-frequency contributions
- Batch operations

## 🔍 Step 8: Monitoring and Debugging

### 8.1 Transaction Monitoring

Monitor all transactions on the testnet explorer:
- Visit: https://testnet-zkevm.polygonscan.com/
- Search for your contract addresses
- Verify all transactions are successful
- Check event logs

### 8.2 Error Handling

Test error scenarios:
- Insufficient balance transactions
- Invalid function parameters
- Network connectivity issues
- MetaMask rejection scenarios

### 8.3 Browser Console Debugging

Monitor browser console for:
- Web3 connection errors
- Transaction failures
- UI rendering issues
- API call failures

## 📝 Step 9: Test Documentation

### 9.1 Create Test Report

Document your testing results:

```markdown
# Testnet Testing Report

## Test Environment
- Network: Polygon zkEVM Testnet
- Contracts Deployed: [Timestamp]
- CShareToken: 0x...
- ProjectEscrow: 0x...

## Test Results
- ✅ Contract Deployment: Success
- ✅ Token Operations: All passed
- ✅ Project Creation: Success
- ✅ Contribution Flow: Success
- ✅ Milestone Management: Success
- ✅ Dispute Handling: Success
- ✅ Refund Mechanism: Success

## Gas Usage
- Project Creation: ~150,000 gas
- Contribution: ~80,000 gas
- Milestone Completion: ~60,000 gas

## Issues Found
- [List any issues discovered]

## Recommendations
- [Any improvements needed before mainnet]
```

### 9.2 Performance Metrics

Track key metrics:
- Average transaction confirmation time
- Gas costs for different operations
- Frontend loading times
- API response times

## 🚀 Step 10: Pre-Mainnet Checklist

Before moving to mainnet, ensure:

- [ ] All smart contract tests pass
- [ ] Frontend works correctly with testnet
- [ ] Backend API functions properly
- [ ] All user flows tested successfully
- [ ] Security vulnerabilities addressed
- [ ] Gas optimization completed
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Team trained on deployment process

## 🛠️ Troubleshooting Common Issues

### Issue: "Insufficient funds for gas"
**Solution**: Get more testnet ETH from faucet

### Issue: "Network mismatch"
**Solution**: Ensure MetaMask is on Polygon zkEVM Testnet (Chain ID: 1442)

### Issue: "Contract not deployed"
**Solution**: Verify contract addresses in environment variables

### Issue: "Transaction failed"
**Solution**: 
- Check gas limit and gas price
- Verify function parameters
- Ensure sufficient token allowances

### Issue: "Frontend not connecting to contracts"
**Solution**:
- Verify contract addresses in frontend config
- Check network configuration
- Ensure MetaMask is connected

## 📞 Getting Help

If you encounter issues:

1. **Check Documentation**: Review Polygon zkEVM docs
2. **Community Support**: Join Polygon Discord
3. **Block Explorer**: Check transaction details
4. **Console Logs**: Review browser and server logs
5. **GitHub Issues**: Check project repository for known issues

## 🎯 Next Steps

After successful testnet testing:

1. **Code Review**: Have team review all changes
2. **Security Audit**: Consider professional audit
3. **Mainnet Preparation**: Prepare mainnet deployment
4. **User Documentation**: Update user guides
5. **Launch Strategy**: Plan mainnet launch

---

**Congratulations!** 🎉 You've successfully tested your DApp on Polygon zkEVM testnet. You're now ready to proceed with mainnet deployment!
