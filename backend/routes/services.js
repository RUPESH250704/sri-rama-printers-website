const express = require('express');
const ServiceOrder = require('../models/ServiceOrder');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create service order
router.post('/order', auth, async (req, res) => {
  try {
    const serviceOrder = new ServiceOrder({
      user: req.user._id,
      ...req.body
    });

    await serviceOrder.save();
    
    res.status(201).json({ 
      message: 'Order placed successfully',
      order: serviceOrder 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's service orders with status
router.get('/my-orders-status', auth, async (req, res) => {
  try {
    const orders = await ServiceOrder.find({ user: req.user._id })
      .select('serviceType quantity totalAmount status deliveryType createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    const formattedOrders = orders.map(order => ({
      id: order._id,
      serviceType: order.serviceType,
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

// Get all service orders
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await ServiceOrder.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service order status
router.put('/orders/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await ServiceOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;