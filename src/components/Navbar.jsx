import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, role, login, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
      <div className="text-xl font-bold">Movie Explorer</div>
      <div  className="text-4xl font-bold text-blue-600" > Weclome to Movie Explorer 🎬 </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded border border-gray-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition"
          title="Toggle theme"
        >
          {theme === 'dark' ? ' Dark' : ' Light'}
        </button>
        {role === 'admin' && (
          <Link to="/admin" className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 transition">Admin Dashboard</Link>
        )}
        {user ? (
          <>
            <span className="mr-2">{user.displayName}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <button onClick={login} className="bg-blue-500 px-3 py-1 rounded">Login with Google</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
