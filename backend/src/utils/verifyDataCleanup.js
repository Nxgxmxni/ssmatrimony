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

async function verify() {
  try {
    const connUri = process.env.MONGODB_URI;
    await mongoose.connect(connUri);

    const users = await User.find({});
    const profiles = await Profile.find({});

    console.log('========================================================');
    console.log('              DATA CLEANUP VERIFICATION                 ');
    console.log('========================================================');
    console.log(`Total Users in DB:    ${users.length}`);
    console.log(`Total Profiles in DB: ${profiles.length}`);

    // Check for fake example emails
    const fakeUsers = users.filter(u => u.email.endsWith('@example.com'));
    console.log(`Fake Users (@example.com): ${fakeUsers.length}`);

    console.log('\n--- USERS LIST ---');
    users.forEach(u => console.log(` - ID: ${u._id} | Email: ${u.email} | Role: ${u.role}`));

    console.log('\n--- PROFILES LIST ---');
    profiles.forEach(p => console.log(` - ID: ${p._id} | Name: ${p.fullName} | Gender: ${p.gender} | Status: ${p.status} | Source: ${p.profileSource}`));

    const adminUsers = users.filter(u => u.role === 'admin').map(u => u._id.toString());
    const validPublicProfiles = profiles.filter(p => {
      if (p.status !== 'Approved') return false;
      if (p.user && adminUsers.includes(p.user.toString())) return false;
      return true;
    });

    console.log(`\nValid Public Profiles for Normal Users: ${validPublicProfiles.length}`);
    validPublicProfiles.forEach(p => console.log(` -> ${p.fullName} (${p.gender})`));

    console.log('========================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Verification Error:', err);
    process.exit(1);
  }
}

verify();
