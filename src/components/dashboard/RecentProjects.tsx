import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard';

interface Project {
  id: number;
  title: string;
  creator: string;
  department: string;
  funding: string;
  target: string;
  progress: number;
  supporters: number;
}

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Projects</h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    by {project.creator} • {project.department}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{project.supporters} supporters</span>
                    <span>{project.funding} raised of {project.target}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300">{project.progress}% funded</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            View All Projects →
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default RecentProjects;
