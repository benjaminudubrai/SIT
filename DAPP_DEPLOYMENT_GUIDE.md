# Student Innovation Trust DApp - Polygon zkEVM Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the Student Innovation Trust platform as a fully functional Web3 DApp on the Polygon zkEVM Cardona Testnet. Following these steps will ensure your environment is correctly configured.

## Architecture Overview

### Smart Contracts
1.  **COSTToken.sol** - ERC20 token for platform transactions (Symbol: COST).
2.  **ProjectEscrow.sol** - Handles project funding, milestones, and escrow.

### Frontend
- React + TypeScript application
- Web3 integration for blockchain interactions

## Prerequisites

### 1. Install Dependencies
Ensure you have Node.js v18+ installed. Then, install the project dependencies:
```bash
npm install
```

### 2. Get a Polygon zkEVM Testnet Wallet
- Install a browser wallet like MetaMask.
- Add the Polygon zkEVM Cardona Testnet:
  - **Network Name**: Polygon zkEVM Cardona Testnet
  - **RPC URL**: https://rpc.cardona.zkevm-rpc.com
  - **Chain ID**: 2442
  - **Currency Symbol**: ETH
  - **Block Explorer**: https://cardona-zkevm.polygonscan.com/

### 3. Get Testnet ETH
You'll need testnet ETH on Cardona to pay for gas fees.
- Visit the official Polygon Faucet: https://faucet.polygon.technology/
- Select "Polygon zkEVM Cardona" and enter your wallet address to request funds.

## Smart Contract Deployment

### Step 1: Configure Environment
Create a `.env` file in the project root by copying the example file:
```bash
cp .env.example .env
```

### 2. Configure .env file
```env
# Blockchain Configuration
POLYGON_ZKEVM_RPC_URL=https://rpc.public.zkevm-test.net
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Application Configuration
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/student-innovation-trust
JWT_SECRET=your_jwt_secret_here
```

### 3. Deploy Contracts
```bash
# Compile contracts
npx hardhat compile

# Deploy to Polygon zkEVM testnet
npx hardhat run scripts/deploy.js --network polygonZkEVM

# Verify contracts (optional)
npx hardhat verify --network polygonZkEVM <CONTRACT_ADDRESS>
```

### 4. Update Frontend Configuration
After deployment, update the contract addresses in:
- `src/utils/web3.ts`
- `src/utils/projectEscrow.ts`

## Frontend Deployment

### 1. Build Application
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Deploy Options

#### Option A: Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

#### Option B: Netlify
1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Add environment variables
4. Deploy

#### Option C: Traditional Hosting
1. Build the application: `npm run build`
2. Upload `dist/` folder to your web server
3. Configure web server for SPA routing

## Backend Deployment

### 1. Prepare for Production
```bash
# Install production dependencies
npm install --production

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=your_production_mongodb_uri
```

### 2. Deploy Options

#### Option A: Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

#### Option B: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### Option C: VPS/Cloud Server
1. Set up Node.js environment
2. Clone repository
3. Install dependencies
4. Configure PM2 for process management
5. Set up reverse proxy (nginx)

## Database Setup

### MongoDB Configuration
```javascript
// Recommended production settings
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### Indexes for Performance
```javascript
// User collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "walletAddress": 1 })

// Projects collection  
db.projects.createIndex({ "creator": 1 })
db.projects.createIndex({ "status": 1 })
db.projects.createIndex({ "category": 1 })
```

## Web3 Integration

### Network Configuration
```javascript
// Polygon zkEVM Testnet
{
  chainId: 1442,
  chainName: "Polygon zkEVM Testnet",
  rpcUrls: ["https://rpc.public.zkevm-test.net"],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  },
  blockExplorerUrls: ["https://testnet-zkevm.polygonscan.com/"]
}
```

### Contract Integration
```javascript
// Example contract interaction
const costToken = new ethers.Contract(
  COST_TOKEN_ADDRESS,
  COSTTokenABI,
  signer
);

const projectEscrow = new ethers.Contract(
  PROJECT_ESCROW_ADDRESS,
  ProjectEscrowABI,
  signer
);
```

## Security Considerations

### Smart Contract Security
- ✅ ReentrancyGuard implemented
- ✅ Access control with Ownable
- ✅ Pausable functionality
- ✅ Input validation
- ✅ Safe math operations

### Backend Security
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Helmet.js security headers

### Frontend Security
- ✅ Environment variable protection
- ✅ XSS prevention
- ✅ Secure wallet connections
- ✅ Transaction validation

## Testing

### Smart Contract Tests
```bash
# Run contract tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run coverage
npx hardhat coverage
```

### Frontend Tests
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

### Integration Tests
```bash
# Test full application flow
npm run test:integration
```

## Monitoring & Analytics

### Recommended Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics
- **Mixpanel** - Event tracking

### Blockchain Monitoring
- **Tenderly** - Transaction monitoring
- **OpenZeppelin Defender** - Security monitoring
- **Alchemy Notify** - Webhook notifications

## Performance Optimization

### Frontend Optimization
- Code splitting with dynamic imports
- Image optimization
- Bundle size analysis
- CDN for static assets

### Backend Optimization
- Database connection pooling
- Redis caching
- API response compression
- Load balancing

### Blockchain Optimization
- Gas optimization
- Batch transactions
- Event filtering
- Efficient data structures

## Maintenance & Updates

### Smart Contract Updates
- Use proxy patterns for upgradability
- Implement governance mechanisms
- Plan migration strategies

### Application Updates
- Implement CI/CD pipelines
- Use feature flags
- Monitor deployment health
- Rollback strategies

## Support & Documentation

### User Documentation
- Wallet setup guides
- Platform usage tutorials
- FAQ section
- Video tutorials

### Developer Documentation
- API documentation
- Smart contract documentation
- Integration guides
- Troubleshooting guides

## Troubleshooting

### Common Issues

#### MetaMask Connection Issues
```javascript
// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
  // MetaMask is available
} else {
  // Prompt user to install MetaMask
}
```

#### Transaction Failures
- Check gas limits
- Verify contract addresses
- Confirm network selection
- Check token approvals

#### Network Issues
- Verify RPC endpoints
- Check network congestion
- Confirm chain ID

## Conclusion

This deployment guide provides a comprehensive roadmap for launching the Student Innovation Trust platform as a fully functional Web3 DApp on Polygon zkEVM. Follow the steps carefully and ensure all security measures are in place before going live.

For additional support, refer to the documentation or contact the development team.
