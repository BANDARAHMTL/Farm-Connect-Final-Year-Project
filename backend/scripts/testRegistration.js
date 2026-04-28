import axios from 'axios';

console.log('Testing new farmer registration and login...\n');

const newFarmer = {
  name: 'Test User 51',
  email: '51@gmail.com',
  password: '123456'
};

try {
  console.log('📝 Registering new farmer...');
  const registerRes = await axios.post('http://localhost:8080/api/farmers/register', newFarmer);
  console.log('✅ Registration successful!');
  console.log('   Farmer ID:', registerRes.data.data.id);
  console.log('   Name:', registerRes.data.data.name);
  console.log('   Email:', registerRes.data.data.email);
  console.log('');
} catch (err) {
  if (err.response?.status === 409) {
    console.log('⚠️  Farmer already exists, proceeding to login test...');
  } else {
    console.log('❌ Registration failed:', err.response?.data?.message || err.message);
    process.exit(1);
  }
  console.log('');
}

try {
  console.log('🔑 Logging in with new credentials...');
  const loginRes = await axios.post('http://localhost:8080/api/farmers/login', {
    email: newFarmer.email,
    password: newFarmer.password
  });
  console.log('✅ Login successful!');
  console.log('   Token:', loginRes.data.token.substring(0, 50) + '...');
  console.log('   Farmer ID:', loginRes.data.farmer.id);
  console.log('   Name:', loginRes.data.farmer.name);
  console.log('   Email:', loginRes.data.farmer.email);
  console.log('');
} catch (err) {
  console.log('❌ Login failed:', err.response?.data?.message || err.message);
  process.exit(1);
}

console.log('✅ All tests passed!');
