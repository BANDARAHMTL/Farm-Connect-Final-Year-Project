import axios from 'axios';

console.log('Testing admin endpoints...\n');

try {
  console.log('🚜 Testing /vehicles endpoint...');
  const vehiclesRes = await axios.get('http://localhost:8080/api/vehicles');
  console.log('✅ Vehicles endpoint works!');
  console.log(`   Found ${vehiclesRes.data.data.length} vehicles`);
  console.log('');
} catch (err) {
  console.log('❌ Vehicles endpoint failed:', err.response?.data?.message || err.message);
  console.log('');
}

try {
  console.log('📋 Testing /bookings endpoint...');
  const bookingsRes = await axios.get('http://localhost:8080/api/bookings');
  console.log('✅ Bookings endpoint works!');
  console.log(`   Found ${bookingsRes.data.data.length} bookings`);
  console.log('');
} catch (err) {
  console.log('❌ Bookings endpoint failed:', err.response?.data?.message || err.message);
  console.log('');
}

console.log('✅ Test complete!');
