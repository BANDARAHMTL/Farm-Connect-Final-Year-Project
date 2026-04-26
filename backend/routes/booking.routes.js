import express from "express";
import {
  getAllBookings, createBooking, updateBookingStatus,
  updateBooking, deleteBooking, getUserBookings,
} from "../controllers/BookingController.js";
import adminAuth from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",               adminAuth, getAllBookings);
router.post("/",              userAuth,  createBooking);
router.put("/:id/status",     adminAuth, updateBookingStatus);
router.put("/:id",            adminAuth, updateBooking);
router.delete("/:id",         adminAuth, deleteBooking);
router.get("/user/:userId",   userAuth,  getUserBookings);

export default router;
