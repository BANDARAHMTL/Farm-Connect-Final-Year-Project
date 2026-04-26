import express from "express";
import { registerAdmin, adminLogin, listFarmers, updateFarmer, deleteFarmer } from "../controllers/AdminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();
router.post("/register",        registerAdmin);
router.post("/login",           adminLogin);
router.get("/farmers",          adminAuth, listFarmers);
router.put("/farmers/:id",      adminAuth, updateFarmer);
router.delete("/farmers/:id",   adminAuth, deleteFarmer);
export default router;
