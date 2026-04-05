/**
 * paddyType.controller.js
 *
 * Returns distinct paddy variety names from rice_types table.
 * Used by the Selling page to populate the paddy type dropdown.
 * The actual per-mill buying prices come from /api/rice/selling-prices.
 */
import pool from "../config/db.js";

// GET /api/paddy-types  — all distinct active paddy names (for Selling page dropdown)
export async function getAllPaddyTypes(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT type_name
      FROM rice_types
      WHERE status = 'active'
      ORDER BY type_name
    `);
    res.json(rows.map(r => ({ type_name: r.type_name, price_per_kg: 0 })));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// GET /api/paddy-types/active  — same, for farmer dropdown
export async function getActivePaddyTypes(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT type_name
      FROM rice_types
      WHERE status = 'active'
      ORDER BY type_name
    `);
    res.json(rows.map(r => ({ type_name: r.type_name, price_per_kg: 0 })));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// These are unused stubs kept for route compatibility
export async function addPaddyType(req, res) {
  res.status(410).json({ message: "Use /api/rice-types to manage paddy buying prices" });
}
export async function updatePaddyType(req, res) {
  res.status(410).json({ message: "Use /api/rice-types to manage paddy buying prices" });
}
export async function deletePaddyType(req, res) {
  res.status(410).json({ message: "Use /api/rice-types to manage paddy buying prices" });
}
