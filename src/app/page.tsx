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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {staticParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-12 space-y-16 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-8 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 leading-tight">
              Discover the{' '}
              <motion.span
                className="inline-block"
                animate={{ 
                  backgroundPosition: ['0%', '100%'],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                style={{
                  backgroundImage: 'linear-gradient(45deg, #3b82f6, #1e40af, #6366f1, #3b82f6)',
                  backgroundSize: '300% 300%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Emotional Soul
              </motion.span>
              {' '}of Your Music
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Unlock deep insights into your musical preferences with our AI-powered analysis. 
              Transform your playlists into psychological profiles and discover what your music says about you.
            </p>
          </motion.div>
        </motion.section>

        {/* Main Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <PlaylistInput onAnalyze={handleAnalyze} onDemo={handleDemo} isLoading={isLoading} />
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🚨</div>
              <p className="text-red-200 font-medium text-lg mb-2">
                {error}
              </p>
              <p className="text-red-300/70 text-sm">
                Make sure the playlist is public and try again, or use our demo mode.
              </p>
            </div>
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
            {/* Toggle Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all transform shadow-2xl hover:shadow-cyan-500/25"
              >
                <span className="flex items-center space-x-2">
                  <span>{showAdvancedAnalytics ? 'Hide' : 'Show'} Advanced Analytics</span>
                  <motion.span
                    animate={{ rotate: showAdvancedAnalytics ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ⬇️
                  </motion.span>
                </span>
              </motion.button>
            </div>

            {/* Advanced Analytics Content */}
            {showAdvancedAnalytics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Mood Trends Over Time */}
                <MoodTrendsChart data={analysisStorage.getMoodTrends()} />
                
                {/* Analysis Comparison */}
                <AnalysisComparison analyses={analysisHistory} />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Features Showcase */}
        {!result && !isLoading && !error && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-12"
          >
            {/* Feature Cards Grid */}
            <div className="max-w-6xl mx-auto">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
              >
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">MoodScope</span>?
              </motion.h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon="🎭"
                  title="AI Mood Analysis"
                  description="Advanced machine learning algorithms analyze emotional patterns in your music, providing deep psychological insights."
                  delay={0.1}
                />
                <FeatureCard
                  icon="📊"
                  title="Interactive Visualizations"
                  description="Beautiful, responsive charts and graphs that bring your music data to life with stunning visual representations."
                  delay={0.2}
                />
                <FeatureCard
                  icon="🧠"
                  title="Personalized Insights"
                  description="Get tailored recommendations, personality analysis, and mood coaching based on your unique musical preferences."
                  delay={0.3}
                />
              </div>
            </div>

            {/* Technology Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">Powered by Advanced Technology</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: '🤖', name: 'Machine Learning', color: 'from-blue-400 to-cyan-400' },
                    { icon: '🎵', name: 'Spotify API', color: 'from-green-400 to-emerald-400' },
                    { icon: '⚡', name: 'Real-time Analysis', color: 'from-yellow-400 to-orange-400' },
                    { icon: '🎨', name: 'Data Visualization', color: 'from-purple-400 to-pink-400' }
                  ].map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-4xl mb-3">{tech.icon}</div>
                      <div className={`text-lg font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                        {tech.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-20">
        <div className="bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h5 className="text-xl font-bold text-white mb-4">MoodScope</h5>
                <p className="text-slate-400">
                  Revolutionizing music analysis with AI-powered emotional intelligence.
                </p>
              </div>
              <div>
                <h6 className="text-lg font-semibold text-white mb-4">Features</h6>
                <ul className="space-y-2 text-slate-400">
                  <li>Mood Analysis</li>
                  <li>Personality Insights</li>
                  <li>Visual Analytics</li>
                  <li>Trend Tracking</li>
                </ul>
              </div>
              <div>
                <h6 className="text-lg font-semibold text-white mb-4">Technology</h6>
                <ul className="space-y-2 text-slate-400">
                  <li>Spotify Web API</li>
                  <li>Machine Learning</li>
                  <li>React & Next.js</li>
                  <li>Real-time Processing</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-slate-400">
                Made with ❤️ for music lovers • Powered by AI & Spotify • © 2025 MoodScope
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Music Terms Glossary */}
      <MusicTermsGlossary />
      
      {/* Advanced Dashboard Button */}
      {analysisHistory.length > 0 && (
        <>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAdvancedDashboard(true)}
            className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white p-4 rounded-full shadow-2xl transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.button>
          
          {/* Clear History Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearHistory}
            className="fixed bottom-6 left-20 z-40 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl transition-all"
            title="Clear Analysis History"
          >
            <Trash2 className="w-6 h-6" />
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      className="group bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-500 text-white relative overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="relative z-10">
        <motion.div 
          className="text-6xl mb-6 inline-block"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          {title}
        </h3>
        <p className="text-slate-300 leading-relaxed text-lg">{description}</p>
      </div>

      {/* Professional glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
    </motion.div>
  );
}
