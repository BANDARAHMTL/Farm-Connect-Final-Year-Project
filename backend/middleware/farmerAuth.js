import jwt    from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function farmerAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Farmer token required" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    req.farmerId  = decoded.farmerId || null;
    req.userId    = decoded.farmerId || null;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
