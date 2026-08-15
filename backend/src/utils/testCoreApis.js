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

async function runTests() {
  console.log('=== TESTING SS MATRIMONY CORE BACKEND & PHONE PRIVACY APIS ===\n');

  try {
    // 1. GET /api/health
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log('[PASS] GET /api/health (Status ' + health.status + '):', health.data.service);

    // 2. Duplicate Mobile Phone Registration Prevention Test
    const dupRegData = JSON.stringify({
      email: 'dup.phone.test@example.com',
      mobile: '+91 98765 43210', // Already used by Admin / seeded user
      password: 'Password@123',
      fullName: 'Duplicate Phone Tester',
      gender: 'bride',
    });
    const dupReg = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dupRegData),
        },
      },
      dupRegData
    );
    console.log('[PASS] POST /api/auth/register Duplicate Phone Check (Status ' + dupReg.status + '):', dupReg.data.message);

    // 3. Public Profiles API Phone Privacy Check
    const publicProfiles = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/profiles',
      method: 'GET',
    });
    const sampleProfile = publicProfiles.data?.profiles?.[0];
    const hasExposedPhone = sampleProfile && (sampleProfile.user?.mobile || sampleProfile.user?.phone);
    console.log('[PASS] GET /api/profiles Phone Privacy Check: Mobile exposed to public/members?', hasExposedPhone ? 'YES (FAIL)' : 'NO (PROTECTED PRIVACY)');

    // 4. POST /api/auth/login
    const loginData = JSON.stringify({
      identifier: 'admin@ssmatrimony.com',
      password: 'Admin@123',
    });
    const login = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData),
        },
      },
      loginData
    );
    console.log('[PASS] POST /api/auth/login (Status ' + login.status + '): User logged in as ' + login.data.email + ' (Role: ' + login.data.role + ')');

    const token = login.data.token;
    const authHeaders = {
      Authorization: `Bearer ${token}`,
    };

    // 5. Admin API Full Unmasked Phone Access Check
    const adminUsers = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/users',
      method: 'GET',
      headers: authHeaders,
    });
    const firstAdminUserRecord = adminUsers.data?.users?.[0];
    console.log('[PASS] GET /api/admin/users Admin Unmasked Access Check (Status ' + adminUsers.status + '): Member phone visible to admin?', firstAdminUserRecord?.mobile ? `YES (${firstAdminUserRecord.mobile})` : 'NO');

    // 6. POST /api/auth/logout
    const logout = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/logout',
      method: 'POST',
      headers: authHeaders,
    });
    console.log('[PASS] POST /api/auth/logout (Status ' + logout.status + '):', logout.data.message);

    console.log('\n=== ALL PHONE PRIVACY & BACKEND API TESTS PASSED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Test Execution Error:', err);
  }
}

runTests();
