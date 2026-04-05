import pool from "../config/db.js";

// GET all types for one mill
export async function getTypesByMill(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM rice_types WHERE mill_id=? ORDER BY type_name", [req.params.millId]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// GET all types (admin overview)
export async function getAllTypes(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT rt.*, rm.mill_name FROM rice_types rt
       JOIN rice_mills rm ON rt.mill_id = rm.id
       ORDER BY rm.mill_name, rt.type_name`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// ADD rice type to mill
export async function addRiceType(req, res) {
  const { millId, mill_id, typeName, type_name, pricePerKg, price_per_kg,
          stockKg, stock_kg, description, status } = req.body;
  const mid   = millId   || mill_id   || null;
  const tname = typeName || type_name || "";
  const price = Number(pricePerKg || price_per_kg || 0);
  const stock = Number(stockKg    || stock_kg     || 0);
  if (!mid || !tname || price <= 0)
    return res.status(400).json({ message: "Mill ID, type name and price required" });
  try {
    const [result] = await pool.query(
      "INSERT INTO rice_types (mill_id,type_name,price_per_kg,stock_kg,description,status) VALUES (?,?,?,?,?,?)",
      [mid, tname, price, stock, description||"", status||"active"]
    );
    res.status(201).json({ id: result.insertId, message: "Rice type added" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// UPDATE
export async function updateRiceType(req, res) {
  const { id } = req.params;
  const { typeName, type_name, pricePerKg, price_per_kg, stockKg, stock_kg, description, status } = req.body;
  const tname = typeName || type_name || "";
  const price = Number(pricePerKg || price_per_kg || 0);
  const stock = Number(stockKg    || stock_kg     || 0);
  try {
    await pool.query(
      "UPDATE rice_types SET type_name=?,price_per_kg=?,stock_kg=?,description=?,status=? WHERE id=?",
      [tname, price, stock, description||"", status||"active", id]
    );
    const [rows] = await pool.query("SELECT * FROM rice_types WHERE id=?", [id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// DELETE
export async function deleteRiceType(req, res) {
  try {
    await pool.query("DELETE FROM rice_types WHERE id=?", [req.params.id]);
    res.json({ message: "Rice type deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
