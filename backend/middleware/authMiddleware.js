import jwt    from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function userAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Please login to perform this action" });

  try {
    const decoded  = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    req.farmerId   = decoded.farmerId  || null;
    req.userId     = decoded.farmerId  || decoded.adminId || decoded.id || null;
    req.userRole   = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token — please login again" });
  }
}

export { default as adminAuth } from "./adminAuth.js";
