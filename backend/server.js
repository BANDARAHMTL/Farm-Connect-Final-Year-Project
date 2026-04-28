import express    from "express";
import cors       from "cors";
import dotenv     from "dotenv";
import path       from "path";
import { fileURLToPath } from "url";
import pool       from "./config/db.js";
import adminAuth  from "./middleware/adminAuth.js";

import farmerRoutes      from "./routes/farmer.routes.js";
import adminRoutes       from "./routes/admin.routes.js";
import vehicleRoutes     from "./routes/vehicle.routes.js";
import millRoutes        from "./routes/riceMill.routes.js";
// import riceTypeRoutes    from "./routes/riceType.routes.js";
// import marketplaceRoutes from "./routes/marketplace.routes.js";
import bookingRoutes     from "./routes/booking.routes.js";
// import sellingRoutes     from "./routes/selling.routes.js";
// import riceRoutes        from "./routes/rice.routes.js";
// import paddyTypeRoutes   from "./routes/paddyType.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ── CORS ─────────────────────────────────────────────────────────
app.use(cors({ origin: "*", exposedHeaders: ["Content-Type"] }));
app.use(express.json());

// ── Static: serve uploaded images ────────────────────────────────
// URL:  http://localhost:8080/uploads/vehicles/file.jpg
// Path: <backend>/uploads/vehicles/file.jpg
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath, {
  setHeaders(res) {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
}));
console.log(`📂 Serving uploads from: ${uploadsPath}`);

// ── API Routes ────────────────────────────────────────────────────
app.use("/api/farmers",      farmerRoutes);
app.use("/api/admin",        adminRoutes);
app.use("/api/vehicles",     vehicleRoutes);
app.use("/api/rice-mills",   millRoutes);
app.use("/api/rices",        millRoutes);       // legacy alias
// app.use("/api/rice-types",   riceTypeRoutes);
// app.use("/api/marketplace",  marketplaceRoutes);
app.use("/api/bookings",     bookingRoutes);
// app.use("/api/selling",      sellingRoutes);
// app.use("/api/rice",         riceRoutes);
// app.use("/api/paddy-types", paddyTypeRoutes);

// ── /api/users (admin) ───────────────────────────────────────────
app.get("/api/users", adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id,farmer_id,name,email,mobile,nic,address,land_number,created_at FROM farmers ORDER BY created_at DESC"
    );
    res.json(rows.map(f => ({
      id: f.id, farmer_id: f.farmer_id, fullName: f.name,
      email: f.email, phone: f.mobile, nic: f.nic,
      address: f.address, role: "farmer", status: "active", created_at: f.created_at,
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.put("/api/users/:id", adminAuth, async (req, res) => {
  const { fullName, name, phone, mobile } = req.body;
  try {
    await pool.query("UPDATE farmers SET name=?,mobile=? WHERE id=?", [fullName||name, phone||mobile, req.params.id]);
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.delete("/api/users/:id", adminAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM farmers WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.get("/api/admin/farmers", adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id,farmer_id,name,email,mobile,created_at FROM farmers ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Health ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.get("/", (_req, res) => res.send(`✅ FarmConnect API v4.0 — uploads at ${uploadsPath}`));
app.use((err, _req, res, _next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ message: err.message });
});
app.listen(PORT, () => {
  console.log(`🚀 Server → http://localhost:${PORT}`);
  console.log(`📸 Images → http://localhost:${PORT}/uploads/`);
});
