import express from "express";
import {
  getRiceListings, getSellingPrices, createRiceOrder,
  getAllOrders, updateOrder, deleteOrder
} from "../controllers/rice.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();
router.get("/listings",       getRiceListings);         // public
router.get("/selling-prices", getSellingPrices);        // public — prices by rice type
router.post("/order",         createRiceOrder);         // public
router.get("/orders",         adminAuth, getAllOrders);
router.put("/orders/:id",     adminAuth, updateOrder);
router.delete("/orders/:id",  adminAuth, deleteOrder);
export default router;
