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

async function removeAdminMatrimonialProfile() {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connUri);

    // Find admin user(s)
    const adminUsers = await User.find({ role: 'admin' });
    const adminUserIds = adminUsers.map((u) => u._id);

    console.log(`Found ${adminUsers.length} Admin User account(s):`);
    adminUsers.forEach((u) => console.log(` - ID: ${u._id} | Email: ${u.email} | Role: ${u.role}`));

    // Delete any matrimonial profile record linked to Admin accounts or named "SS Matrimony Admin"
    const deletedProfiles = await Profile.deleteMany({
      $or: [
        { user: { $in: adminUserIds } },
        { fullName: 'SS Matrimony Admin' },
      ],
    });

    console.log(`Deleted ${deletedProfiles.deletedCount} Admin matrimonial profile record(s).`);

    // Audit remaining Users and Profiles
    const remainingUsers = await User.find({});
    const remainingProfiles = await Profile.find({}).populate('user', 'email role');

    console.log('\n========================================================');
    console.log('              FINAL DATABASE AUDIT                      ');
    console.log('========================================================');
    console.log(`Remaining Users (${remainingUsers.length}):`);
    remainingUsers.forEach((u) => console.log(` - Email: ${u.email} | Role: ${u.role} | Name: ${u.fullName || 'N/A'}`));

    console.log(`\nRemaining Matrimonial Profiles (${remainingProfiles.length}):`);
    remainingProfiles.forEach((p) =>
      console.log(` - Name: ${p.fullName} | Gender: ${p.gender} | Source: ${p.profileSource} | Status: ${p.status} | User Role: ${p.user?.role || 'Imported'}`)
    );
    console.log('========================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error removing admin profile:', err);
    process.exit(1);
  }
}

removeAdminMatrimonialProfile();
