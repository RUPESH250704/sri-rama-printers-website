const bcrypt = require('bcryptjs');
const User = require('./models/User');

const HARDCODED_USERS = [
  {
    name: 'Sabari User',
    email: 'sabarinyp@gmail.com',
    username: 'sabarinyp@gmail.com',
    password: 'sabarinyp',
    phone: '9999999999',
    address: 'User Address',
    isAdmin: true
  },
  {
    name: 'Admin User',
    email: 'chrupesh025@gmail.com',
    username: 'chrupesh025@gmail.com',
    password: 'password123',
    phone: '9999999999',
    address: 'Admin Address',
    isAdmin: false
  }
];

const seedHardcodedUsers = async () => {
  try {
    for (const account of HARDCODED_USERS) {
      const hashedPassword = await bcrypt.hash(account.password, 10);

      await User.findOneAndUpdate(
        { email: account.email },
        {
          $set: {
            name: account.name,
            email: account.email,
            username: account.username,
            password: hashedPassword,
            phone: account.phone,
            address: account.address,
            isAdmin: account.isAdmin
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('Hardcoded user accounts synced successfully');
  } catch (error) {
    console.error('Error syncing hardcoded users:', error);
  }
};

module.exports = seedHardcodedUsers;