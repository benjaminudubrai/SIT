#!/usr/bin/env node

/**
 * Student Innovation Trust - Comprehensive Testing Script
 * This script helps you test the frontend, backend, and blockchain integration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan');
  log('='.repeat(50), 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

// Run command and return output
function runCommand(command, description) {
  try {
    log(`Running: ${command}`, 'yellow');
    const output = execSync(command, { encoding: 'utf8', cwd: __dirname });
    logSuccess(`${description} completed successfully`);
    return output;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    return null;
  }
}

// Check environment setup
function checkEnvironment() {
  logStep(1, 'Checking Environment Setup');
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    logSuccess(`Node.js version: ${nodeVersion}`);
  } catch (error) {
    logError('Node.js is not installed');
    return false;
  }

  // Check npm version
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logSuccess(`npm version: ${npmVersion}`);
  } catch (error) {
    logError('npm is not installed');
    return false;
  }

  // Check if .env file exists
  if (fileExists('.env')) {
    logSuccess('.env file found');
  } else {
    logWarning('.env file not found - you may need to create one from .env.example');
  }

  // Check package.json
  if (fileExists('package.json')) {
    logSuccess('package.json found');
  } else {
    logError('package.json not found');
    return false;
  }

  return true;
}

// Install dependencies
function installDependencies() {
  logStep(2, 'Installing Dependencies');
  
  const result = runCommand('npm install', 'Dependency installation');
  return result !== null;
}

// Check MongoDB connection
function checkMongoDB() {
  logStep(3, 'Checking MongoDB Connection');
  
  try {
    // Try to connect to MongoDB
    const mongoCheck = execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { 
      encoding: 'utf8',
      timeout: 5000 
    });
    logSuccess('MongoDB is running and accessible');
    return true;
  } catch (error) {
    logWarning('MongoDB connection failed - make sure MongoDB is running');
    logInfo('To start MongoDB:');
    logInfo('  macOS: brew services start mongodb-community');
    logInfo('  Ubuntu: sudo systemctl start mongod');
    logInfo('  Windows: net start MongoDB');
    return false;
  }
}

// Test backend server
function testBackend() {
  logStep(4, 'Testing Backend Server');
  
  logInfo('Starting backend server in background...');
  
  try {
    // Start server in background
    const serverProcess = execSync('npm run server &', { encoding: 'utf8' });
    
    // Wait a moment for server to start
    setTimeout(() => {
      try {
        // Test health endpoint
        const healthCheck = execSync('curl -s http://localhost:5000/api/health', { 
          encoding: 'utf8',
          timeout: 10000 
        });
        
        const healthData = JSON.parse(healthCheck);
        if (healthData.status === 'OK') {
          logSuccess('Backend server is running and healthy');
          return true;
        }
      } catch (error) {
        logError('Backend health check failed');
        return false;
      }
    }, 3000);
    
  } catch (error) {
    logError('Failed to start backend server');
    return false;
  }
}

// Test frontend build
function testFrontend() {
  logStep(5, 'Testing Frontend Build');
  
  const result = runCommand('npm run build', 'Frontend build');
  if (result) {
    logSuccess('Frontend builds successfully');
    return true;
  }
  return false;
}

// Test blockchain integration
function testBlockchain() {
  logStep(6, 'Testing Blockchain Integration');
  
  // Check if blockchain utilities exist
  if (fileExists('utils/blockchain.js')) {
    logSuccess('Blockchain utilities found');
  } else {
    logError('Blockchain utilities not found');
    return false;
  }

  if (fileExists('src/utils/web3.ts')) {
    logSuccess('Frontend Web3 utilities found');
  } else {
    logError('Frontend Web3 utilities not found');
    return false;
  }

  if (fileExists('contracts/CShareToken.sol')) {
    logSuccess('Smart contract found');
  } else {
    logError('Smart contract not found');
    return false;
  }

  // Check if ethers is installed
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.dependencies.ethers) {
      logSuccess(`Ethers.js installed: ${packageJson.dependencies.ethers}`);
    } else {
      logError('Ethers.js not installed');
      return false;
    }
  } catch (error) {
    logError('Could not read package.json');
    return false;
  }

  return true;
}

// Run API tests
function runAPITests() {
  logStep(7, 'Running API Tests');
  
  const testEndpoints = [
    { url: 'http://localhost:5000/api/health', name: 'Health Check' },
    { url: 'http://localhost:5000/api/tokens/network', name: 'Network Info' },
    { url: 'http://localhost:5000/api/tokens/health', name: 'Blockchain Health' }
  ];

  let allPassed = true;

  testEndpoints.forEach(endpoint => {
    try {
      const response = execSync(`curl -s ${endpoint.url}`, { 
        encoding: 'utf8',
        timeout: 5000 
      });
      
      const data = JSON.parse(response);
      logSuccess(`${endpoint.name}: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      logError(`${endpoint.name} failed: ${error.message}`);
      allPassed = false;
    }
  });

  return allPassed;
}

// Generate test report
function generateReport(results) {
  logStep(8, 'Generating Test Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    results: results,
    summary: {
      total: Object.keys(results).length,
      passed: Object.values(results).filter(r => r).length,
      failed: Object.values(results).filter(r => !r).length
    }
  };

  // Write report to file
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  
  log('\n📊 TEST SUMMARY', 'bright');
  log('='.repeat(30), 'blue');
  log(`Total Tests: ${report.summary.total}`, 'blue');
  log(`Passed: ${report.summary.passed}`, 'green');
  log(`Failed: ${report.summary.failed}`, 'red');
  
  if (report.summary.failed === 0) {
    log('\n🎉 All tests passed!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the details above.', 'yellow');
  }

  log(`\nDetailed report saved to: test-report.json`, 'blue');
}

// Main test runner
async function runTests() {
  log('🚀 Student Innovation Trust - Test Runner', 'bright');
  log('='.repeat(50), 'blue');
  
  const results = {};
  
  // Run all tests
  results.environment = checkEnvironment();
  results.dependencies = installDependencies();
  results.mongodb = checkMongoDB();
  results.backend = testBackend();
  results.frontend = testFrontend();
  results.blockchain = testBlockchain();
  results.apiTests = runAPITests();
  
  // Generate report
  generateReport(results);
  
  // Exit with appropriate code
  const allPassed = Object.values(results).every(result => result);
  process.exit(allPassed ? 0 : 1);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log('Student Innovation Trust Test Runner', 'bright');
  log('Usage: node test-runner.js [options]', 'blue');
  log('Options:', 'blue');
  log('  --help, -h     Show this help message', 'blue');
  log('  --env-only     Only check environment setup', 'blue');
  log('  --backend-only Only test backend', 'blue');
  log('  --frontend-only Only test frontend', 'blue');
  process.exit(0);
}

if (args.includes('--env-only')) {
  checkEnvironment();
  process.exit(0);
}

if (args.includes('--backend-only')) {
  checkEnvironment() && installDependencies() && checkMongoDB() && testBackend();
  process.exit(0);
}

if (args.includes('--frontend-only')) {
  checkEnvironment() && installDependencies() && testFrontend();
  process.exit(0);
}

// Run all tests
runTests().catch(error => {
  logError(`Test runner failed: ${error.message}`);
  process.exit(1);
});
