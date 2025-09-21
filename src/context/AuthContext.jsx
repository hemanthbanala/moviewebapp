import React, { createContext, useEffect, useState } from "react";
import { getToken } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const user = localStorage.getItem("user");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("Token expired");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuthUser(null);
          return;
        }

        // ✅ Restore from localStorage or decoded token
        setAuthUser(
          user
            ? JSON.parse(user)
            : {
                id: decoded.id || decoded.uid || null,
                username:
                  decoded.username || decoded.name || decoded.email || "User",
                email: decoded.email || null,
                role: decoded.role || "user",
              }
        );
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthUser(null);
      }
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }

    try {
      const decoded = jwtDecode(token);
      setAuthUser({
        id: decoded.id || decoded.uid || null,
        username:
          decoded.username ||
          decoded.name ||
          decoded.email ||
          userData?.username,
        email: decoded.email || userData?.email || null,
        role: decoded.role || userData?.role || "user",
      });
    } catch (err) {
      console.error("Failed to decode token on login", err);
      setAuthUser({
        username: userData?.username || userData?.email,
        role: userData?.role || "user",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthUser(null);
  };

  const isAuthenticated = Boolean(authUser);

  return (
    <AuthContext.Provider value={{ authUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
