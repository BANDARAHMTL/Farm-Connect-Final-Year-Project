import pool from "../config/db.js";

function absUrl(path, req) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = req ? `${req.protocol}://${req.get("host")}` : "http://localhost:8080";
  return base + path;
}

// GET /api/rice/listings — public marketplace
export async function getRiceListings(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT mp.id, mp.mill_id, mp.rice_type_id, mp.title,
        mp.price_per_kg, mp.available_kg, mp.min_order_kg, mp.max_order_kg,
        mp.description, mp.image_url, mp.delivery_time, mp.status,
        rm.mill_name, rm.location, rm.image_url AS mill_image, rm.rating AS mill_rating, rm.contact_number,
        rt.type_name AS rice_type, rt.description AS rice_description
      FROM rice_marketplace mp
      JOIN rice_mills rm ON mp.mill_id = rm.id
      JOIN rice_types rt ON mp.rice_type_id = rt.id
      WHERE mp.status='active' AND rm.status='active'
      ORDER BY rm.mill_name, rt.type_name
    `);
    res.json(rows.map(r => ({
      id:             r.id,
      mill_id:        r.mill_id, millId: r.mill_id,
      mill:           r.mill_name, millName: r.mill_name,
      millLocation:   r.location,
      millImage:      absUrl(r.mill_image, req),
      millRating:     r.mill_rating || 4.5,
      deliveryTime:   r.delivery_time || "1-3 days",
      rice_type_id:   r.rice_type_id,
      rice_type:      r.rice_type, riceTypeName: r.rice_type,
      riceDescription:r.rice_description || "",
      title:          r.title || r.rice_type,
      price_per_kg:   Number(r.price_per_kg),
      basePricePerKg: Number(r.price_per_kg),
      available_kg:   Number(r.available_kg),
      image_url:      absUrl(r.image_url, req),
      imageUrl:       absUrl(r.image_url, req),
      riceImage:      absUrl(r.image_url, req),
      stock:          Number(r.available_kg),
      availableWeights: [
        { value:5,  label:"5kg",  priceMultiplier:1    },
        { value:10, label:"10kg", priceMultiplier:0.95 },
        { value:25, label:"25kg", priceMultiplier:0.90 },
      ],
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// GET /api/rice/selling-prices?type=Samba — used by Selling.js
export async function getSellingPrices(req, res) {
  const riceType = req.query.type || "";
  try {
    let rows;
    if (riceType) {
      [rows] = await pool.query(
        `SELECT rt.id, rt.mill_id, rt.type_name, rt.price_per_kg, rt.stock_kg,
                rm.mill_name, rm.location, rm.contact_number, rm.image_url, rm.rating
         FROM rice_types rt
         JOIN rice_mills rm ON rt.mill_id = rm.id
         WHERE rt.type_name = ? AND rt.status='active' AND rm.status='active'
         ORDER BY rt.price_per_kg DESC`, [riceType]
      );
    } else {
      [rows] = await pool.query(
        `SELECT rt.id, rt.mill_id, rt.type_name, rt.price_per_kg, rt.stock_kg,
                rm.mill_name, rm.location, rm.contact_number, rm.image_url, rm.rating
         FROM rice_types rt
         JOIN rice_mills rm ON rt.mill_id = rm.id
         WHERE rt.status='active' AND rm.status='active'
         ORDER BY rm.mill_name, rt.type_name`
      );
    }
    res.json(rows.map(r => ({
      id:           r.id, millId: r.mill_id,
      millName:     r.mill_name, location: r.location,
      contactNumber:r.contact_number || "",
      imageUrl:     absUrl(r.image_url, req),
      rating:       r.rating || 0,
      typeName:     r.type_name, pricePerKg: Number(r.price_per_kg),
      stockKg:      Number(r.stock_kg),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// POST /api/rice/order
export async function createRiceOrder(req, res) {
  const b = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO rice_orders (customer_name,mobile,address,rice_type,mill_id,mill_name,marketplace_id,
        weight_kg,quantity,total_price,payment_method,delivery_option) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [b.customerName||b.customer_name||"",b.mobile||"",b.address||"",
       b.riceType||b.rice_type||"",b.millId||b.mill_id||null,b.millName||b.mill_name||"",
       b.marketplaceId||b.marketplace_id||null,b.weightKg||b.weight_kg||0,b.quantity||1,
       b.totalPrice||b.total_price||0,b.paymentMethod||b.payment_method||"cash",
       b.deliveryOption||b.delivery_option||"normal"]
    );
    res.status(201).json({ id: result.insertId, message: "Order placed successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// GET /api/rice/orders (admin)
export async function getAllOrders(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, rm.mill_name AS linked_mill FROM rice_orders o
       LEFT JOIN rice_mills rm ON o.mill_id = rm.id ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  const b = req.body;
  try {
    await pool.query(
      `UPDATE rice_orders SET customer_name=?,mobile=?,address=?,rice_type=?,mill_id=?,mill_name=?,
       weight_kg=?,quantity=?,total_price=?,payment_method=?,delivery_option=?,status=? WHERE id=?`,
      [b.customerName||"",b.mobile||"",b.address||"",b.riceType||"",b.millId||null,b.millName||"",
       b.weightKg||0,b.quantity||1,b.totalPrice||0,b.paymentMethod||"cash",b.deliveryOption||"normal",
       b.status||"pending",id]
    );
    res.json({ message: "Order updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function deleteOrder(req, res) {
  try {
    await pool.query("DELETE FROM rice_orders WHERE id=?", [req.params.id]);
    res.json({ message: "Order deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
