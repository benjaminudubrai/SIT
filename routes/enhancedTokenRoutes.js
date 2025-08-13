import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import logger from '../config/logger.js';
import {
  getTokenBalance,
  transferTokens,
  getTransactionHistory,
  validateAddress,
  getNetworkInfo,
  checkBlockchainHealth
} from '../utils/blockchain.js';

const router = express.Router();

// Get user's token balance (both database and blockchain)
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let blockchainBalance = 0;
    
    // Get blockchain balance if user has a wallet address
    if (user.wallet.address) {
      try {
        blockchainBalance = await getTokenBalance(user.wallet.address);
      } catch (error) {
        logger.warn('Could not fetch blockchain balance:', error.message);
      }
    }

    res.json({
      databaseBalance: user.wallet.balance || 0,
      cshareTokens: user.wallet.cshareTokens || 0,
      blockchainBalance: parseFloat(blockchainBalance),
      walletAddress: user.wallet.address || null
    });
  } catch (error) {
    logger.error('Error getting balance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Transfer tokens on blockchain
router.post('/transfer', auth, async (req, res) => {
  try {
    const { to, amount, tokenType } = req.body;

    // Validate input
    if (!to || !amount || !tokenType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    // Validate recipient address if it's a blockchain transfer
    if (tokenType === 'blockchain' && !validateAddress(to)) {
      return res.status(400).json({ message: 'Invalid recipient address' });
    }

    const fromUser = await User.findById(req.user.id);
    if (!fromUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let transactionResult;

    if (tokenType === 'blockchain') {
      // Blockchain transfer
      if (!fromUser.wallet.address) {
        return res.status(400).json({ message: 'Wallet address not configured' });
      }

      try {
        transactionResult = await transferTokens(to, amount);
        
        // Update database record
        fromUser.wallet.cshareTokens -= amount;
        await fromUser.save();

        logger.info(`Blockchain transfer completed: ${transactionResult.hash}`);
      } catch (error) {
        logger.error('Blockchain transfer failed:', error);
        return res.status(500).json({ 
          message: 'Blockchain transfer failed', 
          error: error.message 
        });
      }
    } else {
      // Database-only transfer (legacy)
      const toUser = await User.findById(to);
      if (!toUser) {
        return res.status(404).json({ message: 'Recipient not found' });
      }

      // Check balance
      const currentBalance = tokenType === 'cshare' 
        ? fromUser.wallet.cshareTokens 
        : fromUser.wallet.balance;

      if (currentBalance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Perform database transfer
      if (tokenType === 'cshare') {
        fromUser.wallet.cshareTokens -= amount;
        toUser.wallet.cshareTokens += amount;
      } else {
        fromUser.wallet.balance -= amount;
        toUser.wallet.balance += amount;
      }

      await fromUser.save();
      await toUser.save();

      transactionResult = {
        type: 'database',
        timestamp: new Date()
      };
    }

    res.json({
      message: 'Transfer successful',
      transaction: {
        from: fromUser.name,
        to: tokenType === 'blockchain' ? to : (await User.findById(to)).name,
        amount,
        tokenType,
        ...transactionResult
      }
    });
  } catch (error) {
    logger.error('Error in token transfer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let blockchainHistory = [];
    
    // Get blockchain transaction history if user has a wallet address
    if (user.wallet.address) {
      try {
        blockchainHistory = await getTransactionHistory(user.wallet.address);
      } catch (error) {
        logger.warn('Could not fetch blockchain history:', error.message);
      }
    }

    // TODO: Get database transaction history
    const databaseHistory = [];

    res.json({
      blockchainTransactions: blockchainHistory,
      databaseTransactions: databaseHistory,
      total: blockchainHistory.length + databaseHistory.length
    });
  } catch (error) {
    logger.error('Error getting transaction history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user's wallet address
router.post('/connect-wallet', auth, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || !validateAddress(address)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet.address = address;
    await user.save();

    logger.info(`Wallet connected for user ${user.email}: ${address}`);

    res.json({
      message: 'Wallet connected successfully',
      address: address
    });
  } catch (error) {
    logger.error('Error connecting wallet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get network information
router.get('/network', async (req, res) => {
  try {
    const networkInfo = await getNetworkInfo();
    res.json(networkInfo);
  } catch (error) {
    logger.error('Error getting network info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check for blockchain connection
router.get('/health', async (req, res) => {
  try {
    const health = await checkBlockchainHealth();
    res.json(health);
  } catch (error) {
    logger.error('Error checking blockchain health:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mint tokens (admin only - for testing)
router.post('/mint', auth, async (req, res) => {
  try {
    const { userId, amount, tokenType } = req.body;

    // TODO: Add admin role check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (tokenType === 'cshare') {
      user.wallet.cshareTokens += amount;
    } else {
      user.wallet.balance += amount;
    }

    await user.save();

    logger.info(`Tokens minted: ${amount} ${tokenType} for user ${user.email}`);

    res.json({
      message: 'Tokens minted successfully',
      newBalance: tokenType === 'cshare' ? user.wallet.cshareTokens : user.wallet.balance
    });
  } catch (error) {
    logger.error('Error minting tokens:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
