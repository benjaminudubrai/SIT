import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className = '', hover = true }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-purple-500/20 rounded-2xl shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;