import mysql  from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const [,, username, password, fullName, email] = process.argv;

if (!username || !password || !fullName || !email) {
  console.error("Usage: node scripts/createAdmin.js <username> <password> <fullName> <email>");
  process.exit(1);
}

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "farmconnect",
});

try {
  const [ex] = await pool.query(
    "SELECT id FROM admins WHERE username=?", [username]
  );
  if (ex.length) {
    console.log("⚠️  Admin already exists:", username);
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO admins (username, password, full_name, email) VALUES (?,?,?,?)",
    [username, hashed, fullName, email]
  );
  console.log("✅ Admin created successfully:", username);
  process.exit(0);
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
