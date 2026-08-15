const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

// Configure DNS fallback for reliable mongodb+srv SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS override errors
}

// Load backend environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Profile = require('../models/Profile');

const seedAdmin = async () => {
  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    console.error('[SEED ADMIN ERROR] MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('[SEED ADMIN] Connecting to MongoDB database...');
    await mongoose.connect(connUri);
    console.log('[SEED ADMIN] MongoDB connected successfully.');

    const adminEmail = 'admin@ssmatrimony.com';

    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });

    if (adminUser) {
      adminUser.fullName = 'SS Matrimony Admin';
      adminUser.password = 'Admin@123';
      adminUser.role = 'admin';
      adminUser.accountStatus = 'active';
      adminUser.emailVerified = true;
      await adminUser.save();
    } else {
      adminUser = await User.create({
        fullName: 'SS Matrimony Admin',
        email: adminEmail.toLowerCase(),
        password: 'Admin@123',
        role: 'admin',
        accountStatus: 'active',
        emailVerified: true,
        authProvider: 'local',
      });
    }

    // Ensure NO matrimonial profile record exists for the admin account
    await Profile.deleteMany({
      $or: [{ user: adminUser._id }, { fullName: 'SS Matrimony Admin' }],
    });

    console.log(`\n==================================================`);
    console.log(`[SEED ADMIN SUCCESS] Administrator account verified!`);
    console.log(`Name:     ${adminUser.fullName}`);
    console.log(`Email:    ${adminUser.email}`);
    console.log(`Role:     ${adminUser.role}`);
    console.log(`Status:   ${adminUser.accountStatus}`);
    console.log(`Note:     Admin account is strictly an authentication user and has NO matrimonial profile record.`);
    console.log(`==================================================\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[SEED ADMIN ERROR] Exception creating administrator account:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
