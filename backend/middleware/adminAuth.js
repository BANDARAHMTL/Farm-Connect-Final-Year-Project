import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Admin token required" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admin access required" });
    req.adminId = decoded.adminId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
