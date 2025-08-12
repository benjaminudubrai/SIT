const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get wallet info
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet investments');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      wallet: user.wallet,
      investments: user.investments,
      totalInvested: user.investments.reduce((sum, inv) => sum + inv.amount, 0)
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Add funds to wallet (mock - in real app would integrate with payment gateway)
router.post('/add-funds', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet.balance += amount;
    await user.save();

    res.json({
      message: 'Funds added successfully',
      newBalance: user.wallet.balance
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
