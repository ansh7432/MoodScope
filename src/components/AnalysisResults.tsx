'use client';

import { motion } from 'framer-motion';
import { Music, Brain, TrendingUp, Users, Sparkles, Boxes } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodDistributionChart } from '@/components/charts/MoodDistributionChart';
import { AudioFeaturesRadar } from '@/components/charts/AudioFeaturesRadar';
import { ValenceEnergyScatter } from '@/components/charts/ValenceEnergyScatter';
import { TrackDetailsCard } from '@/components/TrackDetailsCard';
import { MoodBasedPlaylistGenerator } from '@/components/MoodBasedPlaylistGenerator';
import { formatMoodScore, getMoodEmoji } from '@/lib/utils';
import type { AnalysisResult, Track } from '@/lib/types';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onOpenAdvancedVisualizations?: () => void;
  onOpenAIFeatures?: () => void;
}

export function AnalysisResults({ result, onOpenAdvancedVisualizations, onOpenAIFeatures }: AnalysisResultsProps) {
  const { tracks, mood_summary, ai_insights } = result;
  
  const handlePlaylistGenerated = (playlist: Track[], moodTarget: string) => {
    console.log('🎵 Playlist generated in parent component:');
    console.log(`📊 Target: ${moodTarget}`);
    console.log(`🎯 Tracks: ${playlist.length}`);
    console.log('🎼 Playlist:', playlist.map(t => `${t.name} by ${t.artist}`));
    
    // You could add notification or modal to show the generated playlist
    alert(`✅ Successfully generated "${moodTarget}" playlist with ${playlist.length} tracks!`);
  };

  // Check if this is demo/fallback data
  const isDemoData =
    ai_insights?.emotional_analysis?.includes('demo analysis') ||
    ai_insights?.emotional_analysis?.includes('This is a demo analysis');

  const stats = [
    {
      label: 'Total Tracks',
      value: mood_summary.total_tracks,
      icon: Music,
      color: 'text-cyan-400',
    },
    {
      label: 'Mood Score',
      value: `${formatMoodScore(mood_summary.mood_score)}%`,
      icon: Brain,
      color: 'text-purple-400',
    },
    {
      label: 'Energy Level',
      value: `${formatMoodScore(mood_summary.avg_energy)}%`,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Popularity',
      value: `${mood_summary.avg_popularity.toFixed(0)}/100`,
      icon: Users,
      color: 'text-pink-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full space-y-8"
    >
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center space-x-3 bg-green-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-green-400/30">
          <Sparkles className="h-5 w-5 text-green-400" />
          <span className="text-white font-semibold">
            Analysis Complete! {tracks.length} tracks analyzed
          </span>
        </div>
        
        {/* Advanced Features Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {onOpenAdvancedVisualizations && (
            <Button
              onClick={onOpenAdvancedVisualizations}
              variant="outline"
              className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 border-cyan-400/30 text-white hover:text-white transition-all"
            >
              <Boxes className="h-4 w-4 mr-2" />
              3D Visualizations
            </Button>
          )}
          {onOpenAIFeatures && (
            <Button
              onClick={onOpenAIFeatures}
              variant="outline" 
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border-purple-400/30 text-white hover:text-white transition-all"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Features
            </Button>
          )}
        </div>
      </motion.div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dominant Mood Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl">
                {getMoodEmoji(mood_summary.dominant_mood)}
              </span>
              <div>
                <h3 className="text-xl font-semibold">Dominant Mood</h3>
                <p className="text-2xl font-bold text-purple-300">
                  {mood_summary.dominant_mood}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visualizations */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Music className="h-5 w-5 text-cyan-400" />
                <span>Mood Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MoodDistributionChart moodSummary={mood_summary} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <span>Audio Features Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AudioFeaturesRadar moodSummary={mood_summary} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Valence vs Energy Scatter */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Valence vs Energy Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ValenceEnergyScatter tracks={tracks} />
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      {ai_insights && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-cyan-300">
                  Emotional Analysis
                </h4>
                <p className="text-white/90 leading-relaxed">
                  {ai_insights.emotional_analysis}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2 text-purple-300">
                  Personality Traits
                </h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {ai_insights.personality_traits.map((trait, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-white/10 rounded-lg p-2"
                    >
                      <span className="text-yellow-400">✨</span>
                      <span className="text-sm">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2 text-green-300">
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {ai_insights.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 bg-white/5 rounded-lg p-3"
                    >
                      <span className="text-green-400 mt-0.5">💡</span>
                      <span className="text-sm text-white/90">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2 text-pink-300">
                  Mood Coaching
                </h4>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/90 leading-relaxed">
                    {ai_insights.mood_coaching}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Track Details */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardContent className="p-6">
            <TrackDetailsCard tracks={tracks} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood-Based Playlist Generator */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardContent className="p-6">
            <MoodBasedPlaylistGenerator 
              allTracks={tracks} 
              onPlaylistGenerated={handlePlaylistGenerated}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Demo Data Notification */}
      {isDemoData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-yellow-200 text-sm">
                  <strong>Demo Mode:</strong> This is sample data showing MoodScope&apos;s capabilities. 
                  For real analysis, make sure your Spotify playlist is public and try again!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
