import express from "express";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//  Middleware to check JWT
const authMiddleware = (req, res, next) => {
  console.log(" ===== AUTH MIDDLEWARE START =====");
  console.log(" Request headers:", req.headers);
  console.log(" Authorization header:", req.headers.authorization);
  
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(" Extracted token:", token ? "Token present" : "No token");
  
  if (!token) {
    console.log(" ERROR: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Token verified successfully. Decoded:", decoded);
    req.user = decoded; // attach user info to request
    console.log(" ===== AUTH MIDDLEWARE SUCCESS =====");
    next();
  } catch (err) {
    console.log(" Token verification error:", err.message);
    console.log(" ===== AUTH MIDDLEWARE FAILED =====");
    return res.status(401).json({ error: "Invalid token" });
  }
};

// TEST route without authentication
router.post("/test", async (req, res) => {
  console.log(" TEST ROUTE: POST /bookings/test reached");
  console.log(" Test request body:", req.body);
  res.json({ message: "Test route working", received: req.body });
});

// TEMPORARY: POST /bookings → add a booking (NO AUTHENTICATION FOR TESTING)
router.post("/", async (req, res) => {
  console.log(" ===== BOOKING ROUTE START (NO AUTH) =====");
  console.log(" POST /bookings route reached");
  console.log(" Headers received:", req.headers);
  
  try {
    console.log(" ===== BOOKING REQUEST DEBUG =====");
    console.log(" Incoming booking request:", req.body);
    
    // TEMPORARY FIX: Use a dummy userId for testing
    const userId = "temporary-user-id-12345";
    console.log(" Using temporary userId:", userId);
    
    // attach userId to the booking
    const bookingData = {
      ...req.body,
      userId: userId,
    };
    
    console.log(" Final booking data:", bookingData);
    console.log(" ===== END BOOKING DEBUG =====");
    
    const booking = new Booking(bookingData);

    const saved = await booking.save();
    console.log(" Booking saved successfully:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error(" Booking error:", err.message);
    console.error(" Full error:", err);
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
