import Booking from "../models/booking.js";

export const bookMovie = async (booking) => {
  const newBooking = new Booking(booking);
  return await newBooking.save();
};

export const getBookings = async () => {
  return await Booking.find().lean();
};
