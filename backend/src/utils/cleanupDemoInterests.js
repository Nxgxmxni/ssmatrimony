const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Interest = require('../models/Interest');
const Notification = require('../models/Notification');

async function cleanupInterests() {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connUri);

    // 1. Delete all Interest documents
    const deletedInterests = await Interest.deleteMany({});
    console.log(`Deleted ${deletedInterests.deletedCount} Interest document(s).`);

    // 2. Delete all Notification documents linked to demo interests
    const deletedNotifications = await Notification.deleteMany({});
    console.log(`Deleted ${deletedNotifications.deletedCount} Notification document(s).`);

    // Verify Interest count
    const remainingInterests = await Interest.countDocuments();
    const remainingNotifications = await Notification.countDocuments();

    console.log(`\n=== INTEREST & NOTIFICATION CLEANUP VERIFICATION ===`);
    console.log(`Remaining Interests in DB:     ${remainingInterests}`);
    console.log(`Remaining Notifications in DB: ${remainingNotifications}`);
    console.log(`====================================================\n`);

    process.exit(0);
  } catch (err) {
    console.error('Cleanup Interests Error:', err);
    process.exit(1);
  }
}

cleanupInterests();
