import React, { useEffect, useState, useContext } from 'react';
import { getBookings, getBookingStats } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { authUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [remainingDetails, setRemainingDetails] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 15;

  useEffect(() => {
    getBookings()
      .then((data) => {
        const sortedBookings = data.sort((a, b) => {
          const timeA = new Date(a.createdAt || `${a.date}T${a.time}`);
          const timeB = new Date(b.createdAt || `${b.date}T${b.time}`);
          return timeB - timeA;
        });
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);

        const totalRev = sortedBookings.reduce((sum, booking) => sum + (booking.ticketAmount || 0), 0);
        const totalBooks = sortedBookings.length;
        
        setTotalRevenue(totalRev);
        setTotalBookings(totalBooks);
        
        console.log("Calculated stats:", { totalRev, totalBooks, bookingsCount: sortedBookings.length });
      })
      .catch((err) => console.error("Error fetching bookings:", err));

    getBookingStats()
      .then((stats) => {
        console.log("Stats from API:", stats);
        if (stats.totalRevenue) setTotalRevenue(stats.totalRevenue);
        if (stats.totalBookings) setTotalBookings(stats.totalBookings);
        if (stats.remainingDetails) setRemainingDetails(stats.remainingDetails);
      })
      .catch((err) => console.error("Error fetching booking stats:", err));
  }, []);

  useEffect(() => {
    let result = bookings;

    if (search) {
      result = result.filter(
        (b) =>
          (b.userEmail && b.userEmail.toLowerCase().includes(search.toLowerCase())) ||
          (b.user && b.user.toLowerCase().includes(search.toLowerCase())) ||
          b.movieTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedMovie) {
      result = result.filter((b) => b.movieTitle === selectedMovie);
    }

    setFilteredBookings(result);
    setCurrentPage(1);
  }, [search, selectedMovie, bookings]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            ${totalRevenue}
          </p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            {totalBookings}
          </p>
        </div>
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Remaining Details</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 max-h-24 overflow-y-auto">
            {remainingDetails.length > 0 ? (
              remainingDetails.map((r, i) => (
                <li key={i}>
                  {r.movieTitle} ({r.date} {r.time}) → Seats left:{" "}
                  <strong>{r.remaining}</strong>
                </li>
              ))
            ) : (
              <li>No data</li>
            )}
          </ul>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email or movie title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 w-full sm:w-1/2"
        />

        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 w-full sm:w-1/3"
        >
          <option value="">All Movies</option>
          {[...new Set(bookings.map((b) => b.movieTitle))].map((title, i) => (
            <option key={i} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 border dark:border-gray-600 text-left">Email</th>
              <th className="py-3 px-4 border dark:border-gray-600 text-left">Movie Title</th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">Seats</th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">Booking Date</th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">Show Time</th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">Ticket Price</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((b, index) => {
              const bookingDate = new Date(`${b.date}T${b.time}:00Z`);
              return (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="py-2 px-4 border dark:border-gray-600">{b.userEmail || b.user || '-'}</td>
                  <td className="py-2 px-4 border dark:border-gray-600 font-semibold text-blue-700 dark:text-blue-400">
                    {b.movieTitle}
                  </td>
                  <td className="py-2 px-4 border dark:border-gray-600 text-center">{b.seats}</td>
                  <td className="py-2 px-4 border dark:border-gray-600 text-center">
                    {bookingDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td className="py-2 px-4 border dark:border-gray-600 text-center">
                    {bookingDate.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td className="py-2 px-4 border dark:border-gray-600 text-center">${b.ticketAmount || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;


