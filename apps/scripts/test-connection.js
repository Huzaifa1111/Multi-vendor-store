const axios = require('axios');

async function testConnections() {
  console.log('🔍 Testing application connections...\n');
  
  // Test backend
  try {
    console.log('Testing backend (port 3000)...');
    const backendResponse = await axios.get('http://localhost:3000/auth/health', {
      timeout: 5000
    });
    console.log('✅ Backend is running:', backendResponse.data);
  } catch (error) {
    console.log('❌ Backend is NOT running on port 3000');
    console.log('   Please run: cd apps/backend && npm run start:dev');
  }
  
  console.log('\n---\n');
  
  // Test frontend
  try {
    console.log('Testing frontend (port 3001)...');
    const frontendResponse = await axios.get('http://localhost:3001', {
      timeout: 5000
    });
    console.log('✅ Frontend is running');
  } catch (error) {
    console.log('❌ Frontend is NOT running on port 3001');
    console.log('   Please run: cd apps/frontend && npm run dev');
  }
  
  console.log('\n📝 Summary:');
  console.log('- Backend should run on: http://localhost:3000');
  console.log('- Frontend should run on: http://localhost:3001');
  console.log('- Frontend will connect to backend at: http://localhost:3000');
}

testConnections();