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

async function testAllMetrics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id);

    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' }, isDeleted: { $ne: true } });
    const totalBrides = await Profile.countDocuments({ gender: { $in: ['bride', 'female', 'Bride', 'Female'] }, user: { $nin: adminIds } });
    const totalGrooms = await Profile.countDocuments({ gender: { $in: ['groom', 'male', 'Groom', 'Male'] }, user: { $nin: adminIds } });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activeUsersToday = await User.countDocuments({ role: { $ne: 'admin' }, $or: [{ lastLogin: { $gte: startOfToday } }, { createdAt: { $gte: startOfToday } }] });
    const onlineToday = activeUsersToday;

    const pendingInterests = await Interest.countDocuments({ status: 'pending' });
    const acceptedInterests = await Interest.countDocuments({ status: 'accepted' });
    const rejectedInterests = await Interest.countDocuments({ status: 'rejected' });
    const underReviewInterests = await Interest.countDocuments({ status: 'under_admin_review' });
    const contactSharedInterests = await Interest.countDocuments({ status: 'contact_shared' });
    const closedInterests = await Interest.countDocuments({ status: 'closed' });
    const totalInterests = await Interest.countDocuments();

    console.log('========================================================');
    console.log('             FINAL TASK VERIFICATION METRICS            ');
    console.log('========================================================');
    console.log('Members (excl. admin):   ', totalUsers);
    console.log('Brides:                  ', totalBrides);
    console.log('Grooms:                  ', totalGrooms);
    console.log('Online Today:            ', onlineToday);
    console.log('Total Interests:         ', totalInterests);
    console.log('Pending Interests:       ', pendingInterests);
    console.log('Accepted Interests:      ', acceptedInterests);
    console.log('Rejected Interests:      ', rejectedInterests);
    console.log('Under Review:            ', underReviewInterests);
    console.log('Contact Shared:          ', contactSharedInterests);
    console.log('Closed Cases:            ', closedInterests);
    console.log('========================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Metrics error:', err);
    process.exit(1);
  }
}

testAllMetrics();
