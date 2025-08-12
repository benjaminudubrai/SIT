import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, UserIcon, BriefcaseIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';

const roles = [
  { key: 'student', label: 'Student', icon: AcademicCapIcon },
  { key: 'investor', label: 'Investor', icon: UserIcon },
  { key: 'vendor', label: 'Vendor', icon: BriefcaseIcon },
];

const vendorTypes = [
  { key: 'student_vendor', label: 'Student Vendor' },
  { key: 'elderly_vendor', label: 'Elderly/Trusted Vendor' },
];

const RegistrationPage = () => {
  const [role, setRole] = useState('student');
  const [vendorType, setVendorType] = useState('student_vendor');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Submit logic here
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
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-400 to-purple-500 mb-2">
            Create your SIT Account
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Join as a student, investor, or trusted campus vendor.
          </p>

          {/* Role Selection */}
          <div className="flex justify-center gap-4 mb-8">
            {roles.map(r => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all duration-200
                  ${role === r.key
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-gray-700 text-gray-400 hover:border-blue-400 hover:text-blue-200'
                  }`}
              >
                <r.icon className="w-6 h-6 mb-1" />
                <span className="text-sm font-medium">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
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
                placeholder="Create a password"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Confirm your password"
              />
            </div>

            {/* Vendor-specific fields */}
            {role === 'vendor' && (
              <>
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Vendor Type</label>
                  <select
                    name="vendorType"
                    value={form.vendorType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="student_vendor">Student Vendor</option>
                    <option value="elderly_vendor">Elderly/Trusted Vendor</option>
                  </select>
                </div>
                <div className="bg-blue-900/30 border-l-4 border-blue-400 text-blue-200 p-3 rounded mb-2 text-sm">
                  <span className="font-semibold">Note:</span> Elderly, trusted, and verified vendors (not just students) can register. Our team will verify your business on campus before approval.
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 mt-2"
            >
              Create Account
            </button>
          </form>

          {submitted && (
            <div className="flex flex-col items-center mt-8">
              <CheckCircleIcon className="w-10 h-10 text-green-400 mb-2" />
              <p className="text-green-300 font-semibold text-center">
                Registration successful! Please check your email for verification instructions.
              </p>
            </div>
          )}

          <div className="mt-8 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;