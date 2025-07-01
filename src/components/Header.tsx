'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles, Zap } from 'lucide-react';
import ThemeSelector from './ui/ThemeSelector';

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 relative overflow-hidden border-b border-slate-800"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Professional grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Theme Selector - positioned in top right */}
        <div className="absolute top-4 right-4">
          <ThemeSelector />
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          {/* Animated music icon */}
          <motion.div
            initial={{ rotate: 0, scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.5, delay: 0.2 }
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-50"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-cyan-600 p-3 rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          {/* Main title with enhanced styling */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-2">
              <motion.span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #1e40af, #3b82f6, #60a5fa, #1e40af)',
                  backgroundSize: '300% 300%',
                }}
                animate={{ 
                  backgroundPosition: ['0%', '100%'],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                MoodScope
              </motion.span>
            </h1>
            
            {/* Beta badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-flex items-center space-x-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-3 py-1 text-sm"
            >
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-cyan-300 font-medium">AI-Powered</span>
            </motion.div>
          </motion.div>

          {/* Sparkles animation */}
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-xl md:text-2xl text-cyan-100 mb-4 font-light">
            AI-Powered Music Mood Analysis
          </p>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Unlock the emotional DNA of your playlists with cutting-edge artificial intelligence and discover what your music reveals about your personality
          </p>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="relative mt-8"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto max-w-md"></div>
          <motion.div
            animate={{ x: [-100, 100] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gradient-to-r from-purple-400 to-cyan-400 blur-sm"
          ></motion.div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.header>
  );
}
