import pool from "../config/db.js";

// Detect actual columns in selling_requests table once
let _sellingCols = null;
async function getSellingCols() {
  if (_sellingCols) return _sellingCols;
  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'selling_requests'`
  );
  _sellingCols = cols.map(c => c.COLUMN_NAME);
  console.log("[selling] columns:", _sellingCols.join(", "));
  return _sellingCols;
}

export async function getAllSellings(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, f.name AS farmerName, rm.mill_name AS millName
       FROM selling_requests s
       LEFT JOIN farmers    f  ON s.farmer_id = f.id
       LEFT JOIN rice_mills rm ON s.mill_id   = rm.id
       ORDER BY s.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    // fallback without joins if columns missing
    try {
      const [rows2] = await pool.query("SELECT * FROM selling_requests ORDER BY id DESC");
      res.json(rows2);
    } catch (err2) {
      res.status(500).json({ message: err2.message });
    }
  }
}

export async function getSellingById(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM selling_requests WHERE id=?", [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addSelling(req, res) {
  const {
    farmerId, farmer_id,
    millId,   mill_id,
    riceType, rice_type,
    stockKg,  stock_kg,
    pricePerKg, price_per_kg,
  } = req.body;

  const fid   = req.farmerId || req.userId || farmerId || farmer_id || null;
  const type  = riceType  || rice_type  || "";
  const stock = Number(stockKg    || stock_kg    || 0);
  const price = Number(pricePerKg || price_per_kg || 0);
  const total = Math.round(stock * price);

  if (!type || stock <= 0)
    return res.status(400).json({ message: "Rice type and stock quantity are required" });

  try {
    const cols = await getSellingCols();

    // Validate mill_id — only include if the mill actually exists
    // If mill_id is invalid/not in rice_mills, set it to NULL to avoid FK error
    let validMillId = null;
    const rawMillId = millId || mill_id || null;

    if (rawMillId && cols.includes("mill_id")) {
      const [millCheck] = await pool.query(
        "SELECT id FROM rice_mills WHERE id = ?", [rawMillId]
      );
      validMillId = millCheck.length > 0 ? rawMillId : null;
    }

    // Build INSERT dynamically
    const fields = [];
    const values = [];

    if (cols.includes("farmer_id")) { fields.push("farmer_id"); values.push(fid); }
    if (cols.includes("mill_id"))   { fields.push("mill_id");   values.push(validMillId); }

    fields.push("rice_type");    values.push(type);
    fields.push("stock_kg");     values.push(stock);
    fields.push("price_per_kg"); values.push(price);
    fields.push("total_price");  values.push(total);

    if (cols.includes("status")) { fields.push("status"); values.push("PENDING"); }

    const sql = `INSERT INTO selling_requests (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`;
    const [result] = await pool.query(sql, values);

    res.status(201).json({
      id: result.insertId,
      message: "Selling request submitted successfully",
      total_price: total,
    });
  } catch (err) {
    console.error("addSelling error:", err);
    res.status(500).json({ message: err.message });
  }
}

export async function updateSelling(req, res) {
  const { riceType, rice_type, stockKg, stock_kg,
          pricePerKg, price_per_kg, status } = req.body;
  const type  = riceType  || rice_type  || "";
  const stock = Number(stockKg    || stock_kg    || 0);
  const price = Number(pricePerKg || price_per_kg || 0);
  const total = Math.round(stock * price);
  try {
    await pool.query(
      `UPDATE selling_requests
       SET rice_type=?, stock_kg=?, price_per_kg=?, total_price=?, status=?
       WHERE id=?`,
      [type, stock, price, total, status || "PENDING", req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM selling_requests WHERE id=?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteSelling(req, res) {
  try {
    await pool.query("DELETE FROM selling_requests WHERE id=?", [req.params.id]);
    res.json({ message: "Selling request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
