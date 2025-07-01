'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';
import ThemeSelector from './ui/ThemeSelector';

export function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-8 relative"
    >
      <div className="container mx-auto px-4">
        {/* Theme Selector - positioned in top right */}
        <div className="absolute top-4 right-4">
          <ThemeSelector />
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Music className="h-8 w-8" />
          </motion.div>
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200"
          >
            MoodScope
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-4 text-lg md:text-xl text-cyan-100"
        >
          AI-Powered Music Mood Analysis
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-6 mx-auto max-w-md rounded-full"
        />
      </div>
    </motion.header>
  );
}
