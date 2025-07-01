'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause } from 'lucide-react';
import type { Track } from '@/lib/types';

interface Mood3DVisualizationProps {
  tracks: Track[];
  selectedTrack?: Track | null;
  onTrackSelect?: (track: Track) => void;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  track: Track;
  color: string;
}

export function Mood3DVisualization({ tracks, selectedTrack, onTrackSelect }: Mood3DVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  // Convert tracks to 3D points
  const points3D: Point3D[] = tracks.map((track) => ({
    x: (track.valence - 0.5) * 400, // Valence: -200 to 200
    y: (track.energy - 0.5) * 400,  // Energy: -200 to 200
    z: (track.danceability - 0.5) * 400, // Danceability: -200 to 200
    track,
    color: getMoodColor(track.mood_score),
  }));

  function getMoodColor(moodScore: number): string {
    // Color gradient based on mood score
    const hue = moodScore * 120; // 0 (red) to 120 (green)
    return `hsl(${hue}, 70%, 60%)`;
  }

  const projectTo2D = useCallback((point: Point3D, centerX: number, centerY: number): { x: number; y: number; z: number } => {
    // Simple 3D to 2D projection with rotation
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    // Rotate around X axis
    const y1 = point.y * cosX - point.z * sinX;
    const z1 = point.y * sinX + point.z * cosX;

    // Rotate around Y axis
    const x2 = point.x * cosY + z1 * sinY;
    const z2 = -point.x * sinY + z1 * cosY;

    // Project to 2D
    const perspective = 800;
    const scale = perspective / (perspective + z2);

    return {
      x: centerX + x2 * scale,
      y: centerY + y1 * scale,
      z: z2,
    };
  }, [rotation]);

  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // X axis (Valence)
    ctx.beginPath();
    ctx.moveTo(50, centerY);
    ctx.lineTo(width - 50, centerY);
    ctx.stroke();

    // Y axis (Energy)
    ctx.beginPath();
    ctx.moveTo(centerX, 50);
    ctx.lineTo(centerX, height - 50);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Low Valence', 80, centerY - 10);
    ctx.fillText('High Valence', width - 80, centerY - 10);
    ctx.save();
    ctx.translate(centerX - 15, 80);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('High Energy', 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(centerX - 15, height - 80);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Low Energy', 0, 0);
    ctx.restore();

    // Sort points by z-depth for proper rendering
    const projectedPoints = points3D
      .map(point => ({ ...projectTo2D(point, centerX, centerY), originalPoint: point }))
      .sort((a, b) => b.z - a.z);

    // Draw connection lines for selected track
    if (selectedTrack) {
      const selectedPoint = projectedPoints.find(p => p.originalPoint.track.id === selectedTrack.id);
      if (selectedPoint) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        projectedPoints.forEach(point => {
          if (point.originalPoint.track.id !== selectedTrack.id) {
            ctx.beginPath();
            ctx.moveTo(selectedPoint.x, selectedPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        });
      }
    }

    // Draw points
    projectedPoints.forEach(({ x, y, z, originalPoint }) => {
      const { track, color } = originalPoint;
      const isSelected = selectedTrack?.id === track.id;
      const size = isSelected ? 8 : Math.max(2, 6 * (1 + z / 400));

      // Draw point shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw point
      ctx.fillStyle = isSelected ? '#60A5FA' : color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw point border
      if (isSelected) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw track name for selected track
      if (isSelected) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(track.name, x, y - size - 8);
        ctx.font = '10px Inter';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(track.artist, x, y - size - 22);
      }
    });

    // Draw legend
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 100);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('3D Mood Space', 20, 30);
    ctx.font = '12px Inter';
    ctx.fillText('X: Valence (Positivity)', 20, 50);
    ctx.fillText('Y: Energy (Intensity)', 20, 65);
    ctx.fillText('Z: Danceability (Depth)', 20, 80);
    ctx.fillText('Color: Overall Mood', 20, 95);
  }, [points3D, selectedTrack, projectTo2D]); // projectTo2D includes rotation internally

  function handleMouseDown(e: React.MouseEvent) {
    if (!isRotating) {
      setIsDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01,
      }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleCanvasClick(e: React.MouseEvent) {
    if (isDragging || !onTrackSelect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find closest point to click
    let closestTrack: Track | null = null;
    let minDistance = Infinity;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    points3D.forEach(point => {
      const projected = projectTo2D(point, centerX, centerY);
      const distance = Math.sqrt(
        Math.pow(projected.x - clickX, 2) + Math.pow(projected.y - clickY, 2)
      );

      if (distance < 15 && distance < minDistance) {
        minDistance = distance;
        closestTrack = point.track;
      }
    });

    if (closestTrack) {
      onTrackSelect(closestTrack);
    }
  }

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    
    function animate() {
      if (isRotating) {
        setRotation(prev => ({
          x: prev.x + 0.001, // Much slower rotation speed
          y: prev.y + 0.002, // Much slower rotation speed
        }));
      }
      drawVisualization();
      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRotating, drawVisualization]); // Include drawVisualization but it's now stable

  // Separate effect for redrawing when data changes
  useEffect(() => {
    if (!isRotating) {
      drawVisualization();
    }
  }, [selectedTrack, drawVisualization, isRotating]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 400;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            <span>3D Mood Space Visualization</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsRotating(!isRotating)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setRotation({ x: 0, y: 0 })}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full border border-white/20 rounded-lg cursor-grab active:cursor-grabbing"
            style={{ height: '400px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
          />
          <div className="absolute bottom-4 right-4 text-xs text-white/60">
            {isRotating ? 'Auto-rotating' : 'Click and drag to rotate'}
          </div>
        </div>
        
        {selectedTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20"
          >
            <h4 className="font-semibold text-white mb-2">Selected Track</h4>
            <p className="text-cyan-400">{selectedTrack.name}</p>
            <p className="text-white/70 text-sm">{selectedTrack.artist}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-white/60">Valence:</span>
                <span className="ml-1 text-green-400">{(selectedTrack.valence * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-white/60">Energy:</span>
                <span className="ml-1 text-yellow-400">{(selectedTrack.energy * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-white/60">Dance:</span>
                <span className="ml-1 text-purple-400">{(selectedTrack.danceability * 100).toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
