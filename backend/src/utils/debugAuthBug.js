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

async function debugAuth() {
  console.log('=== DEBUGGING USER REGISTRATION & LOGIN FLOW ===\n');

  const testEmail = `normal.user.${Date.now()}@example.com`;
  const testMobile = `+91 ${Math.floor(9000000000 + Math.random() * 900000000)}`;
  const testPassword = 'NormalUser@123';

  console.log(`1. Attempting Registration for: Email=${testEmail}, Mobile=${testMobile}, Password=${testPassword}`);

  const regPayload = JSON.stringify({
    fullName: 'Test Normal Member',
    email: testEmail,
    mobile: testMobile,
    password: testPassword,
    gender: 'bride',
    profileManagedBy: 'Self',
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

  console.log(`Registration Response (Status ${regRes.status}):`, regRes.data);

  if (regRes.status !== 201) {
    console.error('Registration failed! Aborting login test.');
    return;
  }

  console.log(`\n2. Attempting Normal User Login with Email: ${testEmail}`);
  const loginPayloadEmail = JSON.stringify({
    identifier: testEmail,
    password: testPassword,
  });

  const loginResEmail = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginPayloadEmail),
      },
    },
    loginPayloadEmail
  );

  console.log(`Login by Email Response (Status ${loginResEmail.status}):`, loginResEmail.data);

  console.log(`\n3. Attempting Normal User Login with Mobile: ${testMobile}`);
  const loginPayloadMobile = JSON.stringify({
    identifier: testMobile,
    password: testPassword,
  });

  const loginResMobile = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginPayloadMobile),
      },
    },
    loginPayloadMobile
  );

  console.log(`Login by Mobile Response (Status ${loginResMobile.status}):`, loginResMobile.data);
}

debugAuth();
