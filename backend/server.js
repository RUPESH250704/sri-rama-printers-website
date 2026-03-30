const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const createAdminUser = require('./createAdmin');
require('dotenv').config();

const app = express();

const getDbDebugInfo = () => ({
  connected: mongoose.connection.readyState === 1,
  dbName: mongoose.connection.name || null
});

const extraAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedVercelOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
};

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

    if (isDevelopment && devOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (extraAllowedOrigins.includes(origin) || isAllowedVercelOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/services', require('./routes/services'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/attendance', require('./routes/attendance'));

// Lightweight health check to verify active DB after deployment.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: getDbDebugInfo()
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected (db: ${mongoose.connection.name || 'unknown'})`);
    // Create admin user on startup
    createAdminUser();
  })
  .catch(err => console.log('MongoDB connection error:', err.message));

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;