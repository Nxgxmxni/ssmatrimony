const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');

async function testDirectLogin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('\n--- DIRECT MODEL LOOKUP FOR asd@gmail.com ---');

  const user = await User.findOne({ email: 'asd@gmail.com' }).select('+password');
  console.log('User Found:', !!user);
  if (user) {
    console.log('User _id:', user._id);
    console.log('User Email:', user.email);
    console.log('Stored Password Hash:', user.password);

    // Test password match against common passwords
    const match1 = await user.matchPassword('password123');
    const match2 = await user.matchPassword('Password@123');
    const match3 = await user.matchPassword('asd12345');
    console.log('matchPassword("password123"):', match1);
    console.log('matchPassword("Password@123"):', match2);
    console.log('matchPassword("asd12345"):', match3);
  }

  await mongoose.disconnect();
}

testDirectLogin();
