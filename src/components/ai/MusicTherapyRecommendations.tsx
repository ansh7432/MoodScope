'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Brain, 
  Moon, 
  Zap, 
  Target, 
  Shield,
  Clock,
  Play,
  Users,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { generateTherapyRecommendation } from '@/lib/ai-service';

interface TherapySession {
  id: string;
  title: string;
  objective: string;
  duration: number; // minutes
  techniques: string[];
  recommendedTracks: string[];
  instructions: string[];
  benefits: string[];
  mood: 'calm' | 'energetic' | 'balanced' | 'focus' | 'sleep' | 'social';
  intensity: 'low' | 'medium' | 'high';
}

interface PersonalizedRecommendation {
  sessionId: string;
  personalizedInstructions: string[];
  adaptedTracks: string[];
  customBenefits: string[];
  estimatedEffectiveness: number;
}

interface MusicTherapyProps {
  currentAnalysis: AnalysisResult;
  userGoals?: string[];
}

const therapySessions: TherapySession[] = [
  {
    id: 'anxiety-relief',
    title: 'Anxiety Relief Session',
    objective: 'Reduce anxiety and promote relaxation through guided music listening',
    duration: 20,
    techniques: ['Progressive Muscle Relaxation', 'Deep Breathing', 'Mindful Listening'],
    recommendedTracks: ['Ambient nature sounds', 'Slow instrumental music', 'Binaural beats'],
    instructions: [
      'Find a comfortable, quiet space where you won\'t be disturbed',
      'Begin with 5 minutes of deep breathing exercises',
      'Listen to the selected tracks while focusing on your breath',
      'Practice progressive muscle relaxation during the session',
      'End with 2 minutes of silence and reflection'
    ],
    benefits: ['Reduced anxiety levels', 'Lower heart rate', 'Improved emotional regulation'],
    mood: 'calm',
    intensity: 'low'
  },
  {
    id: 'energy-boost',
    title: 'Energy Enhancement Session',
    objective: 'Increase motivation and energy levels through uplifting music',
    duration: 15,
    techniques: ['Movement Therapy', 'Rhythmic Breathing', 'Positive Visualization'],
    recommendedTracks: ['Upbeat instrumental', 'Motivational songs', 'High-energy rhythms'],
    instructions: [
      'Start with gentle stretching or light movement',
      'Listen to energizing music while moving rhythmically',
      'Practice positive affirmations during instrumental breaks',
      'Visualize achieving your daily goals',
      'End with a moment of gratitude'
    ],
    benefits: ['Increased motivation', 'Enhanced mood', 'Better focus and clarity'],
    mood: 'energetic',
    intensity: 'high'
  },
  {
    id: 'emotional-balance',
    title: 'Emotional Balance Session',
    objective: 'Stabilize emotions and promote inner harmony',
    duration: 25,
    techniques: ['Emotional Regulation', 'Mindfulness', 'Musical Expression'],
    recommendedTracks: ['Classical music', 'Meditative soundscapes', 'Gentle melodies'],
    instructions: [
      'Begin by identifying your current emotional state',
      'Select music that matches your mood initially',
      'Gradually transition to more balanced, harmonious pieces',
      'Practice emotional awareness without judgment',
      'Journal about your experience afterward'
    ],
    benefits: ['Better emotional stability', 'Increased self-awareness', 'Reduced mood swings'],
    mood: 'balanced',
    intensity: 'medium'
  },
  {
    id: 'focus-enhancement',
    title: 'Cognitive Focus Session',
    objective: 'Improve concentration and mental clarity through strategic music use',
    duration: 30,
    techniques: ['Attention Training', 'Cognitive Enhancement', 'Flow State Induction'],
    recommendedTracks: ['Lo-fi beats', 'Classical baroque', 'Ambient electronic'],
    instructions: [
      'Clear your workspace of distractions',
      'Start with 5 minutes of silence to center yourself',
      'Begin playing focus-enhancing background music',
      'Work on a specific task while maintaining awareness of the music',
      'Take breaks every 25 minutes to reset your attention'
    ],
    benefits: ['Improved concentration', 'Enhanced productivity', 'Better task performance'],
    mood: 'focus',
    intensity: 'medium'
  },
  {
    id: 'sleep-preparation',
    title: 'Sleep Preparation Session',
    objective: 'Prepare mind and body for restorative sleep',
    duration: 35,
    techniques: ['Sleep Hygiene', 'Relaxation Response', 'Circadian Rhythm Support'],
    recommendedTracks: ['Soft lullabies', 'Nature sounds', 'Delta wave frequencies'],
    instructions: [
      'Begin 1 hour before intended bedtime',
      'Dim the lights and eliminate screen exposure',
      'Listen to calming music while doing gentle stretches',
      'Practice gratitude meditation during quiet passages',
      'Allow the music to gradually fade as you drift toward sleep'
    ],
    benefits: ['Faster sleep onset', 'Improved sleep quality', 'Reduced nighttime anxiety'],
    mood: 'sleep',
    intensity: 'low'
  },
  {
    id: 'social-connection',
    title: 'Social Bonding Session',
    objective: 'Foster connection and empathy through shared musical experiences',
    duration: 40,
    techniques: ['Group Listening', 'Emotional Mirroring', 'Shared Experience'],
    recommendedTracks: ['Collaborative playlists', 'Cultural music', 'Sing-along favorites'],
    instructions: [
      'Gather with friends, family, or support group',
      'Create a shared playlist with everyone\'s contributions',
      'Take turns sharing what each song means to you',
      'Practice active listening when others are sharing',
      'End with a group reflection on the shared experience'
    ],
    benefits: ['Strengthened relationships', 'Increased empathy', 'Reduced feelings of isolation'],
    mood: 'social',
    intensity: 'medium'
  }
];

