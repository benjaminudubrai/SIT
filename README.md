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
- **Firebase** (Firestore) for real-time database
- **Firebase Authentication** for user management
- **Firebase Cloud Functions** for serverless backend logic
- **Firebase Storage** for file uploads and media

### Blockchain
- **Polygon Network** for fast, low-cost transactions
- **Solidity** smart contracts for escrow and governance
- **Web3.js/Ethers.js** for blockchain interactions
- **MetaMask** integration for wallet connectivity
- **Remix IDE** for smart contract development

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git
- MetaMask browser extension
- Firebase account
- Basic understanding of React and blockchain concepts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/student-innovation-trust.git
   cd student-innovation-trust
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
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Polygon Network Configuration
   VITE_POLYGON_RPC_URL=https://polygon-rpc.com
   VITE_CSHARE_CONTRACT_ADDRESS=0x...
   VITE_ESCROW_CONTRACT_ADDRESS=0x...

   # Application Configuration
   VITE_APP_NAME="Student Innovation Trust"
   VITE_NETWORK_CHAIN_ID=137
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🔥 Firebase Setup Instructions

### Database Configuration

1. **Create a new Firebase project** at [Firebase Console](https://console.firebase.google.com)

2. **Enable Firestore Database**
   - Go to Firestore Database in the Firebase console
   - Create database in production mode
   - Choose a location (preferably us-central1 for better performance)

3. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own profile
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Public read access for projects, authenticated write
       match /projects/{projectId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       // Challenges are publicly readable, admin writable
       match /challenges/{challengeId} {
         allow read: if true;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Transactions require authentication and ownership
       match /transactions/{transactionId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

4. **Initialize Firestore Collections**
   Create the following collections with sample documents:

   **Collections Structure:**
   ```
   📁 users/
     └── {userId}
         ├── email: string
         ├── displayName: string
         ├── department: string
         ├── studentId: string
         ├── walletAddress: string
         ├── cshareBalance: number
         ├── createdAt: timestamp
   
   📁 projects/
     └── {projectId}
         ├── title: string
         ├── description: string
         ├── creatorId: string
         ├── category: string
         ├── targetFunding: number
         ├── currentFunding: number
         ├── supporters: array
         ├── status: string
         ├── createdAt: timestamp
         ├── deadline: timestamp
   
   📁 challenges/
     └── {challengeId}
         ├── title: string
         ├── description: string
         ├── prizePool: number
         ├── deadline: timestamp
         ├── categories: array
         ├── participants: array
         ├── status: string
   
   📁 transactions/
     └── {transactionId}
         ├── userId: string
         ├── type: string (buy|sell|reward)
         ├── amount: number
         ├── projectId: string
         ├── txHash: string
         ├── status: string
         ├── timestamp: timestamp
   ```

### Authentication Setup

1. **Enable Authentication Methods**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Optionally enable Google Sign-in for easier onboarding

2. **Configure Authorized Domains**
   - Add your domain to the authorized domains list
   - For development: `localhost`
   - For production: `your-domain.com`

### Cloud Functions (Optional)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Cloud Functions**
   ```bash
   firebase init functions
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

## ⛓ Blockchain Development Guide

### Smart Contract Architecture

The platform uses two main smart contracts on Polygon:

#### 1. CSHARE Token Contract (`CSHAREToken.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CSHAREToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    constructor() ERC20("Community Share", "CSHARE") {
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
```

#### 2. Project Escrow Contract (`ProjectEscrow.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CSHAREToken.sol";

contract ProjectEscrow is ReentrancyGuard, Ownable {
    CSHAREToken public cshareToken;
    
    enum ProjectStatus { Active, Funded, Completed, Disputed, Cancelled }
    
    struct Project {
        address creator;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        ProjectStatus status;
        string metadataURI;
    }
    
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public contributors;
    
    uint256 public projectCounter;
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    
    event ProjectCreated(uint256 indexed projectId, address indexed creator, uint256 targetAmount);
    event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event ProjectFunded(uint256 indexed projectId, uint256 totalAmount);
    event FundsReleased(uint256 indexed projectId, address indexed creator, uint256 amount);
    event DisputeRaised(uint256 indexed projectId, address indexed contributor);
    
    constructor(address _cshareToken) {
        cshareToken = CSHAREToken(_cshareToken);
    }
    
    function createProject(
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _metadataURI
    ) external returns (uint256) {
        require(_targetAmount > 0, "Target amount must be positive");
        require(_deadline > block.timestamp, "Deadline must be in future");
        
        uint256 projectId = projectCounter++;
        projects[projectId] = Project({
            creator: msg.sender,
            targetAmount: _targetAmount,
            currentAmount: 0,
            deadline: _deadline,
            status: ProjectStatus.Active,
            metadataURI: _metadataURI
        });
        
        emit ProjectCreated(projectId, msg.sender, _targetAmount);
        return projectId;
    }
    
    function contribute(uint256 _projectId, uint256 _amount) external nonReentrant {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        require(block.timestamp < project.deadline, "Project deadline passed");
        require(_amount > 0, "Amount must be positive");
        
        cshareToken.transferFrom(msg.sender, address(this), _amount);
        
        if (contributions[_projectId][msg.sender] == 0) {
            contributors[_projectId].push(msg.sender);
        }
        
        contributions[_projectId][msg.sender] += _amount;
        project.currentAmount += _amount;
        
        if (project.currentAmount >= project.targetAmount) {
            project.status = ProjectStatus.Funded;
            emit ProjectFunded(_projectId, project.currentAmount);
        }
        
        emit ContributionMade(_projectId, msg.sender, _amount);
    }
    
    function releaseFunds(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(project.creator == msg.sender, "Only creator can release funds");
        require(project.status == ProjectStatus.Funded, "Project not funded");
        
        uint256 platformFee = (project.currentAmount * PLATFORM_FEE) / 10000;
        uint256 creatorAmount = project.currentAmount - platformFee;
        
        project.status = ProjectStatus.Completed;
        
        cshareToken.transfer(owner(), platformFee);
        cshareToken.transfer(project.creator, creatorAmount);
        
        emit FundsReleased(_projectId, project.creator, creatorAmount);
    }
    
    function raiseDispute(uint256 _projectId) external {
        require(contributions[_projectId][msg.sender] > 0, "Not a contributor");
        projects[_projectId].status = ProjectStatus.Disputed;
        emit DisputeRaised(_projectId, msg.sender);
    }
    
    function refund(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.Cancelled || 
            (block.timestamp > project.deadline && project.status == ProjectStatus.Active),
            "Refund not available"
        );
        
        uint256 contribution = contributions[_projectId][msg.sender];
        require(contribution > 0, "No contribution to refund");
        
        contributions[_projectId][msg.sender] = 0;
        cshareToken.transfer(msg.sender, contribution);
    }
}
```

### Remix IDE Deployment Instructions

1. **Access Remix IDE**
   - Go to [https://remix.ethereum.org](https://remix.ethereum.org)
   - Create a new workspace

2. **Create Smart Contract Files**
   - Create `contracts/CSHAREToken.sol`
   - Create `contracts/ProjectEscrow.sol`
   - Paste the contract code above

3. **Install Dependencies**
   - In the File Explorer, create a `package.json`:
   ```json
   {
     "dependencies": {
       "@openzeppelin/contracts": "^4.9.0"
     }
   }
   ```

4. **Compile Contracts**
   - Go to the Solidity Compiler tab
   - Select compiler version 0.8.19
   - Click "Compile CSHAREToken.sol"
   - Click "Compile ProjectEscrow.sol"

5. **Deploy to Polygon**
   - Go to Deploy & Run Transactions tab
   - Select "Injected Provider - MetaMask"
   - Switch MetaMask to Polygon network
   - Deploy CSHAREToken first
   - Copy the deployed token address
   - Deploy ProjectEscrow with token address as constructor parameter

6. **Verify Contracts on Polygonscan**
   - Go to [Polygonscan.com](https://polygonscan.com)
   - Search for your contract address
   - Click "Contract" tab → "Verify and Publish"
   - Upload source code and constructor parameters

### Integration with Frontend

Add the contract addresses to your `.env` file:

```env
VITE_CSHARE_CONTRACT_ADDRESS=0x_your_token_contract_address
VITE_ESCROW_CONTRACT_ADDRESS=0x_your_escrow_contract_address
```

## 📋 Development Roadmap

### Phase 1: MVP Launch (Months 1-3)
**Status: In Development**

#### Core Infrastructure
- [x] Project setup with React + TypeScript
- [x] Responsive UI with glassmorphism design
- [x] Firebase integration for real-time data
- [ ] User authentication and profile management
- [ ] Basic project creation and browsing
- [ ] MetaMask wallet integration

#### Smart Contract Development
- [ ] Deploy CSHARE token contract on Polygon Mumbai testnet
- [ ] Implement basic escrow functionality
- [ ] Test contract interactions with frontend
- [ ] Security audit of smart contracts

#### UNILAG Pilot Features
- [ ] Student verification system
- [ ] Department categorization
- [ ] Basic funding mechanics
- [ ] Simple voting system

**Deliverables:**
- Functional MVP with core features
- Smart contracts deployed on testnet
- Onboarding documentation for UNILAG students
- Basic analytics dashboard

---

### Phase 2: Enhanced Features (Months 4-6)
**Status: Planned**

#### Advanced Functionality
- [ ] Innovation challenge system
- [ ] Project milestone tracking
- [ ] Reputation scoring for creators
- [ ] Advanced search and filtering
- [ ] Mobile application (React Native)

#### Governance & Community
- [ ] Community voting mechanisms
- [ ] Dispute resolution system
- [ ] Project review and approval process
- [ ] Mentor matching system

#### Analytics & Insights
- [ ] Comprehensive analytics dashboard
- [ ] Project performance metrics
- [ ] User engagement tracking
- [ ] ROI calculations for supporters

**Deliverables:**
- Challenge competition platform
- Mobile app for iOS/Android
- Community governance tools
- Enhanced analytics suite

---

### Phase 3: Scale & Expand (Months 7-12)
**Status: Future Planning**

#### Platform Expansion
- [ ] Multi-university support
- [ ] International student programs
- [ ] Corporate partnership integration
- [ ] Alumni network features

#### Advanced Blockchain Features
- [ ] Multi-token support (USDC, MATIC)
- [ ] NFT certificates for project completion
- [ ] Cross-chain interoperability
- [ ] DeFi yield farming for platform treasury

#### AI & Machine Learning
- [ ] AI-powered project recommendations
- [ ] Fraud detection algorithms
- [ ] Success prediction models
- [ ] Automated content moderation

**Deliverables:**
- Multi-university platform
- Advanced DeFi integration
- AI recommendation engine
- International expansion framework

---

### Phase 4: Ecosystem Development (Year 2)
**Status: Long-term Vision**

#### Ecosystem Expansion
- [ ] Incubator program integration
- [ ] Industry partnership marketplace
- [ ] IP protection and licensing
- [ ] Graduate tracking and success metrics

#### Advanced Features
- [ ] Virtual reality project presentations
- [ ] Blockchain-based academic credentials
- [ ] Decentralized autonomous organization (DAO)
- [ ] Carbon offset integration for sustainable projects

#### Global Impact
- [ ] UNESCO partnership for education innovation
- [ ] World Bank collaboration for development projects
- [ ] UN SDG alignment and tracking
- [ ] Global innovation metrics and reporting

**Deliverables:**
- Global platform with 100+ universities
- DAO governance structure
- Sustainable development impact tracking
- Industry-standard incubator program

## 📊 Success Metrics & KPIs

### Platform Metrics
- **Active Users**: Target 10,000+ UNILAG students by Q4 2024
- **Project Success Rate**: Maintain 80%+ project completion rate
- **Funding Volume**: Process ₦50M+ in project funding annually
- **Community Growth**: 25%+ month-over-month user growth

### Student Impact Metrics
- **Projects Launched**: 500+ student projects in first year
- **Students Benefited**: 2,000+ students receive funding or support
- **Employment Rate**: 70%+ of successful project creators find employment
- **Innovation Patents**: 50+ patent applications from platform projects

### Financial Metrics
- **Platform Revenue**: ₦5M+ annual revenue from platform fees
- **Token Circulation**: 80%+ of CSHARE tokens in active circulation
- **Average Project Size**: ₦100,000 average funding per project
- **ROI for Supporters**: 15%+ average return on investment

## 🔒 Security Considerations

### Smart Contract Security
- **Reentrancy Protection**: All contracts use OpenZeppelin's ReentrancyGuard
- **Access Controls**: Role-based permissions for critical functions
- **Audit Requirements**: Professional security audit before mainnet deployment
- **Emergency Pauses**: Circuit breakers for contract emergencies

### Platform Security
- **Firebase Security Rules**: Strict data access controls
- **Input Validation**: Comprehensive validation on all user inputs
- **Rate Limiting**: API rate limits to prevent abuse
- **Encryption**: All sensitive data encrypted at rest and in transit

### Privacy Protection
- **GDPR Compliance**: Full compliance with data protection regulations
- **Anonymous Voting**: Option for anonymous project support
- **Data Minimization**: Collect only necessary user information
- **Right to Deletion**: User data deletion capabilities

## 🤝 Contributing

We welcome contributions from developers, designers, and blockchain enthusiasts! Here's how you can contribute:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write tests for new functionality
- Update documentation for any changes
- Ensure all tests pass before submitting PR
- Add meaningful commit messages

### Areas for Contribution
- **Frontend Development**: React components, UI/UX improvements
- **Smart Contracts**: Solidity development, security improvements
- **Backend**: Firebase functions, API development
- **Testing**: Unit tests, integration tests, security testing
- **Documentation**: Code documentation, user guides
- **Design**: UI/UX design, branding, marketing materials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **University of Lagos (UNILAG)** for inspiring this initiative
- **Polygon Network** for providing scalable blockchain infrastructure
- **Firebase** for reliable backend services
- **OpenZeppelin** for secure smart contract frameworks
- **The open-source community** for invaluable tools and resources

## 📞 Support & Contact

### Technical Support
- **Documentation**: [docs.studentinnovationtrust.com](https://docs.studentinnovationtrust.com)
- **Discord Community**: [discord.gg/student-innovation](https://discord.gg/student-innovation)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/your-org/student-innovation-trust/issues)

### Business Inquiries
- **Email**: partnerships@studentinnovationtrust.com
- **LinkedIn**: [Student Innovation Trust](https://linkedin.com/company/student-innovation-trust)
- **Twitter**: [@StudentInnoTrust](https://twitter.com/StudentInnoTrust)

### University Partnerships
- **UNILAG Coordinator**: unilag@studentinnovationtrust.com
- **Partnership Inquiries**: expand@studentinnovationtrust.com

---

**Built with ❤️ for the next generation of Nigerian innovators**

*Last updated: January 2024*