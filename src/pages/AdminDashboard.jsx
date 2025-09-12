import React, { useEffect, useState } from 'react';
import { getBookings } from '../services/bookingService';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    getBookings()
      .then((data) => {
        console.log('Fetched bookings in Admin Dashboard:', data);

        // Sort bookings by date (latest first)
        const sortedBookings = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setBookings(sortedBookings);
        setTotalRevenue(
          sortedBookings.reduce(
            (acc, booking) => acc + (booking.ticketAmount || 0),
            0
          )
        );
        setTotalBookings(sortedBookings.length);
      })
      .catch((error) => {
        console.error('Error fetching bookings in Admin Dashboard:', error);
      });
  }, []);

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
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-300">
            Seats available: TBD
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 border dark:border-gray-600 text-left">
                Email
              </th>
              <th className="py-3 px-4 border dark:border-gray-600 text-left">
                Movie Title
              </th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">
                Seats
              </th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">
                Booking Date
              </th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">
                Show Time
              </th>
              <th className="py-3 px-4 border dark:border-gray-600 text-center">
                Ticket Price
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="py-2 px-4 border dark:border-gray-600">
                  {b.user || '-'}
                </td>
                <td className="py-2 px-4 border dark:border-gray-600 font-semibold text-blue-700 dark:text-blue-400">
                  {b.movieTitle}
                </td>
                <td className="py-2 px-4 border dark:border-gray-600 text-center">
                  {b.seats}
                </td>
                <td className="py-2 px-4 border dark:border-gray-600 text-center">
                  {b.date}
                </td>
                <td className="py-2 px-4 border dark:border-gray-600 text-center">
                  {b.time}
                </td>
                <td className="py-2 px-4 border dark:border-gray-600 text-center">
                  ${b.ticketAmount || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
