export interface Track {
  id?: string;
  name: string;
  artist: string;
  album?: string;
  popularity: number;
  duration_ms?: number;
  release_date?: string;
  artist_genres?: string[];
  explicit?: boolean;
  valence: number;
  energy: number;
  mood_score: number;
  mood_category: string;
  ai_emotion?: string;
  ai_confidence?: number;
  detected_emotions?: string[];
  analysis_method?: string;
  danceability: number;
  acousticness?: number;
  speechiness?: number;
  instrumentalness?: number;
  intensity?: number;
}

export interface MoodSummary {
  total_tracks: number;
  mood_score: number;
  avg_energy: number;
  avg_valence: number;
  avg_danceability: number;
  avg_acousticness: number;
  avg_speechiness: number;
  avg_instrumentalness: number;
  avg_popularity: number;
  dominant_mood: string;
  most_common_mood: string;
  mood_distribution: Record<string, number>;
  emotional_range: number;
  using_estimates: boolean;
}

export interface AIInsights {
  emotional_analysis: string;
  personality_traits: string[];
  recommendations: string[];
  mental_health_tips: string[];
  mood_coaching: string;
}

export interface AnalysisResult {
  tracks: Track[];
  mood_summary: MoodSummary;
  ai_insights?: AIInsights;
  playlist_name?: string;
}

export interface ApiError {
  message: string;
  details?: string;
}
