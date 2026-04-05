// Run AFTER schema.sql and sample_data.sql (vehicles/mills/orders only)
// node scripts/createFarmers.js
import pool   from "../config/db.js";
import bcrypt from "bcrypt";

const farmers = [
  { farmer_id:"FRM-2025-AA1001", name:"Kamal Perera",     email:"kamal@gmail.com", mobile:"0771234567", nic:"199012345678", address:"No.5, Kandy Road, Kurunegala",    land_number:"LND-2025-001" },
  { farmer_id:"FRM-2025-BB2002", name:"Nimal Silva",      email:"nimal@gmail.com", mobile:"0712345679", nic:"198534567891", address:"No.12, Galle Road, Matara",       land_number:"LND-2025-002" },
  { farmer_id:"FRM-2025-CC3003", name:"Sunil Fernando",   email:"sunil@gmail.com", mobile:"0751122335", nic:"200112398766", address:"No.8, Temple Road, Polonnaruwa",  land_number:"LND-2025-003" },
  { farmer_id:"FRM-2025-DD4004", name:"Ajith Bandara",    email:"ajith@gmail.com", mobile:"0763344557", nic:"197823456713", address:"No.3, Lake View, Anuradhapura",   land_number:"LND-2025-004" },
  { farmer_id:"FRM-2025-EE5005", name:"Priya Jayasinghe", email:"priya@gmail.com", mobile:"0777665544", nic:"199567890124", address:"No.22, Main Street, Ampara",      land_number:"LND-2025-005" },
  { farmer_id:"FRM-2025-FF6006", name:"Saman Kumara",     email:"saman@gmail.com", mobile:"0715566778", nic:"198901234568", address:"No.7, Paddy Lane, Kandy",         land_number:"LND-2025-006" },
];

const PASSWORD = "farmer123";
console.log(`Creating ${farmers.length} farmers with password: "${PASSWORD}"`);

for (const f of farmers) {
  const hash = await bcrypt.hash(PASSWORD, 10);
  try {
    await pool.query(
      `INSERT INTO farmers (farmer_id,name,email,mobile,password,nic,address,land_number)
       VALUES (?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE password=VALUES(password)`,
      [f.farmer_id, f.name, f.email, f.mobile, hash, f.nic, f.address, f.land_number]
    );
    console.log(`✅ ${f.name} (${f.email})`);
  } catch(err) {
    console.error(`❌ ${f.email}: ${err.message}`);
  }
}

console.log(`\n✅ All farmers ready!`);
console.log(`Login at: http://localhost:3000`);
console.log(`Email: kamal@gmail.com   Password: farmer123`);
process.exit(0);
