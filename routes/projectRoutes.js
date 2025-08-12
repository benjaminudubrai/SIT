const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    // Mock data for now - in a real app, this would come from a Project model
    const projects = [
      {
        id: 1,
        title: 'Smart Campus Navigation App',
        creator: 'Adewale Ogundimu',
        department: 'Computer Science',
        description: 'An AI-powered navigation system for UNILAG campus',
        funding: 560000,
        target: 1000000,
        progress: 56,
        supporters: 23,
        status: 'active',
        createdAt: new Date('2025-07-15')
      },
      {
        id: 2,
        title: 'Sustainable Water Purification System',
        creator: 'Chiamaka Okoro',
        department: 'Environmental Engineering',
        description: 'Low-cost water purification system for rural communities',
        funding: 3240000,
        target: 6000000,
        progress: 54,
        supporters: 18,
        status: 'active',
        createdAt: new Date('2025-07-10')
      },
      {
        id: 3,
        title: 'AI-Powered Study Assistant',
        creator: 'Ibrahim Lawal',
        department: 'Information Technology',
        description: 'Personalized AI tutor for students',
        funding: 5800000,
        target: 10000000,
        progress: 58,
        supporters: 31,
        status: 'active',
        createdAt: new Date('2025-07-05')
      }
    ];

    res.json(projects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock data - in a real app, find by ID from database
    const project = {
      id: parseInt(id),
      title: 'Smart Campus Navigation App',
      creator: 'Adewale Ogundimu',
      department: 'Computer Science',
      description: 'An AI-powered navigation system for UNILAG campus that helps students and visitors navigate the campus efficiently.',
      funding: 560000,
      target: 1000000,
      progress: 56,
      supporters: 23,
      status: 'active',
      createdAt: new Date('2025-07-15'),
      updates: [
        {
          date: '2025-08-01',
          title: 'Prototype Development Complete',
          content: 'We have successfully completed the initial prototype of the navigation app.'
        }
      ]
    };

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, target, department } = req.body;

    // In a real app, create new Project document
    const newProject = {
      id: Date.now(), // Mock ID
      title,
      description,
      target,
      department,
      creator: req.user.id,
      funding: 0,
      progress: 0,
      supporters: 0,
      status: 'active',
      createdAt: new Date()
    };

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Fund a project
router.post('/:id/fund', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has sufficient balance
    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // In a real app, update project funding and user's investments
    user.wallet.balance -= amount;
    user.investments.push({
      project: id,
      amount,
      date: new Date()
    });

    await user.save();

    res.json({
      message: 'Project funded successfully',
      investment: {
        project: id,
        amount,
        date: new Date()
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
