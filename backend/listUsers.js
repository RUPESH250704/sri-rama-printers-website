const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const users = await User.find({}, 'name email username isAdmin');
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();