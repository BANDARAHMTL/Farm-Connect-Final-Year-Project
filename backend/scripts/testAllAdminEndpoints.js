import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

async function test() {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('TESTING ALL THREE ADMIN ENDPOINTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    // First, login as admin to get token
    console.log('1️⃣  ADMIN LOGIN...');
    const loginRes = await axios.post(`${API_BASE}/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful! Token:', token.substring(0, 20) + '...');
    
    const headers = { Authorization: `Bearer ${token}` };

    // Test 1: Get farmers (for /admin/users)
    console.log('\n2️⃣  TESTING /admin/farmers ENDPOINT...');
    try {
      const farmersRes = await axios.get(`${API_BASE}/admin/farmers`, { headers });
      console.log(`✅ SUCCESS! Found ${farmersRes.data.data.length} farmers`);
      if (farmersRes.data.data.length > 0) {
        console.log('   Sample farmer:', JSON.stringify(farmersRes.data.data[0], null, 2).substring(0, 200));
      }
    } catch (err) {
      console.error('❌ FAILED:', err.response?.data?.message || err.message);
    }

    // Test 2: Get vehicles (for /admin/vehicles)
    console.log('\n3️⃣  TESTING /vehicles ENDPOINT...');
    try {
      const vehiclesRes = await axios.get(`${API_BASE}/vehicles`);
      console.log(`✅ SUCCESS! Found ${vehiclesRes.data.data.length} vehicles`);
      if (vehiclesRes.data.data.length > 0) {
        console.log('   Sample vehicle:', vehiclesRes.data.data[0].vehicle_number);
      }
    } catch (err) {
      console.error('❌ FAILED:', err.response?.data?.message || err.message);
    }

    // Test 3: Get bookings (for /admin/bookings)
    console.log('\n4️⃣  TESTING /bookings ENDPOINT...');
    try {
      const bookingsRes = await axios.get(`${API_BASE}/bookings`, { headers });
      console.log(`✅ SUCCESS! Found ${bookingsRes.data.data.length} bookings`);
      if (bookingsRes.data.data.length > 0) {
        console.log('   Sample booking farmer:', bookingsRes.data.data[0].farmer_name);
      }
    } catch (err) {
      console.error('❌ FAILED:', err.response?.data?.message || err.message);
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('TESTS COMPLETED - All three pages should now work!');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('Test error:', error.message);
  }
  
  process.exit(0);
}

test();
