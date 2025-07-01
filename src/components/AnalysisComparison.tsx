'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analysisStorage, type StoredAnalysis } from '@/lib/storage';

interface AnalysisComparisonProps {
  analyses: StoredAnalysis[];
}

export function AnalysisComparison({ analyses }: AnalysisComparisonProps) {
  const [selectedAnalysis1, setSelectedAnalysis1] = useState<string>('');
  const [selectedAnalysis2, setSelectedAnalysis2] = useState<string>('');
  const [comparison, setComparison] = useState<ReturnType<typeof analysisStorage.compareAnalyses>>(null);

  const handleCompare = () => {
    if (selectedAnalysis1 && selectedAnalysis2) {
      const result = analysisStorage.compareAnalyses(selectedAnalysis1, selectedAnalysis2);
      setComparison(result);
    }
  };

  const getChangeIcon = (value: number) => {
    if (value > 0.05) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (value < -0.05) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getChangeColor = (value: number) => {
    if (value > 0.05) return 'text-green-400';
    if (value < -0.05) return 'text-red-400';
    return 'text-gray-400';
  };

  if (analyses.length < 2) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <GitCompare className="h-5 w-5" />
            <span>Analysis Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-white/70 py-8">
            <p>Need at least 2 analyses to compare.</p>
            <p className="text-sm mt-2">Analyze more playlists to unlock comparisons!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <GitCompare className="h-5 w-5 text-blue-400" />
            <span>Analysis Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selection Interface */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                First Analysis
              </label>
              <select
                value={selectedAnalysis1}
                onChange={(e) => setSelectedAnalysis1(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select analysis...</option>
                {analyses.map((analysis) => (
                  <option key={analysis.id} value={analysis.id} className="bg-gray-800">
                    {analysis.playlistName} - {new Date(analysis.timestamp).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Second Analysis
              </label>
              <select
                value={selectedAnalysis2}
                onChange={(e) => setSelectedAnalysis2(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select analysis...</option>
                {analyses.filter(a => a.id !== selectedAnalysis1).map((analysis) => (
                  <option key={analysis.id} value={analysis.id} className="bg-gray-800">
                    {analysis.playlistName} - {new Date(analysis.timestamp).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleCompare}
            disabled={!selectedAnalysis1 || !selectedAnalysis2}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Analyses
          </Button>

          {/* Comparison Results */}
          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="border-t border-white/20 pt-4">
                <h4 className="text-white font-medium mb-4">Comparison Results</h4>
                
                {/* Similarity Score */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Similarity Score</span>
                    <span className="text-xl font-bold text-purple-400">
                      {(comparison.comparison.similarityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${comparison.comparison.similarityScore * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Changes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Mood Score</span>
                      {getChangeIcon(comparison.comparison.moodScoreDiff)}
                    </div>
                    <div className={`text-lg font-bold ${getChangeColor(comparison.comparison.moodScoreDiff)}`}>
                      {comparison.comparison.moodScoreDiff > 0 ? '+' : ''}
                      {(comparison.comparison.moodScoreDiff * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Energy</span>
                      {getChangeIcon(comparison.comparison.energyDiff)}
                    </div>
                    <div className={`text-lg font-bold ${getChangeColor(comparison.comparison.energyDiff)}`}>
                      {comparison.comparison.energyDiff > 0 ? '+' : ''}
                      {(comparison.comparison.energyDiff * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Valence</span>
                      {getChangeIcon(comparison.comparison.valenceDiff)}
                    </div>
                    <div className={`text-lg font-bold ${getChangeColor(comparison.comparison.valenceDiff)}`}>
                      {comparison.comparison.valenceDiff > 0 ? '+' : ''}
                      {(comparison.comparison.valenceDiff * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Playlist Names */}
                <div className="mt-4 text-sm text-white/60">
                  <p><strong>First:</strong> {comparison.analysis1.playlistName}</p>
                  <p><strong>Second:</strong> {comparison.analysis2.playlistName}</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
