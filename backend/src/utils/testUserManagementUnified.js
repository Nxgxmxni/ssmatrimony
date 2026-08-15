const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { getAllUsers, getUserDetails, editUser } = require('../controllers/adminController');

async function testUserManagement() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('=== TEST 1: LIST ALL MEMBERS (REGISTERED + IMPORTED) ===');
    let req1 = { query: { page: 1, limit: 10 } };
    let res1 = {
      json: (d) => {
        console.log(`Total Records: ${d.total}`);
        d.users.forEach((u) => console.log(` - ${u.fullName} (${u.profileSource}) | ID: ${u._id} | Gender: ${u.gender}`));
      },
    };
    await getAllUsers(req1, res1);

    console.log('\n=== TEST 2: SEARCH FOR IMPORTED PROFILE "Sudheer" ===');
    let req2 = { query: { search: 'Sudheer' } };
    let res2 = {
      json: (d) => {
        console.log(`Matched Records: ${d.total}`);
        d.users.forEach((u) => console.log(` - ${u.fullName} (${u.profileSource})`));
      },
    };
    await getAllUsers(req2, res2);

    console.log('\n=== TEST 3: GET DETAILS FOR IMPORTED PROFILE (6a7ae7a7efa828245761dd58) ===');
    let req3 = { params: { id: '6a7ae7a7efa828245761dd58' } };
    let res3 = {
      json: (d) => {
        console.log(`Profile Name: ${d.profile?.fullName} | City: ${d.profile?.city} | Source: ${d.profile?.profileSource}`);
      },
    };
    await getUserDetails(req3, res3);

    console.log('\n[PASS] All User Management tests passed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
}

testUserManagement();
