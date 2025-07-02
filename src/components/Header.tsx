'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onShowAdvancedAnalytics?: () => void;
  hasAnalysisData?: boolean;
}

export function Header({ onShowAdvancedAnalytics, hasAnalysisData }: HeaderProps) {
  const handleHomeClick = () => {
    // Refresh the page to go back to the initial state
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand - Now clickable as home button */}
          <motion.button
            onClick={handleHomeClick}
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Music className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <motion.div
                className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors">
                MoodScope
              </h1>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-xs text-purple-400 group-hover:text-purple-300 transition-colors font-medium">
                  AI Powered
                </span>
              </div>
            </div>
          </motion.button>

          {/* Center Navigation - Analyze */}
          <nav className="hidden md:flex items-center">
          
          </nav>

          {/* Right Corner - Analytics Button */}
          <div className="flex items-center">
            {hasAnalysisData && (
              <motion.button
                onClick={onShowAdvancedAnalytics}
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-gray-800/30 border border-gray-700/50 hover:border-cyan-400/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
