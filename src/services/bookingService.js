import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings"; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getBookings = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getBookingStats = async () => {
  const res = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const bookMovie = async (bookingData) => {
  console.log(" Sending bookingData:", bookingData);
  try {
    const res = await axios.post(API_URL, bookingData, {
      headers: getAuthHeaders(),
    });
    console.log(" Booking success:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Booking failed:", err.response?.data || err.message);
    throw err;
  }
};
