const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');

async function testCycle() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('\n--- TESTING REGISTRATION TO LOGIN PASSWORD MATCH CYCLE ---');

  const testEmail = `cycle.test.${Date.now()}@example.com`;
  const plainPass = 'MySecretPass@123';

  console.log(`1. Creating User with plain password: "${plainPass}"`);

  // Step 1: User.create calls pre('save')
  const user = await User.create({
    fullName: 'Cycle Test User',
    email: testEmail,
    mobile: `+91 ${Math.floor(9000000000 + Math.random() * 900000000)}`,
    password: plainPass,
    role: 'user',
    authProvider: 'local',
  });

  console.log('User created in DB. Stored Hash:', user.password);

  // Immediate match check on created document
  const match1 = await user.matchPassword(plainPass);
  console.log('Immediate matchPassword(plainPass):', match1);

  // Step 2: In authController.js line 165: user.refreshTokens.push(...); await user.save();
  console.log('\n2. Simulating authController line 165: user.refreshTokens.push(...); await user.save();');
  user.refreshTokens.push('sample_refresh_token');
  await user.save();

  console.log('After second save(). Stored Hash:', user.password);
  const match2 = await user.matchPassword(plainPass);
  console.log('After second save() matchPassword(plainPass):', match2);

  // Step 3: Fetching user from MongoDB like loginUser does: User.findOne(...).select('+password')
  console.log('\n3. Simulating loginUser lookup: User.findOne(...).select("+password")');
  const fetchedUser = await User.findOne({ email: testEmail }).select('+password');
  console.log('Fetched User Stored Hash:', fetchedUser.password);
  const match3 = await fetchedUser.matchPassword(plainPass);
  console.log('Login lookup matchPassword(plainPass):', match3);

  // Clean up
  await User.deleteOne({ _id: user._id });
  await mongoose.disconnect();
}

testCycle();
