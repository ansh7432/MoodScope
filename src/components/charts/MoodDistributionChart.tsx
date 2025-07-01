'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { moodColors, getMoodEmoji } from '@/lib/utils';
import type { MoodSummary } from '@/lib/types';

// Enhanced color palette for better visual distinction
const enhancedMoodColors = {
  'Energetic & Happy': '#FFD700', // Gold
  'Happy & Uplifting': '#FF6B35', // Vibrant Orange
  'Excited & Energetic': '#FF1744', // Bright Red
  'Calm & Content': '#4FC3F7', // Light Blue
  'Balanced & Stable': '#66BB6A', // Green
  'Neutral & Balanced': '#78909C', // Blue Grey
  'Melancholic & Reflective': '#9C27B0', // Purple
  'Melancholic & Thoughtful': '#7986CB', // Indigo
  'Intense & Dramatic': '#E91E63', // Pink
  'Sad & Reflective': '#5C6BC0', // Deep Purple
} as const;

interface MoodDistributionChartProps {
  moodSummary: MoodSummary;
}

export function MoodDistributionChart({ moodSummary }: MoodDistributionChartProps) {
  const data = Object.entries(moodSummary.mood_distribution).map(([mood, count]) => ({
    name: mood,
    value: count,
    color: enhancedMoodColors[mood as keyof typeof enhancedMoodColors] || 
           moodColors[mood as keyof typeof moodColors] || '#CCCCCC',
    emoji: getMoodEmoji(mood),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={30}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20">
                    <div className="text-center">
                      <p className="text-white font-bold text-lg mb-1">
                        {data.emoji} {data.name}
                      </p>
                      <p className="text-gray-300 text-sm mb-2">
                        {data.value} track{data.value !== 1 ? 's' : ''}
                      </p>
                      <div className="bg-white/10 rounded-full px-3 py-1">
                        <span className="text-white font-semibold">
                          {((data.value / moodSummary.total_tracks) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={60}
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value, entry) => (
              <span className="text-white text-sm font-medium">
                {(entry.payload as { emoji: string }).emoji} {value}
              </span>
            )}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
