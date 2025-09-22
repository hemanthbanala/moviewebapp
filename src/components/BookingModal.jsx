import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookMovie } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";

const BookingModal = ({ open, onClose, onBook, movie }) => {
  const navigate = useNavigate();
  const { isAuthenticated, authUser } = useContext(AuthContext);

  const [seats, setSeats] = useState(1);
  const [showLimit, setShowLimit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (authUser?.email) {
      setUserEmail(authUser.email); 
    } else if (authUser?.username) {
      setUserEmail(authUser.username); 
    }
  }, [authUser]);

  if (!open) return null;

  const handleBook = async () => {
    if (!isAuthenticated) {
      alert("Please log in to book tickets.");
      navigate("/login");
      return;
    }

    if (!userEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (Number(seats) > 5) {
      setShowLimit(true);
      setTimeout(() => setShowLimit(false), 2000);
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for booking.");
      return;
    }

    if (
      isNaN(new Date(selectedDate).getTime()) ||
      !selectedTime.match(/^\d{2}:\d{2}$/)
    ) {
      alert("Invalid date or time format. Please select valid values.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const bookingData = {
        movieTitle: movie.title,
        movieId: movie.id,
        seats: Number(seats),
        date: selectedDate,
        time: selectedTime,
        name: authUser?.username || "Guest",
        userEmail: authUser?.email || userEmail || "<Email>",
        ticketAmount: Number(seats) * 20,
      };

      const savedBooking = await bookMovie(bookingData, token);

      setSuccess({ date: selectedDate, time: selectedTime });
      setTimeout(() => {
        setSuccess(false);
        onBook(savedBooking);
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-2xl w-96 relative animate-fadeIn transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-extrabold mb-6 text-gray-800 dark:text-gray-100 tracking-tight">
          Book: <span className="text-blue-600">{movie.title}</span>
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
            Email:
          </label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={isAuthenticated || loading || success}
          />
        </div>

        {/* Seats */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
            Seats:
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={loading || success}
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
            Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={loading || success}
          />
        </div>

        {/* Time */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
            Time:
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={loading || success}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={loading || success}
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            className={`px-4 py-2 rounded-lg font-semibold transition bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md flex items-center gap-2 ${
              loading || success
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-green-500 hover:to-blue-600"
            }`}
            disabled={loading || success}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            {success ? "Booked!" : "Book"}
          </button>
        </div>

        {/* Validation Messages */}
        {showLimit && (
          <div className="mt-6 animate-bounce bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold shadow">
            Limit exceeded: Max 5 tickets allowed
          </div>
        )}
        {success && typeof success === "object" && (
          <div className="mt-6 animate-fadeIn bg-green-500 text-white px-4 py-2 rounded-lg text-center font-semibold shadow">
            <div>You have booked successfully!</div>
            <div className="text-sm mt-2 font-normal">
              Date: <span className="font-bold">{success.date}</span>
            </div>
            <div className="text-sm font-normal">
              Time: <span className="font-bold">{success.time}</span>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
        .animate-fadeIn { animation: fadeIn 0.4s ease; }
      `}</style>
    </div>
  );
};

export default BookingModal;
