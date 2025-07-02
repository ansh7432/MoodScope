'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { PlaylistInput } from '@/components/PlaylistInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { MoodTrendsChart } from '@/components/charts/MoodTrendsChart';
import { AnalysisComparison } from '@/components/AnalysisComparison';
import { MusicTermsGlossary } from '@/components/MusicTermsGlossary';
import { AdvancedDashboard } from '@/components/AdvancedDashboard';
import { DemoSelector } from '@/components/DemoSelector';
import { moodScopeAPI } from '@/lib/api';
import { analysisStorage, type StoredAnalysis } from '@/lib/storage';
import type { AnalysisResult, ApiError } from '@/lib/types';
import { Trash2 } from 'lucide-react';

// Pre-defined particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { x: 25, y: 15 }, { x: 75, y: 85 }, { x: 45, y: 55 }, { x: 85, y: 25 },
  { x: 15, y: 75 }, { x: 65, y: 35 }, { x: 35, y: 65 }, { x: 55, y: 45 },
  { x: 95, y: 5 }, { x: 5, y: 95 }, { x: 80, y: 70 }, { x: 20, y: 30 },
  { x: 70, y: 20 }, { x: 30, y: 80 }, { x: 60, y: 10 }, { x: 40, y: 90 },
  { x: 90, y: 60 }, { x: 10, y: 40 }, { x: 50, y: 50 }, { x: 85, y: 75 }
];

