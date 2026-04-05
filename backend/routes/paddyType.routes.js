import { Router } from "express";
import {
  getAllPaddyTypes, getActivePaddyTypes,
  addPaddyType, updatePaddyType, deletePaddyType
} from "../controllers/paddyType.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

router.get("/",         getAllPaddyTypes);   // admin: all
router.get("/active",   getActivePaddyTypes); // farmers: active only
router.post("/",        adminAuth, addPaddyType);
router.put("/:id",      adminAuth, updatePaddyType);
router.delete("/:id",   adminAuth, deletePaddyType);

export default router;
