// TypeScript interfaces for AI/ML services

export interface SentimentResult {
  sentiment: string;
  confidence: number;
  emotions: EmotionResult[];
  keywords: string[];
}

export interface EmotionResult {
  emotion: string;
  score: number;
}

export interface TherapyRecommendation {
  recommendation: string;
  confidence: number;
  duration: string;
  techniques: string[];
}

export interface MusicFeatures {
  spectral_features: SpectralFeatures;
  temporal_features: TemporalFeatures;
  harmonic_features: HarmonicFeatures;
}

export interface SpectralFeatures {
  spectral_centroid: number;
  spectral_rolloff: number;
  mfcc: number[];
}

export interface TemporalFeatures {
  tempo: number;
  rhythm_strength: number;
  beat_consistency: number;
}

export interface HarmonicFeatures {
  key: number;
  mode: number;
  harmonic_complexity: number;
}

export interface FeatureExtractionResult {
  features: MusicFeatures;
  embedding: number[];
  confidence: number;
}

export interface MoodPrediction {
  date: Date;
  predictedMood: number;
  confidence: number;
}

export interface PredictionResult {
  predictions: MoodPrediction[];
  confidence: number;
  trend: string;
  factors: string[];
}

export interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PersonalityAnalysis {
  personality: PersonalityTraits;
  confidence: number;
  insights: string[];
  clustering: string;
}

export interface AudioFeatures {
  valence: number;
  energy: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  tempo?: number;
  key?: number;
  mode?: number;
}

export interface TrackData {
  id: string;
  name: string;
  artist: string;
  valence: number;
  energy: number;
  danceability: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  tempo?: number;
  key?: number;
  mode?: number;
  lyrics?: string;
}

export interface HistoricalData {
  date: Date;
  valence: number;
  energy: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
}

export interface MusicData {
  avgValence: number;
  avgEnergy: number;
  avgDanceability: number;
  tracks: TrackData[];
}

export interface LyricsAnalysis {
  lyrics: string;
  sentiment: SentimentResult;
  emotions: EmotionResult[];
  themes: string[];
  readability: number;
}

export interface HuggingFaceTextClassificationResult {
  label: string;
  score: number;
}

export interface HuggingFaceTextGenerationResult {
  generated_text: string;
}
