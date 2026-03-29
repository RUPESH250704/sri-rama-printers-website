const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'sabarinyp@gmail.com' });
    
    if (!existingAdmin) {
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
      console.log('Admin user created successfully');
      console.log('Email: sabarinyp@gmail.com');
      console.log('Password: sabarinyp');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = createAdminUser;