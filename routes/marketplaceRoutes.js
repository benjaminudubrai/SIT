import express from 'express';
import auth from '../middleware/auth.js';
import MarketplaceItem from '../models/MarketplaceItem.js';

const router = express.Router();

// Get all marketplace items
router.get('/', async (req, res, next) => {
  try {
    // Fetch items from the database and populate the vendor's name
    const items = await MarketplaceItem.find({ isActive: true })
      .populate('vendor', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Create marketplace item (requires user to be authenticated)
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, category, price, description, image } = req.body;

    const newItem = new MarketplaceItem({
      name,
      category,
      price,
      description,
      image,
      vendor: req.user.id,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

export default router;
