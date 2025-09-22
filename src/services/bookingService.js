import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings"; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log(" Token from localStorage:", token ? "Token found" : "No token in localStorage");
  return token ? { Authorization: `Bearer ${token}` } : {};
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

export const bookMovie = async (bookingData, token) => {
  console.log(" Sending bookingData:", bookingData);
  console.log(" Using token:", token ? "Token present" : "No token provided");
  
  try {
    const authHeaders = token 
      ? { Authorization: `Bearer ${token}` }
      : getAuthHeaders();
      
    console.log(" Auth headers:", authHeaders);
    
    const res = await axios.post(API_URL, bookingData, {
      headers: authHeaders,
    });
    console.log(" Booking success:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Booking failed:", err.response?.data || err.message);
    throw err;
  }
};
