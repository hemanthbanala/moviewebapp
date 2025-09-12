import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">Login with Google</button>
    </div>
  );
};
export default Login;

