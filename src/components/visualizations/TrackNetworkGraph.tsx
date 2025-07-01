'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Zap, Filter, Eye } from 'lucide-react';
import type { Track } from '@/lib/types';

interface TrackNetworkGraphProps {
  tracks: Track[];
  onTrackSelect?: (track: Track) => void;
}

interface NetworkNode {
  id: string;
  track: Track;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: string[];
}

interface NetworkEdge {
  source: string;
  target: string;
  similarity: number;
  weight: number;
}

export function TrackNetworkGraph({ tracks, onTrackSelect }: TrackNetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7);
  const [isSimulating, setIsSimulating] = useState(true);

  // Calculate similarity between two tracks
  const calculateSimilarity = (track1: Track, track2: Track): number => {
    const features = ['valence', 'energy', 'danceability', 'acousticness', 'instrumentalness'];
    let totalDiff = 0;
    
    features.forEach(feature => {
      const val1 = (track1 as unknown as Record<string, number>)[feature] || 0;
      const val2 = (track2 as unknown as Record<string, number>)[feature] || 0;
      totalDiff += Math.abs(val1 - val2);
    });
    
    return 1 - (totalDiff / features.length);
  };

  // Create network data
  const networkData = useMemo(() => {
    const nodes: NetworkNode[] = tracks.map((track, index) => ({
      id: track.id || `track-${index}`,
      track,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      vx: 0,
      vy: 0,
      radius: Math.max(8, track.mood_score * 20),
      color: `hsl(${track.mood_score * 120}, 70%, 60%)`,
      connections: [],
    }));

    const edges: NetworkEdge[] = [];
    
    // Calculate edges based on similarity
    for (let i = 0; i < tracks.length; i++) {
      for (let j = i + 1; j < tracks.length; j++) {
        const similarity = calculateSimilarity(tracks[i], tracks[j]);
        if (similarity >= similarityThreshold) {
          const nodeId1 = nodes[i].id;
          const nodeId2 = nodes[j].id;
          
          edges.push({
            source: nodeId1,
            target: nodeId2,
            similarity,
            weight: similarity,
          });
          
          nodes[i].connections.push(nodeId2);
          nodes[j].connections.push(nodeId1);
        }
      }
    }

    return { nodes, edges };
  }, [tracks, similarityThreshold]);

  // Physics simulation
  const runSimulation = () => {
    const { nodes, edges } = networkData;
    const damping = 0.85;
    const springStrength = 0.1;
    const repulsionStrength = 500;
    const centerX = 400;
    const centerY = 300;

    // Apply forces
    nodes.forEach(node => {
      // Reset forces
      let fx = 0;
      let fy = 0;

      // Repulsion from other nodes
      nodes.forEach(other => {
        if (node.id !== other.id) {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0) {
            const force = repulsionStrength / (distance * distance);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        }
      });

      // Attraction to center
      const centerDx = centerX - node.x;
      const centerDy = centerY - node.y;
      fx += centerDx * 0.01;
      fy += centerDy * 0.01;

      // Apply forces
      node.vx = (node.vx + fx) * damping;
      node.vy = (node.vy + fy) * damping;
      node.x += node.vx;
      node.y += node.vy;

      // Boundary constraints
      node.x = Math.max(node.radius, Math.min(800 - node.radius, node.x));
      node.y = Math.max(node.radius, Math.min(600 - node.radius, node.y));
    });

    // Spring forces for connected nodes
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const targetDistance = 80 + (1 - edge.similarity) * 100;
        
        if (distance > 0) {
          const force = (distance - targetDistance) * springStrength * edge.weight;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      }
    });
  };

  // Draw network
  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, edges } = networkData;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        const isHighlighted = selectedNode && 
          (selectedNode.id === edge.source || selectedNode.id === edge.target);
        
        ctx.strokeStyle = isHighlighted ? 
          `rgba(96, 165, 250, ${edge.similarity})` : 
          `rgba(255, 255, 255, ${edge.similarity * 0.3})`;
        ctx.lineWidth = isHighlighted ? 2 : 1;
        
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isConnected = selectedNode && 
        selectedNode.connections.includes(node.id);

      // Node shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(node.x + 2, node.y + 2, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Node body
      ctx.fillStyle = isSelected ? '#60A5FA' : 
                     isConnected ? '#10B981' : node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      if (isSelected || isConnected) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Mood indicator (inner circle)
      ctx.fillStyle = `rgba(255, 255, 255, ${node.track.mood_score})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw labels for selected and connected nodes
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isConnected = selectedNode && selectedNode.connections.includes(node.id);
      
      if (isSelected || isConnected) {
        const name = node.track.name.length > 15 ? 
          node.track.name.substring(0, 15) + '...' : node.track.name;
        
        ctx.fillText(name, node.x, node.y - node.radius - 8);
        
        if (isSelected) {
          ctx.font = '10px Inter';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(node.track.artist, node.x, node.y - node.radius - 22);
          ctx.font = '12px Inter';
          ctx.fillStyle = '#FFFFFF';
        }
      }
    });

    // Draw statistics
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Network Statistics', 20, 30);
    ctx.font = '12px Inter';
    ctx.fillText(`Nodes: ${nodes.length}`, 20, 50);
    ctx.fillText(`Connections: ${edges.length}`, 20, 65);
    ctx.fillText(`Threshold: ${(similarityThreshold * 100).toFixed(0)}%`, 20, 80);
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find clicked node
    const { nodes } = networkData;
    let clickedNode: NetworkNode | null = null;
    let minDistance = Infinity;

    nodes.forEach(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - clickX, 2) + Math.pow(node.y - clickY, 2)
      );
      
      if (distance <= node.radius && distance < minDistance) {
        minDistance = distance;
        clickedNode = node as NetworkNode;
      }
    });

    if (clickedNode !== null) {
      setSelectedNode(clickedNode);
      if (onTrackSelect) {
        onTrackSelect((clickedNode as NetworkNode).track);
      }
    } else {
      setSelectedNode(null);
    }
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (isSimulating) {
        runSimulation();
      }
      drawNetwork();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [networkData, selectedNode, isSimulating]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 600;
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
            <Network className="h-5 w-5 text-cyan-400" />
            <span>Track Similarity Network</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              <Zap className="h-4 w-4" />
              {isSimulating ? 'Pause' : 'Simulate'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-white/70">Similarity Threshold:</span>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.1"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-cyan-400 min-w-[3rem]">
              {(similarityThreshold * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Network Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full border border-white/20 rounded-lg cursor-pointer"
            style={{ height: '600px' }}
            onClick={handleCanvasClick}
          />
          <div className="absolute bottom-4 right-4 text-xs text-white/60">
            Click nodes to explore connections
          </div>
        </div>

        {/* Selected track details */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-white/20"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Selected Track</h4>
                <p className="text-cyan-400 font-medium">{selectedNode.track.name}</p>
                <p className="text-white/70 text-sm">{selectedNode.track.artist}</p>
                <div className="mt-2 text-sm">
                  <span className="text-white/60">Mood Score: </span>
                  <span className="text-purple-400">{(selectedNode.track.mood_score * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Network Info</h4>
                <p className="text-sm text-white/70">
                  Connections: <span className="text-green-400">{selectedNode.connections.length}</span>
                </p>
                <p className="text-sm text-white/70">
                  Node Size: Based on mood intensity
                </p>
                <p className="text-sm text-white/70">
                  Color: Mood-based hue spectrum
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Network insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Eye className="h-4 w-4 text-cyan-400" />
            <h5 className="font-medium text-white">Network Insights</h5>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/70 mb-1">Total Connections:</p>
              <p className="text-cyan-400 text-lg font-semibold">{networkData.edges.length}</p>
            </div>
            <div>
              <p className="text-white/70 mb-1">Average Similarity:</p>
              <p className="text-green-400 text-lg font-semibold">
                {networkData.edges.length > 0 ? 
                  (networkData.edges.reduce((sum, e) => sum + e.similarity, 0) / networkData.edges.length * 100).toFixed(0) + '%' : 
                  'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-white/70 mb-1">Most Connected:</p>
              <p className="text-purple-400 text-lg font-semibold">
                {networkData.nodes.reduce((max, node) => 
                  node.connections.length > max.connections.length ? node : max, 
                  networkData.nodes[0]
                )?.track.name.substring(0, 10) + '...' || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
