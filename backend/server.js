const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createAdminUser = require('./createAdmin');
require('dotenv').config();

const app = express();

const extraAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedVercelOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev && ['http://localhost:3000', 'http://127.0.0.1:3000'].includes(origin)) {
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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/attendance', require('./routes/attendance'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: { connected: mongoose.connection.readyState === 1, dbName: mongoose.connection.name || null }
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected (db: ${mongoose.connection.name})`);
    createAdminUser();
  })
  .catch(err => console.log('MongoDB connection error:', err.message));

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
