'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Music, Heart, Zap, Activity, Mic, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const musicTerms = [
  {
    term: 'Valence',
    icon: Heart,
    color: 'text-green-400',
    definition: 'Musical positivity and emotional tone',
    explanation: 'Measures how positive, happy, euphoric (high valence) or negative, sad, angry (low valence) a track sounds. Range: 0.0 to 1.0',
    examples: {
      high: 'Happy pop songs, upbeat dance tracks',
      low: 'Sad ballads, melancholic indie songs'
    }
  },
  {
    term: 'Energy',
    icon: Zap,
    color: 'text-yellow-400',
    definition: 'Perceptual measure of intensity and power',
    explanation: 'Represents how fast, loud, and noisy a track feels. High energy tracks feel energetic and intense. Range: 0.0 to 1.0',
    examples: {
      high: 'Death metal, fast electronic dance music',
      low: 'Lullabies, ambient music'
    }
  },
  {
    term: 'Danceability',
    icon: Activity,
    color: 'text-cyan-400',
    definition: 'How suitable a track is for dancing',
    explanation: 'Based on tempo, rhythm stability, beat strength, and overall regularity. Range: 0.0 to 1.0',
    examples: {
      high: 'House music, disco, hip-hop',
      low: 'Classical music, folk ballads'
    }
  },
  {
    term: 'Popularity',
    icon: Music,
    color: 'text-pink-400',
    definition: 'How popular the track is on Spotify',
    explanation: 'Based on recent play counts and user interactions. More popular tracks get higher scores. Range: 0 to 100',
    examples: {
      high: 'Chart-topping hits, viral songs',
      low: 'Underground tracks, new releases'
    }
  },
  {
    term: 'Acousticness',
    icon: Volume2,
    color: 'text-orange-400',
    definition: 'Likelihood that the track is acoustic',
    explanation: 'Confidence measure of whether the track contains acoustic instruments. Range: 0.0 to 1.0',
    examples: {
      high: 'Acoustic guitar songs, unplugged versions',
      low: 'Electronic music, heavily produced tracks'
    }
  },
  {
    term: 'Speechiness',
    icon: Mic,
    color: 'text-purple-400',
    definition: 'Presence of spoken words in the track',
    explanation: 'Detects spoken words like rap, talk shows, poetry. Values above 0.66 are mostly speech. Range: 0.0 to 1.0',
    examples: {
      high: 'Rap music, podcasts, spoken word',
      low: 'Instrumental music, wordless vocals'
    }
  },
];

export function MusicTermsGlossary() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Info Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-40 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <Info className="h-4 w-4 mr-2" />
        Music Terms
      </Button>

      {/* Glossary Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-gray-900/95 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-2xl">
                      <Music className="h-6 w-6 text-cyan-400" />
                      <span>Music Terms Glossary</span>
                    </CardTitle>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-gray-300 mt-2">
                    Understanding the musical features used in MoodScope analysis
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {musicTerms.map((term, index) => (
                      <motion.div
                        key={term.term}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 ${term.color}`}>
                            <term.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {term.term}
                            </h3>
                            <p className={`text-sm font-medium mb-2 ${term.color}`}>
                              {term.definition}
                            </p>
                            <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                              {term.explanation}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start space-x-2">
                                <span className="text-green-400 text-xs font-medium min-w-[40px]">
                                  HIGH:
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {term.examples.high}
                                </span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-red-400 text-xs font-medium min-w-[40px]">
                                  LOW:
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {term.examples.low}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      💡 How to Read the Charts
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <h5 className="font-medium text-white mb-1">Radar Chart:</h5>
                        <p>Shows your playlist&apos;s average values for each audio feature. Larger areas indicate higher values.</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-1">Scatter Plot:</h5>
                        <p>Maps tracks by Valence (x-axis) vs Energy (y-axis). Each dot represents one track, colored by mood.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
