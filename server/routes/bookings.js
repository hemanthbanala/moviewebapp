import express from "express";
import Booking from "../models/booking.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//  Middleware to check JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// POST /bookings → add a booking (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log(" Incoming booking request:", req.body);

    // attach logged-in userId to the booking
    const booking = new Booking({
      ...req.body,
      user: req.user.id, 
    });

    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(" Booking error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// fetch all bookings 
router.get("/", authMiddleware, async (req, res) => {
  try {
   
    const bookings = await Booking.find().lean();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
