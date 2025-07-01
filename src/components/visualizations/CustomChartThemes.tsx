'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Palette,
  Sun,
  Moon,
  Sunset,
  Sparkles,
  Waves,
  Mountain,
  Leaf,
  Flame
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ChartTheme {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: string;
    text: string;
    border: string;
  };
  mood: 'energetic' | 'calm' | 'vibrant' | 'neutral' | 'dark' | 'nature';
}

const chartThemes: ChartTheme[] = [
  {
    id: 'sunset',
    name: 'Sunset Glow',
    icon: Sunset,
    description: 'Warm oranges and purples like a beautiful sunset',
    mood: 'energetic',
    colors: {
      primary: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8066', '#E63946'],
      secondary: ['#6A4C93', '#8E44AD', '#9B59B6', '#D63384', '#E91E63'],
      accent: ['#FFE66D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    icon: Waves,
    description: 'Cool blues and teals inspired by ocean waves',
    mood: 'calm',
    colors: {
      primary: ['#0077BE', '#00A8E8', '#007EA7', '#003459', '#00171F'],
      secondary: ['#4ECDC4', '#26D0CE', '#1ABC9C', '#16A085', '#0E7B83'],
      accent: ['#74D3F3', '#81ECE6', '#A8E6CF', '#88D8C0', '#4FC3A1'],
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    icon: Sparkles,
    description: 'Mystical greens and purples like northern lights',
    mood: 'vibrant',
    colors: {
      primary: ['#00FF7F', '#32CD32', '#7CFC00', '#ADFF2F', '#98FB98'],
      secondary: ['#9370DB', '#8A2BE2', '#9932CC', '#BA55D3', '#DA70D6'],
      accent: ['#00CED1', '#48D1CC', '#40E0D0', '#7FFFD4', '#AFEEEE'],
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    icon: Leaf,
    description: 'Natural greens and earth tones from the forest',
    mood: 'nature',
    colors: {
      primary: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F'],
      secondary: ['#8B4513', '#CD853F', '#D2691E', '#DEB887', '#F4A460'],
      accent: ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347'],
      background: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'fire',
    name: 'Phoenix Fire',
    icon: Flame,
    description: 'Intense reds and oranges like dancing flames',
    mood: 'energetic',
    colors: {
      primary: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500'],
      secondary: ['#DC143C', '#B22222', '#8B0000', '#CD5C5C', '#F08080'],
      accent: ['#FFD700', '#FFFF00', '#ADFF2F', '#32CD32', '#00FF00'],
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Sky',
    icon: Moon,
    description: 'Dark blues and silvers for a night-time feel',
    mood: 'dark',
    colors: {
      primary: ['#191970', '#000080', '#0000CD', '#4169E1', '#1E90FF'],
      secondary: ['#2F4F4F', '#708090', '#778899', '#B0C4DE', '#C0C0C0'],
      accent: ['#FFFAF0', '#F5F5DC', '#FFEFD5', '#FFE4B5', '#FFDAB9'],
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'daylight',
    name: 'Sunny Day',
    icon: Sun,
    description: 'Bright and cheerful colors for an uplifting mood',
    mood: 'vibrant',
    colors: {
      primary: ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347'],
      secondary: ['#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#4169E1'],
      accent: ['#98FB98', '#90EE90', '#00FF7F', '#00FA9A', '#00FF00'],
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'mountain',
    name: 'Mountain Peak',
    icon: Mountain,
    description: 'Cool grays and blues like mountain landscapes',
    mood: 'neutral',
    colors: {
      primary: ['#708090', '#778899', '#B0C4DE', '#D3D3D3', '#DCDCDC'],
      secondary: ['#4682B4', '#5F9EA0', '#87CEEB', '#87CEFA', '#ADD8E6'],
      accent: ['#F0F8FF', '#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE'],
      background: 'linear-gradient(135deg, #636fa4 0%, #e8cbc0 100%)',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  }
];

interface CustomChartThemesProps {
  onThemeChange?: (theme: ChartTheme) => void;
  currentTheme?: ChartTheme;
}

export default function CustomChartThemes({ onThemeChange, currentTheme }: CustomChartThemesProps) {
  const { currentTheme: contextTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ChartTheme>(currentTheme || contextTheme);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  const moodFilters = [
    { id: 'all', name: 'All Themes' },
    { id: 'energetic', name: 'Energetic' },
    { id: 'calm', name: 'Calm' },
    { id: 'vibrant', name: 'Vibrant' },
    { id: 'neutral', name: 'Neutral' },
    { id: 'dark', name: 'Dark' },
    { id: 'nature', name: 'Nature' }
  ];

  const filteredThemes = selectedMoodFilter === 'all' 
    ? chartThemes 
    : chartThemes.filter(theme => theme.mood === selectedMoodFilter);

  const handleThemeSelect = (theme: ChartTheme) => {
    setSelectedTheme(theme);
    setTheme(theme); // Apply theme globally through context
    onThemeChange?.(theme); // Optional callback for parent components
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Palette className="w-6 h-6 text-purple-400" />
          Chart Themes
        </h2>
        <p className="text-gray-400">
          Choose a visual theme that matches your mood and style preferences
        </p>
      </div>

      {/* Mood Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {moodFilters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedMoodFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMoodFilter(filter.id)}
            className="transition-all duration-300"
          >
            {filter.name}
          </Button>
        ))}
      </div>

      {/* Current Theme Preview */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Current Theme: {selectedTheme.name}</h3>
          <p className="text-gray-400">{selectedTheme.description}</p>
        </div>
        
        {/* Color Palette Preview */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Primary Colors</h4>
            <div className="flex gap-2 justify-center">
              {selectedTheme.colors.primary.map((color, index) => (
                <motion.div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Secondary Colors</h4>
            <div className="flex gap-2 justify-center">
              {selectedTheme.colors.secondary.map((color, index) => (
                <motion.div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Accent Colors</h4>
            <div className="flex gap-2 justify-center">
              {selectedTheme.colors.accent.map((color, index) => (
                <motion.div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredThemes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all duration-300 ${
                selectedTheme.id === theme.id
                  ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50 ring-2 ring-purple-500/50'
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30'
              }`}
              onClick={() => handleThemeSelect(theme)}
            >
              <div className="text-center space-y-3">
                <div 
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                  style={{ background: theme.colors.background }}
                >
                  <theme.icon className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h4 className="font-medium text-white">{theme.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{theme.description}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full mt-2 capitalize">
                    {theme.mood}
                  </span>
                </div>

                {/* Mini Color Preview */}
                <div className="flex gap-1 justify-center">
                  {theme.colors.primary.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Apply Theme Button */}
      <div className="text-center">
        <Button
          onClick={() => onThemeChange?.(selectedTheme)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
        >
          Apply {selectedTheme.name} Theme
        </Button>
      </div>
    </div>
  );
}

// Export the themes for use in other components
export { chartThemes };
