import pool   from "../config/db.js";
import bcrypt from "bcrypt";
import jwt    from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

function generateFarmerId() {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FRM-${year}-${rand}`;
}

// ── REGISTER ────────────────────────────────────────────
export async function registerFarmer(req, res) {
  const { name, email, mobile, password, nic, address, land_number } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, and password are required" });

  try {
    // Check duplicate email
    const [existing] = await pool.query(
      "SELECT id FROM farmers WHERE email = ?", [email]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    // Hash
    const hashed = await bcrypt.hash(password, 10);

    // Unique farmer_id
    let farmer_id = null;
    for (let i = 0; i < 10; i++) {
      const candidate = generateFarmerId();
      const [dup] = await pool.query(
        "SELECT id FROM farmers WHERE farmer_id = ?", [candidate]
      );
      if (!dup.length) { farmer_id = candidate; break; }
    }

    const [result] = await pool.query(
      `INSERT INTO farmers (farmer_id, name, email, mobile, password, nic, address, land_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [farmer_id, name, email, mobile || null, hashed,
       nic || null, address || null, land_number || null]
    );

    return res.status(201).json({
      id: result.insertId,
      farmer_id,
      message: "Farmer registered successfully",
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

// ── LOGIN ───────────────────────────────────────────────
export async function farmerLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM farmers WHERE email = ?", [email]
    );
    const farmer = rows[0];
    if (!farmer)
      return res.status(401).json({ message: "Invalid email or password" });

    // column name is "password" in schema
    const storedHash = farmer.password;
    if (!storedHash)
      return res.status(500).json({ message: "Account password not found" });

    const valid = await bcrypt.compare(password, storedHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { farmerId: farmer.id, email: farmer.email, role: "farmer" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      farmer: {
        id:          farmer.id,
        farmer_id:   farmer.farmer_id,
        name:        farmer.name,
        email:       farmer.email,
        mobile:      farmer.mobile,
        nic:         farmer.nic,
        address:     farmer.address,
        land_number: farmer.land_number,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
}

// ── GET MY PROFILE ──────────────────────────────────────
export async function getFarmerProfile(req, res) {
  const farmerId = req.farmerId;
  if (!farmerId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [rows] = await pool.query(
      `SELECT id, farmer_id, name, email, mobile, nic, address, land_number, created_at
       FROM farmers WHERE id = ?`, [farmerId]
    );
    if (!rows.length) return res.status(404).json({ message: "Farmer not found" });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// ── GET BY ID ───────────────────────────────────────────
export async function getFarmerById(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, farmer_id, name, email, mobile, nic, address, land_number
       FROM farmers WHERE id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Farmer not found" });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
