import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import GlassCard from '../components/GlassCard';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add your password reset logic here
    setTimeout(() => {
      setSent(true);
      setLoading(false);
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
            <EnvelopeIcon className="w-12 h-12 text-blue-400 mb-2" />
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-400 to-purple-500">
              Forgot Password
            </h2>
            <p className="text-gray-400 text-center mt-2">
              Enter your email and we'll send you a password reset link.
            </p>
          </div>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-blue-400 text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 mt-2"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center text-green-300 font-semibold py-8">
              If an account exists for <span className="font-mono">{email}</span>, a reset link has been sent.
              <div className="mt-6">
                <Link to="/" className="text-blue-400 hover:underline">
                  Back to Home
                </Link>
              </div>
            </div>
          )}
          <div className="mt-8 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            <Link to="/login" className="text-blue-400 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;