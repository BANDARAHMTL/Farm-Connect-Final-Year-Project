import { Router } from "express";
import {
  getAllRiceMills, getAllRiceMillsAdmin, getRiceMillById,
  addRiceMill, updateRiceMill, deleteRiceMill
} from "../controllers/RiceMillController.js";
import adminAuth from "../middleware/adminAuth.js";
import { uploadRiceMill } from "../middleware/upload.js";

const router = Router();

router.get("/",    (req, res, next) => {
  // admin gets all mills including inactive, public gets only active
  const token = req.headers.authorization?.split(" ")[1];
  if (token) return getAllRiceMillsAdmin(req, res, next);
  return getAllRiceMills(req, res, next);
});
router.get("/:id", getRiceMillById);
router.post("/",    adminAuth, uploadRiceMill.single("image"), addRiceMill);
router.put("/:id",  adminAuth, uploadRiceMill.single("image"), updateRiceMill);
router.delete("/:id", adminAuth, deleteRiceMill);

export default router;
