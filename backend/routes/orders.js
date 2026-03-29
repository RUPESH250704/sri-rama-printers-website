const express = require('express');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { card, quantity, customPrice, customText, totalAmount, deliveryType, deliveryAddress, phone } = req.body;
    
    // Check stock availability
    const Card = require('../models/Card');
    const cardData = await Card.findById(card);
    if (!cardData) {
      return res.status(404).json({ message: 'Card not found' });
    }
    if (cardData.stock < quantity) {
      return res.status(400).json({ message: `Only ${cardData.stock} items available in stock` });
    }
    
    const order = new Order({
      user: req.user._id,
      card,
      quantity,
      customPrice,
      customText,
      totalAmount,
      deliveryType,
      deliveryAddress,
      phone
    });
    
    await order.save();
    
    // Reduce stock
    await Card.findByIdAndUpdate(card, { $inc: { stock: -quantity } });
    
    await order.populate('card');
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders with detailed status
router.get('/my-orders-status', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('card', 'name price')
      .select('card quantity totalAmount status deliveryType createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    const formattedOrders = orders.map(order => ({
      id: order._id,
      cardName: order.card?.name || 'Unknown',
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      status: order.status,
      deliveryType: order.deliveryType,
      orderDate: order.createdAt,
      lastUpdated: order.updatedAt
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('card').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user card').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user card');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;