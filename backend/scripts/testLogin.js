import axios from 'axios';

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/farmers/login', {
      email: 'kamal@gmail.com',
      password: 'farmer123'
    });
    console.log('✅ Login successful!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
};

testLogin();
