import axios from 'axios';
import jwt from 'jsonwebtoken';

console.log('Testing bookings endpoint with vehicle data...\n');

// Create a test admin token
const testToken = jwt.sign(
  { adminId: 1, username: 'admin', role: 'admin' },
  'super_secret_key_farmconnect_2024',
  { expiresIn: '7d' }
);

try {
  console.log('📋 Testing /bookings endpoint...');
  const bookingsRes = await axios.get('http://localhost:8080/api/bookings', {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  
  if (bookingsRes.data.success) {
    console.log('✅ Bookings endpoint works!');
    console.log(`   Found ${bookingsRes.data.data.length} bookings\n`);
    
    if (bookingsRes.data.data.length > 0) {
      const booking = bookingsRes.data.data[0];
      console.log('   ════════════════════════════════════════');
      console.log('   FIRST BOOKING DETAILS:');
      console.log('   ════════════════════════════════════════');
      console.log(`   Booking ID: ${booking.id}`);
      console.log(`   Farmer Name: ${booking.farmer_name}`);
      console.log(`   Status: ${booking.status}`);
      console.log('\n   📦 VEHICLE DATA:');
      console.log(`   - Vehicle ID: ${booking.vehicle_id}`);
      console.log(`   - Vehicle Number: ${booking.vehicle_number}`);
      console.log(`   - Vehicle Type: ${booking.vehicle_type_full}`);
      console.log(`   - Model: ${booking.model}`);
      console.log(`   - Capacity: ${booking.capacity}`);
      console.log(`   - Owner Name: ${booking.owner_name}`);
      console.log(`   - Owner Mobile: ${booking.owner_mobile}`);
      console.log(`   - Location: ${booking.vehicle_location}`);
      console.log(`   - Price Per Acre: ${booking.vehicle_price_per_acre}`);
      console.log(`   - Image URL: ${booking.vehicle_image_url}`);
      console.log(`   - Rating: ${booking.rating}`);
      console.log('   ════════════════════════════════════════');
    }
  } else {
    console.log('❌ Unexpected response:');
    console.log(bookingsRes.data);
  }
} catch (err) {
  console.log('❌ Test failed:');
  console.log('   Status:', err.response?.status);
  console.log('   Message:', err.response?.data?.message || err.message);
  console.log('   Error:', err.message);
}

console.log('\n✅ Test complete!');
