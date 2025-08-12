import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import GlassCard from '../GlassCard';

interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Latest Announcements</h2>
        <div className="space-y-6">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex-shrink-0">
                  <CalendarIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {announcement.title}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {formatDate(announcement.date)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            View All Announcements →
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default Announcements;
