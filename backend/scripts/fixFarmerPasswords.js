// Run: node scripts/fixFarmerPasswords.js
// This resets all sample farmer passwords to "farmer123"

import pool   from "../config/db.js";
import bcrypt from "bcrypt";

const farmers = [
  { email: "kamal@gmail.com",  password: "farmer123" },
  { email: "nimal@gmail.com",  password: "farmer123" },
  { email: "sunil@gmail.com",  password: "farmer123" },
  { email: "ajith@gmail.com",  password: "farmer123" },
  { email: "priya@gmail.com",  password: "farmer123" },
  { email: "saman@gmail.com",  password: "farmer123" },
];

console.log("Fixing farmer passwords...");
for (const f of farmers) {
  const hash = await bcrypt.hash(f.password, 10);
  const [r] = await pool.query(
    "UPDATE farmers SET password=? WHERE email=?", [hash, f.email]
  );
  if (r.affectedRows) {
    console.log(`✅ ${f.email} → password set to "farmer123"`);
  } else {
    console.log(`⚠️  ${f.email} not found`);
  }
}
console.log("\nDone! Login with: email=kamal@gmail.com  password=farmer123");
process.exit(0);
