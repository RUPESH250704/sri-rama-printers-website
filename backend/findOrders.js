const mongoose = require('mongoose');
const Order = require('./models/Order');
const ServiceOrder = require('./models/ServiceOrder');
const User = require('./models/User');
require('dotenv').config();

const findUserOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Find user first
    const user = await User.findOne({ email: 'chrupesh025@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }

    console.log(`Found user: ${user.name} (${user.email})`);

    // Find regular orders
    const orders = await Order.find({ userId: user._id });
    console.log(`\nRegular Orders: ${orders.length}`);
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.orderType} - Status: ${order.status} - Date: ${order.createdAt}`);
    });

    // Find service orders
    const serviceOrders = await ServiceOrder.find({ userId: user._id });
    console.log(`\nService Orders: ${serviceOrders.length}`);
    serviceOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.serviceType} - Status: ${order.status} - Date: ${order.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error finding orders:', error);
    process.exit(1);
  }
};

findUserOrders();