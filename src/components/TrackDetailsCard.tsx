'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Music, Clock, Users, Zap, Heart, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMoodScore, getMoodEmoji } from '@/lib/utils';
import type { Track } from '@/lib/types';
import { useState } from 'react';

interface TrackDetailsCardProps {
  tracks: Track[];
}

// Musical term definitions for tooltips
const musicTerms = {
  valence: "Musical positivity: How positive, happy, euphoric, or sad a track sounds (0.0 = negative/sad, 1.0 = positive/happy)",
  energy: "Perceptual measure of intensity and power: Fast, loud, noisy tracks feel more energetic (0.0 = low energy, 1.0 = high energy)",
  danceability: "How suitable a track is for dancing: Based on tempo, rhythm stability, beat strength (0.0 = not danceable, 1.0 = very danceable)",
  popularity: "How popular the track is on Spotify: Based on recent play counts and user interactions (0-100 scale)",
  mood_score: "Overall emotional tone: Combines valence, energy, and other audio features to determine the track's mood",
  acousticness: "Confidence measure of whether the track is acoustic: Higher values represent greater likelihood of acoustic instruments",
  intensity: "Emotional intensity: How emotionally intense or dramatic the track feels to listeners"
};

const TooltipWrapper = ({ term, children }: { term: keyof typeof musicTerms; children: React.ReactNode }) => (
  <div className="group/tooltip relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs border border-gray-700">
      <div className="text-center">
        <div className="font-semibold capitalize mb-1">{term.replace('_', ' ')}</div>
        <div className="text-gray-300">{musicTerms[term]}</div>
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export function TrackDetailsCard({ tracks }: TrackDetailsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;
  
  const displayedTracks = showAll ? tracks : tracks.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreTracks = tracks.length > INITIAL_DISPLAY_COUNT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
          <Music className="h-6 w-6 text-cyan-400" />
          <span>Track Details</span>
        </h3>
        <p className="text-white/70">
          Showing {displayedTracks.length} of {tracks.length} tracks
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {displayedTracks.map((track, index) => (
            <motion.div
              key={track.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-white/8 backdrop-blur-md border-white/20 text-white hover:bg-white/12 hover:border-cyan-400/30 transition-all duration-300 group h-full">
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Track Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {track.name}
                      </h4>
                      <p className="text-white/70 text-xs truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Track Meta Info */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                    {track.duration_ms && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {Math.floor(track.duration_ms / 60000)}:
                          {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="text-base">{getMoodEmoji(track.mood_category || 'Neutral')}</span>
                      <span className="text-xs">{track.mood_category}</span>
                    </div>
                  </div>

                  {/* Musical Features Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
                    <TooltipWrapper term="popularity">
                      <div className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-help border border-transparent hover:border-pink-400/30">
                        <Users className="h-4 w-4 text-pink-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-pink-400">
                          {track.popularity || 0}
                        </div>
                        <div className="text-xs text-white/60">Popularity</div>
                      </div>
                    </TooltipWrapper>

                    <TooltipWrapper term="valence">
                      <div className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-help border border-transparent hover:border-green-400/30">
                        <Heart className="h-4 w-4 text-green-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-green-400">
                          {formatMoodScore(track.valence)}%
                        </div>
                        <div className="text-xs text-white/60">Valence</div>
                      </div>
                    </TooltipWrapper>

                    <TooltipWrapper term="energy">
                      <div className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-help border border-transparent hover:border-yellow-400/30">
                        <Zap className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-yellow-400">
                          {formatMoodScore(track.energy)}%
                        </div>
                        <div className="text-xs text-white/60">Energy</div>
                      </div>
                    </TooltipWrapper>

                    <TooltipWrapper term="danceability">
                      <div className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-help border border-transparent hover:border-cyan-400/30">
                        <Activity className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-cyan-400">
                          {formatMoodScore(track.danceability || 0)}%
                        </div>
                        <div className="text-xs text-white/60">Dance</div>
                      </div>
                    </TooltipWrapper>
                  </div>

                  {/* Mood Score Bar */}
                  <div className="mt-auto">
                    <TooltipWrapper term="mood_score">
                      <div className="cursor-help">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-white/80">Mood Score</span>
                          <span className="text-sm font-bold text-purple-400">
                            {formatMoodScore(track.mood_score)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${track.mood_score * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </TooltipWrapper>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {hasMoreTracks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6"
        >
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show {tracks.length - INITIAL_DISPLAY_COUNT} More Tracks
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
