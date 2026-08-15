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
const Interest = require('../models/Interest');

async function cleanup() {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(connUri);

    console.log('Connected to MongoDB. Starting fake/test profile cleanup...');

    // 1. Identify fake users by email domain or test pattern
    const fakeUsers = await User.find({
      $or: [
        { email: { $regex: /@example\.com$/i } },
        { email: { $regex: /^test\./i } },
        { email: { $regex: /^normal\.user\./i } },
        { email: { $regex: /^verified\.member\./i } },
      ],
      role: { $ne: 'admin' }, // Never touch admin account
    });

    const fakeUserIds = fakeUsers.map((u) => u._id);
    console.log(`Found ${fakeUserIds.length} fake/test user accounts to delete.`);

    // 2. Delete interests involving fake users
    const deletedInterests = await Interest.deleteMany({
      $or: [
        { sender: { $in: fakeUserIds } },
        { recipient: { $in: fakeUserIds } },
      ],
    });
    console.log(`Deleted ${deletedInterests.deletedCount} interests involving fake users.`);

    // 3. Delete profiles linked to fake users
    const deletedProfiles = await Profile.deleteMany({
      $or: [
        { user: { $in: fakeUserIds } },
        { contactEmail: { $regex: /@example\.com$/i } },
      ],
    });
    console.log(`Deleted ${deletedProfiles.deletedCount} fake user profiles.`);

    // 4. Delete fake users
    const deletedUsers = await User.deleteMany({ _id: { $in: fakeUserIds } });
    console.log(`Deleted ${deletedUsers.deletedCount} fake user accounts.`);

    // Audit remaining Users and Profiles
    const remainingUsers = await User.find({}).select('email fullName role');
    const remainingProfiles = await Profile.find({}).select('fullName gender status isVerified profileSource user');

    console.log('\n=== CLEANUP VERIFICATION ===');
    console.log(`Remaining Users (${remainingUsers.length}):`);
    remainingUsers.forEach((u) => console.log(` - ${u.fullName || 'No Name'} <${u.email}> [${u.role}]`));

    console.log(`\nRemaining Profiles (${remainingProfiles.length}):`);
    remainingProfiles.forEach((p) =>
      console.log(` - ${p.fullName} (${p.gender}) | Status: ${p.status} | Verified: ${p.isVerified} | Source: ${p.profileSource}`)
    );

    console.log('\nCleanup process finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup Error:', err);
    process.exit(1);
  }
}

cleanup();
