'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, Heart, Activity, Brain, Sparkles, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Track } from '@/lib/types';

interface CriteriaRule {
  min?: number;
  max?: number;
  weight: number;
}

interface MoodCriteria {
  [feature: string]: CriteriaRule;
}

interface MoodTarget {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  criteria: MoodCriteria;
}

interface MoodBasedPlaylistGeneratorProps {
  allTracks: Track[];
  onPlaylistGenerated: (playlist: Track[], moodTarget: string) => void;
}

const moodTargets = [
  {
    id: 'energetic',
    name: 'High Energy Workout',
    description: 'Pump up tracks for exercise and motivation',
    icon: Zap,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500',
    criteria: {
      energy: { min: 0.7, weight: 0.4 },
      valence: { min: 0.6, weight: 0.3 },
      danceability: { min: 0.6, weight: 0.3 },
    } as MoodCriteria
  },
  {
    id: 'chill',
    name: 'Chill & Relax',
    description: 'Calm vibes for unwinding and relaxation',
    icon: Heart,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    criteria: {
      energy: { max: 0.5, weight: 0.4 },
      valence: { min: 0.4, weight: 0.3 },
      acousticness: { min: 0.3, weight: 0.3 },
    } as MoodCriteria
  },
  {
    id: 'happy',
    name: 'Feel Good Vibes',
    description: 'Uplifting tracks to boost your mood',
    icon: Heart,
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    criteria: {
      valence: { min: 0.7, weight: 0.5 },
      energy: { min: 0.5, weight: 0.3 },
      popularity: { min: 30, weight: 0.2 },
    } as MoodCriteria
  },
  {
    id: 'focus',
    name: 'Focus & Study',
    description: 'Instrumental and ambient tracks for concentration',
    icon: Brain,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-500',
    criteria: {
      energy: { min: 0.3, max: 0.7, weight: 0.3 },
      valence: { min: 0.4, max: 0.8, weight: 0.2 },
      instrumentalness: { min: 0.1, weight: 0.3 },
      speechiness: { max: 0.3, weight: 0.2 },
    } as MoodCriteria
  },
  {
    id: 'dance',
    name: 'Dance Party',
    description: 'High-danceability tracks perfect for moving',
    icon: Activity,
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    criteria: {
      danceability: { min: 0.7, weight: 0.5 },
      energy: { min: 0.6, weight: 0.3 },
      valence: { min: 0.5, weight: 0.2 },
    } as MoodCriteria
  },
  {
    id: 'discovery',
    name: 'Hidden Gems',
    description: 'Lesser-known tracks with unique character',
    icon: Sparkles,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-teal-500',
    criteria: {
      popularity: { max: 40, weight: 0.4 },
      valence: { min: 0.3, weight: 0.3 },
      energy: { min: 0.3, weight: 0.3 },
    } as MoodCriteria
  },
] as const;

