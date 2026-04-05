import { Router } from "express";
import { listVehicles, getVehicle, addVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicle.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import { uploadVehicle } from "../middleware/upload.js";

const router = Router();

router.get("/",    listVehicles);
router.get("/:id", getVehicle);

// Admin routes — support multipart (image upload) or JSON
router.post("/",    adminAuth, uploadVehicle.single("image"), addVehicle);
router.put("/:id",  adminAuth, uploadVehicle.single("image"), updateVehicle);
router.delete("/:id", adminAuth, deleteVehicle);

export default router;
