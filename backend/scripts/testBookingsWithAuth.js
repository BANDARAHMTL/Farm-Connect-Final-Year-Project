import axios from 'axios';
import jwt from 'jsonwebtoken';

console.log('Testing bookings endpoint with admin token...\n');

// Create a test admin token
const testToken = jwt.sign(
  { adminId: 1, username: 'admin', role: 'admin' },
  'super_secret_key_farmconnect_2024',
  { expiresIn: '7d' }
);

try {
  console.log('📋 Testing /bookings endpoint with admin token...');
  const bookingsRes = await axios.get('http://localhost:8080/api/bookings', {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  console.log('✅ Bookings endpoint works!');
  console.log(`   Found ${bookingsRes.data.data.length} bookings`);
  if (bookingsRes.data.data.length > 0) {
    console.log('\n   Sample booking:');
    console.log(`   - ID: ${bookingsRes.data.data[0].id}`);
    console.log(`   - Farmer: ${bookingsRes.data.data[0].farmer_name}`);
    console.log(`   - Status: ${bookingsRes.data.data[0].status}`);
  }
  console.log('');
} catch (err) {
  console.log('❌ Bookings endpoint failed:');
  console.log('   Status:', err.response?.status);
  console.log('   Message:', err.response?.data?.message || err.message);
  console.log('');
}

console.log('✅ Test complete!');
