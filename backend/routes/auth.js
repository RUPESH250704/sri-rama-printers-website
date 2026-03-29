const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register - Disabled for production
router.post('/register', async (req, res) => {
  res.status(403).json({ message: 'Registration is disabled' });
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email }, { username: email }] 
    });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin } });
});

module.exports = router;