import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'farmconnect'
});

const [farmers] = await conn.query('SELECT id, name, email FROM farmers');
console.log('Farmers in database:', farmers);
const [admins] = await conn.query('SELECT id, username FROM admins');
console.log('Admins in database:', admins);

await conn.end();
