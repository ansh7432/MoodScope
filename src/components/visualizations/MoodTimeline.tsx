'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Clock, TrendingUp } from 'lucide-react';
import type { Track } from '@/lib/types';

interface MoodTimelineProps {
  tracks: Track[];
  onTrackSelect?: (track: Track) => void;
}

interface TimelinePoint {
  index: number;
  trackName: string;
  artist: string;
  valence: number;
  energy: number;
  mood: number;
  duration: number;
  timestamp: number;
  track: Track;
}

export function MoodTimeline({ tracks, onTrackSelect }: MoodTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<'valence' | 'energy' | 'mood'>('mood');

  // Create timeline data
  const timelineData: TimelinePoint[] = useMemo(() => {
    let cumulativeTime = 0;
    return tracks.map((track, index) => {
      const point: TimelinePoint = {
        index,
        trackName: track.name.length > 20 ? track.name.substring(0, 20) + '...' : track.name,
        artist: track.artist,
        valence: track.valence * 100,
        energy: track.energy * 100,
        mood: track.mood_score * 100,
        duration: track.duration_ms || 180000, // Default 3 minutes if not available
        timestamp: cumulativeTime,
        track,
      };
      cumulativeTime += point.duration;
      return point;
    });
  }, [tracks]);

  const totalDuration = timelineData.reduce((sum, point) => sum + point.duration, 0);

  // Format time in MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get mood trend analysis
  const moodAnalysis = useMemo(() => {
    if (timelineData.length < 2) return null;

    const firstHalf = timelineData.slice(0, Math.floor(timelineData.length / 2));
    const secondHalf = timelineData.slice(Math.floor(timelineData.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, p) => sum + p.mood, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, p) => sum + p.mood, 0) / secondHalf.length;

    const trend = secondHalfAvg - firstHalfAvg;
    
    return {
      trend: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable',
      change: Math.abs(trend),
      firstHalf: firstHalfAvg,
      secondHalf: secondHalfAvg,
    };
  }, [timelineData]);

  // Auto-play functionality
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= timelineData.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000); // Move to next track every second for demo

    return () => clearInterval(interval);
  }, [isPlaying, timelineData.length]);

  const currentTrack = timelineData[currentIndex];
  const currentTime = currentTrack ? currentTrack.timestamp : 0;

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TimelinePoint; value: number }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3 text-white">
          <p className="font-semibold">{data.trackName}</p>
          <p className="text-sm text-white/70">{data.artist}</p>
          <p className="text-cyan-400">
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-xs text-white/50">Track #{data.index + 1}</p>
        </div>
      );
    }
    return null;
  };

  // Get color for selected metric
  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'valence': return '#10B981'; // Green
      case 'energy': return '#F59E0B'; // Amber
      case 'mood': return '#8B5CF6'; // Purple
      default: return '#8B5CF6';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-cyan-400" />
            <span>Interactive Mood Timeline</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setCurrentIndex(Math.min(timelineData.length - 1, currentIndex + 1))}
              disabled={currentIndex === timelineData.length - 1}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Selection */}
        <div className="flex space-x-2">
          {['mood', 'valence', 'energy'].map((metric) => (
            <Button
              key={metric}
              onClick={() => setSelectedMetric(metric as 'valence' | 'energy' | 'mood')}
              variant={selectedMetric === metric ? "default" : "ghost"}
              size="sm"
              className={selectedMetric === metric ? 
                "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" : 
                "text-white/70 hover:text-white"
              }
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </Button>
          ))}
        </div>

        {/* Timeline Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="index"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                tickFormatter={(value) => `#${value + 1}`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor(selectedMetric)}
                strokeWidth={2}
                fill="url(#moodGradient)"
                fillOpacity={0.4}
              />
              {/* Current track indicator */}
              {currentTrack && (
                <Line
                  type="monotone"
                  dataKey={() => null}
                  stroke="#60A5FA"
                  strokeWidth={3}
                  dot={false}
                  strokeDasharray="5 5"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current Track Info */}
        <AnimatePresence>
          {currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">Now Playing</h4>
                <span className="text-sm text-white/60">
                  Track {currentIndex + 1} of {timelineData.length}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-medium text-cyan-400 mb-1">{currentTrack.track.name}</p>
                  <p className="text-white/70 mb-3">{currentTrack.track.artist}</p>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-white/10 rounded">
                      <div className="text-green-400 font-semibold">{currentTrack.valence.toFixed(0)}%</div>
                      <div className="text-white/60 text-xs">Valence</div>
                    </div>
                    <div className="text-center p-2 bg-white/10 rounded">
                      <div className="text-yellow-400 font-semibold">{currentTrack.energy.toFixed(0)}%</div>
                      <div className="text-white/60 text-xs">Energy</div>
                    </div>
                    <div className="text-center p-2 bg-white/10 rounded">
                      <div className="text-purple-400 font-semibold">{currentTrack.mood.toFixed(0)}%</div>
                      <div className="text-white/60 text-xs">Mood</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60 mb-1">Playback Progress</div>
                    <div className="bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / timelineData.length) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/50 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                  </div>

                  {onTrackSelect && (
                    <Button
                      onClick={() => onTrackSelect(currentTrack.track)}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                    >
                      Select This Track
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Analysis */}
        {moodAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <h5 className="font-medium text-white">Mood Trend Analysis</h5>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-cyan-400">
                  {moodAnalysis.trend === 'improving' ? '📈' : 
                   moodAnalysis.trend === 'declining' ? '📉' : '➡️'}
                </div>
                <div className="text-white/70">
                  {moodAnalysis.trend === 'improving' ? 'Improving' : 
                   moodAnalysis.trend === 'declining' ? 'Declining' : 'Stable'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400">
                  {moodAnalysis.firstHalf.toFixed(1)}%
                </div>
                <div className="text-white/70">First Half Avg</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-400">
                  {moodAnalysis.secondHalf.toFixed(1)}%
                </div>
                <div className="text-white/70">Second Half Avg</div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
