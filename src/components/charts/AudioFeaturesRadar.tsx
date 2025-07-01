'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { MoodSummary } from '@/lib/types';

// Audio feature descriptions for tooltips
const featureDescriptions = {
  'Energy': 'Perceptual measure of intensity and power (fast, loud, noisy tracks = high energy)',
  'Valence': 'Musical positivity (happy/euphoric vs sad/angry)',
  'Danceability': 'How suitable a track is for dancing (tempo, rhythm, beat strength)',
  'Acousticness': 'Confidence measure of whether the track is acoustic',
  'Speechiness': 'Presence of spoken words (rap, talk shows = high speechiness)',
  'Instrumentalness': 'Predicts whether a track contains no vocals',
} as const;

interface AudioFeaturesRadarProps {
  moodSummary: MoodSummary;
}

export function AudioFeaturesRadar({ moodSummary }: AudioFeaturesRadarProps) {
  const data = [
    {
      feature: 'Energy',
      value: moodSummary.avg_energy * 100,
      fullMark: 100,
      description: featureDescriptions['Energy'],
    },
    {
      feature: 'Valence',
      value: moodSummary.avg_valence * 100,
      fullMark: 100,
      description: featureDescriptions['Valence'],
    },
    {
      feature: 'Danceability',
      value: moodSummary.avg_danceability * 100,
      fullMark: 100,
      description: featureDescriptions['Danceability'],
    },
    {
      feature: 'Acousticness',
      value: moodSummary.avg_acousticness * 100,
      fullMark: 100,
      description: featureDescriptions['Acousticness'],
    },
    {
      feature: 'Speechiness',
      value: moodSummary.avg_speechiness * 100,
      fullMark: 100,
      description: featureDescriptions['Speechiness'],
    },
    {
      feature: 'Instrumentalness',
      value: moodSummary.avg_instrumentalness * 100,
      fullMark: 100,
      description: featureDescriptions['Instrumentalness'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid gridType="polygon" className="stroke-white/20" />
          <PolarAngleAxis 
            dataKey="feature" 
            className="fill-white text-sm"
            tick={{ fontSize: 12, fill: 'white' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            className="stroke-white/30"
            tick={{ fontSize: 10, fill: 'white/70' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20 max-w-xs">
                    <div className="text-center">
                      <p className="text-white font-bold text-lg mb-1">{data.feature}</p>
                      <p className="text-cyan-400 font-semibold text-xl mb-2">
                        {data.value.toFixed(1)}%
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {data.description}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Radar
            name="Audio Features"
            dataKey="value"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.4}
            strokeWidth={3}
            animationBegin={0}
            animationDuration={1000}
            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
