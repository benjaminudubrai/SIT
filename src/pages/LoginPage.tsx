import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import GlassCard from '../components/GlassCard';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Add your authentication logic here
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }
    // Simulate login...
    setTimeout(() => {
      setLoading(false);
      // You can redirect or show a success message here
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <LockClosedIcon className="w-12 h-12 text-blue-400 mb-2" />
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-400 to-purple-500">
              Sign In to SIT
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-blue-400 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 mt-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default LoginPage;