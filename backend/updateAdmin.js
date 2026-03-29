const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updateAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Delete all existing users
    await User.deleteMany({});
    console.log('All existing users deleted');

    // Create new admin user
    const adminUser = new User({
      name: 'Krishnaprasad',
      email: 'sabarinyp@gmail.com',
      username: 'Krishnaprasad',
      password: 'sabarinyp',
      phone: '9999999999',
      address: 'Admin Address',
      isAdmin: true
    });

    await adminUser.save();
    console.log('New admin user created successfully');
    console.log('Email: sabarinyp@gmail.com');
    console.log('Password: sabarinyp');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin user:', error);
    process.exit(1);
  }
};

updateAdminUser();