'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodTrendsData {
  date: string;
  moodScore: number;
  energy: number;
  valence: number;
}

interface MoodTrendsChartProps {
  data: MoodTrendsData[];
}

export function MoodTrendsChart({ data }: MoodTrendsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="h-5 w-5" />
            <span>Mood Trends Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-white/70 py-8">
            <p>No historical data available yet.</p>
            <p className="text-sm mt-2">Analyze more playlists to see your mood trends!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span>Mood Trends Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number, name: string) => [
                    `${(value * 100).toFixed(1)}%`,
                    name === 'moodScore' ? 'Mood Score' :
                    name === 'energy' ? 'Energy' : 'Valence'
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="Mood Score"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  name="Energy"
                />
                <Line
                  type="monotone"
                  dataKey="valence"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Valence"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-white/80">Mood Score</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Overall emotional tone</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-white/80">Energy</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Musical intensity</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/80">Valence</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Positivity level</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
