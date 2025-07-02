'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Moon, Sun, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onShowAdvancedAnalytics?: () => void;
  hasAnalysisData?: boolean;
}

export function Header({ onShowAdvancedAnalytics, hasAnalysisData }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Music className="w-8 h-8 text-cyan-400" />
              <motion.div
                className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MoodScope</h1>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">AI Powered</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#analyze"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Analyze
            </a>
            {hasAnalysisData && (
              <button
                onClick={onShowAdvancedAnalytics}
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            )}
            <a
              href="#dashboard"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Dashboard
            </a>
          </nav>

          {/* Theme Toggle */}
          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-400" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
