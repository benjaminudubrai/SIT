import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import InnovationChallenge from './pages/InnovationChallenge';
import Wallet from './pages/Wallet';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminVendors from './pages/AdminVendors';
import VendorProfile from './pages/VendorProfile';
import InvestmentPortal from './pages/InvestmentPortal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/challenges" element={<InnovationChallenge />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/vendors/:id" element={<VendorProfile />} />
          <Route path="/invest" element={<InvestmentPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;