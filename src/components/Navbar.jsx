import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setAuthUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
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
        {!user ? (
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
            <span className="text-sm">Welcome, {user.username}</span>
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
