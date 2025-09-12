import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, role } = useContext(AuthContext);
  if (!user || role !== 'admin') {
    window.location.href = '/';
    return null;
  }
  return children;
};

const App = () => (
  <AuthProvider>
    <Router>
      {/* Navbar with Tailwind background */}
      <div className="bg-gray-900 text-white shadow-md">
        <Navbar />
      </div>

      {/* Page wrapper */}
      <div className="container mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                  Welcome to Movie Explorer 🎬
                </h1>
                <Home />
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <AdminDashboard />
                </div>
              </AdminRoute>
            }
          />
          <Route
            path="/login"
            element={
              <div className="flex justify-center items-center h-screen">
                <div className="bg-white shadow-lg rounded-xl p-8 w-96">
                  <Login />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
