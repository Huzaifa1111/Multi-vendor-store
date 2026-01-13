const axios = require('axios');

async function testAdminRole() {
  console.log('🔍 Testing Admin Role Issue...\n');

  try {
    // 1. Test login directly (no DB check needed)
    console.log('1. Testing login...');
    const loginRes = await axios.post('http://localhost:3001/auth/login', {
      email: 'admin@store.com',
      password: 'Admin@123'
    });

    const token = loginRes.data.access_token;
    const user = loginRes.data.user;
    
    console.log('✅ Login successful!');
    console.log(`   Response user role: ${user?.role}`);
    console.log(`   Is admin in response: ${user?.role === 'admin'}`);
    console.log(`   Full response:`, JSON.stringify(user, null, 2));

    // 2. Decode JWT to see payload
    console.log('\n2. Decoding JWT token...');
    const jwtParts = token.split('.');
    const payload = JSON.parse(Buffer.from(jwtParts[1], 'base64').toString());
    console.log('✅ JWT Payload:');
    console.log(`   Role in JWT: ${payload.role}`);
    console.log(`   Email: ${payload.email}`);
    console.log(`   Subject: ${payload.sub}`);
    console.log(`   Full payload:`, JSON.stringify(payload, null, 2));

    // 3. Test /auth/me endpoint
    console.log('\n3. Testing /auth/me endpoint...');
    try {
      const meRes = await axios.get('http://localhost:3001/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /auth/me response:');
      console.log(`   Role from /me: ${meRes.data?.role}`);
      console.log(`   Is admin: ${meRes.data?.role === 'admin'}`);
      console.log(`   Full /me response:`, JSON.stringify(meRes.data, null, 2));
    } catch (meErr) {
      console.log('❌ /auth/me failed:', meErr.response?.data?.message || meErr.message);
    }

    // 4. Test admin endpoint
    console.log('\n4. Testing admin dashboard...');
    try {
      const adminRes = await axios.get('http://localhost:3001/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Admin dashboard accessible!');
      console.log(`   Users count: ${adminRes.data.totals?.users}`);
    } catch (adminErr) {
      console.log('❌ Admin dashboard failed:');
      console.log(`   Status: ${adminErr.response?.status}`);
      console.log(`   Message: ${adminErr.response?.data?.message}`);
      console.log(`   Error: ${adminErr.response?.data?.error}`);
    }

    // 5. Create a simple debug endpoint test
    console.log('\n5. Creating debug request...');
    console.log('\n📋 Copy this curl command to test:');
    console.log(`
curl -X GET http://localhost:3001/admin/dashboard \\
  -H "Authorization: Bearer ${token.substring(0, 50)}..." \\
  -H "Content-Type: application/json"
    `);

    console.log('\n📋 Or test in browser console:');
    console.log(`
fetch('http://localhost:3001/admin/dashboard', {
  headers: {
    'Authorization': 'Bearer ${token}'
  }
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err))
    `);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    }
    
    console.log('\n💡 Possible issues:');
    console.log('1. Backend not running on port 3001');
    console.log('2. Wrong email/password');
    console.log('3. Admin user not created');
    console.log('\n🔧 Quick fix: Create admin via API:');
    console.log(`
curl -X POST http://localhost:3001/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Admin",
    "email": "admin@store.com",
    "password": "Admin@123",
    "role": "admin"
  }'
    `);
  }
}

// Run the test
testAdminRole();