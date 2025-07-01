/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AnalysisResult } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  Clock,
  Grid3X3,
  Palette,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Box
} from 'lucide-react';

// Placeholder components for missing chart types
const MoodDistributionChart = ({ analysis }: { analysis: any }) => (
  <div className="flex items-center justify-center h-full text-gray-400">
    <div className="text-center">
      <PieChart className="w-16 h-16 mx-auto mb-4" />
      <p>Mood Distribution Chart</p>
      <p className="text-sm">Tracks: {analysis.tracks?.length || 0}</p>
    </div>
  </div>
);

const AudioFeaturesRadar = ({ features }: { features: any }) => (
  <div className="flex items-center justify-center h-full text-gray-400">
    <div className="text-center">
      <Activity className="w-16 h-16 mx-auto mb-4" />
      <p>Audio Features Radar</p>
      <p className="text-sm">Energy: {features?.avg_energy?.toFixed(2) || 'N/A'}</p>
    </div>
  </div>
);

const Mood3DVisualization = ({ tracks }: { tracks: any[] }) => (
  <div className="flex items-center justify-center h-full text-gray-400">
    <div className="text-center">
      <Box className="w-16 h-16 mx-auto mb-4" />
      <p>3D Mood Visualization</p>
      <p className="text-sm">Tracks: {tracks?.length || 0}</p>
    </div>
  </div>
);

// Type alias for analysis data
type PlaylistAnalysis = AnalysisResult;

type ChartComponent = React.ComponentType<any>;

interface ChartConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: ChartComponent;
  description: string;
  category: 'basic' | 'advanced' | '3d' | 'temporal';
  props: (analysis: AnalysisResult) => any;
}

const chartConfigs: ChartConfig[] = [
  {
    id: 'mood-distribution',
    name: 'Mood Distribution',
    icon: PieChart,
    component: MoodDistributionChart,
    description: 'Pie chart showing distribution of mood categories',
    category: 'basic',
    props: (analysis: AnalysisResult) => ({ data: analysis.mood_summary })
  },
  {
    id: 'audio-features',
    name: 'Audio Features Radar',
    icon: Activity,
    component: AudioFeaturesRadar,
    description: 'Radar chart of audio features',
    category: 'basic',
    props: (analysis: AnalysisResult) => ({ features: analysis.mood_summary })
  },
  {
    id: 'mood-3d',
    name: '3D Mood Space',
    icon: Activity,
    component: Mood3DVisualization,
    description: 'Interactive 3D visualization of track positions',
    category: '3d',
    props: (analysis: AnalysisResult) => ({ tracks: analysis.tracks })
  }
];

interface AnimatedChartTransitionsProps {
  analysis: PlaylistAnalysis;
}

export default function AnimatedChartTransitions({ analysis }: AnimatedChartTransitionsProps) {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCharts = selectedCategory === 'all' 
    ? chartConfigs 
    : chartConfigs.filter(chart => chart.category === selectedCategory);

  const currentChart = filteredCharts[currentChartIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentChartIndex((prev) => (prev + 1) % filteredCharts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredCharts.length]);

  // Reset current index when category changes
  useEffect(() => {
    setCurrentChartIndex(0);
  }, [selectedCategory]);

  const nextChart = () => {
    setCurrentChartIndex((prev) => (prev + 1) % filteredCharts.length);
  };

  const prevChart = () => {
    setCurrentChartIndex((prev) => (prev - 1 + filteredCharts.length) % filteredCharts.length);
  };

  const categories = [
    { id: 'all', name: 'All Charts', icon: Palette },
    { id: 'basic', name: 'Basic', icon: BarChart3 },
    { id: 'advanced', name: 'Advanced', icon: Grid3X3 },
    { id: '3d', name: '3D Views', icon: Box },
    { id: 'temporal', name: 'Timeline', icon: Clock }
  ];

  const chartVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut" as const
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      transition: {
        duration: 0.8,
        ease: "easeInOut" as const
      }
    })
  };

  const thumbnailVariants = {
    inactive: {
      scale: 0.8,
      opacity: 0.6,
      y: 10
    },
    active: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Main Chart Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <currentChart.icon className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">{currentChart.name}</h3>
              <p className="text-sm text-gray-400">{currentChart.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAutoPlaying ? 'Pause' : 'Auto'}
            </Button>
            <Button variant="outline" size="sm" onClick={prevChart}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-400 px-2">
              {currentChartIndex + 1} / {filteredCharts.length}
            </span>
            <Button variant="outline" size="sm" onClick={nextChart}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative h-[600px] overflow-hidden">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentChart.id}
              custom={1}
              variants={chartVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 p-6"
              style={{ perspective: 1000 }}
            >
              <currentChart.component analysis={analysis} />
            </motion.div>
          </AnimatePresence>

          {/* Loading Overlay */}
          {isAutoPlaying && (
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin"></div>
            </div>
          )}
        </div>
      </Card>

      {/* Chart Thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {filteredCharts.map((chart, index) => (
          <motion.div
            key={chart.id}
            variants={thumbnailVariants}
            animate={index === currentChartIndex ? "active" : "inactive"}
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
          >
            <Card
              className={`p-3 cursor-pointer transition-all duration-300 ${
                index === currentChartIndex
                  ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50'
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30'
              }`}
              onClick={() => setCurrentChartIndex(index)}
            >
              <div className="flex flex-col items-center gap-2">
                <chart.icon className={`w-6 h-6 ${
                  index === currentChartIndex ? 'text-purple-400' : 'text-gray-400'
                }`} />
                <span className={`text-xs text-center ${
                  index === currentChartIndex ? 'text-white' : 'text-gray-400'
                }`}>
                  {chart.name}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicator */}
      {isAutoPlaying && (
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentChartIndex}
          />
        </div>
      )}
    </div>
  );
}
