import fs from 'fs';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function loadDatabase() {
  try {
    // Read the SQL file
    const sqlFile = './COMPLETE_FIXED_DATABASE.sql';
    let sql = fs.readFileSync(sqlFile, 'utf8');

    // Create connection to MySQL (without database first)
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('🔄 Executing database setup...');
    
    // Disable foreign key checks to allow loading sample data
    await conn.query('SET FOREIGN_KEY_CHECKS=0;');
    
    await conn.query(sql);
    
    // Re-enable foreign key checks
    await conn.query('SET FOREIGN_KEY_CHECKS=1;');
    
    // Add sample farmers with hashed passwords
    console.log('🔄 Adding sample farmers...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const farmerHash = await bcrypt.hash('farmer123', 10);
    
    // Insert admin if not exists
    await conn.query(
      `INSERT IGNORE INTO admins (username, password, full_name, email, role) 
       VALUES ('admin', ?, 'System Administrator', 'admin@farmconnect.lk', 'admin')`,
      [adminHash]
    );
    
    // Insert sample farmers
    const farmers = [
      ['Kamal Perera',      'kamal@gmail.com',   '0712345678', 'K-001', farmerHash],
      ['Nimal Silva',       'nimal@gmail.com',   '0723456789', 'N-002', farmerHash],
      ['Sunil Fernando',    'sunil@gmail.com',   '0734567890', 'S-003', farmerHash],
      ['Ajith Bandara',     'ajith@gmail.com',   '0745678901', 'A-004', farmerHash],
      ['Priya Jayasinghe',  'priya@gmail.com',   '0756789012', 'P-005', farmerHash],
      ['Saman Kumara',      'saman@gmail.com',   '0767890123', 'S-006', farmerHash],
    ];
    
    for (const [name, email, mobile, farmerId, hash] of farmers) {
      await conn.query(
        `INSERT IGNORE INTO farmers (name, email, mobile, farmer_id, password, address, land_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, mobile, farmerId, hash, 'Sample Address, Sri Lanka', '2.5']
      );
    }
    
    await conn.end();

    console.log('✅ Database loaded successfully!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   Farmers: email=kamal@gmail.com, password=farmer123');
    console.log('            (uses for all farmers: nimal, sunil, ajith, priya, saman)');
    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error loading database:', error.message);
    process.exit(1);
  }
}

loadDatabase();
