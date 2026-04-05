import pool from "../config/db.js";

const JOIN = `
  SELECT mp.*, rm.mill_name, rm.location AS mill_location, rm.image_url AS mill_image,
    rm.rating AS mill_rating, rm.contact_number,
    rt.type_name AS rice_type_name, rt.description AS rice_description
  FROM rice_marketplace mp
  JOIN rice_mills rm ON mp.mill_id = rm.id
  JOIN rice_types rt ON mp.rice_type_id = rt.id
`;

function norm(row, req) {
  const baseUrl = req
    ? `${req.protocol}://${req.get("host")}`
    : "http://localhost:8080";
  function toAbs(path) {
    if (!path || path.trim() === "") return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:8080${path}`;
  }
  const imgUrl  = toAbs(row.image_url);
  const millImg = toAbs(row.mill_image);
  return {
    id:             row.id,
    millId:         row.mill_id,
    millName:       row.mill_name,
    millLocation:   row.mill_location,
    millImage:      millImg,
    millRating:     row.mill_rating   || 0,
    contactNumber:  row.contact_number|| "",
    riceTypeId:     row.rice_type_id,
    riceTypeName:   row.rice_type_name,
    riceDescription:row.rice_description || "",
    title:          row.title         || row.rice_type_name,
    pricePerKg:     Number(row.price_per_kg),
    availableKg:    Number(row.available_kg),
    minOrderKg:     Number(row.min_order_kg),
    maxOrderKg:     Number(row.max_order_kg),
    description:    row.description   || "",
    imageUrl:       imgUrl,
    image_url:      imgUrl,
    status:         row.status,
    deliveryTime:   row.delivery_time || "1-3 days",
    created_at:     row.created_at,
  };
}

export async function getListings(req, res) {
  try {
    const [rows] = await pool.query(
      `${JOIN} WHERE mp.status='active' AND rm.status='active' ORDER BY rm.mill_name, rt.type_name`
    );
    res.json(rows.map(r => norm(r, req)));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getAllListingsAdmin(req, res) {
  try {
    const [rows] = await pool.query(`${JOIN} ORDER BY rm.mill_name, rt.type_name`);
    res.json(rows.map(r => norm(r, req)));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getListingById(req, res) {
  try {
    const [rows] = await pool.query(`${JOIN} WHERE mp.id=?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Listing not found" });
    res.json(norm(rows[0], req));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function addListing(req, res) {
  const b = req.body;
  const mid   = b.millId      || b.mill_id      || null;
  const rtid  = b.riceTypeId  || b.rice_type_id || null;
  const price = Number(b.pricePerKg  || b.price_per_kg  || 0);
  const avail = Number(b.availableKg || b.available_kg  || 0);
  const imgPath = req.file ? `/uploads/marketplace/${req.file.filename}` : (b.imageUrl || b.image_url || null);
  if (!mid || !rtid || price <= 0)
    return res.status(400).json({ message: "Mill, rice type and price required" });
  try {
    const [result] = await pool.query(
      `INSERT INTO rice_marketplace (mill_id,rice_type_id,title,price_per_kg,available_kg,min_order_kg,max_order_kg,description,image_url,status,delivery_time)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [mid, rtid, b.title||"", price, avail,
       Number(b.minOrderKg||b.min_order_kg||1), Number(b.maxOrderKg||b.max_order_kg||1000),
       b.description||"", imgPath, b.status||"active", b.deliveryTime||b.delivery_time||"1-3 days"]
    );
    res.status(201).json({ id: result.insertId, message: "Listing created" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateListing(req, res) {
  const { id } = req.params;
  const b = req.body;
  const price = Number(b.pricePerKg || b.price_per_kg || 0);
  const avail = Number(b.availableKg || b.available_kg || 0);
  let imgPath = req.file ? `/uploads/marketplace/${req.file.filename}` : (b.imageUrl || b.image_url || null);
  if (!imgPath) {
    const [cur] = await pool.query("SELECT image_url FROM rice_marketplace WHERE id=?", [id]);
    imgPath = cur[0]?.image_url || null;
  }
  try {
    await pool.query(
      `UPDATE rice_marketplace SET title=?,price_per_kg=?,available_kg=?,min_order_kg=?,max_order_kg=?,
       description=?,image_url=?,status=?,delivery_time=? WHERE id=?`,
      [b.title||"", price, avail,
       Number(b.minOrderKg||b.min_order_kg||1), Number(b.maxOrderKg||b.max_order_kg||1000),
       b.description||"", imgPath, b.status||"active", b.deliveryTime||b.delivery_time||"1-3 days", id]
    );
    const [rows] = await pool.query(`${JOIN} WHERE mp.id=?`, [id]);
    res.json(rows.length ? norm(rows[0], req) : { message: "Updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function deleteListing(req, res) {
  try {
    await pool.query("DELETE FROM rice_marketplace WHERE id=?", [req.params.id]);
    res.json({ message: "Listing deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
