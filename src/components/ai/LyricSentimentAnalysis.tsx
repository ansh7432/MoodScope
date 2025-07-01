'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Search, 
  Loader, 
  Heart,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Brain,
  BarChart3,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Track } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchAndAnalyzeLyrics } from '@/lib/ai-service';

interface LyricSentiment {
  track: Track;
  lyrics: string;
  overallSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1 to 1
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  themes: string[];
  wordCount: number;
  readabilityScore: number;
  keyPhrases: string[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface EmotionData {
  emotion: string;
  value: number;
  color: string;
}

interface SentimentAnalysisProps {
  tracks: Track[];
}

const EMOTION_COLORS = {
  joy: '#FFD700',
  sadness: '#4169E1',
  anger: '#FF6347',
  fear: '#800080',
  surprise: '#FF69B4',
  disgust: '#228B22'
};

// Mock lyrics data for fallback
const mockLyricsData: Record<string, string> = {
  default: `I feel the sunshine on my face
Dancing through this lovely place
Every moment feels so right
Everything is burning bright

When the world seems dark and cold
Let the music take control
Feel the rhythm in your heart
This is where the magic starts`
};

export default function LyricSentimentAnalysis({ tracks }: SentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<LyricSentiment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<LyricSentiment | null>(null);
  const [overallSentiment, setOverallSentiment] = useState<ChartData[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<EmotionData[]>([]);

  const generateMockLyrics = useCallback((track: Track): string => {
    const moodCategory = track.mood_category.toLowerCase();
    const valence = track.valence;
    const energy = track.energy;

    if (moodCategory.includes('happy') || valence > 0.7) {
      return `Sunshine fills my soul today
Dancing all my fears away
Life is beautiful and bright
Everything will be alright

Joy is flowing through my veins
Washing away all the pains
Feel the music lift me high
Touching stars up in the sky`;
    } else if (moodCategory.includes('sad') || valence < 0.3) {
      return `Shadows fall across my heart
Everything is torn apart
Memories of better days
Lost within this endless maze

Tears are falling like the rain
Can't escape this crushing pain
Hope seems distant and so far
Healing wounds and hidden scars`;
    } else if (energy > 0.7) {
      return `Feel the power in your chest
Give it all and give your best
Rush of energy so strong
This is where we all belong

Beat is pounding in my ears
Pushing through my deepest fears
Nothing's gonna stop me now
I will make it through somehow`;
    } else {
      return mockLyricsData.default;
    }
  }, []);

  const analyzeSentimentMock = useCallback((lyrics: string, track: Track): LyricSentiment => {
    // Simple sentiment analysis simulation
    const words = lyrics.toLowerCase().split(/\s+/);
    const wordCount = words.length;

    // Positive and negative word lists for basic sentiment analysis
    const positiveWords = ['happy', 'joy', 'love', 'beautiful', 'amazing', 'wonderful', 'great', 'fantastic', 'sunshine', 'bright', 'hope', 'dream', 'perfect', 'smile', 'laugh'];
    const negativeWords = ['sad', 'pain', 'hurt', 'terrible', 'awful', 'hate', 'dark', 'fear', 'angry', 'broken', 'lost', 'tears', 'alone', 'empty', 'nightmare'];

    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;

    const sentimentScore = (positiveCount - negativeCount) / wordCount;
    let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    
    if (sentimentScore > 0.05) overallSentiment = 'positive';
    else if (sentimentScore < -0.05) overallSentiment = 'negative';

    // Generate emotion scores based on lyrics content and track features
    const baseJoy = track.valence * 0.7 + Math.random() * 0.3;
    const baseSadness = (1 - track.valence) * 0.6 + Math.random() * 0.4;
    const baseEnergy = track.energy * 0.5 + Math.random() * 0.5;

    const emotions = {
      joy: Math.max(0, Math.min(1, baseJoy + (positiveCount / wordCount) * 2)),
      sadness: Math.max(0, Math.min(1, baseSadness + (negativeCount / wordCount) * 2)),
      anger: Math.max(0, Math.min(1, (1 - track.valence) * baseEnergy * 0.8 + Math.random() * 0.2)),
      fear: Math.max(0, Math.min(1, (1 - track.valence) * (1 - track.energy) * 0.6 + Math.random() * 0.4)),
      surprise: Math.max(0, Math.min(1, track.energy * 0.3 + Math.random() * 0.7)),
      disgust: Math.max(0, Math.min(1, Math.random() * 0.3))
    };

    // Generate themes based on content
    const themes = [];
    if (lyrics.includes('love') || lyrics.includes('heart')) themes.push('Love & Relationships');
    if (lyrics.includes('dream') || lyrics.includes('hope')) themes.push('Dreams & Aspirations');
    if (lyrics.includes('pain') || lyrics.includes('hurt')) themes.push('Pain & Struggle');
    if (lyrics.includes('dance') || lyrics.includes('party')) themes.push('Celebration & Fun');
    if (lyrics.includes('life') || lyrics.includes('world')) themes.push('Life & Existence');
    if (themes.length === 0) themes.push('General');

    // Extract key phrases (simplified)
    const keyPhrases = lyrics.split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3)
      .map(line => line.trim());

    return {
      track,
      lyrics,
      overallSentiment,
      sentimentScore,
      emotions,
      themes,
      wordCount,
      readabilityScore: Math.random() * 100, // Mock readability score
      keyPhrases
    };
  }, []);

  const updateChartData = useCallback((results: LyricSentiment[]) => {
    // Calculate overall sentiment distribution
    const sentimentCounts = results.reduce((acc, data) => {
      acc[data.overallSentiment] = (acc[data.overallSentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setOverallSentiment([
      { name: 'Positive', value: sentimentCounts.positive || 0, color: '#10B981' },
      { name: 'Neutral', value: sentimentCounts.neutral || 0, color: '#6B7280' },
      { name: 'Negative', value: sentimentCounts.negative || 0, color: '#EF4444' }
    ]);

    // Calculate emotion distribution
    const avgEmotions = Object.keys(EMOTION_COLORS).map(emotion => {
      const avg = results.reduce((sum, data) => sum + data.emotions[emotion as keyof typeof data.emotions], 0) / results.length;
      return {
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: avg * 100,
        color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS]
      };
    });

    setEmotionDistribution(avgEmotions);
  }, []);

  const analyzeLyrics = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const results: LyricSentiment[] = [];
      
      for (const track of tracks.slice(0, 10)) { // Limit to first 10 tracks for performance
        try {
          // Use real AI service for lyrics analysis
          const lyricsAnalysis = await fetchAndAnalyzeLyrics(track.name, track.artist || 'Unknown Artist');
          
          // Transform AI service result to component format
          const sentimentResult: LyricSentiment = {
            track,
            lyrics: lyricsAnalysis.lyrics,
            overallSentiment: lyricsAnalysis.sentiment.sentiment as 'positive' | 'negative' | 'neutral',
            sentimentScore: lyricsAnalysis.sentiment.confidence * (lyricsAnalysis.sentiment.sentiment === 'positive' ? 1 : lyricsAnalysis.sentiment.sentiment === 'negative' ? -1 : 0),
            emotions: {
              joy: lyricsAnalysis.emotions.find(e => e.emotion === 'joy')?.score || 0,
              sadness: lyricsAnalysis.emotions.find(e => e.emotion === 'sadness')?.score || 0,
              anger: lyricsAnalysis.emotions.find(e => e.emotion === 'anger')?.score || 0,
              fear: lyricsAnalysis.emotions.find(e => e.emotion === 'fear')?.score || 0,
              surprise: lyricsAnalysis.emotions.find(e => e.emotion === 'surprise')?.score || 0,
              disgust: lyricsAnalysis.emotions.find(e => e.emotion === 'disgust')?.score || 0,
            },
            themes: lyricsAnalysis.themes || ['General'],
            wordCount: lyricsAnalysis.lyrics.split(/\s+/).length,
            readabilityScore: lyricsAnalysis.readability * 100,
            keyPhrases: lyricsAnalysis.sentiment.keywords || []
          };
          
          results.push(sentimentResult);
        } catch (error) {
          console.error(`Failed to analyze lyrics for ${track.name}:`, error);
          // Fallback to mock data for this track
          const mockLyrics = generateMockLyrics(track);
          results.push(analyzeSentimentMock(mockLyrics, track));
        }
      }
      
      setSentimentData(results);
      updateChartData(results);
    } catch (error) {
      console.error('Lyrics analysis failed:', error);
      // Fallback to mock data
      const mockResults = tracks.slice(0, 10).map(track => {
        const mockLyrics = generateMockLyrics(track);
        return analyzeSentimentMock(mockLyrics, track);
      });
      setSentimentData(mockResults);
      updateChartData(mockResults);
    } finally {
      setIsAnalyzing(false);
    }
  }, [tracks, generateMockLyrics, analyzeSentimentMock, updateChartData]);

  useEffect(() => {
    if (tracks.length > 0) {
      analyzeLyrics();
    }
  }, [tracks, analyzeLyrics]);

  const filteredTracks = sentimentData.filter(data =>
    data.track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-5 h-5 text-green-400" />;
      case 'negative': return <ThumbsDown className="w-5 h-5 text-red-400" />;
      default: return <Meh className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-400/10';
      case 'negative': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
            <MessageSquare className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Lyric Sentiment Analysis
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          AI-powered analysis of song lyrics using advanced NLP models to detect emotions, themes, and sentiment patterns in your music.
        </p>
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tracks or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>
        <Button
          onClick={analyzeLyrics}
          disabled={isAnalyzing || tracks.length === 0}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
        >
          {isAnalyzing ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analyze Lyrics
            </>
          )}
        </Button>
      </motion.div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-lg text-gray-300">Analyzing lyrics with AI models...</span>
          </div>
          <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </motion.div>
      )}

