const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    // Mock notifications data
    const notifications = [
      {
        id: 1,
        title: 'New Project Funded',
        message: 'Your project "Smart Campus Navigation App" received ₦50,000 funding!',
        type: 'success',
        read: false,
        createdAt: new Date('2025-08-10T10:30:00Z')
      },
      {
        id: 2,
        title: 'Investment Update',
        message: 'The "Water Purification System" project you invested in has reached 60% funding.',
        type: 'info',
        read: false,
        createdAt: new Date('2025-08-09T15:45:00Z')
      },
      {
        id: 3,
        title: 'Welcome Bonus',
        message: 'You received 50 $CSHARE tokens as a welcome bonus!',
        type: 'success',
        read: true,
        createdAt: new Date('2025-08-08T09:00:00Z')
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, update notification in database
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    // In a real app, update all user notifications in database
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
