import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all marketplace items
router.get('/', async (req, res, next) => {
  try {
    // Mock marketplace data
    const items = [
      {
        id: 1,
        name: 'Campus Food Delivery',
        vendor: 'Mama Cass Kitchen',
        category: 'Food',
        price: 1500,
        rating: 4.8,
        image: 'https://placehold.co/600x400/7C3AED/FFFFFF?text=Food+Delivery',
        description: 'Fresh home-cooked meals delivered to your hostel'
      },
      {
        id: 2,
        name: 'Textbook Rental',
        vendor: 'BookHub UNILAG',
        category: 'Education',
        price: 2000,
        rating: 4.6,
        image: 'https://placehold.co/600x400/2563EB/FFFFFF?text=Textbooks',
        description: 'Rent textbooks at affordable prices'
      },
      {
        id: 3,
        name: 'Laundry Service',
        vendor: 'Campus Cleaners',
        category: 'Service',
        price: 2500,
        rating: 4.5,
        image: 'https://placehold.co/600x400/10B981/FFFFFF?text=Laundry',
        description: 'Quick and reliable laundry service for students.'
      }
    ];

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Create marketplace item
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, category, price, description } = req.body;

    const newItem = {
      id: Date.now(),
      name,
      category,
      price,
      description,
      vendor: req.user.id,
      rating: 0,
      createdAt: new Date()
    };

    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

export default router;