      {/* Overview Charts */}
      {sentimentData.length > 0 && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Sentiment Distribution */}
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Overall Sentiment Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallSentiment}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {overallSentiment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Emotion Distribution */}
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Average Emotion Intensity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="emotion" 
                    tick={{ fill: 'white', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'white', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#emotionGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="emotionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Track List */}
      {sentimentData.length > 0 && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Track Analysis Results ({filteredTracks.length})
          </h3>
          <div className="grid gap-4">
            {filteredTracks.map((data, index) => (
              <motion.div
                key={`${data.track.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedTrack(selectedTrack?.track.id === data.track.id ? null : data)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getSentimentColor(data.overallSentiment)}`}>
                          {getSentimentIcon(data.overallSentiment)}
                          {data.overallSentiment.charAt(0).toUpperCase() + data.overallSentiment.slice(1)}
                        </div>
                        <span className="text-sm text-gray-400">Score: {data.sentimentScore.toFixed(2)}</span>
                      </div>
                      <h4 className="font-semibold text-white">{data.track.name}</h4>
                      <p className="text-sm text-gray-400">{data.track.artist}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {data.themes.slice(0, 3).map(theme => (
                          <span key={theme} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-400">{data.wordCount} words</div>
                      <div className="text-sm text-gray-400">Readability: {data.readabilityScore.toFixed(0)}%</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedTrack?.track.id === data.track.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10 space-y-4"
                    >
                      {/* Emotion Breakdown */}
                      <div>
                        <h5 className="font-medium text-white mb-2">Emotion Breakdown</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(data.emotions).map(([emotion, value]) => (
                            <div key={emotion} className="flex items-center justify-between">
                              <span className="text-sm text-gray-400 capitalize">{emotion}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full transition-all duration-500"
                                    style={{ 
                                      width: `${value * 100}%`,
                                      backgroundColor: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS]
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-400 w-8">{(value * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Phrases */}
                      {data.keyPhrases.length > 0 && (
                        <div>
                          <h5 className="font-medium text-white mb-2">Key Phrases</h5>
                          <div className="space-y-1">
                            {data.keyPhrases.map((phrase, idx) => (
                              <div key={idx} className="text-sm text-gray-300 italic">
                                &ldquo;{phrase}&rdquo;
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lyrics Preview */}
                      <div>
                        <h5 className="font-medium text-white mb-2">Lyrics Preview</h5>
                        <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-300 max-h-32 overflow-y-auto">
                          {data.lyrics.split('\n').slice(0, 8).join('\n')}
                          {data.lyrics.split('\n').length > 8 && '\n...'}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!isAnalyzing && sentimentData.length === 0 && tracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
          <p className="text-gray-400 mb-6">Click &ldquo;Analyze Lyrics&rdquo; to start the AI-powered sentiment analysis of your tracks.</p>
          <Button
            onClick={analyzeLyrics}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
          >
            <Brain className="w-4 h-4 mr-2" />
            Start Analysis
          </Button>
        </motion.div>
      )}

      {/* No Tracks State */}
      {tracks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Tracks Available</h3>
          <p className="text-gray-400">Please load some tracks first to analyze their lyrics and sentiment.</p>
        </motion.div>
      )}
    </div>
  );
}
