const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { auth } = require('../middleware/auth');

const router = express.Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Register - Disabled for production
router.post('/register', async (req, res) => {
  res.status(403).json({ message: 'Registration is disabled' });
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginId = (email || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const exactMatchRegex = new RegExp(`^${escapeRegex(loginId)}$`, 'i');

    // Find user by email or username (case-insensitive for resilience).
    const user = await User.findOne({
      $or: [{ email: exactMatchRegex }, { username: exactMatchRegex }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let isValidPassword = false;
    try {
      isValidPassword = await user.comparePassword(password);
    } catch (error) {
      isValidPassword = false;
    }

    // Legacy compatibility: if old records stored plain text, allow one-time login
    // and immediately migrate stored password to a bcrypt hash.
    if (!isValidPassword && user.password === password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      isValidPassword = true;
    }

    if (!isValidPassword) {
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

// Get incharge options from actual DB data
router.get('/incharge-options', auth, async (req, res) => {
  try {
    const [users, employees] = await Promise.all([
      User.find().select('name -_id'),
      Employee.find({ isActive: { $ne: false } }).select('name -_id')
    ]);

    const names = Array.from(
      new Set(
        [...users, ...employees]
          .map((item) => (item.name || '').trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    res.json({ names });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;