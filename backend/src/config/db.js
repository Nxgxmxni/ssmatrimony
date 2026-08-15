const mongoose = require('mongoose');
const dns = require('dns');

// Configure DNS fallback for reliable mongodb+srv SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS servers are restricted
}

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;

    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Extract host name for logging without exposing credentials
    let hostInfo = 'Unknown Host';
    try {
      if (connUri.includes('@')) {
        hostInfo = connUri.split('@')[1].split('/')[0];
      } else {
        const parsed = new URL(connUri);
        hostInfo = parsed.host || parsed.pathname;
      }
    } catch (e) {
      hostInfo = connUri.replace(/^mongodb(\+srv)?:\/\/[^@]+@/, '');
    }

    console.log(`Connecting to MongoDB... Host: ${hostInfo}`);

    const conn = await mongoose.connect(connUri);
    const User = require('../models/User');

    console.log('\n=========================================================');
    console.log('         SS MATRIMONY DATABASE AUTHENTICATION AUDIT       ');
    console.log('=========================================================');
    console.log(`Mongo Host:      ${conn.connection.host}`);
    console.log(`Database Name:   ${conn.connection.name}`);
    console.log(`Collection Name: ${User.collection.name}`);
    console.log('---------------------------------------------------------');

    const totalUsers = await User.countDocuments();
    console.log(`Total Registered Users in MongoDB: ${totalUsers}`);
    
    const allUsers = await User.find().select('email mobile role authProvider accountStatus').limit(25);
    if (allUsers.length > 0) {
      console.log('\nExisting User Accounts in Database:');
      allUsers.forEach((u, i) => {
        console.log(`  [${i + 1}] ID: ${u._id} | Email: "${u.email}" | Phone: "${u.mobile || 'N/A'}" | Role: "${u.role}" | Provider: "${u.authProvider || 'local'}"`);
      });
    } else {
      console.log('  No user accounts found in database. Seed required.');
    }
    console.log('=========================================================\n');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Tip: Make sure MONGODB_URI is properly formatted and valid.');
    process.exit(1);
  }
};

module.exports = connectDB;
