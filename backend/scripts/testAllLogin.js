import axios from 'axios';

console.log('Testing farmer login endpoint...\n');

// Test 2: Try login with correct credentials
const testCases = [
  { email: 'kamal@gmail.com', password: 'farmer123', desc: 'Correct credentials' },
  { email: 'kamal@gmail.com', password: 'wrong', desc: 'Wrong password' },
  { email: 'wrong@gmail.com', password: 'farmer123', desc: 'Wrong email' },
  { email: '', password: '', desc: 'Empty credentials' },
];

for (const test of testCases) {
  try {
    const res = await axios.post('http://localhost:8080/api/farmers/login', {
      email: test.email,
      password: test.password
    });
    console.log(`\n✅ ${test.desc}`);
    console.log(`   Email: ${test.email}`);
    console.log(`   Password: ${test.password}`);
    console.log(`   Token received: ${res.data.token ? 'YES' : 'NO'}`);
  } catch (err) {
    console.log(`\n❌ ${test.desc}`);
    console.log(`   Email: ${test.email}`);
    console.log(`   Password: ${test.password}`);
    console.log(`   Error: ${err.response?.data?.message || err.message}`);
  }
}

console.log('\n✅ Test complete!');
