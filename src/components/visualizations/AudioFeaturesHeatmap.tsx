'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Palette, Grid3X3, Eye } from 'lucide-react';
import type { Track } from '@/lib/types';

interface AudioFeaturesHeatmapProps {
  tracks: Track[];
  onTrackSelect?: (track: Track) => void;
}

interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  track: Track;
  feature: string;
  normalizedValue: number;
}

const audioFeatures = [
  { key: 'valence', label: 'Valence', color: 'from-red-500 to-green-500' },
  { key: 'energy', label: 'Energy', color: 'from-blue-500 to-yellow-500' },
  { key: 'danceability', label: 'Danceability', color: 'from-purple-500 to-pink-500' },
  { key: 'acousticness', label: 'Acousticness', color: 'from-gray-500 to-orange-500' },
  { key: 'instrumentalness', label: 'Instrumentalness', color: 'from-indigo-500 to-cyan-500' },
  { key: 'speechiness', label: 'Speechiness', color: 'from-emerald-500 to-lime-500' },
  { key: 'liveness', label: 'Liveness', color: 'from-rose-500 to-amber-500' },
] as const;

export function AudioFeaturesHeatmap({ tracks, onTrackSelect }: AudioFeaturesHeatmapProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [colorScheme, setColorScheme] = useState<'viridis' | 'plasma' | 'rainbow'>('viridis');

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    const cells: HeatmapCell[] = [];
    
    tracks.forEach((track, trackIndex) => {
      audioFeatures.forEach((feature, featureIndex) => {
        const value = (track as unknown as Record<string, number>)[feature.key] || 0;
        cells.push({
          x: featureIndex,
          y: trackIndex,
          value: value,
          track,
          feature: feature.label,
          normalizedValue: value,
        });
      });
    });

    return cells;
  }, [tracks]);

  // Get color for value based on scheme
  const getColor = (value: number, scheme: string = colorScheme) => {
    switch (scheme) {
      case 'viridis':
        return `hsl(${240 + (120 * value)}, 70%, ${30 + (40 * value)}%)`;
      case 'plasma':
        return `hsl(${300 - (60 * value)}, 80%, ${20 + (60 * value)}%)`;
      case 'rainbow':
        return `hsl(${value * 240}, 70%, 50%)`;
      default:
        return `hsl(${240 + (120 * value)}, 70%, ${30 + (40 * value)}%)`;
    }
  };

  // Calculate feature statistics
  const featureStats = useMemo(() => {
    return audioFeatures.map(feature => {
      const values = tracks.map(track => (track as unknown as Record<string, number>)[feature.key] || 0);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
      
      return {
        ...feature,
        avg,
        max,
        min,
        variance: Math.sqrt(variance),
      };
    });
  }, [tracks]);

  // Handle cell click
  const handleCellClick = (cell: HeatmapCell) => {
    if (onTrackSelect) {
      onTrackSelect(cell.track);
    }
  };

  const gridCols = audioFeatures.length;
  const gridRows = tracks.length;
  const cellSize = Math.max(15, Math.min(40, 600 / Math.max(gridCols, gridRows)));

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-cyan-400" />
            <span>Audio Features Heatmap</span>
          </CardTitle>
          <div className="flex space-x-2">
            {['viridis', 'plasma', 'rainbow'].map((scheme) => (
              <Button
                key={scheme}
                onClick={() => setColorScheme(scheme as 'viridis' | 'plasma' | 'rainbow')}
                variant={colorScheme === scheme ? "default" : "ghost"}
                size="sm"
                className={colorScheme === scheme ? 
                  "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" : 
                  "text-white/70 hover:text-white"
                }
              >
                <Palette className="h-3 w-3 mr-1" />
                {scheme}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {featureStats.map((stat) => (
            <motion.div
              key={stat.key}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedFeature === stat.key 
                  ? 'border-cyan-400 bg-cyan-400/20' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setSelectedFeature(selectedFeature === stat.key ? null : stat.key)}
            >
              <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
              <div className="text-xs text-white/70">
                Avg: {(stat.avg * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-white/70">
                Range: {(stat.min * 100).toFixed(0)}% - {(stat.max * 100).toFixed(0)}%
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${stat.avg * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="relative">
          <div className="flex items-center space-x-2 mb-4">
            <Grid3X3 className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-white/70">
              {tracks.length} tracks × {audioFeatures.length} features
            </span>
            {hoveredCell && (
              <span className="text-sm text-cyan-400">
                | {hoveredCell.track.name} - {hoveredCell.feature}: {(hoveredCell.value * 100).toFixed(1)}%
              </span>
            )}
          </div>

          <div className="bg-black/30 rounded-lg p-4 overflow-auto">
            {/* Feature labels */}
            <div className="flex mb-2" style={{ paddingLeft: '120px' }}>
              {audioFeatures.map((feature) => (
                <div
                  key={feature.key}
                  className="text-xs text-white/70 text-center transform -rotate-45 origin-bottom"
                  style={{ 
                    width: `${cellSize}px`,
                    minWidth: `${cellSize}px`,
                    height: '40px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    paddingBottom: '5px'
                  }}
                >
                  {feature.label}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex flex-col space-y-1">
              {tracks.map((track, trackIndex) => (
                <div key={track.id || trackIndex} className="flex items-center space-x-2">
                  {/* Track label */}
                  <div 
                    className="text-xs text-white/70 text-right overflow-hidden"
                    style={{ width: '110px', minWidth: '110px' }}
                    title={`${track.name} - ${track.artist}`}
                  >
                    <div className="truncate">{track.name}</div>
                    <div className="truncate text-white/50">{track.artist}</div>
                  </div>

                  {/* Feature cells */}
                  <div className="flex space-x-1">
                    {audioFeatures.map((feature, featureIndex) => {
                      const cell = heatmapData.find(
                        c => c.x === featureIndex && c.y === trackIndex
                      );
                      if (!cell) return null;

                      const isHighlighted = selectedFeature === feature.key;
                      const opacity = isHighlighted ? 1 : selectedFeature ? 0.3 : 1;

                      return (
                        <motion.div
                          key={`${trackIndex}-${featureIndex}`}
                          className="cursor-pointer border border-white/10 rounded"
                          style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            backgroundColor: getColor(cell.value),
                            opacity,
                          }}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => handleCellClick(cell)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color scale legend */}
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-white/70">Intensity:</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white/50">Low</span>
              <div className="flex">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4"
                    style={{ backgroundColor: getColor(i / 9) }}
                  />
                ))}
              </div>
              <span className="text-xs text-white/50">High</span>
            </div>
          </div>
        </div>

        {/* Hovered cell details */}
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-white/20"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Track Details</h4>
                <p className="text-cyan-400 font-medium">{hoveredCell.track.name}</p>
                <p className="text-white/70 text-sm">{hoveredCell.track.artist}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Audio Feature</h4>
                <p className="text-yellow-400 font-medium">{hoveredCell.feature}</p>
                <p className="text-white/70 text-sm">
                  Value: {(hoveredCell.value * 100).toFixed(1)}%
                </p>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${hoveredCell.value * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Eye className="h-4 w-4 text-cyan-400" />
            <h5 className="font-medium text-white">Pattern Insights</h5>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/70 mb-2">Highest Variance:</p>
              <p className="text-cyan-400">
                {featureStats.reduce((max, stat) => 
                  stat.variance > max.variance ? stat : max
                ).label}
              </p>
            </div>
            <div>
              <p className="text-white/70 mb-2">Most Consistent:</p>
              <p className="text-green-400">
                {featureStats.reduce((min, stat) => 
                  stat.variance < min.variance ? stat : min
                ).label}
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
