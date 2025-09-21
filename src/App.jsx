import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login.jsx';       
import Register from './components/Register'; 
import { AuthProvider, AuthContext } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser || authUser.role !== 'admin') {
      navigate('/');
    }
  }, [authUser, navigate]);

  if (!authUser || authUser.role !== 'admin') {
    return null; 
  }

  return children;
};

const AppRoutes = () => (
  <>
    {/* Navbar */}
    <div className="bg-gray-900 text-white shadow-md">
      <Navbar />
    </div>

    {/* Page wrapper */}
    <div className="container mx-auto p-6">
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route
          path="/register"
          element={
            <div className="flex justify-center items-center h-screen">
              <div className="bg-white shadow-lg rounded-xl p-8 w-96">
                <Register />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  </>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
