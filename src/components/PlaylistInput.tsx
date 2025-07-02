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
      <div className="relative">
        {/* Enhanced background glow */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-cyan-600/30 to-blue-600/30 rounded-2xl blur-xl"
        />
        
        <div className="relative bg-gray-950/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3 mb-6"
          >
            <div className="relative">
              <Music2 className="h-6 w-6 text-cyan-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-cyan-400/30 rounded-full blur-sm"
              />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Analyze Your Playlist
            </h2>
          </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative group">
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                type="url"
                value={url}
                onChange={handleInputChange}
                placeholder="Paste your Spotify playlist URL here..."
                className={cn(
                  'w-full px-6 py-4 pr-14 rounded-xl border bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-lg group-hover:bg-gray-900/70',
                  error && 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50'
                )}
                disabled={isLoading}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-6 w-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </motion.div>
              
              {/* Input glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 mt-3 text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50 shadow-lg hover:shadow-purple-500/25 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <Spinner size="sm" />
                  <span>Analyzing Your Music...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Search className="h-5 w-5" />
                  <span>Analyze Playlist</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </div>
              )}
            </Button>
          </motion.div>
          
          {onDemo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="button"
                onClick={onDemo}
                disabled={isLoading}
                variant="outline"
                className="w-full mt-4 bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-600/50 hover:border-gray-500/50 py-4 rounded-xl transition-all hover:scale-[1.02] text-lg backdrop-blur-sm"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Music2 className="h-5 w-5" />
                  <span>Try Demo Analysis</span>
                  <span>🎵</span>
                </div>
              </Button>
            </motion.div>
          )}
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20"
        >
          <div className="text-sm text-gray-300 space-y-2">
            <p className="flex items-center space-x-2">
              <span className="text-lg">💡</span>
              <span><strong className="text-cyan-400">Tip:</strong> Make sure your playlist is public!</span>
            </p>
            <p className="flex items-center space-x-2 text-gray-400">
              <span className="text-lg">🔗</span>
              <span className="font-mono text-xs bg-gray-800/50 px-2 py-1 rounded">
                https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
              </span>
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
