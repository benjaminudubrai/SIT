import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UsersIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import GlassCard from '../components/GlassCard';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentProjects from '../components/dashboard/RecentProjects';
import Announcements from '../components/dashboard/Announcements';
import ReferralModal from '../components/dashboard/ReferralModal';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Funding',
      value: '₦48,270,000',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Active Projects',
      value: '24',
      change: '+3',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
    },
    {
      name: 'Community Members',
      value: '51,247',
      change: '+2000',
      changeType: 'increase' as const,
      icon: UsersIcon,
    },
    {
      name: 'Success Rate',
      value: '87%',
      change: '-2%',
      changeType: 'decrease' as const,
      icon: TrophyIcon,
    },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Smart Campus Navigation App',
      creator: 'Adewale Ogundimu',
      department: 'Computer Science',
      funding: '₦560,000',
      target: '₦1,000,000',
      progress: 56,
      supporters: 23,
    },
    {
      id: 2,
      title: 'Sustainable Water Purification System',
      creator: 'Chiamaka Okoro',
      department: 'Environmental Engineering',
      funding: '₦3,240,000',
      target: '₦6,000,000',
      progress: 54,
      supporters: 18,
    },
    {
      id: 3,
      title: 'AI-Powered Study Assistant',
      creator: 'Ibrahim Lawal',
      department: 'Information Technology',
      funding: '₦5,800,000',
      target: '₦10,000,000',
      progress: 58,
      supporters: 31,
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Auditions Open for Launchpad: The Show!",
      date: "2025-08-15",
      content: "Register now to participate in Season 1 and showcase your innovation to the world.",
    },
    {
      id: 2,
      title: "Marketplace Vendor Onboarding",
      date: "2025-08-10",
      content: "Elderly and student vendors can now register. Our team will verify your business on campus.",
    },
    {
      id: 3,
      title: "SIT $CSHARE Token Launch",
      date: "2025-08-01",
      content: "Our utility token is live on Polygon! Use it for voting, purchases, and more.",
    },
  ];

  // Referral modal state
  const [showReferral, setShowReferral] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulate user ID for referral link (replace with real user ID if available)
  const userId = 1234;
  const referralLink = `${window.location.origin}/register?ref=${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-300 text-lg">
            Track innovation projects and community funding at UNILAG
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Recent Projects */}
        <RecentProjects projects={recentProjects} />

        {/* Announcements */}
        <div className="mt-12">
          <Announcements announcements={announcements} />
        </div>

      </motion.div>

      {/* Referral Program Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowReferral(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
        >
          Refer a Friend
        </button>
      </div>

      {/* Referral Modal */}
      <ReferralModal
        show={showReferral}
        onClose={() => setShowReferral(false)}
        referralLink={referralLink}
        copied={copied}
        onCopy={handleCopy}
      />
    </div>
  );
};

export default Dashboard;