export default function MusicTherapyRecommendations({ currentAnalysis, userGoals = [] }: MusicTherapyProps) {
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [personalizedRecs, setPersonalizedRecs] = useState<PersonalizedRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  // Remove unused state for now
  // const [aiRecommendations, setAiRecommendations] = useState<any>(null);

  const generatePersonalizedRecommendations = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Use real AI service for therapy recommendations
      const primaryGoal = userGoals.length > 0 ? userGoals[0] : 'general-wellness';
      
      // Transform currentAnalysis to MusicData format expected by AI service
      const musicData = {
        avgValence: currentAnalysis.mood_summary.avg_valence,
        avgEnergy: currentAnalysis.mood_summary.avg_energy,
        avgDanceability: currentAnalysis.mood_summary.avg_danceability || 0.5,
        tracks: [] // AI service doesn't need actual tracks for therapy recommendations
      };
      
      const aiResult = await generateTherapyRecommendation(primaryGoal, musicData);
      
      // Convert AI result to component format
      const aiBasedRecommendations = therapySessions.map(session => {
        const effectiveness = calculateSessionEffectiveness(session, currentAnalysis.mood_summary.mood_score, 
                                                          currentAnalysis.mood_summary.avg_energy, 
                                                          currentAnalysis.mood_summary.avg_valence);
        
        // Enhance with AI insights
        const personalizedInstructions = [
          ...adaptInstructions(session, currentAnalysis),
          `AI Insight: ${aiResult.recommendation}`
        ];
        
        const adaptedTracks = [
          ...adaptTrackRecommendations(session, currentAnalysis),
          ...aiResult.techniques.map((technique: string) => `Track selection optimized for ${technique}`)
        ];
        
        const customBenefits = [
          ...adaptBenefits(session, currentAnalysis),
          `Expected session duration: ${aiResult.duration}`,
          `AI confidence level: ${(aiResult.confidence * 100).toFixed(0)}%`
        ];
        
        return {
          sessionId: session.id,
          personalizedInstructions,
          adaptedTracks,
          customBenefits,
          estimatedEffectiveness: effectiveness * aiResult.confidence
        };
      });
      
      aiBasedRecommendations.sort((a, b) => b.estimatedEffectiveness - a.estimatedEffectiveness);
      setPersonalizedRecs(aiBasedRecommendations);
      // setAiRecommendations(aiResult); // Removed unused state
    } catch (error) {
      console.error('AI therapy recommendation failed:', error);
      // Fallback to mock recommendations
      await generateMockRecommendations();
    } finally {
      setIsGenerating(false);
    }
  }, [currentAnalysis, userGoals]);

  const generateMockRecommendations = async () => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const moodScore = currentAnalysis.mood_summary.mood_score;
    const energy = currentAnalysis.mood_summary.avg_energy;
    const valence = currentAnalysis.mood_summary.avg_valence;
    
    const recommendations = therapySessions.map(session => {
      const effectiveness = calculateSessionEffectiveness(session, moodScore, energy, valence);
      const personalizedInstructions = adaptInstructions(session, currentAnalysis);
      const adaptedTracks = adaptTrackRecommendations(session, currentAnalysis);
      const customBenefits = adaptBenefits(session, currentAnalysis);
      
      return {
        sessionId: session.id,
        personalizedInstructions,
        adaptedTracks,
        customBenefits,
        estimatedEffectiveness: effectiveness
      };
    });
    
    recommendations.sort((a, b) => b.estimatedEffectiveness - a.estimatedEffectiveness);
    setPersonalizedRecs(recommendations);
  };

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, [currentAnalysis, userGoals]);

  const calculateSessionEffectiveness = (session: TherapySession, moodScore: number, energy: number, valence: number): number => {
    let effectiveness = 0.5; // Base effectiveness
    
    // Adjust based on current mood state vs session objective
    if (session.mood === 'calm' && (energy < 0.5 || valence < 0.4)) {
      effectiveness += 0.3; // High need for calming
    } else if (session.mood === 'energetic' && energy < 0.4) {
      effectiveness += 0.4; // High need for energy boost
    } else if (session.mood === 'balanced' && Math.abs(valence - 0.5) > 0.3) {
      effectiveness += 0.3; // High need for balance
    } else if (session.mood === 'focus' && energy > 0.3 && energy < 0.7) {
      effectiveness += 0.2; // Good state for focus work
    } else if (session.mood === 'sleep' && energy < 0.3) {
      effectiveness += 0.4; // Ready for sleep preparation
    }
    
    // Factor in user goals
    if (userGoals.includes('stress-reduction') && session.mood === 'calm') effectiveness += 0.2;
    if (userGoals.includes('productivity') && session.mood === 'focus') effectiveness += 0.2;
    if (userGoals.includes('sleep-improvement') && session.mood === 'sleep') effectiveness += 0.2;
    
    return Math.min(1, effectiveness);
  };

  const adaptInstructions = (session: TherapySession, analysis: AnalysisResult): string[] => {
    const baseInstructions = [...session.instructions];
    const energy = analysis.mood_summary.avg_energy;
    const valence = analysis.mood_summary.avg_valence;
    
    // Add personalized instructions based on current state
    if (energy < 0.3) {
      baseInstructions.unshift('Note: Your current energy is low - be gentle with yourself and allow extra time for each step');
    } else if (energy > 0.8) {
      baseInstructions.unshift('Your energy is high - you may need extra grounding techniques before beginning');
    }
    
    if (valence < 0.3) {
      baseInstructions.push('Given your current mood, be patient with the process and remember that small improvements are valuable');
    }
    
    return baseInstructions;
  };

  const adaptTrackRecommendations = (session: TherapySession, analysis: AnalysisResult): string[] => {
    const baseTracks = [...session.recommendedTracks];
    const dominantMood = analysis.mood_summary.dominant_mood;
    
    // Adapt track suggestions based on current playlist preferences
    if (dominantMood === 'Happy' && session.mood === 'calm') {
      baseTracks.push('Gentle uplifting melodies to bridge your current positive state');
    } else if (dominantMood === 'Sad' && session.mood === 'energetic') {
      baseTracks.push('Gradually building music that starts slow and gains momentum');
    }
    
    return baseTracks;
  };

  const adaptBenefits = (session: TherapySession, analysis: AnalysisResult): string[] => {
    const baseBenefits = [...session.benefits];
    const energy = analysis.mood_summary.avg_energy;
    
    if (energy < 0.4 && session.mood === 'energetic') {
      baseBenefits.push('Specifically helpful for combating low energy states');
    }
    
    return baseBenefits;
  };

  const markSessionCompleted = (sessionId: string) => {
    setCompletedSessions(prev => [...prev, sessionId]);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'calm': return <Moon className="w-5 h-5 text-blue-400" />;
      case 'energetic': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'balanced': return <Target className="w-5 h-5 text-green-400" />;
      case 'focus': return <Brain className="w-5 h-5 text-purple-400" />;
      case 'sleep': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'social': return <Users className="w-5 h-5 text-pink-400" />;
      default: return <Heart className="w-5 h-5 text-red-400" />;
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-400" />
          Music Therapy Recommendations
        </h2>
        <p className="text-gray-400">
          Personalized therapeutic music sessions based on your current emotional state
        </p>
      </div>

      {/* Current Mood Assessment */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {(currentAnalysis.mood_summary.mood_score * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Mood Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {(currentAnalysis.mood_summary.avg_energy * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Energy Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {currentAnalysis.mood_summary.dominant_mood}
            </div>
            <div className="text-sm text-gray-400">Dominant Mood</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {completedSessions.length}
            </div>
            <div className="text-sm text-gray-400">Sessions Completed</div>
          </div>
        </div>
      </Card>

      {/* Session Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isGenerating ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Generating personalized recommendations...</p>
            </div>
          </div>
        ) : (
          therapySessions.map((session, index) => {
            const personalizedRec = personalizedRecs.find(rec => rec.sessionId === session.id);
            const isCompleted = completedSessions.includes(session.id);
            const effectiveness = personalizedRec?.estimatedEffectiveness || 0;
            
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedSession?.id === session.id
                      ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50'
                      : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30'
                  } ${isCompleted ? 'ring-2 ring-green-500/30' : ''}`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="space-y-4">
                    {/* Session Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMoodIcon(session.mood)}
                        <h3 className="font-semibold text-white">{session.title}</h3>
                      </div>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>

                    {/* Effectiveness Meter */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Effectiveness for you</span>
                        <span className="text-sm font-medium text-purple-400">
                          {(effectiveness * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${effectiveness * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">{session.objective}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.duration} min
                        </span>
                        <span className={`capitalize ${getIntensityColor(session.intensity)}`}>
                          {session.intensity} intensity
                        </span>
                      </div>
                    </div>

                    {/* Quick Benefits */}
                    <div className="flex flex-wrap gap-1">
                      {session.benefits.slice(0, 2).map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Detailed Session View */}
      {selectedSession && (
        <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {getMoodIcon(selectedSession.mood)}
                {selectedSession.title}
              </h2>
              <p className="text-gray-400 mt-2">{selectedSession.objective}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => markSessionCompleted(selectedSession.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={completedSessions.includes(selectedSession.id)}
              >
                {completedSessions.includes(selectedSession.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </>
                )}
              </Button>
              <Button
                onClick={() => setSelectedSession(null)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instructions & Techniques */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Personalized Instructions
                </h3>
                <ol className="space-y-3">
                  {(personalizedRecs.find(rec => rec.sessionId === selectedSession.id)?.personalizedInstructions || selectedSession.instructions).map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-300">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Therapeutic Techniques
                </h3>
                <div className="space-y-2">
                  {selectedSession.techniques.map((technique, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{technique}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations & Benefits */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recommended Music</h3>
                <div className="space-y-2">
                  {(personalizedRecs.find(rec => rec.sessionId === selectedSession.id)?.adaptedTracks || selectedSession.recommendedTracks).map((track, idx) => (
                    <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-300">{track}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Expected Benefits</h3>
                <div className="space-y-2">
                  {(personalizedRecs.find(rec => rec.sessionId === selectedSession.id)?.customBenefits || selectedSession.benefits).map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-300 mb-1">Important Note</h4>
                    <p className="text-sm text-blue-200">
                      This session has been personalized based on your current music listening patterns. 
                      If you experience any discomfort, feel free to modify the approach or consult with a healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <Button
          onClick={generatePersonalizedRecommendations}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Heart className="w-5 h-5 mr-2" />
          )}
          {isGenerating ? 'Updating...' : 'Refresh Recommendations'}
        </Button>
      </div>
    </div>
  );
}
