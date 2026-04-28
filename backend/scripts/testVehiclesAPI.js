import axios from 'axios';

console.log('Testing vehicles API endpoint...\n');

try {
  const res = await axios.get('http://localhost:8080/api/vehicles');
  
  if (res.data.success) {
    console.log('✅ Vehicles endpoint works!');
    console.log(`   Found ${res.data.data.length} vehicles\n`);
    
    if (res.data.data.length > 0) {
      const vehicle = res.data.data[0];
      console.log('   ════════════════════════════════════════');
      console.log('   FIRST VEHICLE DATA FROM API:');
      console.log('   ════════════════════════════════════════');
      console.log(JSON.stringify(vehicle, null, 2));
      console.log('   ════════════════════════════════════════');
    }
  } else {
    console.log('❌ Unexpected response:', res.data);
  }
} catch (err) {
  console.log('❌ Test failed:');
  console.log('   Status:', err.response?.status);
  console.log('   Message:', err.response?.data?.message || err.message);
  console.log('   Error:', err.message);
}

console.log('\n✅ Test complete!');
