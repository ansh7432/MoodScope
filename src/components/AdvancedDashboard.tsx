'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Star, 
  Share2, 
  Download, 
  Search, 
  TrendingUp,
  Music2,
  Clock,
  X,
  Boxes,
  Brain,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analysisStorage, type StoredAnalysis } from '@/lib/storage';
import { Mood3DVisualization } from '@/components/visualizations/Mood3DVisualization';
import { MoodTimeline } from '@/components/visualizations/MoodTimeline';
import { AudioFeaturesHeatmap } from '@/components/visualizations/AudioFeaturesHeatmap';
import { TrackNetworkGraph } from '@/components/visualizations/TrackNetworkGraph';
import AdvancedAIFeatures from '@/components/ai/AdvancedAIFeatures';
import type { AnalysisResult } from '@/lib/types';

interface AdvancedDashboardProps {
  currentAnalysis?: AnalysisResult;
  onClose: () => void;
  initialTab?: 'history' | 'favorites' | 'compare' | 'export' | 'visualizations' | 'ai-features';
}

export function AdvancedDashboard({ currentAnalysis, onClose, initialTab = 'history' }: AdvancedDashboardProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites' | 'compare' | 'export' | 'visualizations' | 'ai-features'>(initialTab);
  const [analysisHistory, setAnalysisHistory] = useState<StoredAnalysis[]>([]);
  const [favorites, setFavorites] = useState<StoredAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<StoredAnalysis[]>([]);
  const [activeVisualization, setActiveVisualization] = useState<'3d' | 'timeline' | 'heatmap' | 'network'>('3d');

  useEffect(() => {
    const history = analysisStorage.getHistory();
    const favs = analysisStorage.getFavorites();
    setAnalysisHistory(history);
    setFavorites(favs);
  }, []);

  const filteredHistory = analysisHistory.filter(analysis =>
    (analysis.playlistName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (analysis.result.ai_insights?.emotional_analysis || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToFavorites = (analysis: StoredAnalysis) => {
    analysisStorage.toggleFavorite(analysis.id);
    setAnalysisHistory(analysisStorage.getHistory());
    setFavorites(analysisStorage.getFavorites());
  };

  const removeFromFavorites = (analysisId: string) => {
    analysisStorage.toggleFavorite(analysisId);
    setAnalysisHistory(analysisStorage.getHistory());
    setFavorites(analysisStorage.getFavorites());
  };

  const toggleComparison = (analysis: StoredAnalysis) => {
    if (selectedForComparison.find(a => a.id === analysis.id)) {
      setSelectedForComparison(prev => prev.filter(a => a.id !== analysis.id));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, analysis]);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = currentAnalysis || (analysisHistory[0]?.result);
    if (!data) return;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moodscope-analysis-${Date.now()}.json`;
      a.click();
    } else {
      // CSV export for tracks
      const csv = [
        'Track,Artist,Mood Category,Mood Score,Valence,Energy,Danceability,Popularity',
        ...data.tracks.map(track => 
          `"${track.name}","${track.artist}","${track.mood_category}",${track.mood_score},${track.valence},${track.energy},${track.danceability},${track.popularity}`
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moodscope-tracks-${Date.now()}.csv`;
      a.click();
    }
  };

  const shareAnalysis = async () => {
    if (!currentAnalysis) return;
    
    const shareData = {
      title: `MoodScope Analysis: ${currentAnalysis.playlist_name || 'My Playlist'}`,
      text: `Check out my music mood analysis! Overall mood score: ${(currentAnalysis.mood_summary.mood_score * 100).toFixed(1)}%`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('Analysis details copied to clipboard!');
    }
  };

  const tabs = [
    { id: 'history', label: 'Analysis History', icon: Clock },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'visualizations', label: '3D Visualizations', icon: Boxes },
    { id: 'ai-features', label: 'AI Features', icon: Brain },
    { id: 'export', label: 'Export & Share', icon: Share2 },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-7xl h-[90vh] bg-gray-900/98 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/5 m-6 mb-0 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 pt-4">
            {/* Search Bar (for history and favorites) */}
            {(activeTab === 'history' || activeTab === 'favorites') && (
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Analysis History ({filteredHistory.length})
                  </h3>
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <Music2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No analyses found. Analyze a playlist to get started!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredHistory.slice(0, 10).map((analysis) => (
                        <AnalysisCard
                          key={analysis.id}
                          analysis={analysis}
                          onToggleFavorite={() => 
                            favorites.find(f => f.id === analysis.id)
                              ? removeFromFavorites(analysis.id)
                              : addToFavorites(analysis)
                          }
                          isFavorite={favorites.some(f => f.id === analysis.id)}
                          onToggleComparison={() => toggleComparison(analysis)}
                          isSelectedForComparison={selectedForComparison.some(a => a.id === analysis.id)}
                          canAddToComparison={selectedForComparison.length < 3}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'favorites' && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Favorite Analyses ({favorites.length})
                  </h3>
                  {favorites.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No favorites yet. Star some analyses to save them here!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {favorites.map((analysis) => (
                        <AnalysisCard
                          key={analysis.id}
                          analysis={analysis}
                          onToggleFavorite={() => removeFromFavorites(analysis.id)}
                          isFavorite={true}
                          onToggleComparison={() => toggleComparison(analysis)}
                          isSelectedForComparison={selectedForComparison.some(a => a.id === analysis.id)}
                          canAddToComparison={selectedForComparison.length < 3}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'compare' && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Compare Analyses ({selectedForComparison.length}/3)
                    </h3>
                    {selectedForComparison.length > 0 && (
                      <Button
                        onClick={() => setSelectedForComparison([])}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Clear Selection
                      </Button>
                    )}
                  </div>
                  
                  {selectedForComparison.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select 2-3 analyses from History or Favorites to compare them.</p>
                    </div>
                  ) : (
                    <ComparisonView analyses={selectedForComparison} />
                  )}
                </motion.div>
              )}

              {activeTab === 'export' && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Export & Share</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Export Section */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <Download className="h-5 w-5 text-green-400" />
                        <span>Export Analysis Data</span>
                      </h4>
                      <div className="space-y-4">
                        <Button
                          onClick={() => exportData('json')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          disabled={!currentAnalysis}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export as JSON
                        </Button>
                        <Button
                          onClick={() => exportData('csv')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!currentAnalysis}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Tracks as CSV
                        </Button>
                        {!currentAnalysis && (
                          <p className="text-sm text-white/60">
                            Analyze a playlist first to enable export
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Share Section */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <Share2 className="h-5 w-5 text-purple-400" />
                        <span>Share Analysis</span>
                      </h4>
                      <div className="space-y-4">
                        <Button
                          onClick={shareAnalysis}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={!currentAnalysis}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Results
                        </Button>
                        {!currentAnalysis && (
                          <p className="text-sm text-white/60">
                            Analyze a playlist first to enable sharing
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'visualizations' && (
                <motion.div
                  key="visualizations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Advanced Visualizations</h3>
                    
                    {/* Visualization Selector */}
                    <div className="flex space-x-2 bg-white/5 rounded-lg p-1">
                      {[
                        { id: '3d', label: '3D Mood Space', icon: Boxes },
                        { id: 'timeline', label: 'Timeline', icon: LineChart },
                        { id: 'heatmap', label: 'Heatmap', icon: BarChart3 },
                        { id: 'network', label: 'Network', icon: Share2 }
                      ].map((viz) => (
                        <button
                          key={viz.id}
                          onClick={() => setActiveVisualization(viz.id as '3d' | 'timeline' | 'heatmap' | 'network')}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-all ${
                            activeVisualization === viz.id
                              ? 'bg-white/20 text-white'
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <viz.icon className="h-3 w-3" />
                          <span>{viz.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {!currentAnalysis ? (
                    <div className="text-center py-12 text-white/60">
                      <Boxes className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h4 className="text-lg font-semibold mb-2">No Analysis Data</h4>
                      <p>Analyze a playlist to see advanced 3D visualizations and interactive charts.</p>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 min-h-[400px]">
                      {activeVisualization === '3d' && (
                        <Mood3DVisualization tracks={currentAnalysis.tracks} />
                      )}
                      {activeVisualization === 'timeline' && (
                        <MoodTimeline tracks={currentAnalysis.tracks} />
                      )}
                      {activeVisualization === 'heatmap' && (
                        <AudioFeaturesHeatmap tracks={currentAnalysis.tracks} />
                      )}
                      {activeVisualization === 'network' && (
                        <TrackNetworkGraph tracks={currentAnalysis.tracks} />
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'ai-features' && (
                <motion.div
                  key="ai-features"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <Brain className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">AI-Powered Features</h3>
                  </div>

                  {!currentAnalysis ? (
                    <div className="text-center py-12 text-white/60">
                      <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h4 className="text-lg font-semibold mb-2">AI Features Available</h4>
                      <p>Analyze a playlist to unlock advanced AI-powered insights, custom mood training, and personalized recommendations.</p>
                    </div>
                  ) : (
                    <AdvancedAIFeatures currentAnalysis={currentAnalysis} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Analysis Card Component
interface AnalysisCardProps {
  analysis: StoredAnalysis;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  onToggleComparison: () => void;
  isSelectedForComparison: boolean;
  canAddToComparison: boolean;
}

function AnalysisCard({ 
  analysis, 
  onToggleFavorite, 
  isFavorite, 
  onToggleComparison,
  isSelectedForComparison,
  canAddToComparison
}: AnalysisCardProps) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-2">{analysis.playlistName}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/60">Tracks:</span>
              <span className="text-white ml-2">{analysis.result.tracks.length}</span>
            </div>
            <div>
              <span className="text-white/60">Mood Score:</span>
              <span className="text-white ml-2">{(analysis.result.mood_summary.mood_score * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-white/60">Energy:</span>
              <span className="text-white ml-2">{(analysis.result.mood_summary.avg_energy * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-white/60">Date:</span>
              <span className="text-white ml-2">{new Date(analysis.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={onToggleFavorite}
            variant="ghost"
            size="sm"
            className={`p-2 ${isFavorite ? 'text-yellow-400' : 'text-white/60 hover:text-yellow-400'}`}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button
            onClick={onToggleComparison}
            variant="ghost"
            size="sm"
            disabled={!canAddToComparison && !isSelectedForComparison}
            className={`p-2 ${
              isSelectedForComparison 
                ? 'text-cyan-400 bg-cyan-400/20' 
                : 'text-white/60 hover:text-cyan-400'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Comparison View Component
function ComparisonView({ analyses }: { analyses: StoredAnalysis[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {analyses.map((analysis, index) => (
          <div key={analysis.id} className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">
              {index + 1}. {analysis.playlistName}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white/60 mb-1">Mood Score</div>
                <div className="text-lg font-bold text-purple-400">
                  {(analysis.result.mood_summary.mood_score * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60 mb-1">Energy</div>
                <div className="text-lg font-bold text-yellow-400">
                  {(analysis.result.mood_summary.avg_energy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60 mb-1">Valence</div>
                <div className="text-lg font-bold text-green-400">
                  {(analysis.result.mood_summary.avg_valence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60 mb-1">Danceability</div>
                <div className="text-lg font-bold text-cyan-400">
                  {(analysis.result.mood_summary.avg_danceability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60 mb-1">Tracks</div>
                <div className="text-lg font-bold text-white">
                  {analysis.result.tracks.length}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {analyses.length >= 2 && (
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
          <h5 className="text-white font-semibold mb-2">Quick Insights</h5>
          <div className="text-sm text-white/80 space-y-1">
            <p>• Most energetic: {analyses.reduce((prev, curr) => 
              curr.result.mood_summary.avg_energy > prev.result.mood_summary.avg_energy ? curr : prev
            ).playlistName}</p>
            <p>• Most positive: {analyses.reduce((prev, curr) => 
              curr.result.mood_summary.avg_valence > prev.result.mood_summary.avg_valence ? curr : prev
            ).playlistName}</p>
            <p>• Most danceable: {analyses.reduce((prev, curr) => 
              curr.result.mood_summary.avg_danceability > prev.result.mood_summary.avg_danceability ? curr : prev
            ).playlistName}</p>
          </div>
        </div>
      )}
    </div>
  );
}
