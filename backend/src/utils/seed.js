const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

// Configure DNS fallback for reliable mongodb+srv SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore
}

const User = require('../models/User');
const Profile = require('../models/Profile');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connUri);

    // Ensure Administrator Account exists
    const adminEmail = 'admin@ssmatrimony.com';
    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!adminUser) {
      adminUser = await User.create({
        fullName: 'SS Matrimony Admin',
        email: adminEmail.toLowerCase(),
        mobile: '+91 98765 43210',
        password: 'Admin@123',
        role: 'admin',
        emailVerified: true,
        accountStatus: 'active',
        authProvider: 'local',
      });
      console.log('Admin account created successfully: admin@ssmatrimony.com / Admin@123');
    } else {
      adminUser.role = 'admin';
      adminUser.accountStatus = 'active';
      adminUser.emailVerified = true;
      await adminUser.save();
      console.log('Admin account already exists and is active.');
    }

    // Ensure NO matrimonial profile record exists for the admin account
    await Profile.deleteMany({
      $or: [{ user: adminUser._id }, { fullName: 'SS Matrimony Admin' }],
    });

    console.log('\n--- SEED COMPLETE (Admin account verified. Zero fake profiles generated.) ---');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDB();
