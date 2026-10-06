const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed');
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email },
      { $set: { name, email, username: email, password: hashedPassword, isAdmin: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Admin user synced');
  } catch (error) {
    console.error('Error syncing admin user:', error);
  }
};

module.exports = seedAdminUser;
