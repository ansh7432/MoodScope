'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { PlaylistInput } from '@/components/PlaylistInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { MoodTrendsChart } from '@/components/charts/MoodTrendsChart';
import { MusicTermsGlossary } from '@/components/MusicTermsGlossary';
import { AdvancedDashboard } from '@/components/AdvancedDashboard';
import { DemoSelector } from '@/components/DemoSelector';
import { moodScopeAPI } from '@/lib/api';
import { analysisStorage, type StoredAnalysis } from '@/lib/storage';
import type { AnalysisResult, ApiError } from '@/lib/types';
import { Trash2, Music, Brain, BarChart3 } from 'lucide-react';

// Pre-defined particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { x: 25, y: 15 }, { x: 75, y: 85 }, { x: 45, y: 55 }, { x: 85, y: 25 },
  { x: 15, y: 75 }, { x: 65, y: 35 }, { x: 35, y: 65 }, { x: 55, y: 45 },
  { x: 95, y: 5 }, { x: 5, y: 95 }, { x: 80, y: 70 }, { x: 20, y: 30 },
  { x: 70, y: 20 }, { x: 30, y: 80 }, { x: 60, y: 10 }, { x: 40, y: 90 }
];

// Pre-defined particle animations to avoid hydration issues
const staticParticles = PARTICLE_POSITIONS.map((pos, i) => ({
  x: pos.x,
  y: pos.y,
  duration: 2 + (i % 3),
  delay: (i % 4) * 0.5
}));

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<StoredAnalysis[]>([]);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Load analysis history on component mount
  useEffect(() => {
    setAnalysisHistory(analysisStorage.getHistory());
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all analysis history? This action cannot be undone.')) {
      analysisStorage.clearHistory();
      setAnalysisHistory([]);
    }
  };

  const handleAnalyze = async (playlistUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await moodScopeAPI.analyzePlaylist(playlistUrl);
      setResult(analysisResult);
      
      // Save to analysis history with better naming
      const isDemoData = analysisResult.ai_insights?.emotional_analysis?.includes('demo analysis') || 
                        analysisResult.ai_insights?.emotional_analysis?.includes('This is a demo analysis');
      
      let playlistName: string;
      if (analysisResult.playlist_name) {
        playlistName = analysisResult.playlist_name;
      } else if (isDemoData) {
        playlistName = 'Demo Analysis';
      } else {
        // Extract a better name from the URL
        const urlMatch = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
        if (urlMatch) {
          playlistName = `Spotify Playlist ${urlMatch[1].substring(0, 8)}`;
        } else {
          playlistName = 'My Playlist';
        }
      }
      
      const savedAnalysis = analysisStorage.saveAnalysis(playlistUrl, analysisResult, playlistName);
      setAnalysisHistory(prev => [savedAnalysis, ...prev]);
    } catch (err) {
      const apiError = err as ApiError;
      let errorMessage = 'Failed to analyze playlist. Please try again.';
      
      if (apiError.message?.includes('timeout')) {
        errorMessage = 'Analysis timed out. The playlist might be too large or the server is busy. Please try a smaller playlist or try again later.';
      } else if (apiError.message?.includes('404') || apiError.message?.includes('not found')) {
        errorMessage = 'Playlist not found. Make sure the playlist is public and the URL is correct. You can also try our demo mode below.';
      } else if (apiError.message?.includes('403') || apiError.message?.includes('private')) {
        errorMessage = 'This playlist appears to be private. Please make sure the playlist is public, or try our demo mode.';
      }
      
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setShowDemoSelector(true);
  };

  const handleDemoSelection = async (demoType: string) => {
    setShowDemoSelector(false);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const demoResult = await moodScopeAPI.getDemoAnalysis(demoType);
      setResult(demoResult);
      
      // Save demo analysis with proper name
      const playlistName = demoResult.playlist_name || `Demo: ${demoType}`;
      const savedAnalysis = analysisStorage.saveAnalysis(`demo-${demoType}`, demoResult, playlistName);
      setAnalysisHistory(prev => [savedAnalysis, ...prev]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load demo analysis. Please try again.');
      console.error('Demo error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-950 to-black"></div>
        
        {/* Enhanced floating blobs with better colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/15 to-cyan-600/15 rounded-full mix-blend-screen filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/15 to-purple-600/15 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {staticParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: particle.duration + 1,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <Header 
        onShowAdvancedAnalytics={() => setShowAdvancedDashboard(true)}
        hasAnalysisData={analysisHistory.length > 0 || result !== null}
      />
      
      <main className="relative z-10 pt-32">
        {/* Hero Section - More Compact */}
        <section id="analyze" className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 relative"
          >
            {/* Animated Background Glow */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            />
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 relative z-10"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-block"
              >
                Discover Your Music&apos;s{' '}
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 relative inline-block"
              >
                <motion.span
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_100%]"
                  style={{ backgroundSize: '200% 100%' }}
                >
                  Emotional DNA
                </motion.span>
                
                {/* Sparkle Effects */}
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1,
                  }}
                  className="absolute -top-2 -right-2 text-yellow-400 text-2xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 2,
                  }}
                  className="absolute -bottom-2 -left-2 text-cyan-400 text-xl"
                >
                  💫
                </motion.div>
              </motion.span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="inline-block"
              >
                Analyze emotional patterns and mood distributions in your Spotify playlists with{' '}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="text-purple-400 font-semibold"
              >
                AI insights
              </motion.span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                className="inline-block ml-1"
              >
                🧠
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Compact Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {[
              { icon: <Music className="w-5 h-5" />, title: "Music Analysis", color: "from-cyan-500/20 to-blue-500/20", borderColor: "border-cyan-400/30" },
              { icon: <Brain className="w-5 h-5" />, title: "AI Insights", color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-400/30" },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Visualizations", color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-400/30" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className={`flex items-center space-x-2 bg-gradient-to-r ${feature.color} backdrop-blur-xl border ${feature.borderColor} rounded-full px-6 py-3 hover:shadow-lg transition-all cursor-pointer`}
              >
                <motion.div 
                  className="text-cyan-400"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <span className="text-white text-sm font-medium">{feature.title}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Analysis Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative group">
              {/* Card background with glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/25 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-500"></div>
              
              <div className="relative bg-gray-950/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <PlaylistInput onAnalyze={handleAnalyze} onDemo={handleDemo} isLoading={isLoading} />
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto mt-6"
            >
              <div className="bg-red-950/40 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">🚨</div>
                <p className="text-red-200 font-semibold mb-1">Analysis Error</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Results Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8"
            >
              <AnalysisResults result={result} />
            </motion.div>
          )}
        </section>

        {/* Compact Dashboard and Analysis Tools - Only show if there's data */}
        {(analysisHistory.length > 0 || result) && (
          <section className="container mx-auto px-6 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Analysis History - Compact View */}
              {analysisHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-950/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Analyses ({analysisHistory.length})</h3>
                    <button
                      onClick={clearHistory}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {analysisHistory.slice(0, 5).map((analysis) => (
                      <div
                        key={analysis.id}
                        className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:border-cyan-400/30 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-white text-sm">{analysis.playlistName || 'My Playlist'}</h5>
                            <p className="text-xs text-gray-400">{new Date(analysis.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div className="text-xs text-cyan-400">
                            {analysis.result.tracks?.length || 0} tracks
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Mood Trends Chart - Compact */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-950/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Mood Trends</h3>
                  <MoodTrendsChart data={result.tracks?.map((track, index) => ({
                    date: `Track ${index + 1}`,
                    moodScore: track.valence || 0,
                    energy: track.energy || 0,
                    valence: track.valence || 0
                  })) || []} />
                </motion.div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Floating Music Terms Glossary */}
      <MusicTermsGlossary />

      {/* Demo Selector Modal */}
      {showDemoSelector && (
        <DemoSelector
          isOpen={showDemoSelector}
          onSelect={handleDemoSelection}
          onClose={() => setShowDemoSelector(false)}
        />
      )}

      {/* Advanced Dashboard Modal */}
      {showAdvancedDashboard && (
        <AdvancedDashboard 
          currentAnalysis={result || undefined}
          onClose={() => setShowAdvancedDashboard(false)}
          initialTab="history"
        />
      )}
    </div>
  );
}
