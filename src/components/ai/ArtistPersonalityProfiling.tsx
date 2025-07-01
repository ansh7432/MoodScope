'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Search, 
  Brain, 
  Zap,
  Heart,
  Target,
  Music,
  Award,
  Users,
  BarChart3
} from 'lucide-react';
import { Track } from '@/lib/types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface PersonalityTraits {
  creativity: number;
  energy: number;
  emotionalDepth: number;
  complexity: number;
  consistency: number;
  innovation: number;
}

interface MusicStyle {
  valenceRange: { min: number; max: number; avg: number };
  energyRange: { min: number; max: number; avg: number };
  danceabilityRange: { min: number; max: number; avg: number };
  acousticnessRange: { min: number; max: number; avg: number };
}

interface ArtistDescription {
  description: string;
  strengths: string[];
  characteristics: string[];
}

interface ArtistPersonality {
  artistName: string;
  trackCount: number;
  personalityTraits: PersonalityTraits;
  musicStyle: MusicStyle;
  emotionalProfile: {
    dominant: string;
    secondary: string;
    range: number;
  };
  artistType: string;
  description: string;
  strengths: string[];
  characteristics: string[];
  similarArtists: string[];
}

interface ArtistProfilingProps {
  tracks: Track[];
}

export default function ArtistPersonalityProfiling({ tracks }: ArtistProfilingProps) {
  const [artistProfiles, setArtistProfiles] = useState<ArtistPersonality[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<ArtistPersonality | null>(null);

  useEffect(() => {
    if (tracks.length > 0) {
      analyzeArtists();
    }
  }, [tracks]);

  const analyzeArtists = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Group tracks by artist
    const artistGroups = tracks.reduce((groups, track) => {
      const artist = track.artist;
      if (!groups[artist]) {
        groups[artist] = [];
      }
      groups[artist].push(track);
      return groups;
    }, {} as Record<string, Track[]>);

    // Analyze each artist with multiple tracks
    const profiles = Object.entries(artistGroups)
      .filter(([, artistTracks]) => artistTracks.length >= 1) // At least 1 track
      .map(([artistName, artistTracks]) => analyzeArtistPersonality(artistName, artistTracks))
      .sort((a, b) => b.trackCount - a.trackCount);

    setArtistProfiles(profiles);
    setIsAnalyzing(false);
  };

  const analyzeArtistPersonality = (artistName: string, artistTracks: Track[]): ArtistPersonality => {
    const trackCount = artistTracks.length;
    
    // Calculate audio feature statistics
    const valences = artistTracks.map(t => t.valence);
    const energies = artistTracks.map(t => t.energy);
    const danceabilities = artistTracks.map(t => t.danceability);
    const acousticnesses = artistTracks.map(t => t.acousticness || 0);

    const calculateStats = (values: number[]) => ({
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length
    });

    const musicStyle = {
      valenceRange: calculateStats(valences),
      energyRange: calculateStats(energies),
      danceabilityRange: calculateStats(danceabilities),
      acousticnessRange: calculateStats(acousticnesses)
    };

    // Calculate personality traits based on musical patterns
    const traits = {
      creativity: calculateCreativity(artistTracks, musicStyle),
      energy: musicStyle.energyRange.avg,
      emotionalDepth: calculateEmotionalDepth(musicStyle),
      complexity: calculateComplexity(musicStyle),
      consistency: calculateConsistency(musicStyle),
      innovation: calculateInnovation(artistTracks, musicStyle)
    };

    // Determine emotional profile
    const emotionalProfile = determineEmotionalProfile(musicStyle);

    // Classify artist type
    const artistType = classifyArtistType(traits, musicStyle);

    // Generate description and characteristics
    const { description, strengths, characteristics } = generateArtistDescription(artistType);

    // Generate similar artists (mock data)
    const similarArtists = generateSimilarArtists(artistType);

    return {
      artistName,
      trackCount,
      personalityTraits: traits,
      musicStyle,
      emotionalProfile,
      artistType,
      description,
      strengths,
      characteristics,
      similarArtists
    };
  };

  const calculateCreativity = (tracks: Track[], musicStyle: MusicStyle): number => {
    // Creativity based on diversity of audio features
    const diversityScore = (
      musicStyle.valenceRange.max - musicStyle.valenceRange.min +
      musicStyle.energyRange.max - musicStyle.energyRange.min +
      musicStyle.danceabilityRange.max - musicStyle.danceabilityRange.min
    ) / 3;

    return Math.min(1, diversityScore + Math.random() * 0.2);
  };

  const calculateEmotionalDepth = (musicStyle: MusicStyle): number => {
    // Emotional depth based on valence variation and range
    const valenceVariation = musicStyle.valenceRange.max - musicStyle.valenceRange.min;
    const avgValence = musicStyle.valenceRange.avg;
    
    // Higher depth for artists who explore both high and low valence
    return Math.min(1, valenceVariation * 1.5 + (0.5 - Math.abs(avgValence - 0.5)) * 0.5);
  };

  const calculateComplexity = (musicStyle: MusicStyle): number => {
    // Complexity based on acoustic vs electronic balance and feature ranges
    const acousticFactor = 1 - musicStyle.acousticnessRange.avg; // More electronic = more complex
    const rangeVariation = (
      musicStyle.energyRange.max - musicStyle.energyRange.min +
      musicStyle.danceabilityRange.max - musicStyle.danceabilityRange.min
    ) / 2;
    
    return Math.min(1, acousticFactor * 0.6 + rangeVariation * 0.4 + Math.random() * 0.2);
  };

  const calculateConsistency = (musicStyle: MusicStyle): number => {
    // Consistency is inverse of variation
    const totalVariation = (
      musicStyle.valenceRange.max - musicStyle.valenceRange.min +
      musicStyle.energyRange.max - musicStyle.energyRange.min +
      musicStyle.danceabilityRange.max - musicStyle.danceabilityRange.min
    ) / 3;
    
    return Math.max(0.2, 1 - totalVariation);
  };

  const calculateInnovation = (tracks: Track[], musicStyle: MusicStyle): number => {
    // Innovation based on unique combinations of features
    const energyValenceMix = Math.abs(musicStyle.energyRange.avg - musicStyle.valenceRange.avg);
    const acousticEnergyContrast = musicStyle.acousticnessRange.avg * musicStyle.energyRange.avg;
    
    return Math.min(1, energyValenceMix + acousticEnergyContrast + Math.random() * 0.3);
  };

  const determineEmotionalProfile = (musicStyle: MusicStyle) => {
    const avgValence = musicStyle.valenceRange.avg;
    const avgEnergy = musicStyle.energyRange.avg;
    const range = musicStyle.valenceRange.max - musicStyle.valenceRange.min;

    let dominant = 'Balanced';
    let secondary = 'Neutral';

    if (avgValence > 0.7) {
      dominant = avgEnergy > 0.7 ? 'Euphoric' : 'Content';
      secondary = avgEnergy > 0.5 ? 'Energetic' : 'Peaceful';
    } else if (avgValence < 0.3) {
      dominant = avgEnergy > 0.5 ? 'Intense' : 'Melancholic';
      secondary = avgEnergy > 0.7 ? 'Aggressive' : 'Introspective';
    } else {
      dominant = avgEnergy > 0.7 ? 'Dynamic' : 'Contemplative';
      secondary = avgEnergy > 0.5 ? 'Moderate' : 'Calm';
    }

    return { dominant, secondary, range };
  };

  const classifyArtistType = (traits: PersonalityTraits, musicStyle: MusicStyle): string => {
    const { creativity, energy, emotionalDepth, complexity, consistency } = traits;
    const avgValence = musicStyle.valenceRange.avg;

    if (creativity > 0.8 && complexity > 0.7) return 'Experimental Innovator';
    if (energy > 0.8 && avgValence > 0.7) return 'High-Energy Performer';
    if (emotionalDepth > 0.8 && avgValence < 0.5) return 'Emotional Storyteller';
    if (consistency > 0.8 && complexity < 0.5) return 'Accessible Populist';
    if (complexity > 0.7 && emotionalDepth > 0.7) return 'Artistic Composer';
    if (energy > 0.7 && creativity > 0.6) return 'Dynamic Creator';
    if (emotionalDepth > 0.6 && consistency > 0.6) return 'Balanced Artist';
    
    return 'Versatile Musician';
  };

  const generateArtistDescription = (artistType: string): ArtistDescription => {
    const descriptions: Record<string, ArtistDescription> = {
      'Experimental Innovator': {
        description: 'A boundary-pushing artist who consistently explores new sonic territories and challenges conventional musical structures.',
        strengths: ['Innovative sound design', 'Creative risk-taking', 'Unique artistic vision'],
        characteristics: ['High creativity', 'Complex compositions', 'Unpredictable elements']
      },
      'High-Energy Performer': {
        description: 'An energetic artist who specializes in creating uplifting, high-energy music that motivates and energizes listeners.',
        strengths: ['Infectious energy', 'Motivational content', 'Crowd engagement'],
        characteristics: ['Consistent high energy', 'Positive vibes', 'Danceability focus']
      },
      'Emotional Storyteller': {
        description: 'A deeply expressive artist who uses music to explore complex emotions and tell compelling personal stories.',
        strengths: ['Emotional authenticity', 'Lyrical depth', 'Atmospheric production'],
        characteristics: ['Deep emotional range', 'Introspective themes', 'Variable energy']
      },
      'Accessible Populist': {
        description: 'A consistent artist who creates broadly appealing music with familiar structures and universal themes.',
        strengths: ['Mass appeal', 'Reliable quality', 'Clear messaging'],
        characteristics: ['Consistent style', 'Familiar patterns', 'Mainstream appeal']
      },
      'Artistic Composer': {
        description: 'A sophisticated artist who combines emotional depth with complex musical arrangements and thoughtful composition.',
        strengths: ['Musical sophistication', 'Emotional intelligence', 'Technical skill'],
        characteristics: ['Complex arrangements', 'Emotional nuance', 'Artistic integrity']
      },
      'Dynamic Creator': {
        description: 'A versatile artist who brings high energy and creative flair to diverse musical styles and concepts.',
        strengths: ['Versatile creativity', 'Dynamic range', 'Fresh perspectives'],
        characteristics: ['Creative energy', 'Style diversity', 'Innovative approach']
      },
      'Balanced Artist': {
        description: 'A well-rounded artist who effectively balances emotional depth with consistency and broad appeal.',
        strengths: ['Emotional intelligence', 'Consistent quality', 'Broad appeal'],
        characteristics: ['Emotional balance', 'Reliable output', 'Universal themes']
      },
      'Versatile Musician': {
        description: 'A flexible artist who adapts their style across different moods and genres while maintaining their unique identity.',
        strengths: ['Adaptability', 'Genre flexibility', 'Consistent identity'],
        characteristics: ['Style versatility', 'Mood variation', 'Identity consistency']
      }
    };

    return descriptions[artistType] || descriptions['Versatile Musician'];
  };

  const generateSimilarArtists = (artistType: string): string[] => {
    const similarByType: Record<string, string[]> = {
      'Experimental Innovator': ['Aphex Twin', 'Björk', 'Radiohead', 'Flying Lotus'],
      'High-Energy Performer': ['The Chainsmokers', 'Calvin Harris', 'Skrillex', 'Marshmello'],
      'Emotional Storyteller': ['Bon Iver', 'Sufjan Stevens', 'Lana Del Rey', 'The National'],
      'Accessible Populist': ['Ed Sheeran', 'Taylor Swift', 'Bruno Mars', 'Adele'],
      'Artistic Composer': ['Thom Yorke', 'Joni Mitchell', 'Frank Ocean', 'Kendrick Lamar'],
      'Dynamic Creator': ['Kanye West', 'Gorillaz', 'Beck', 'Prince'],
      'Balanced Artist': ['Coldplay', 'John Mayer', 'Alicia Keys', 'Sam Smith'],
      'Versatile Musician': ['David Bowie', 'The Beatles', 'Arcade Fire', 'Tame Impala']
    };

    return similarByType[artistType] || similarByType['Versatile Musician'];
  };

  const filteredArtists = artistProfiles.filter(profile =>
    profile.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const personalityData = selectedArtist ? Object.entries(selectedArtist.personalityTraits).map(([trait, value]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1),
    value: value * 100,
    fullMark: 100
  })) : [];

  const featureRanges = selectedArtist ? [
    { feature: 'Valence', min: selectedArtist.musicStyle.valenceRange.min * 100, max: selectedArtist.musicStyle.valenceRange.max * 100, avg: selectedArtist.musicStyle.valenceRange.avg * 100 },
    { feature: 'Energy', min: selectedArtist.musicStyle.energyRange.min * 100, max: selectedArtist.musicStyle.energyRange.max * 100, avg: selectedArtist.musicStyle.energyRange.avg * 100 },
    { feature: 'Danceability', min: selectedArtist.musicStyle.danceabilityRange.min * 100, max: selectedArtist.musicStyle.danceabilityRange.max * 100, avg: selectedArtist.musicStyle.danceabilityRange.avg * 100 },
    { feature: 'Acousticness', min: selectedArtist.musicStyle.acousticnessRange.min * 100, max: selectedArtist.musicStyle.acousticnessRange.max * 100, avg: selectedArtist.musicStyle.acousticnessRange.avg * 100 }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <User className="w-6 h-6 text-purple-400" />
          Artist Personality Profiling
        </h2>
        <p className="text-gray-400">
          AI-powered analysis of artist personalities based on musical patterns
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search artists..."
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>
        <Button
          onClick={analyzeArtists}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isAnalyzing ? (
            <Brain className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Brain className="w-4 h-4 mr-2" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
        </Button>
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isAnalyzing ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <Brain className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Analyzing artist personalities...</p>
            </div>
          </div>
        ) : (
          filteredArtists.map((profile, index) => (
            <motion.div
              key={profile.artistName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all duration-300"
                onClick={() => setSelectedArtist(profile)}
              >
                <div className="space-y-4">
                  {/* Artist Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{profile.artistName}</h3>
                      <p className="text-sm text-gray-400">{profile.trackCount} tracks analyzed</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-400">{profile.artistType}</div>
                    </div>
                  </div>

                  {/* Emotional Profile */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-gray-400">Dominant Emotion</div>
                      <div className="text-sm font-medium text-white">{profile.emotionalProfile.dominant}</div>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-gray-400">Secondary</div>
                      <div className="text-sm font-medium text-white">{profile.emotionalProfile.secondary}</div>
                    </div>
                  </div>

                  {/* Top Traits */}
                  <div>
                    <div className="text-sm font-medium text-gray-300 mb-2">Key Traits</div>
                    {(() => {
                      const topTraits = Object.entries(profile.personalityTraits)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 2);
                      return (
                        <div className="space-y-1">
                          {topTraits.map(([trait, value]) => (
                            <div key={trait} className="flex justify-between items-center">
                              <span className="text-xs text-gray-400 capitalize">{trait}</span>
                              <span className="text-xs text-white">{(value * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {(profile.musicStyle.valenceRange.avg * 100).toFixed(0)}% Valence
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {(profile.musicStyle.energyRange.avg * 100).toFixed(0)}% Energy
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Detailed Artist Profile */}
      {selectedArtist && (
        <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">{selectedArtist.artistName}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  {selectedArtist.artistType}
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  {selectedArtist.trackCount} tracks
                </span>
              </div>
            </div>
            <Button
              onClick={() => setSelectedArtist(null)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personality Radar */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Personality Profile
              </h3>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={personalityData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis 
                      dataKey="trait" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <Radar
                      name="Personality"
                      dataKey="value"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-gray-300 text-sm">{selectedArtist.description}</p>
            </div>

            {/* Musical Features */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Musical Style Analysis
              </h3>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureRanges}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="feature" 
                      stroke="#9CA3AF" 
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                    />
                    <Bar dataKey="avg" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Emotional Profile Detail */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-lg font-semibold text-purple-400">
                    {selectedArtist.emotionalProfile.dominant}
                  </div>
                  <div className="text-xs text-gray-400">Dominant Emotion</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-lg font-semibold text-blue-400">
                    {selectedArtist.emotionalProfile.secondary}
                  </div>
                  <div className="text-xs text-gray-400">Secondary</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <div className="text-lg font-semibold text-green-400">
                    {(selectedArtist.emotionalProfile.range * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">Range</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Strengths */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {selectedArtist.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Characteristics */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Characteristics
              </h4>
              <ul className="space-y-2">
                {selectedArtist.characteristics.map((char, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            {/* Similar Artists */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Similar Artists
              </h4>
              <div className="space-y-2">
                {selectedArtist.similarArtists.slice(0, 4).map((artist, idx) => (
                  <div key={idx} className="px-3 py-2 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-300">{artist}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
