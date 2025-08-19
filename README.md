# Student Innovation Trust - UNILAG Pilot Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)

A revolutionary blockchain-based platform that empowers University of Lagos (UNILAG) students to showcase innovative projects and receive community funding through $CSHARE tokens on the Polygon network.

## 🚀 Project Overview

Student Innovation Trust is a comprehensive platform designed to democratize funding for student innovations at UNILAG through blockchain technology. The platform enables community members to purchase $CSHARE tokens and vote to support promising student projects, creating a transparent and decentralized funding ecosystem.

### Key Features

- **🎓 Student Innovation Marketplace**: Showcase and discover groundbreaking projects from UNILAG students
- **💎 $CSHARE Token System**: Polygon-based utility tokens for voting and funding projects
- **🏆 Innovation Challenges**: Competitive platform for students to win funding through innovation contests
- **💼 Polygon Wallet Integration**: Secure wallet management with MetaMask compatibility
- **📊 Real-time Analytics**: Comprehensive dashboard tracking project performance and funding metrics
- **🔒 Smart Contract Escrow**: Automated fund management with dispute resolution mechanisms
- **🌐 Responsive Design**: Beautiful glassmorphism UI optimized for all devices

## 🛠 Technology Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router DOM** for navigation
- **Heroicons** for iconography
- **Vite** for development and building

### Backend & Database
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Winston** for logging

### Blockchain
- **Polygon Network** for fast, low-cost transactions
- **Solidity** smart contracts for escrow and governance
- **Ethers.js** for blockchain interactions
- **MetaMask** integration for wallet connectivity
- **Hardhat** for smart contract development and testing

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git
- MetaMask browser extension
- MongoDB (local or cloud)
- Basic understanding of React and blockchain concepts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/benjaminudubrai/SIT.git
   cd SIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/student-innovation-trust
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Polygon Network Configuration
   POLYGON_RPC_URL=https://polygon-rpc.com
   CSHARE_CONTRACT_ADDRESS=0x...
   ESCROW_CONTRACT_ADDRESS=0x...
   PRIVATE_KEY=your_wallet_private_key_for_deployment
   
   # Application Configuration
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   
   **Option 1: Start both frontend and backend together**
   ```bash
   npm run dev:full
   ```
   
   **Option 2: Start them separately**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🔧 Recent Fixes Applied

### Frontend Configuration Issues Resolved

The following critical configuration files were missing and have been added:

#### 1. **Vite Configuration** (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

