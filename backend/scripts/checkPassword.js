import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const conn = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'farmconnect'
});

const [farmers] = await conn.query('SELECT id, email, password FROM farmers LIMIT 1');
const farmer = farmers[0];

console.log('First farmer:', farmer.email);
console.log('Password hash:', farmer.password);
console.log('Hash length:', farmer.password.length);

// Test bcrypt comparison
const testPassword = 'farmer123';
const match = await bcrypt.compare(testPassword, farmer.password);
console.log('Password "farmer123" matches:', match);

await conn.end();
