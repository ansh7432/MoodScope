'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Music2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn, isValidSpotifyPlaylistUrl } from '@/lib/utils';

interface PlaylistInputProps {
  onAnalyze: (url: string) => void;
  onDemo?: () => void;
  isLoading: boolean;
}

export function PlaylistInput({ onAnalyze, onDemo, isLoading }: PlaylistInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    if (!isValidSpotifyPlaylistUrl(url)) {
      setError('Please enter a valid Spotify playlist URL');
      return;
    }

    onAnalyze(url.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Music2 className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">
            Analyze Your Playlist
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={handleInputChange}
                placeholder="Paste your Spotify playlist URL here..."
                className={cn(
                  'w-full px-4 py-3 pr-12 rounded-lg border bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all',
                  error && 'border-red-400 focus:ring-red-400'
                )}
                disabled={isLoading}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 mt-2 text-red-400"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Analyze Playlist</span>
              </div>
            )}
          </Button>
          
          {onDemo && (
            <Button
              type="button"
              onClick={onDemo}
              disabled={isLoading}
              variant="outline"
              className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
            >
              <div className="flex items-center space-x-2">
                <Music2 className="h-4 w-4" />
                <span>Try Demo Analysis</span>
              </div>
            </Button>
          )}
        </form>

        <div className="mt-4 text-sm text-white/70">
          <p>💡 <strong>Tip:</strong> Make sure your playlist is public!</p>
          <p className="mt-1">
            Example: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
          </p>
        </div>
      </div>
    </motion.div>
  );
}
