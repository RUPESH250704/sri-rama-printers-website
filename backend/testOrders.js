const mongoose = require('mongoose');
const Order = require('./models/Order');
const ServiceOrder = require('./models/ServiceOrder');
const User = require('./models/User');
const Card = require('./models/Card');
require('dotenv').config();

const testOrderStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const user = await User.findOne({ email: 'chrupesh025@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }

    // Create a test card if none exists
    let card = await Card.findOne();
    if (!card) {
      card = new Card({
        name: 'Test Business Card',
        price: 100,
        stock: 50,
        category: 'business'
      });
      await card.save();
      console.log('Test card created');
    }

    // Create a test order
    const testOrder = new Order({
      user: user._id,
      card: card._id,
      quantity: 5,
      totalAmount: 500,
      deliveryType: 'pickup',
      phone: '9999999999'
    });
    await testOrder.save();

    // Create a test service order
    const testServiceOrder = new ServiceOrder({
      user: user._id,
      serviceType: 'xerox',
      quantity: 10,
      totalAmount: 50,
      deliveryType: 'pickup'
    });
    await testServiceOrder.save();

    console.log('Test orders created successfully!');
    console.log('New API endpoints available:');
    console.log('- GET /api/orders/my-orders-status');
    console.log('- GET /api/services/my-orders-status');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testOrderStatus();