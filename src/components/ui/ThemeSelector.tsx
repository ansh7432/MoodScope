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
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl hover:bg-slate-700/80 hover:border-blue-400/50 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-4 h-4 text-blue-400" />
        <span className="text-white text-sm font-medium">Themes</span>
        <div 
          className="w-4 h-4 rounded-full border-2 border-blue-400/50 shadow-inner"
          style={{ 
            background: `linear-gradient(45deg, ${currentTheme.colors.primary[0]}, ${currentTheme.colors.primary[1]})` 
          }}
        />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400"
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Theme Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full mt-2 right-0 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-2xl shadow-2xl z-50 p-6"
        >
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-400" />
              Choose Theme
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {chartThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    currentTheme.id === theme.id 
                      ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                      : 'border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <theme.icon className={`w-4 h-4 ${currentTheme.id === theme.id ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-white text-sm font-medium truncate">
                      {theme.name}
                    </span>
                    {currentTheme.id === theme.id && (
                      <Check className="w-4 h-4 text-blue-400 ml-auto" />
                    )}
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex gap-1 mb-2">
                    {theme.colors.primary.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <div className="text-slate-400 text-xs truncate">
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
