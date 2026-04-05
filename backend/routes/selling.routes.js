import express from "express";
import { getAllSellings, getSellingById, addSelling, updateSelling, deleteSelling } from "../controllers/selling.controller.js";
import { userAuth, adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/",        getAllSellings);
router.get("/:id",     getSellingById);
router.post("/",       userAuth,  addSelling);
router.put("/:id",     adminAuth, updateSelling);   // admin can update status
router.delete("/:id",  adminAuth, deleteSelling);   // admin can delete
export default router;
