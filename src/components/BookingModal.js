import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookMovie } from '../services/bookingService';

const BookingModal = ({ open, onClose, movie }) => {
  const { user } = useContext(AuthContext);
  const [seats, setSeats] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!open) return null;

  const handleBook = async () => {
    if (!user) {
      alert('Please login to book tickets.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time for booking.');
      return;
    }
    setLoading(true);
    const ticketPrice = 20;
    const totalAmount = seats * ticketPrice;
    const bookingData = {
      user: user.email,
      movieTitle: movie.title,
      seats,
      date: selectedDate,
      time: selectedTime,
      ticketAmount: totalAmount,
    };
    await bookMovie(bookingData);
    setLoading(false);
    setSuccessMessage(
      `Booking successful!\nMovie: ${movie.title}\nDate: ${selectedDate}\nTime: ${selectedTime}`
    );
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 3000);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 dark:text-white p-8 rounded-2xl shadow-2xl w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6">
          Book:{' '}
          <span className="text-blue-600 dark:text-blue-400">{movie.title}</span>
        </h2>

        {/* Seats */}
        <label className="block mb-4 font-medium">
          Seats:
          <input
            type="number"
            min="1"
            max="5"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </label>

        {/* Date */}
        <label className="block mb-4 font-medium">
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </label>

        {/* Time */}
        <label className="block mb-4 font-medium">
          Time:
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {generateTimeOptions().map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book'}
          </button>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 rounded-t-2xl">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
