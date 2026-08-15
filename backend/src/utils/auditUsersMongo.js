const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');

async function auditMongo() {
  try {
    console.log('Connecting to MongoDB for collection audit...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('\n=========================================================');
    console.log('         DIRECT MONGODB USERS COLLECTION AUDIT           ');
    console.log('=========================================================');
    console.log(`Database Name:   ${mongoose.connection.name}`);
    console.log(`Collection Name: ${User.collection.name}`);
    
    const count = await User.countDocuments();
    console.log(`Total Documents: ${count}\n`);

    const users = await User.find({}, { email: 1, mobile: 1, role: 1, authProvider: 1, createdAt: 1 });
    
    users.forEach((u, i) => {
      console.log(`[${i + 1}] _id: ${u._id}`);
      console.log(`    email:        "${u.email}"`);
      console.log(`    mobile/phone: "${u.mobile || 'N/A'}"`);
      console.log(`    role:         "${u.role}"`);
      console.log(`    authProvider: "${u.authProvider}"`);
      console.log(`    createdAt:    ${u.createdAt}\n`);
    });

    console.log('=========================================================\n');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Mongo Audit Error:', err);
  }
}

auditMongo();