export function MoodBasedPlaylistGenerator({ allTracks, onPlaylistGenerated }: MoodBasedPlaylistGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Track[] | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const scoreTrack = (track: Track, criteria: MoodCriteria): number => {
    let score = 0;
    let totalWeight = 0;

    Object.entries(criteria).forEach(([feature, rules]: [string, CriteriaRule]) => {
      const trackValue = (track as unknown as Record<string, number>)[feature] || 0;
      const weight = rules.weight || 0;
      totalWeight += weight;

      let featureScore = 1; // Default perfect score

      // Check minimum criteria
      if (rules.min !== undefined && trackValue < rules.min) {
        featureScore = Math.max(0, trackValue / rules.min);
      }

      // Check maximum criteria
      if (rules.max !== undefined && trackValue > rules.max) {
        featureScore = Math.max(0, (1 - trackValue) / (1 - rules.max));
      }

      // For ranges (both min and max)
      if (rules.min !== undefined && rules.max !== undefined) {
        if (trackValue >= rules.min && trackValue <= rules.max) {
          featureScore = 1;
        } else if (trackValue < rules.min) {
          featureScore = trackValue / rules.min;
        } else {
          featureScore = (1 - trackValue) / (1 - rules.max);
        }
      }

      score += featureScore * weight;
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  };

  const generatePlaylist = async (moodTarget: MoodTarget) => {
    console.log('🎵 Generating playlist for:', moodTarget.name);
    console.log('📊 Available tracks:', allTracks.length);
    
    setIsGenerating(true);
    setSelectedMood(moodTarget.id);

    try {
      // Simulate generation time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (allTracks.length === 0) {
        console.log('❌ No tracks available for playlist generation');
        alert('No tracks available! Please analyze a playlist first.');
        return;
      }

      // Score all tracks against the mood criteria
      console.log('🔄 Scoring tracks against criteria:', moodTarget.criteria);
      
      const scoredTracks = allTracks.map(track => {
        const score = scoreTrack(track, moodTarget.criteria);
        console.log(`Track: "${track.name}" by ${track.artist} → Score: ${score.toFixed(3)}`);
        return {
          track,
          score,
        };
      });

      // Sort by score and take top tracks
      const sortedTracks = scoredTracks
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(15, Math.ceil(allTracks.length * 0.7))); // Take up to 15 tracks or 70% of available

      console.log('🏆 Top scoring tracks:', sortedTracks.map(t => `${t.track.name} (${t.score.toFixed(3)})`));

      if (sortedTracks.length === 0) {
        console.log('❌ No tracks met the criteria');
        alert(`No tracks in your playlist match the "${moodTarget.name}" criteria. Try a different mood!`);
        return;
      }

      // Add some randomness to avoid always getting the same playlist
      const topTracks = sortedTracks.slice(0, Math.ceil(sortedTracks.length * 0.8));
      const randomizedTracks = topTracks
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(12, topTracks.length));

      const playlist = randomizedTracks.map(item => item.track);
      
      console.log('✅ Generated playlist:', playlist.map(t => `${t.name} by ${t.artist}`));
      
      // Set the generated playlist and show it
      setGeneratedPlaylist(playlist);
      setShowPlaylist(true);
      onPlaylistGenerated(playlist, moodTarget.name);
      
      // Show success notification
      alert(`🎉 Generated "${moodTarget.name}" playlist with ${playlist.length} tracks! Check the results below.`);
      
    } catch (error) {
      console.error('❌ Error generating playlist:', error);
      alert('Error generating playlist. Please try again.');
    } finally {
      setIsGenerating(false);
      setSelectedMood(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
          <Music className="h-6 w-6 text-cyan-400" />
          <span>Generate Mood-Based Playlists</span>
        </h3>
        <p className="text-white/70">
          Create curated playlists from your analyzed tracks based on different moods and activities
        </p>
        {/* Debug Info */}
        <div className="mt-2 text-sm text-white/50">
          Available tracks: {allTracks.length} | Ready: {allTracks.length > 0 ? '✅' : '❌'}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moodTargets.map((mood) => (
          <motion.div
            key={mood.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${mood.gradient}`}>
                    <mood.icon className="h-5 w-5 text-white" />
                  </div>
                  <span>{mood.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70 text-sm">{mood.description}</p>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-white/80">Criteria:</h5>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(mood.criteria).map(([feature, rules]: [string, CriteriaRule]) => (
                      <span
                        key={feature}
                        className="inline-block px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
                      >
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        {rules.min && ` ≥${(rules.min * 100).toFixed(0)}%`}
                        {rules.max && ` ≤${(rules.max * 100).toFixed(0)}%`}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    console.log('🎯 Button clicked for mood:', mood.name);
                    console.log('📊 Available tracks for generation:', allTracks.length);
                    generatePlaylist(mood);
                  }}
                  disabled={isGenerating || allTracks.length === 0}
                  className={`w-full bg-gradient-to-r ${mood.gradient} hover:opacity-90 text-white transition-all`}
                >
                  {isGenerating && selectedMood === mood.id ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Generate Playlist</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {allTracks.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Analyze a playlist first to generate mood-based playlists!</p>
        </div>
      )}

      {/* Generated Playlist Display */}
      {showPlaylist && generatedPlaylist && generatedPlaylist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span>Generated Playlist ({generatedPlaylist.length} tracks)</span>
            </h4>
            <Button
              onClick={() => setShowPlaylist(false)}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
            >
              ✕
            </Button>
          </div>
          
          <div className="grid gap-2">
            {generatedPlaylist.map((track, index) => (
              <div
                key={track.id || index}
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.name}</p>
                  <p className="text-white/70 text-sm truncate">{track.artist}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-purple-400">
                    {(track.mood_score * 100).toFixed(0)}% mood
                  </span>
                  <span className="text-yellow-400">
                    {(track.energy * 100).toFixed(0)}% energy
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm">
              💡 This playlist was generated based on the musical characteristics of your analyzed tracks!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
