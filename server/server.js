import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import bookingsRouter from "./routes/bookings.js";
import authRouter from "./routes/auth.js"; 
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

app.use("/api/bookings", bookingsRouter);  
app.use("/api/auth", authRouter);  

console.log(" Auth routes loaded at /api/auth");


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/moviewebapp";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send(" Movie Booking API is running with JWT Auth");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET ? "JWT_SECRET is set" : "JWT_SECRET is missing"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

export default app;
