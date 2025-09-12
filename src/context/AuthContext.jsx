import React, { createContext, useEffect, useState } from 'react';
import { auth, provider } from '../auth/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Assign roles based on email
        // Add your admin emails below
        const adminEmails = [
          "banalahemanth372@gmail.com"
          // Add more admin emails here
        ];
        const viewerEmails = [
          "viewer@example.com",
          // Add more viewer emails here
        ];
        if (adminEmails.includes(u.email)) {
          setRole("admin");
        } else if (viewerEmails.includes(u.email)) {
          setRole("viewer");
        } else {
          setRole("user");
        }
      } else {
        setRole(null);
      }
    });
    return () => unsub();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
