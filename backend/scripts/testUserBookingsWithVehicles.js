import axios from 'axios';
import jwt from 'jsonwebtoken';

console.log('Testing user bookings endpoint with vehicle data...\n');

// Create test tokens
const adminToken = jwt.sign(
  { adminId: 1, username: 'admin', role: 'admin' },
  'super_secret_key_farmconnect_2024',
  { expiresIn: '7d' }
);

const farmerToken = jwt.sign(
  { farmerId: 1, username: 'farmer', role: 'farmer' },
  'super_secret_key_farmconnect_2024',
  { expiresIn: '7d' }
);

try {
  console.log('📋 Testing /bookings/user/1 endpoint...');
  const userBookingsRes = await axios.get('http://localhost:8080/api/bookings/user/1', {
    headers: { Authorization: `Bearer ${farmerToken}` }
  });
  
  if (userBookingsRes.data.success) {
    console.log('✅ User bookings endpoint works!');
    console.log(`   Found ${userBookingsRes.data.data.length} bookings\n`);
    
    if (userBookingsRes.data.data.length > 0) {
      const booking = userBookingsRes.data.data[0];
      console.log('   ════════════════════════════════════════');
      console.log('   FIRST USER BOOKING:');
      console.log('   ════════════════════════════════════════');
      console.log(`   Booking ID: ${booking.id}`);
      console.log(`   Farmer ID: ${booking.farmer_id}`);
      console.log(`   Farmer Name: ${booking.farmer_name}`);
      console.log(`   Status: ${booking.status}`);
      console.log('\n   📦 VEHICLE DATA:');
      console.log(`   - Vehicle Number: ${booking.vehicle_number}`);
      console.log(`   - Vehicle Type: ${booking.vehicle_type_full}`);
      console.log(`   - Model: ${booking.model}`);
      console.log(`   - Capacity: ${booking.capacity}`);
      console.log(`   - Owner: ${booking.owner_name}`);
      console.log(`   - Location: ${booking.vehicle_location}`);
      console.log('   ════════════════════════════════════════');
    }
  } else {
    console.log('❌ Unexpected response:', userBookingsRes.data);
  }
} catch (err) {
  console.log('❌ Test failed:');
  console.log('   Status:', err.response?.status);
  console.log('   Message:', err.response?.data?.message || err.message);
}

console.log('\n✅ Test complete!');
