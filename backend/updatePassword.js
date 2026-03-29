const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Create new user
    const newUser = new User({
      name: 'Chrupesh',
      email: 'chrupesh025@gmail.com',
      username: 'chrupesh025',
      password: 'password123',
      phone: '9999999999',
      address: 'User Address',
      isAdmin: true
    });

    await newUser.save();
    console.log('User created successfully');
    console.log('Email: chrupesh025@gmail.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

createUser();