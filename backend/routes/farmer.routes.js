import express from "express";
import { registerFarmer, farmerLogin, getFarmerProfile, getFarmerById } from "../controllers/farmer.controller.js";
import { farmerAuth } from "../middleware/farmerAuth.js";

const router = express.Router();
router.post("/register",  registerFarmer);
router.post("/login",     farmerLogin);
router.get("/me",         farmerAuth, getFarmerProfile);
router.get("/profile",    farmerAuth, getFarmerProfile);
router.get("/:id",        getFarmerById);
export default router;
