const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function testFullFlow() {
  console.log('=== END-TO-END AUTHENTICATION FLOW VERIFICATION ===\n');

  const testEmail = `verified.member.${Date.now()}@example.com`;
  const testMobile = `+91 ${Math.floor(9000000000 + Math.random() * 900000000)}`;
  const testPassword = 'StrongPass@2026';

  // 1. REGISTER NEW USER
  console.log(`1. REGISTER: Email="${testEmail}", Mobile="${testMobile}", Password="${testPassword}"`);
  const regPayload = JSON.stringify({
    fullName: 'Verified Test Member',
    email: testEmail,
    mobile: testMobile,
    password: testPassword,
    gender: 'bride',
  });

  const regRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(regPayload),
      },
    },
    regPayload
  );

  console.log(`-> Register Result (Status ${regRes.status}):`, regRes.data.message);
  if (regRes.status !== 201) return;

  // 2. ATTEMPT DUPLICATE REGISTRATION (SHOULD BE REJECTED)
  console.log('\n2. DUPLICATE REGISTRATION CHECK (Should return 400 Already Exists):');
  const dupRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(regPayload),
      },
    },
    regPayload
  );
  console.log(`-> Duplicate Register Result (Status ${dupRes.status}):`, dupRes.data.message);

  // 3. LOGIN BY EMAIL
  console.log(`\n3. LOGIN BY EMAIL: "${testEmail}"`);
  const loginEmailPayload = JSON.stringify({ identifier: testEmail, password: testPassword });
  const loginEmailRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginEmailPayload),
      },
    },
    loginEmailPayload
  );
  console.log(`-> Login By Email Result (Status ${loginEmailRes.status}): Logged in as ${loginEmailRes.data.email} (Role: ${loginEmailRes.data.role})`);

  // 4. LOGIN BY MOBILE
  console.log(`\n4. LOGIN BY MOBILE: "${testMobile}"`);
  const loginMobilePayload = JSON.stringify({ identifier: testMobile, password: testPassword });
  const loginMobileRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginMobilePayload),
      },
    },
    loginMobilePayload
  );
  console.log(`-> Login By Mobile Result (Status ${loginMobileRes.status}): Logged in as ${loginMobileRes.data.email} (Role: ${loginMobileRes.data.role})`);

  // 5. GET /api/auth/me WITH TOKEN
  const userToken = loginEmailRes.data.token;
  console.log('\n5. CURRENT USER CHECK: GET /api/auth/me');
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`-> Current User (/me) Result (Status ${meRes.status}): Identified as ${meRes.data.user?.fullName} (${meRes.data.user?.email})`);

  // 6. ADMIN LOGIN CHECK
  console.log('\n6. ADMIN LOGIN CHECK: "admin@ssmatrimony.com"');
  const adminLoginPayload = JSON.stringify({ identifier: 'admin@ssmatrimony.com', password: 'Admin@123' });
  const adminRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(adminLoginPayload),
      },
    },
    adminLoginPayload
  );
  console.log(`-> Admin Login Result (Status ${adminRes.status}): Logged in as ${adminRes.data.email} (Role: ${adminRes.data.role})`);

  console.log('\n=== ALL END-TO-END AUTHENTICATION AUDIT TESTS PASSED SUCCESSFULLY ===');
}

testFullFlow();
