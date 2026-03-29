const express = require('express');
const multer = require('multer');
const path = require('path');
const Card = require('../models/Card');
const { adminAuth } = require('../middleware/auth');
const paginate = require('../middleware/pagination');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all cards with pagination
router.get('/', paginate, async (req, res) => {
  try {
    const { page, limit, skip } = req.pagination;
    const { category, search } = req.query;
    
    let query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const cards = await Card.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await Card.countDocuments(query);
    
    res.json({
      data: cards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get card by ID
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create card (Admin only)
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.files && req.files.length > 0 ? req.files[0].filename : '';
    const images = req.files ? req.files.map(file => file.filename) : [];

    const card = new Card({ name, description, price, category, stock, image, images });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update card (Admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body;
    const updateData = { name, description, price, category, stock, isActive };
    
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const card = await Card.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete card (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;