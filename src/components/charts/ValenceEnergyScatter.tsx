'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { moodColors } from '@/lib/utils';
import type { Track } from '@/lib/types';

// Enhanced color palette for scatter points
const scatterColors = {
  'Energetic & Happy': '#FFD700',
  'Happy & Uplifting': '#FF6B35',
  'Excited & Energetic': '#FF1744',
  'Calm & Content': '#4FC3F7',
  'Balanced & Stable': '#66BB6A',
  'Neutral & Balanced': '#78909C',
  'Melancholic & Reflective': '#9C27B0',
  'Melancholic & Thoughtful': '#7986CB',
  'Intense & Dramatic': '#E91E63',
  'Sad & Reflective': '#5C6BC0',
} as const;

interface ValenceEnergyScatterProps {
  tracks: Track[];
}

export function ValenceEnergyScatter({ tracks }: ValenceEnergyScatterProps) {
  const data = tracks.map((track) => ({
    x: track.valence * 100,
    y: track.energy * 100,
    name: track.name,
    artist: track.artist,
    mood: track.mood_category,
    popularity: track.popularity,
    danceability: track.danceability * 100,
    color: scatterColors[track.mood_category as keyof typeof scatterColors] || 
           moodColors[track.mood_category as keyof typeof moodColors] || '#CCCCCC',
  }));

  // Group data by mood for multiple scatter series
  const moodGroups = data.reduce((groups, track) => {
    const mood = track.mood;
    if (!groups[mood]) {
      groups[mood] = [];
    }
    groups[mood].push(track);
    return groups;
  }, {} as Record<string, typeof data>);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-white/20" />
          <XAxis
            type="number"
            dataKey="x"
            name="Valence"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: 'white' }}
            label={{ value: 'Valence (Positivity)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: 'white' } }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Energy"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: 'white' }}
            label={{ value: 'Energy', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'white' } }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.3)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20">
                    <div className="text-center">
                      <p className="font-bold text-white text-lg mb-1">{data.name}</p>
                      <p className="text-gray-300 text-sm mb-2">by {data.artist}</p>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-white/10 rounded-lg p-2">
                          <p className="text-xs text-gray-400">Valence</p>
                          <p className="text-white font-semibold">{data.x.toFixed(1)}%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2">
                          <p className="text-xs text-gray-400">Energy</p>
                          <p className="text-white font-semibold">{data.y.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 mb-2">
                        <p className="text-xs text-gray-400">Popularity</p>
                        <p className="text-white font-semibold">{data.popularity}/100</p>
                      </div>
                      <div 
                        className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: data.color }}
                      >
                        {data.mood}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {Object.entries(moodGroups).map(([mood, moodData]) => (
            <Scatter
              key={mood}
              name={mood}
              data={moodData}
              fill={scatterColors[mood as keyof typeof scatterColors] || 
                    moodColors[mood as keyof typeof moodColors] || '#CCCCCC'}
              fillOpacity={0.8}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
              animationBegin={0}
              animationDuration={1000}
              r={6}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
