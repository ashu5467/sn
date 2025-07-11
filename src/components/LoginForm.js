import React from 'react';
import { motion } from 'framer-motion';

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin, loginError }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 backdrop-blur-sm bg-opacity-80"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300"
            required
          />
        </div>
        {loginError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {loginError}
          </motion.p>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-lg"
        >
          Log In
        </button>
      </form>
    </motion.div>
  );
};

export default LoginForm;