#### 2. **Tailwind CSS Configuration** (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... color palette
        },
        secondary: {
          50: '#faf5ff',
          // ... color palette
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
```

#### 3. **PostCSS Configuration** (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 4. **TypeScript Configuration Files**
- `tsconfig.app.json` - Application TypeScript configuration
- `tsconfig.node.json` - Node.js TypeScript configuration

#### 5. **HTML Template** (`index.html`)
Moved from `public/` to root directory with proper meta tags and font loading.

### Issues Fixed

✅ **Missing Vite Configuration**: Added proper Vite config for React development
✅ **Missing Tailwind Setup**: Configured Tailwind CSS with custom theme
✅ **Missing PostCSS Config**: Added PostCSS configuration for Tailwind processing
✅ **TypeScript Configuration**: Added proper TypeScript project references
✅ **HTML Template Location**: Moved index.html to correct location for Vite
✅ **Development Server**: Fixed 404 errors and proper asset serving
✅ **Build Process**: Resolved build failures and dependency issues

### Verification Steps

The application has been tested and verified to work correctly:

1. ✅ **Landing Page**: Beautiful glassmorphism design loads properly
2. ✅ **Navigation**: React Router navigation works between pages
3. ✅ **Dashboard**: Statistics and components render correctly
4. ✅ **Marketplace**: Product listings and search functionality work
5. ✅ **Responsive Design**: Mobile and desktop layouts function properly
6. ✅ **Animations**: Framer Motion animations work smoothly
7. ✅ **Styling**: Tailwind CSS classes apply correctly

## 🏗 Project Structure

```
student-innovation-trust/
├── public/                     # Static assets
├── src/                        # React application source
│   ├── components/            # Reusable React components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── GlassCard.tsx      # Glassmorphism card component
│   │   └── Navbar.tsx         # Navigation component
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx      # Main dashboard page
│   │   ├── LandingPage.tsx    # Landing/home page
│   │   ├── Marketplace.tsx    # Marketplace page
│   │   ├── Wallet.tsx         # Wallet management page
│   │   └── ...               # Other pages
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles (Tailwind imports)
├── contracts/                 # Smart contracts
│   ├── COSTToken.sol         # COST token contract
│   └── ProjectEscrow.sol     # Escrow contract
├── routes/                   # Backend API routes
├── models/                   # Database models
├── middleware/               # Express middleware
├── scripts/                  # Deployment scripts
├── test/                     # Test files
├── index.html               # HTML template (Vite entry point)
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node.js TypeScript config
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔥 Database Setup Instructions

### MongoDB Configuration

1. **Install MongoDB**
   - **Local Installation**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **Cloud Option**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting

2. **Create Database**
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Create database
   use student-innovation-trust
   
   # Create collections
   db.createCollection("users")
   db.createCollection("projects")
   db.createCollection("transactions")
   db.createCollection("challenges")
   ```

3. **Set up Database Schema**
   
   The application uses Mongoose schemas defined in the `models/` directory:
   
   - **User Model**: Student profiles and authentication
   - **Project Model**: Innovation projects and funding details
   - **Transaction Model**: Blockchain transaction records
   - **Challenge Model**: Innovation challenges and competitions

## ⛓ Blockchain Development Guide

### Smart Contract Architecture

The platform uses smart contracts on Polygon for transparent fund management:

#### 1. COST Token Contract (`COSTToken.sol`)
- ERC-20 token for platform utility
- Used for voting and funding projects
- Mintable by contract owner

#### 2. Project Escrow Contract (`ProjectEscrow.sol`)
- Manages project funding and escrow
- Handles milestone-based fund release
- Includes dispute resolution mechanisms

### Deployment Instructions

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to Polygon Mumbai Testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

4. **Verify Contracts**
   ```bash
   npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
   ```

## 📋 Development Scripts

### Available Scripts

```bash
# Development
npm run dev              # Start frontend development server
npm run server          # Start backend server
npm run dev:full        # Start both frontend and backend

# Building
npm run build           # Build frontend for production
npm run preview         # Preview production build

# Testing
npm test               # Run tests
npm run test:watch     # Run tests in watch mode

# Linting
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors

# Blockchain
npm run compile        # Compile smart contracts
npm run deploy         # Deploy contracts to testnet
npm run verify         # Verify contracts on explorer
```

## 🔒 Security Considerations

### Smart Contract Security
- **Reentrancy Protection**: All contracts use OpenZeppelin's ReentrancyGuard
- **Access Controls**: Role-based permissions for critical functions
- **Audit Requirements**: Professional security audit before mainnet deployment
- **Emergency Pauses**: Circuit breakers for contract emergencies

### Platform Security
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on all user inputs
- **Rate Limiting**: API rate limits to prevent abuse
- **Password Hashing**: bcrypt for secure password storage
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Privacy Protection
- **Data Minimization**: Collect only necessary user information
- **Secure Storage**: Sensitive data encrypted at rest
- **API Security**: Protected routes with authentication middleware
- **Environment Variables**: Sensitive configuration in environment files

## 🤝 Contributing

We welcome contributions from developers, designers, and blockchain enthusiasts!

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write tests for new functionality
- Update documentation for any changes
- Ensure all tests pass before submitting PR
- Add meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **University of Lagos (UNILAG)** for inspiring this initiative
- **Polygon Network** for providing scalable blockchain infrastructure
- **OpenZeppelin** for secure smart contract frameworks
- **The open-source community** for invaluable tools and resources

## 📞 Support & Contact

### Technical Support
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/benjaminudubrai/SIT/issues)
- **Email**: support@studentinnovationtrust.com

### Business Inquiries
- **Email**: partnerships@studentinnovationtrust.com
- **LinkedIn**: [Student Innovation Trust](https://linkedin.com/company/student-innovation-trust)

---

**Built with ❤️ for the next generation of Nigerian innovators**

*Last updated: August 2025*
