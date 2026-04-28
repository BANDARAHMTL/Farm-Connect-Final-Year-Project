import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const conn = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'farmconnect'
});

// Check if the farmer exists
const [farmers] = await conn.query('SELECT * FROM farmers WHERE email = ?', ['51@gmail.com']);

if (farmers.length === 0) {
  console.log('❌ Farmer with email "51@gmail.com" NOT FOUND in database');
  console.log('');
  console.log('All farmers in database:');
  const [all] = await conn.query('SELECT id, email, name FROM farmers');
  console.table(all);
} else {
  const farmer = farmers[0];
  console.log('✅ Farmer found!');
  console.log('   ID:', farmer.id);
  console.log('   Name:', farmer.name);
  console.log('   Email:', farmer.email);
  console.log('   Password hash:', farmer.password);
  console.log('   Password hash length:', farmer.password.length);
  console.log('');
  
  // Test if password matches
  try {
    const match = await bcrypt.compare('123456', farmer.password);
    console.log('   Testing password "123456":', match ? '✅ MATCHES' : '❌ DOES NOT MATCH');
  } catch (e) {
    console.log('   Error testing password:', e.message);
  }
}

await conn.end();
