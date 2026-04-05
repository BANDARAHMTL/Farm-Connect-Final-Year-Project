import { Router } from "express";
import { getTypesByMill, getAllTypes, addRiceType, updateRiceType, deleteRiceType } from "../controllers/riceType.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

// GET /api/rice-types?millId=X  or  GET /api/rice-types
router.get("/", (req, res, next) => {
  if (req.query.millId) return getTypesByMill({ ...req, params: { millId: req.query.millId } }, res, next);
  return getAllTypes(req, res, next);
});
router.get("/:millId/by-mill", getTypesByMill);
router.post("/",    adminAuth, addRiceType);
router.put("/:id",  adminAuth, updateRiceType);
router.delete("/:id", adminAuth, deleteRiceType);

export default router;
