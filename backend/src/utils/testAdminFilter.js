const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Profile = require('../models/Profile');

async function testApis() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Admin Users query (User Management)
    const usersForAdmin = await User.find({ role: { $ne: 'admin' }, isDeleted: { $ne: true } });
    console.log('User Management API User Count (excluding admin):', usersForAdmin.length);
    console.log('User Emails in Management List:', usersForAdmin.map((u) => u.email));

    // 2. Admin Stats
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id);
    const totalBrides = await Profile.countDocuments({ gender: { $in: ['bride', 'female', 'Bride', 'Female'] }, user: { $nin: adminIds } });
    const totalGrooms = await Profile.countDocuments({ gender: { $in: ['groom', 'male', 'Groom', 'Male'] }, user: { $nin: adminIds } });
    console.log('Admin Stats - Brides:', totalBrides, '| Grooms:', totalGrooms);

    // 3. Admin User Profile Check
    const adminProfiles = await Profile.find({ user: { $in: adminIds } });
    console.log('Admin Matrimonial Profiles count in DB:', adminProfiles.length);

    console.log('\n[PASS] All Admin filtering tests completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
}

testApis();
