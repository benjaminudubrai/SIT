# Student Innovation Trust - Quick Start Guide

## 🚀 Quick Testing Steps

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- MetaMask browser extension
- Git

### 1. Environment Setup (5 minutes)

```bash
# Clone and navigate to project
cd "Student Innovation Trust"

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/student-innovation-trust
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
PORT=5000
NODE_ENV=development
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
```

### 2. Database Setup (2 minutes)

```bash
# Start MongoDB (macOS)
brew services start mongodb-community

# Or Ubuntu/Linux
sudo systemctl start mongod
```

### 3. Run Automated Tests (3 minutes)

```bash
# Make test runner executable
chmod +x test-runner.js

# Run all tests
node test-runner.js

# Or run specific tests
node test-runner.js --env-only      # Environment check only
node test-runner.js --backend-only  # Backend tests only
node test-runner.js --frontend-only # Frontend tests only
```

### 4. Manual Testing (10 minutes)

#### Backend Testing
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/tokens/network
curl http://localhost:5000/api/tokens/health
```

#### Frontend Testing
```bash
# Terminal 3: Start frontend
npm run dev

# Visit http://localhost:5173
# Test user registration, login, wallet connection
```

#### Full Stack Testing
```bash
# Run both simultaneously
npm run dev:full
```

### 5. Blockchain Testing (15 minutes)

#### Setup MetaMask
1. Install MetaMask extension
2. Add Polygon Mumbai Testnet:
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com/
   - Chain ID: 80001
   - Currency Symbol: MATIC

3. Get test MATIC: https://faucet.polygon.technology/

#### Test Wallet Connection
1. Go to http://localhost:5173/wallet
2. Click "Connect MetaMask"
3. Switch to Polygon Mumbai network
4. Test token operations

### 6. API Testing with Postman/curl

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test Wallet (use JWT token from login)
```bash
curl -X GET http://localhost:5000/api/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community
```

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### MetaMask Connection Issues
1. Refresh the page
2. Disconnect and reconnect wallet
3. Clear browser cache
4. Check network settings

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

## 📊 Test Results

After running tests, check:
- `test-report.json` - Detailed test results
- Console output for real-time feedback
- Browser developer tools for frontend issues
- Server logs for backend issues

## 🎯 Success Criteria

✅ **Backend**: All API endpoints respond correctly
✅ **Frontend**: Application builds and runs without errors
✅ **Database**: MongoDB connection established
✅ **Authentication**: User registration and login work
✅ **Blockchain**: MetaMask connects and switches networks
✅ **Integration**: Full user journey works end-to-end

## 📚 Next Steps

1. **Deploy Smart Contract**: Use Hardhat to deploy to Polygon Mumbai
2. **Integrate Real Blockchain**: Connect frontend to deployed contract
3. **Add More Tests**: Unit tests, integration tests, e2e tests
4. **Security Audit**: Review authentication, input validation
5. **Performance Optimization**: Bundle size, API response times
6. **Production Deployment**: Set up CI/CD, monitoring

## 🆘 Need Help?

1. Check the detailed `testing-guide.md`
2. Review error logs in console
3. Check `test-report.json` for specific failures
4. Verify environment variables in `.env`
5. Ensure all dependencies are installed

## 📝 Testing Checklist

- [ ] Environment setup complete
- [ ] Dependencies installed
- [ ] MongoDB running
- [ ] Backend server starts
- [ ] Frontend builds successfully
- [ ] User registration works
- [ ] User login works
- [ ] Wallet page loads
- [ ] MetaMask connects
- [ ] Network switching works
- [ ] API endpoints respond
- [ ] Database operations work
- [ ] Error handling works
- [ ] Responsive design works
- [ ] Cross-browser compatibility
