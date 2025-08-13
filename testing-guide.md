# Student Innovation Trust - Complete Testing Guide

## Phase 1: Environment Setup & Prerequisites

### 1.1 Install Required Dependencies for Blockchain Integration

```bash
npm install ethers @metamask/sdk web3 @polygon-io/client-js hardhat @nomiclabs/hardhat-ethers
```

### 1.2 Set up Environment Variables

Create a `.env` file with the following configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/student-innovation-trust

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure

# Server
PORT=5000
NODE_ENV=development

# Polygon Mumbai Testnet Configuration
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
POLYGON_CHAIN_ID=80001
PRIVATE_KEY=your-wallet-private-key-for-testnet-only
CONTRACT_ADDRESS=your-deployed-contract-address

# Alchemy API (for better RPC performance)
ALCHEMY_API_KEY=your-alchemy-api-key

# Logging
LOG_LEVEL=info
```

### 1.3 MetaMask Setup for Polygon Mumbai Testnet

1. Install MetaMask browser extension
2. Add Polygon Mumbai Testnet:
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com/
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com/

3. Get test MATIC tokens from faucet:
   - Visit: https://faucet.polygon.technology/
   - Enter your wallet address
   - Request test MATIC tokens

## Phase 2: Backend Testing

### 2.1 Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Linux
   sudo systemctl start mongod
   ```

### 2.2 Backend Server Testing

1. Start the backend server:
   ```bash
   npm run server
   ```

2. Test health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. Test authentication endpoints:
   ```bash
   # Register a new user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "role": "student"
     }'

   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

4. Test wallet endpoints (use JWT token from login):
   ```bash
   # Get wallet info
   curl -X GET http://localhost:5000/api/wallet \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"

   # Add funds (mock)
   curl -X POST http://localhost:5000/api/wallet/add-funds \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"amount": 1000}'
   ```

## Phase 3: Frontend Testing

### 3.1 Start Frontend Development Server

```bash
npm run dev
```

### 3.2 Frontend Component Testing

1. **Landing Page**: Visit http://localhost:5173
   - Test navigation
   - Check responsive design
   - Verify animations

2. **Authentication Flow**:
   - Test registration form
   - Test login functionality
   - Verify JWT token storage

3. **Dashboard**:
   - Check stats display
   - Test navigation between sections
   - Verify data loading

4. **Wallet Page**:
   - Test wallet connection UI
   - Check balance display
   - Test modal interactions

### 3.3 Full Stack Integration Testing

```bash
# Run both frontend and backend simultaneously
npm run dev:full
```

## Phase 4: Blockchain Integration Implementation

### 4.1 Smart Contract Development

Create a simple ERC-20 token contract for $CSHARE:

```solidity
// contracts/CShareToken.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CShareToken is ERC20, Ownable {
    constructor() ERC20("CShare Token", "CSHARE") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### 4.2 Deploy Contract to Polygon Mumbai

1. Initialize Hardhat:
   ```bash
   npx hardhat init
   ```

2. Configure hardhat.config.js:
   ```javascript
   require("@nomiclabs/hardhat-ethers");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.19",
     networks: {
       mumbai: {
         url: process.env.POLYGON_RPC_URL,
         accounts: [process.env.PRIVATE_KEY]
       }
     }
   };
   ```

3. Deploy contract:
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

### 4.3 Backend Blockchain Integration

Update backend with proper Web3 integration:

```javascript
// utils/blockchain.js
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = [
  // Add your contract ABI here
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

export { provider, wallet, contract };
```

### 4.4 Frontend Web3 Integration

```javascript
// utils/web3.js
import { ethers } from 'ethers';

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return { provider, signer };
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  }
};

export const switchToPolygonMumbai = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }], // 80001 in hex
    });
  } catch (error) {
    // Add network if not exists
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x13881',
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
      }]
    });
  }
};
```

## Phase 5: End-to-End Testing

### 5.1 Complete User Journey Testing

1. **User Registration & Login**
2. **Wallet Connection**
3. **Token Purchase Simulation**
4. **Investment in Projects**
5. **Transaction History Verification**

### 5.2 Blockchain Transaction Testing

1. **Test Token Transfers**:
   ```bash
   # Test transfer endpoint
   curl -X POST http://localhost:5000/api/tokens/transfer \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "to": "USER_ID",
       "amount": 100,
       "tokenType": "cshare"
     }'
   ```

2. **Verify on Polygon Mumbai Explorer**:
   - Visit https://mumbai.polygonscan.com/
   - Search for your contract address
   - Verify transactions

### 5.3 Performance Testing

1. **Load Testing**:
   ```bash
   # Install artillery for load testing
   npm install -g artillery
   
   # Create test config
   artillery quick --count 10 --num 5 http://localhost:5000/api/health
   ```

2. **Frontend Performance**:
   - Use Chrome DevTools Lighthouse
   - Test on different devices
   - Check bundle size

## Phase 6: Security Testing

### 6.1 Backend Security

1. **Authentication Testing**:
   - Test JWT token expiration
   - Test unauthorized access
   - Verify input validation

2. **Rate Limiting**:
   - Test API rate limits
   - Verify CORS configuration

### 6.2 Smart Contract Security

1. **Contract Verification**:
   - Verify contract on Polygonscan
   - Test access controls
   - Check for common vulnerabilities

## Phase 7: Monitoring & Logging

### 7.1 Set up Logging

1. **Backend Logs**:
   - Check logs/combined.log
   - Monitor error logs
   - Set up log rotation

2. **Frontend Error Tracking**:
   - Implement error boundaries
   - Add console logging for debugging

### 7.2 Health Monitoring

1. **API Health Checks**:
   - Monitor /api/health endpoint
   - Set up uptime monitoring

2. **Blockchain Connection**:
   - Monitor RPC connection
   - Track gas prices
   - Monitor contract interactions

## Troubleshooting Common Issues

### Backend Issues
- MongoDB connection errors
- JWT token issues
- CORS problems
- Environment variable misconfigurations

### Frontend Issues
- MetaMask connection problems
- Network switching issues
- Transaction failures
- UI responsiveness

### Blockchain Issues
- Insufficient gas fees
- Network congestion
- Contract interaction failures
- RPC endpoint issues

## Testing Checklist

- [ ] Backend server starts successfully
- [ ] Database connection established
- [ ] All API endpoints respond correctly
- [ ] Frontend builds and runs
- [ ] User authentication works
- [ ] Wallet connection functional
- [ ] Smart contract deployed
- [ ] Token transfers work
- [ ] Transaction history displays
- [ ] Error handling works
- [ ] Security measures in place
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Cross-browser compatible

## Next Steps

1. Deploy to staging environment
2. Conduct user acceptance testing
3. Security audit
4. Performance optimization
5. Production deployment
6. Monitoring setup
7. Documentation completion
