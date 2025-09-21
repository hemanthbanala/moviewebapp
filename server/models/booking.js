import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },   
  userEmail: { type: String, required: true },
  movieId: { type: String, required: true },  
  movieTitle: { type: String, required: true },
  seats: { type: Number, required: true },
  ticketAmount: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
