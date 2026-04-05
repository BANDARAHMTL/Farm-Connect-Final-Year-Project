import pool from "../config/db.js";

function normalizeMill(m, req) {
  const baseUrl = req ? `${req.protocol}://${req.get("host")}` : "http://localhost:8080";
  const imgUrl  = m.image_url
    ? (m.image_url.startsWith("http") ? m.image_url : `${baseUrl}${m.image_url}`)
    : null;
  return {
    id:            m.id,
    millName:      m.mill_name,
    location:      m.location,
    address:       m.address        || "",
    contactNumber: m.contact_number || "",
    email:         m.email          || "",
    description:   m.description    || "",
    imageUrl:      imgUrl,
    image_url:     imgUrl,
    rating:        m.rating         || 0,
    status:        m.status         || "active",
    created_at:    m.created_at,
  };
}

export async function getAllRiceMills(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM rice_mills WHERE status='active' ORDER BY mill_name ASC");
    res.json(rows.map(m => normalizeMill(m, req)));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getAllRiceMillsAdmin(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM rice_mills ORDER BY mill_name ASC");
    const [typeCounts] = await pool.query(
      "SELECT mill_id, COUNT(*) as type_count FROM rice_types GROUP BY mill_id"
    );
    const tcMap = {};
    typeCounts.forEach(t => { tcMap[t.mill_id] = t.type_count; });
    res.json(rows.map(m => ({ ...normalizeMill(m, req), typeCount: tcMap[m.id] || 0 })));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getRiceMillById(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM rice_mills WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Rice mill not found" });
    const [types] = await pool.query(
      "SELECT * FROM rice_types WHERE mill_id=? ORDER BY type_name", [req.params.id]
    );
    res.json({ ...normalizeMill(rows[0], req), riceTypes: types });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function addRiceMill(req, res) {
  const { millName, mill_name, location, address, contactNumber, contact_number,
          email, description, imageUrl, image_url, rating } = req.body;
  const name    = millName || mill_name || "";
  const contact = contactNumber || contact_number || "";
  const imgPath = req.file ? `/uploads/ricemills/${req.file.filename}` : (imageUrl || image_url || null);
  if (!name || !location) return res.status(400).json({ message: "Mill name and location required" });
  try {
    const [result] = await pool.query(
      `INSERT INTO rice_mills (mill_name,location,address,contact_number,email,description,image_url,rating)
       VALUES (?,?,?,?,?,?,?,?)`,
      [name,location,address||"",contact,email||"",description||"",imgPath,rating||0]
    );
    res.status(201).json({ id: result.insertId, message: "Rice mill added" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateRiceMill(req, res) {
  const { id } = req.params;
  const { millName, mill_name, location, address, contactNumber, contact_number,
          email, description, imageUrl, image_url, rating, status } = req.body;
  const name    = millName || mill_name || "";
  const contact = contactNumber || contact_number || "";
  let imgPath = req.file ? `/uploads/ricemills/${req.file.filename}` : (imageUrl || image_url || null);
  if (!imgPath) {
    const [cur] = await pool.query("SELECT image_url FROM rice_mills WHERE id=?", [id]);
    imgPath = cur[0]?.image_url || null;
  }
  try {
    await pool.query(
      `UPDATE rice_mills SET mill_name=?,location=?,address=?,contact_number=?,
       email=?,description=?,image_url=?,rating=?,status=? WHERE id=?`,
      [name,location,address||"",contact,email||"",description||"",imgPath,rating||0,status||"active",id]
    );
    const [rows] = await pool.query("SELECT * FROM rice_mills WHERE id=?", [id]);
    res.json(normalizeMill(rows[0], req));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function deleteRiceMill(req, res) {
  try {
    await pool.query("DELETE FROM rice_mills WHERE id=?", [req.params.id]);
    res.json({ message: "Rice mill deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
