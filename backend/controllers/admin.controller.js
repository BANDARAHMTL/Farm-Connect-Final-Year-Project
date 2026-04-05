import pool   from "../config/db.js";
import bcrypt from "bcrypt";
import jwt    from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ── REGISTER ────────────────────────────────────────────
export async function registerAdmin(req, res) {
  const { username, password, full_name, email } = req.body;
  if (!username || !password || !full_name || !email)
    return res.status(400).json({ message: "All fields required" });
  try {
    const [ex] = await pool.query(
      "SELECT id FROM admins WHERE username=? OR email=?", [username, email]
    );
    if (ex.length) return res.status(409).json({ message: "Username or email already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO admins (username, password, full_name, email) VALUES (?,?,?,?)",
      [username, hashed, full_name, email]
    );
    res.status(201).json({ id: result.insertId, message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
}

// ── LOGIN ───────────────────────────────────────────────
export async function adminLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  try {
    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE username=?", [username]
    );
    const admin = rows[0];
    if (!admin) return res.status(401).json({ message: "Invalid username or password" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({
      token,
      admin: {
        id: admin.id, username: admin.username,
        full_name: admin.full_name, email: admin.email,
        role: admin.role, status: admin.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

// ── LIST FARMERS ────────────────────────────────────────
export async function listFarmers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, farmer_id, name, email, mobile, nic, address, land_number, created_at FROM farmers ORDER BY created_at DESC"
    );
    res.json(rows.map(f => ({
      id: f.id, farmer_id: f.farmer_id,
      fullName: f.name, email: f.email,
      phone: f.mobile, nic: f.nic,
      address: f.address, land_number: f.land_number,
      role: "farmer", status: "active", created_at: f.created_at,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ── UPDATE FARMER ───────────────────────────────────────
export async function updateFarmer(req, res) {
  const { fullName, name, phone, mobile, nic, address } = req.body;
  try {
    await pool.query(
      "UPDATE farmers SET name=?, mobile=?, nic=?, address=? WHERE id=?",
      [fullName || name, phone || mobile, nic || null, address || null, req.params.id]
    );
    res.json({ message: "Farmer updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ── DELETE FARMER ───────────────────────────────────────
export async function deleteFarmer(req, res) {
  try {
    await pool.query("DELETE FROM farmers WHERE id=?", [req.params.id]);
    res.json({ message: "Farmer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
