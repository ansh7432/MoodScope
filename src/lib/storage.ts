/**
 * Local storage utilities for analysis history and favorites
 */

import type { AnalysisResult } from './types';

export interface StoredAnalysis {
  id: string;
  timestamp: number;
  playlistUrl: string;
  playlistName?: string;
  result: AnalysisResult;
  isFavorite?: boolean;
}

const STORAGE_KEYS = {
  ANALYSIS_HISTORY: 'moodscope_analysis_history',
  FAVORITES: 'moodscope_favorites',
  SETTINGS: 'moodscope_settings',
} as const;

export const analysisStorage = {
  /**
   * Save analysis to history
   */
  saveAnalysis(playlistUrl: string, result: AnalysisResult, playlistName?: string): StoredAnalysis {
    // Extract playlist name from URL or use a better default
    let finalPlaylistName = playlistName;
    
    if (!finalPlaylistName) {
      // Try to extract playlist ID from URL for a better name
      const urlMatch = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
      if (urlMatch) {
        finalPlaylistName = `Playlist ${urlMatch[1].substring(0, 8)}...`;
      } else {
        // Check if it's demo data
        const isDemoData = result.ai_insights?.emotional_analysis?.includes('demo analysis') || 
                          result.ai_insights?.emotional_analysis?.includes('This is a demo analysis');
        
        finalPlaylistName = isDemoData ? 'Demo Playlist' : 'Unknown Playlist';
      }
    }

    const analysis: StoredAnalysis = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      playlistUrl,
      playlistName: finalPlaylistName,
      result,
      isFavorite: false,
    };

    const history = this.getHistory();
    history.unshift(analysis); // Add to beginning

    // Keep only last 50 analyses
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(history));
    return analysis;
  },

  /**
   * Get analysis history
   */
  getHistory(): StoredAnalysis[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Get analysis by ID
   */
  getAnalysisById(id: string): StoredAnalysis | null {
    const history = this.getHistory();
    return history.find(analysis => analysis.id === id) || null;
  },

  /**
   * Delete analysis
   */
  deleteAnalysis(id: string): void {
    const history = this.getHistory().filter(analysis => analysis.id !== id);
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(history));
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite(id: string): void {
    const history = this.getHistory();
    const analysis = history.find(a => a.id === id);
    if (analysis) {
      analysis.isFavorite = !analysis.isFavorite;
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(history));
    }
  },

  /**
   * Get favorite analyses
   */
  getFavorites(): StoredAnalysis[] {
    return this.getHistory().filter(analysis => analysis.isFavorite);
  },

  /**
   * Clear all history
   */
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
  },

  /**
   * Get mood trends over time
   */
  getMoodTrends(): Array<{ date: string; moodScore: number; energy: number; valence: number }> {
    const history = this.getHistory();
    return history.map(analysis => ({
      date: new Date(analysis.timestamp).toISOString().split('T')[0],
      moodScore: analysis.result.mood_summary.mood_score,
      energy: analysis.result.mood_summary.avg_energy,
      valence: analysis.result.mood_summary.avg_valence,
    })).reverse(); // Chronological order
  },

  /**
   * Compare two analyses
   */
  compareAnalyses(id1: string, id2: string): {
    analysis1: StoredAnalysis;
    analysis2: StoredAnalysis;
    comparison: {
      moodScoreDiff: number;
      energyDiff: number;
      valenceDiff: number;
      similarityScore: number;
    };
  } | null {
    const analysis1 = this.getAnalysisById(id1);
    const analysis2 = this.getAnalysisById(id2);

    if (!analysis1 || !analysis2) return null;

    const moodScoreDiff = analysis2.result.mood_summary.mood_score - analysis1.result.mood_summary.mood_score;
    const energyDiff = analysis2.result.mood_summary.avg_energy - analysis1.result.mood_summary.avg_energy;
    const valenceDiff = analysis2.result.mood_summary.avg_valence - analysis1.result.mood_summary.avg_valence;

    // Calculate similarity score (0-1, higher = more similar)
    const similarityScore = 1 - (
      Math.abs(moodScoreDiff) + 
      Math.abs(energyDiff) + 
      Math.abs(valenceDiff)
    ) / 3;

    return {
      analysis1,
      analysis2,
      comparison: {
        moodScoreDiff,
        energyDiff,
        valenceDiff,
        similarityScore,
      },
    };
  },
};
