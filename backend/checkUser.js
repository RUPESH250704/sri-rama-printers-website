const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAndResetUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Check if user exists
    const user = await User.findOne({ email: 'chrupesh025@gmail.com' });
    
    if (user) {
      console.log('User found:', user.name, user.email);
      
      // Reset password to 'password123' and make admin
      user.password = 'password123';
      user.isAdmin = true;
      await user.save();
      console.log('Password reset to: password123 and set as admin');
    } else {
      console.log('User not found. Creating new user...');
      
      // Create new user
      const newUser = new User({
        name: 'Chrupesh',
        email: 'chrupesh025@gmail.com',
        username: 'chrupesh025',
        password: 'password123',
        phone: '1234567890',
        address: 'User Address',
        isAdmin: true
      });
      
      await newUser.save();
      console.log('New user created with password: password123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndResetUser();