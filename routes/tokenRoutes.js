const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user's token balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      balance: user.wallet.balance || 0,
      cshareTokens: user.wallet.cshareTokens || 0
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Transfer tokens (placeholder for blockchain integration)
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

    const fromUser = await User.findById(req.user.id);
    const toUser = await User.findById(to);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check balance
    const currentBalance = tokenType === 'cshare' 
      ? fromUser.wallet.cshareTokens 
      : fromUser.wallet.balance;

    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Perform transfer (in a real app, this would interact with blockchain)
    if (tokenType === 'cshare') {
      fromUser.wallet.cshareTokens -= amount;
      toUser.wallet.cshareTokens += amount;
    } else {
      fromUser.wallet.balance -= amount;
      toUser.wallet.balance += amount;
    }

    await fromUser.save();
    await toUser.save();

    res.json({
      message: 'Transfer successful',
      transaction: {
        from: fromUser.name,
        to: toUser.name,
        amount,
        tokenType,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Mint tokens (admin only - placeholder)
router.post('/mint', auth, async (req, res) => {
  try {
    const { userId, amount, tokenType } = req.body;

    // In a real app, check if user is admin
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

    res.json({
      message: 'Tokens minted successfully',
      newBalance: tokenType === 'cshare' ? user.wallet.cshareTokens : user.wallet.balance
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
