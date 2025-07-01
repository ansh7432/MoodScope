'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Zap, Coffee, Palette } from 'lucide-react';

interface DemoOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

interface DemoSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (demoId: string) => void;
  isLoading?: boolean;
}

const demoOptions: DemoOption[] = [
  {
    id: 'upbeat',
    name: 'Upbeat Energy Mix',
    description: 'High-energy tracks perfect for workouts and motivation',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'chill',
    name: 'Chill Vibes Collection', 
    description: 'Relaxing and mellow tracks for studying or unwinding',
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'mixed',
    name: 'Mixed Moods Playlist',
    description: 'Diverse emotional range from happy to melancholic',
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500'
  }
];

export function DemoSelector({ isOpen, onClose, onSelect, isLoading }: DemoSelectorProps) {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleSelect = (demoId: string) => {
    setSelectedDemo(demoId);
    setTimeout(() => {
      onSelect(demoId);
      setSelectedDemo(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Choose Demo Playlist</h3>
                  <p className="text-sm text-slate-400">Select a playlist to analyze</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demo Options */}
            <div className="space-y-3">
              {demoOptions.map((demo) => (
                <motion.button
                  key={demo.id}
                  onClick={() => handleSelect(demo.id)}
                  disabled={isLoading || selectedDemo === demo.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl border transition-all text-left group relative overflow-hidden ${
                    selectedDemo === demo.id
                      ? 'border-white/40 bg-white/10' 
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${demo.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${demo.gradient} flex-shrink-0`}>
                      {demo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                        {demo.name}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {demo.description}
                      </p>
                    </div>
                  </div>

                  {/* Loading indicator for selected demo */}
                  {selectedDemo === demo.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/10 flex items-center justify-center rounded-xl"
                    >
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500 text-center">
                Each demo contains 20 carefully curated tracks for analysis
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
