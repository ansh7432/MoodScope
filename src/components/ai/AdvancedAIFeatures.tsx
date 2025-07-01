'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  User, 
  Heart,
  Palette,
  BarChart3,
  TrendingUp,
  Zap,
  Settings
} from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import CustomMoodTraining from './CustomMoodTraining';
import PredictiveMoodAnalysis from './PredictiveMoodAnalysis';
import LyricSentimentAnalysis from './LyricSentimentAnalysis';
import ArtistPersonalityProfiling from './ArtistPersonalityProfiling';
import MusicTherapyRecommendations from './MusicTherapyRecommendations';
import CustomChartThemes from '../visualizations/CustomChartThemes';
import { ChartTheme } from '@/contexts/ThemeContext';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'analysis' | 'training' | 'therapy' | 'visualization';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

const aiFeatures: AIFeature[] = [
  {
    id: 'custom-mood-training',
    title: 'Custom Mood Training',
    description: 'Train AI to recognize your personal mood categories and patterns',
    icon: Brain,
    category: 'training',
    difficulty: 'advanced',
    estimatedTime: '10-15 min'
  },
  {
    id: 'predictive-analysis',
    title: 'Predictive Mood Analysis',
    description: 'AI predictions of your future mood patterns based on listening history',
    icon: TrendingUp,
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: '5-10 min'
  },
  {
    id: 'lyric-sentiment',
    title: 'Lyric Sentiment Analysis',
    description: 'Deep emotional analysis of song lyrics using natural language processing',
    icon: MessageSquare,
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: '5-10 min'
  },
  {
    id: 'artist-profiling',
    title: 'Artist Personality Profiling',
    description: 'Comprehensive personality analysis of artists based on their musical patterns',
    icon: User,
    category: 'analysis',
    difficulty: 'beginner',
    estimatedTime: '3-5 min'
  },
  {
    id: 'music-therapy',
    title: 'Music Therapy Recommendations',
    description: 'Personalized therapeutic music sessions for mental health and wellness',
    icon: Heart,
    category: 'therapy',
    difficulty: 'beginner',
    estimatedTime: '15-45 min'
  },
  {
    id: 'chart-themes',
    title: 'Custom Chart Themes',
    description: 'Personalize your data visualization experience with custom themes',
    icon: Palette,
    category: 'visualization',
    difficulty: 'beginner',
    estimatedTime: '2-3 min'
  }
];

interface AdvancedAIFeaturesProps {
  currentAnalysis: AnalysisResult;
  historicalAnalyses?: AnalysisResult[];
  onThemeChange?: (theme: ChartTheme) => void;
}

export default function AdvancedAIFeatures({ 
  currentAnalysis, 
  historicalAnalyses = [],
  onThemeChange = () => {}
}: AdvancedAIFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Features', icon: Settings },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'training', name: 'Training', icon: Brain },
    { id: 'therapy', name: 'Therapy', icon: Heart },
    { id: 'visualization', name: 'Visualization', icon: Palette }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const filteredFeatures = aiFeatures.filter(feature => {
    const categoryMatch = categoryFilter === 'all' || feature.category === categoryFilter;
    const difficultyMatch = difficultyFilter === 'all' || feature.difficulty === difficultyFilter;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600/20 border-green-500/30';
      case 'intermediate': return 'bg-yellow-600/20 border-yellow-500/30';
      case 'advanced': return 'bg-red-600/20 border-red-500/30';
      default: return 'bg-gray-600/20 border-gray-500/30';
    }
  };

  const renderSelectedFeature = () => {
    if (!selectedFeature) return null;

    const props = {
      currentAnalysis,
      historicalAnalyses: historicalAnalyses || [],
      onThemeChange: onThemeChange || (() => {})
    };

    switch (selectedFeature.id) {
      case 'custom-mood-training':
        return <CustomMoodTraining tracks={currentAnalysis.tracks} onCategoriesChange={() => {}} />;
      case 'predictive-analysis':
        return <PredictiveMoodAnalysis currentAnalysis={currentAnalysis} historicalAnalyses={historicalAnalyses || []} />;
      case 'lyric-sentiment':
        return <LyricSentimentAnalysis tracks={currentAnalysis.tracks} />;
      case 'artist-profiling':
        return <ArtistPersonalityProfiling tracks={currentAnalysis.tracks} />;
      case 'music-therapy':
        return <MusicTherapyRecommendations currentAnalysis={currentAnalysis} userGoals={[]} />;
      case 'chart-themes': {
        // Import the first theme from the themes array as default
        const defaultTheme: ChartTheme = {
          id: 'sunset',
          name: 'Sunset Glow',
          icon: Brain, // placeholder
          description: 'Default theme',
          mood: 'energetic',
          colors: {
            primary: ['#FF6B35', '#F7931E', '#FFD23F'],
            secondary: ['#6A4C93', '#8E44AD', '#9B59B6'],
            accent: ['#FFE66D', '#FF6B6B', '#4ECDC4'],
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            text: '#FFFFFF',
            border: 'rgba(255, 255, 255, 0.2)'
          }
        };
        return <CustomChartThemes onThemeChange={props.onThemeChange} currentTheme={defaultTheme} />;
      }
      default:
        return (
          <div className="text-center py-12 text-white/60">
            <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Feature component not found</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          Advanced AI Features
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore cutting-edge AI and machine learning features to enhance your music mood analysis experience. 
          From custom mood training to therapeutic recommendations, discover new insights about your musical preferences.
        </p>
      </div>

      {/* Stats Overview */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{aiFeatures.length}</div>
            <div className="text-sm text-gray-400">AI Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{currentAnalysis.tracks.length}</div>
            <div className="text-sm text-gray-400">Tracks Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{historicalAnalyses.length}</div>
            <div className="text-sm text-gray-400">Historical Analyses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {(currentAnalysis.mood_summary.mood_score * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Current Mood Score</div>
          </div>
        </div>
      </Card>

      {!selectedFeature ? (
        <>
          {/* Filters */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(category.id)}
                    className="flex items-center gap-2"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Filter by Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty.id}
                    variant={difficultyFilter === difficulty.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficultyFilter(difficulty.id)}
                  >
                    {difficulty.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-6 cursor-pointer transition-all duration-300 bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-gray-800/70 hover:to-purple-900/20 group"
                  onClick={() => setSelectedFeature(feature)}
                >
                  <div className="space-y-4">
                    {/* Feature Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all duration-300">
                          <feature.icon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {feature.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyBg(feature.difficulty)}`}>
                              <span className={getDifficultyColor(feature.difficulty)}>
                                {feature.difficulty}
                              </span>
                            </span>
                            <span className="text-xs text-gray-400">{feature.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      <Zap className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs capitalize">
                        {feature.category}
                      </span>
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No features found</h3>
              <p className="text-gray-400">Try adjusting your filters to see more AI features.</p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {/* Feature Header */}
          <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <selectedFeature.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedFeature.title}</h2>
                  <p className="text-gray-400 mt-1">{selectedFeature.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyBg(selectedFeature.difficulty)}`}>
                      <span className={getDifficultyColor(selectedFeature.difficulty)}>
                        {selectedFeature.difficulty}
                      </span>
                    </span>
                    <span className="text-sm text-gray-400">Estimated time: {selectedFeature.estimatedTime}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setSelectedFeature(null)}
                variant="outline"
                className="bg-gray-800 border-gray-600 hover:bg-gray-700"
              >
                Back to Features
              </Button>
            </div>
          </Card>

          {/* Feature Component */}
          <div className="min-h-screen">
            {renderSelectedFeature()}
          </div>
        </div>
      )}
    </div>
  );
}
