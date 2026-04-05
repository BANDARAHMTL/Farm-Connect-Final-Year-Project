import pool from "../config/db.js";

function normV(v, req) {
  const baseUrl = req ? `${req.protocol}://${req.get("host")}` : "http://localhost:8080";
  const imgUrl  = v.image_url
    ? (v.image_url.startsWith("http") ? v.image_url : `${baseUrl}${v.image_url}`)
    : null;
  return {
    id:           v.id,
    vehicleNumber:v.vehicle_number,
    vehicleType:  v.vehicle_type,
    model:        v.model        || "",
    capacity:     v.capacity     || 0,
    status:       v.status       || "Available",
    ownerName:    v.owner_name   || "",
    ownerMobile:  v.owner_mobile || "",
    regNumber:    v.reg_number   || "",
    rating:       v.rating       || 0,
    reviews:      v.reviews      || 0,
    location:     v.location     || "",
    pricePerAcre: Number(v.price_per_acre) || 0,
    imageUrl:     imgUrl,
    type:         v.vehicle_type,
    title:        v.model || v.vehicle_type,
    owner_name:   v.owner_name,
    owner_mobile: v.owner_mobile,
    reg_number:   v.reg_number,
    price_per_acre: Number(v.price_per_acre) || 0,
    image_url:    imgUrl,
    image:        imgUrl || "",
    created_at:   v.created_at,
  };
}

export async function listVehicles(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM vehicles ORDER BY id DESC");
    res.json(rows.map(v => normV(v, req)));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getVehicle(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Vehicle not found" });
    res.json(normV(rows[0], req));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function addVehicle(req, res) {
  const { vehicleNumber, vehicle_number, vehicleType, vehicle_type, model, capacity, status,
    ownerName, owner_name, ownerMobile, owner_mobile, regNumber, reg_number,
    rating, reviews, location, pricePerAcre, price_per_acre, imageUrl, image_url } = req.body;
  const vnum  = vehicleNumber || vehicle_number || "";
  const vtype = vehicleType   || vehicle_type   || "Tractor";
  const price = Number(pricePerAcre || price_per_acre || 0);
  const imgPath = req.file ? `/uploads/vehicles/${req.file.filename}` : (imageUrl || image_url || null);
  if (!vnum) return res.status(400).json({ message: "Vehicle number required" });
  try {
    const [result] = await pool.query(
      `INSERT INTO vehicles (vehicle_number,vehicle_type,model,capacity,status,owner_name,owner_mobile,
        reg_number,rating,reviews,location,price_per_acre,image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [vnum,vtype,model||"",capacity||0,status||"Available",
       ownerName||owner_name||"",ownerMobile||owner_mobile||"",
       regNumber||reg_number||"",rating||0,reviews||0,location||"",price,imgPath]
    );
    res.status(201).json({ id: result.insertId, message: "Vehicle added" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateVehicle(req, res) {
  const { id } = req.params;
  const { vehicleNumber, vehicle_number, vehicleType, vehicle_type, model, capacity, status,
    ownerName, owner_name, ownerMobile, owner_mobile, regNumber, reg_number,
    rating, reviews, location, pricePerAcre, price_per_acre, imageUrl, image_url } = req.body;
  let imgPath = req.file ? `/uploads/vehicles/${req.file.filename}` : (imageUrl || image_url || null);
  if (!imgPath) {
    const [cur] = await pool.query("SELECT image_url FROM vehicles WHERE id=?", [id]);
    imgPath = cur[0]?.image_url || null;
  }
  try {
    await pool.query(
      `UPDATE vehicles SET vehicle_number=?,vehicle_type=?,model=?,capacity=?,status=?,
       owner_name=?,owner_mobile=?,reg_number=?,rating=?,reviews=?,location=?,price_per_acre=?,image_url=? WHERE id=?`,
      [vehicleNumber||vehicle_number,vehicleType||vehicle_type,model||"",capacity||0,status||"Available",
       ownerName||owner_name||"",ownerMobile||owner_mobile||"",regNumber||reg_number||"",
       rating||0,reviews||0,location||"",Number(pricePerAcre||price_per_acre||0),imgPath,id]
    );
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE id=?", [id]);
    res.json(normV(rows[0], req));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function deleteVehicle(req, res) {
  try {
    await pool.query("DELETE FROM vehicles WHERE id=?", [req.params.id]);
    res.json({ message: "Vehicle deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
