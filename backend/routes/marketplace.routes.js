import { Router } from "express";
import { getListings, getAllListingsAdmin, getListingById, addListing, updateListing, deleteListing } from "../controllers/marketplace.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import { uploadMarketplace } from "../middleware/upload.js";

const router = Router();

router.get("/",         getListings);
router.get("/admin",    adminAuth, getAllListingsAdmin);
router.get("/:id",      getListingById);
router.post("/",        adminAuth, uploadMarketplace.single("image"), addListing);
router.put("/:id",      adminAuth, uploadMarketplace.single("image"), updateListing);
router.delete("/:id",   adminAuth, deleteListing);

export default router;
