import pool from "../config/db.js";

const SESSION_LABELS = ["6-9am","9-12am","12-3pm","3-6pm","6-9pm","9-12pm"];

// GET ALL (admin)
export async function getAllBookings(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, f.mobile AS farmer_mobile, v.vehicle_number
       FROM   bookings b
       LEFT JOIN farmers  f ON b.farmer_id  = f.id
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// CREATE (farmer) — columns: vehicle_id, vehicle_name, vehicle_type,
//   booking_date, session_label, farmer_id, farmer_name,
//   address, area_acres, payment_method, total_price, status
export async function createBooking(req, res) {
  const {
    vehicleId,    vehicle_id,
    vehicleName,  vehicle_name,
    vehicleType,  vehicle_type,
    pricePerAcre, price_per_acre,   // used only for total calc, not stored
    bookingDate,  booking_date,
    session,      sessionLabel,  session_label,
    farmerId,     farmer_id,
    farmerName,   farmer_name,
    address,
    areaAcres,    area_acres,
    paymentMethod,payment_method,
    totalPrice,   total_price,
    status,
  } = req.body;

  const fid      = req.farmerId  || req.userId    || farmerId    || farmer_id    || null;
  const vid      = vehicleId     || vehicle_id    || null;
  const vname    = vehicleName   || vehicle_name  || null;
  const vtype    = vehicleType   || vehicle_type  || null;
  const ppa      = Number(pricePerAcre || price_per_acre || 0);
  const bdate    = bookingDate   || booking_date  || null;
  const sesIdx   = Number(session ?? 0);
  const sesLabel = sessionLabel  || session_label || SESSION_LABELS[sesIdx] || "6-9am";
  const fname    = farmerName    || farmer_name   || null;
  const addr     = address       || null;
  const acres    = Number(areaAcres || area_acres || 0);
  const pm       = paymentMethod || payment_method || "cash";
  const total    = Number(totalPrice || total_price || Math.round(ppa * acres));

  // validate vehicle FK
  let validVid = null;
  if (vid) {
    try {
      const [r] = await pool.query("SELECT id FROM vehicles WHERE id=?", [vid]);
      if (r.length) validVid = vid;
    } catch {}
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings
         (vehicle_id, vehicle_name, vehicle_type,
          booking_date, session_label,
          farmer_id, farmer_name, address,
          area_acres, payment_method, total_price, status)
       VALUES (?,?,?, ?,?, ?,?,?, ?,?,?,?)`,
      [
        validVid, vname, vtype,
        bdate, sesLabel,
        fid, fname, addr,
        acres, pm, total, status || "pending",
      ]
    );
    res.status(201).json({ id: result.insertId, message: "Booking created successfully", total_price: total });
  } catch (err) {
    console.error("Booking insert error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

// UPDATE STATUS (admin quick)
export async function updateBookingStatus(req, res) {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status required" });
  try {
    await pool.query("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ message: "Booking status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// FULL UPDATE (admin edit modal)
export async function updateBooking(req, res) {
  const { id } = req.params;
  const {
    session, sessionLabel, session_label,
    bookingDate, booking_date,
    farmerName, farmer_name,
    address,
    areaAcres, area_acres,
    paymentMethod, payment_method,
    totalPrice, total_price,
    status,
  } = req.body;

  const sesIdx   = Number(session ?? 0);
  const sesLabel = sessionLabel || session_label || SESSION_LABELS[sesIdx] || "6-9am";
  const bdate    = bookingDate  || booking_date  || null;
  const fname    = farmerName   || farmer_name   || null;
  const acres    = Number(areaAcres || area_acres || 0);
  const pm       = paymentMethod || payment_method || "cash";
  const total    = Number(totalPrice || total_price || 0);

  try {
    await pool.query(
      `UPDATE bookings SET
         booking_date=?, session_label=?,
         farmer_name=?, address=?,
         area_acres=?, payment_method=?, total_price=?,
         status=?
       WHERE id=?`,
      [bdate, sesLabel, fname, addr, acres, pm, total, status || "pending", id]
    );
    res.json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// DELETE (admin)
export async function deleteBooking(req, res) {
  try {
    await pool.query("DELETE FROM bookings WHERE id=?", [req.params.id]);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET USER BOOKINGS (farmer dashboard)
export async function getUserBookings(req, res) {
  const farmerId = req.params.userId || req.farmerId || req.userId;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bookings WHERE farmer_id=? ORDER BY created_at DESC",
      [farmerId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