// Pre-defined particle animations to avoid hydration issues
const staticParticles = PARTICLE_POSITIONS.map((pos, i) => ({
  x: pos.x,
  y: pos.y,
  duration: 2 + (i % 3), // Vary between 2-4 seconds
  delay: (i % 4) * 0.5    // Stagger delays: 0, 0.5, 1, 1.5 seconds
}));

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<StoredAnalysis[]>([]);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'history' | 'favorites' | 'compare' | 'export' | 'visualizations' | 'ai-features'>('history');
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Load analysis history on component mount
  useEffect(() => {
    setAnalysisHistory(analysisStorage.getHistory());
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all analysis history? This action cannot be undone.')) {
      analysisStorage.clearHistory();
      setAnalysisHistory([]);
      setShowAdvancedAnalytics(false);
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
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full mix-blend-screen filter blur-2xl animate-blob animation-delay-6000"></div>
        
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
        
        {/* Additional larger particles for depth */}
        {staticParticles.slice(0, 8).map((particle, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"
            initial={{
              x: `${(particle.x + 10) % 100}%`,
              y: `${(particle.y + 15) % 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.6, 0],
              scale: [0.3, 1.2, 0.3],
            }}
            transition={{
              duration: particle.duration + 2,
              repeat: Infinity,
              delay: particle.delay + 1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-12 space-y-16 relative z-10">
        {/* Enhanced Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center space-y-8 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8"
          >
            <motion.h2 
              className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 leading-tight tracking-tight"
              initial={{ backgroundPosition: '0%' }}
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #67e8f9, #3b82f6, #6366f1, #8b5cf6, #67e8f9)',
                backgroundSize: '200% 200%'
              }}
            >
              Discover the{' '}
              <motion.span
                className="inline-block relative"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  animate={{ 
                    backgroundPosition: ['0%', '100%'],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #06b6d4, #3b82f6, #6366f1, #8b5cf6, #06b6d4)',
                    backgroundSize: '300% 300%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Emotional Soul
                </motion.span>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl -z-10 opacity-50"></div>
              </motion.span>
              <br />
              of Your Music
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Unlock deep insights into your musical preferences with our{' '}
              <motion.span 
                className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                AI-powered analysis
              </motion.span>
              . Transform your playlists into psychological profiles and discover what your music reveals about your inner world.
            </motion.p>

            {/* Enhanced call-to-action badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { icon: "🎭", text: "Mood Analysis" },
                { icon: "🧠", text: "AI Insights" },
                { icon: "📊", text: "Data Visualization" }
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-full px-6 py-3 flex items-center space-x-2"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-gray-300 font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Enhanced Main Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative group"
        >
          {/* Enhanced background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/25 to-purple-600/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl"></div>
          
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
              backgroundSize: '200% 100%'
            }}
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="relative bg-gray-950/60 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-1">
            <PlaylistInput onAnalyze={handleAnalyze} onDemo={handleDemo} isLoading={isLoading} />
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <motion.div 
              className="bg-red-950/40 backdrop-blur-xl border border-red-400/30 rounded-2xl p-8 text-center relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-pink-600/5 -z-10"></div>
              
              <motion.div 
                className="text-5xl mb-6"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚨
              </motion.div>
              <p className="text-red-200 font-semibold text-xl mb-4">
                {error}
              </p>
              <p className="text-red-300/80 text-base">
                Make sure the playlist is public and try again, or use our demo mode.
              </p>
            </motion.div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnalysisResults 
              result={result} 
              onOpenAdvancedVisualizations={() => {
                setDashboardTab('visualizations');
                setShowAdvancedDashboard(true);
              }}
              onOpenAIFeatures={() => {
                setDashboardTab('ai-features');
                setShowAdvancedDashboard(true);
              }}
            />
          </motion.div>
        )}

        {/* Advanced Analytics Section */}
        {analysisHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Enhanced Toggle Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
                className="relative group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform shadow-2xl hover:shadow-cyan-500/30 overflow-hidden"
              >
                {/* Button background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl group-hover:blur-lg transition-all duration-300 -z-10"></div>
                
                {/* Button content */}
                <span className="relative flex items-center space-x-3">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: showAdvancedAnalytics ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    📊
                  </motion.span>
                  <span>{showAdvancedAnalytics ? 'Hide' : 'Show'} Advanced Analytics</span>
                  <motion.span
                    animate={{ rotate: showAdvancedAnalytics ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-xl"
                  >
                    ⬇️
                  </motion.span>
                </span>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'subtract'
                  }}
                  animate={{
                    backgroundPosition: ['200% 0%', '-200% 0%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.button>
            </div>

            {/* Enhanced Advanced Analytics Content */}
            {showAdvancedAnalytics && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-10"
              >
                {/* Enhanced container with better styling */}
                <div className="bg-gray-950/40 backdrop-blur-2xl border border-gray-700/30 rounded-3xl p-8 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '30px 30px'
                  }}></div>
                  
                  <div className="relative space-y-10">
                    {/* Enhanced Mood Trends */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <MoodTrendsChart data={analysisStorage.getMoodTrends()} />
                    </motion.div>
                    
                    {/* Enhanced Analysis Comparison */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <AnalysisComparison analyses={analysisHistory} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Enhanced Features Showcase */}
        {!result && !isLoading && !error && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-16"
          >
            {/* Enhanced Feature Cards Grid */}
            <div className="max-w-7xl mx-auto">
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-center text-white mb-16 tracking-tight"
              >
                Why Choose{' '}
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  MoodScope
                </motion.span>
                ?
              </motion.h3>
              
              <div className="grid md:grid-cols-3 gap-10">
                <FeatureCard
                  icon="🎭"
                  title="AI Mood Analysis"
                  description="Advanced machine learning algorithms analyze emotional patterns in your music, providing deep psychological insights that reveal your inner emotional landscape."
                  delay={0.1}
                />
                <FeatureCard
                  icon="📊"
                  title="Interactive Visualizations"
                  description="Beautiful, responsive charts and graphs that bring your music data to life with stunning visual representations and real-time analytics."
                  delay={0.2}
                />
                <FeatureCard
                  icon="🧠"
                  title="Personalized Insights"
                  description="Get tailored recommendations, personality analysis, and mood coaching based on your unique musical preferences and listening patterns."
                  delay={0.3}
                />
              </div>
            </div>

            {/* Enhanced Technology Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="max-w-6xl mx-auto"
            >
              <div className="relative group">
                {/* Enhanced background with multiple layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-slate-900/60 to-gray-900/60 backdrop-blur-2xl rounded-3xl border border-gray-700/30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-blue-600/10 to-purple-600/5 rounded-3xl"></div>
                
                {/* Animated border glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/30 via-blue-600/30 to-purple-600/30 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                
                <div className="relative p-10">
                  <motion.h4 
                    className="text-3xl md:text-4xl font-black text-white mb-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    Powered by{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      Advanced Technology
                    </span>
                  </motion.h4>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { icon: '🤖', name: 'Machine Learning', color: 'from-cyan-400 to-blue-400', bg: 'from-cyan-600/20 to-blue-600/20' },
                      { icon: '🎵', name: 'Spotify API', color: 'from-green-400 to-emerald-400', bg: 'from-green-600/20 to-emerald-600/20' },
                      { icon: '⚡', name: 'Real-time Analysis', color: 'from-yellow-400 to-orange-400', bg: 'from-yellow-600/20 to-orange-600/20' },
                      { icon: '🎨', name: 'Data Visualization', color: 'from-purple-400 to-pink-400', bg: 'from-purple-600/20 to-pink-600/20' }
                    ].map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="text-center group/tech"
                      >
                        <div className={`relative bg-gradient-to-br ${tech.bg} rounded-2xl p-6 border border-gray-600/30 group-hover/tech:border-gray-500/50 transition-all duration-300`}>
                          {/* Tech icon with enhanced animation */}
                          <motion.div 
                            className="text-5xl mb-4 inline-block"
                            whileHover={{ 
                              rotate: [0, -5, 5, 0], 
                              scale: 1.2,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {tech.icon}
                          </motion.div>
                          
                          <div className={`text-lg font-bold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                            {tech.name}
                          </div>

                          {/* Hover glow effect */}
                          <div className={`absolute -inset-1 bg-gradient-to-r ${tech.color} rounded-2xl blur opacity-0 group-hover/tech:opacity-30 transition-opacity duration-300 -z-10`}></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-24">
        <div className="bg-gradient-to-r from-gray-950/95 via-slate-950/95 to-gray-950/95 backdrop-blur-xl border-t border-gray-700/30">
          <div className="container mx-auto px-4 py-16">
            {/* Enhanced footer content */}
            <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h5 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                  MoodScope
                </h5>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Revolutionizing music analysis with AI-powered emotional intelligence and cutting-edge data visualization.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h6 className="text-xl font-bold text-white mb-6">Features</h6>
                <ul className="space-y-3 text-gray-400">
                  {['Mood Analysis', 'Personality Insights', 'Visual Analytics', 'Trend Tracking'].map((item, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5, color: '#60a5fa' }}
                      transition={{ duration: 0.2 }}
                      className="cursor-default"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h6 className="text-xl font-bold text-white mb-6">Technology</h6>
                <ul className="space-y-3 text-gray-400">
                  {['Spotify Web API', 'Machine Learning', 'React & Next.js', 'Real-time Processing'].map((item, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5, color: '#60a5fa' }}
                      transition={{ duration: 0.2 }}
                      className="cursor-default"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            {/* Enhanced footer bottom */}
            <motion.div 
              className="border-t border-gray-700/30 mt-12 pt-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 text-lg">
                Made with{' '}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-red-400"
                >
                  ❤️
                </motion.span>
                {' '}for music lovers • Powered by AI & Spotify • © 2025 MoodScope
              </p>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Music Terms Glossary */}
      <MusicTermsGlossary />
      
      {/* Enhanced Advanced Dashboard Button */}
      {analysisHistory.length > 0 && (
        <>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAdvancedDashboard(true)}
            className="fixed bottom-6 left-6 z-40 group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white p-5 rounded-full shadow-2xl transition-all duration-300"
          >
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            
            <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.button>
          
          {/* Enhanced Clear History Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearHistory}
            className="fixed bottom-6 left-24 z-40 group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white p-5 rounded-full shadow-2xl transition-all duration-300"
            title="Clear Analysis History"
          >
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            
            <Trash2 className="w-7 h-7 relative z-10" />
          </motion.button>
        </>
      )}

      {/* Advanced Dashboard Modal */}
      {showAdvancedDashboard && (
        <AdvancedDashboard
          currentAnalysis={result || undefined}
          onClose={() => setShowAdvancedDashboard(false)}
          initialTab={dashboardTab}
        />
      )}

      {/* Demo Selector Modal */}
      <DemoSelector
        isOpen={showDemoSelector}
        onClose={() => setShowDemoSelector(false)}
        onSelect={handleDemoSelection}
        isLoading={isLoading}
      />
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        rotateY: 5,
      }}
      whileTap={{ scale: 0.98 }}
      className="group bg-gray-950/50 backdrop-blur-2xl rounded-3xl p-10 border border-gray-700/40 hover:border-cyan-400/50 transition-all duration-500 text-white relative overflow-hidden"
      style={{ perspective: 1000 }}
    >
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-blue-600/10 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-3xl"></div>
      
      <div className="relative z-10">
        {/* Enhanced icon with multiple animation layers */}
        <motion.div 
          className="text-7xl mb-8 inline-block relative"
          whileHover={{ 
            rotate: [0, -8, 8, 0], 
            scale: 1.3,
            textShadow: "0 0 20px rgba(6, 182, 212, 0.5)"
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {icon}
          
          {/* Icon glow effect */}
          <motion.div
            className="absolute inset-0 text-7xl text-cyan-400/30 blur-sm"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        </motion.div>
        
        <motion.h3 
          className="text-2xl md:text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
        </motion.p>
      </div>

      {/* Enhanced professional glow effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 via-blue-600/30 to-indigo-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      {/* Animated border effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'subtract'
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        animate={{
          backgroundPosition: ['200% 0%', '-200% 0%']
        }}
        transition={{
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          },
          opacity: { duration: 0.3 }
        }}
      />

      {/* Corner accent */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
}
