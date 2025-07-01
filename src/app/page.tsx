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
import { moodScopeAPI } from '@/lib/api';
import { analysisStorage, type StoredAnalysis } from '@/lib/storage';
import type { AnalysisResult, ApiError } from '@/lib/types';

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<StoredAnalysis[]>([]);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'history' | 'favorites' | 'compare' | 'export' | 'visualizations' | 'ai-features'>('history');

  // Load analysis history on component mount
  useEffect(() => {
    setAnalysisHistory(analysisStorage.getHistory());
  }, []);

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
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const demoResult = await moodScopeAPI.getDemoAnalysis();
      setResult(demoResult);
      
      // Save demo analysis with proper name
      const playlistName = demoResult.playlist_name || 'Demo Analysis';
      const savedAnalysis = analysisStorage.saveAnalysis('demo', demoResult, playlistName);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <PlaylistInput onAnalyze={handleAnalyze} onDemo={handleDemo} isLoading={isLoading} />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-4 text-center">
              <p className="text-red-200 font-medium">
                ❌ {error}
              </p>
              <p className="text-red-300/70 text-sm mt-2">
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
              <button
                onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {showAdvancedAnalytics ? 'Hide' : 'Show'} Advanced Analytics
              </button>
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

        {!result && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center space-y-8"
          >
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon="🎭"
                title="Mood Analysis"
                description="AI-powered analysis of your playlist's emotional landscape"
              />
              <FeatureCard
                icon="📊"
                title="Interactive Charts"
                description="Beautiful visualizations of your music's audio features"
              />
              <FeatureCard
                icon="🧠"
                title="Personalized Insights"
                description="Get tailored recommendations and psychological insights"
              />
            </div>
          </motion.div>
        )}
      </main>

      <footer className="text-center py-8 text-white/50">
        <p>Made with ❤️ for music lovers • Powered by AI & Spotify</p>
      </footer>

      {/* Music Terms Glossary */}
      <MusicTermsGlossary />
      
      {/* Advanced Dashboard Button */}
      {analysisHistory.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowAdvancedDashboard(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </motion.button>
      )}

      {/* Advanced Dashboard Modal */}
      {showAdvancedDashboard && (
        <AdvancedDashboard
          currentAnalysis={result || undefined}
          onClose={() => setShowAdvancedDashboard(false)}
          initialTab={dashboardTab}
        />
      )}
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
}
