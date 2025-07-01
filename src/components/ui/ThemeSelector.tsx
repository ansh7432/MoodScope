'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { chartThemes } from '@/components/visualizations/CustomChartThemes';

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Theme Selector Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-4 h-4 text-purple-400" />
        <span className="text-white text-sm font-medium">Theme</span>
        <div 
          className="w-4 h-4 rounded-full border-2 border-white/30"
          style={{ background: currentTheme.colors.primary[0] }}
        />
      </motion.button>

      {/* Theme Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full mt-2 right-0 w-80 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 p-4"
        >
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm mb-3">Choose Theme</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {chartThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    currentTheme.id === theme.id 
                      ? 'border-purple-400 bg-purple-500/20' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <theme.icon className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium truncate">
                      {theme.name}
                    </span>
                    {currentTheme.id === theme.id && (
                      <Check className="w-3 h-3 text-purple-400 ml-auto" />
                    )}
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex gap-1 mb-1">
                    {theme.colors.primary.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <div className="text-gray-400 text-xs truncate">
                    {theme.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
