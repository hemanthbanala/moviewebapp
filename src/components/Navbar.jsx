import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { authUser, logout, isAuthenticated, isAdmin } = useContext(AuthContext);

  // Debug logging
  console.log("Navbar - authUser:", authUser);
  console.log("Navbar - isAuthenticated:", isAuthenticated);
  console.log("Navbar - isAdmin:", isAdmin);
  console.log("Navbar - token in localStorage:", localStorage.getItem("token"));

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Logo / Home */}
      <Link to="/" className="text-xl font-bold hover:text-blue-400">
        Movie Explorer
      </Link>

      {/* Right Side Menu */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm">Welcome, {authUser?.username || "User"}</span>
            
            {/* Admin Dashboard Button - Only visible to admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 transition text-white font-medium"
              >
                Admin Dashboard
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
