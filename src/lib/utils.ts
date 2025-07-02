import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const moodColors = {
  // Happy/Energetic moods - Warm colors
  'Energetic & Happy': '#FFD700', // Gold
  'Happy & Uplifting': '#FF6B35', // Vibrant Orange
  'Excited & Energetic': '#FF1744', // Bright Red
  'Upbeat & Energetic': '#FF9800', // Orange
  
  // Calm/Peaceful moods - Cool blues and greens
  'Calm & Content': '#4FC3F7', // Light Blue
  'Balanced & Stable': '#66BB6A', // Green
  'Neutral & Balanced': '#78909C', // Blue Grey
  'Contemplative & Peaceful': '#81C784', // Light Green
  'Peaceful & Serene': '#26C6DA', // Cyan
  
  // Emotional/Deep moods - Purples and deep blues
  'Melancholic & Reflective': '#9C27B0', // Purple
  'Melancholic & Thoughtful': '#7986CB', // Indigo
  'Deeply Emotional': '#673AB7', // Deep Purple
  'Atmospheric & Emotional': '#8E24AA', // Medium Purple
  'Vulnerable & Heartfelt': '#EC407A', // Pink
  
  // Sad/Reflective moods - Darker purples and blues
  'Sad & Reflective': '#5C6BC0', // Deep Purple
  'Introspective & Sad': '#3F51B5', // Indigo
  'Melancholic & Sad': '#512DA8', // Deep Purple
  
  // Intense/Dramatic moods - Reds and magentas
  'Intense & Dramatic': '#E91E63', // Pink
  'Passionate & Intense': '#D32F2F', // Red
  'Dramatic & Powerful': '#C2185B', // Dark Pink
  
  // Other/Undefined - Neutral colors
  'Other': '#9E9E9E', // Grey
  'Undefined': '#757575', // Dark Grey
  'Mixed': '#607D8B', // Blue Grey
} as const;

export const gradients = {
  primary: 'from-purple-600 via-blue-600 to-cyan-600',
  secondary: 'from-pink-500 via-red-500 to-yellow-500',
  accent: 'from-green-400 to-blue-600',
  mood: 'from-indigo-500 via-purple-500 to-pink-500',
} as const;

export function formatMoodScore(score: number): string {
  return (score * 100).toFixed(1);
}

export function getMoodEmoji(mood: string): string {
  const emojiMap: Record<string, string> = {
    // Happy/Energetic moods
    'Energetic & Happy': '🎉',
    'Happy & Uplifting': '😊',
    'Excited & Energetic': '⚡',
    'Upbeat & Energetic': '🚀',
    
    // Calm/Peaceful moods
    'Calm & Content': '😌',
    'Balanced & Stable': '⚖️',
    'Neutral & Balanced': '🔘',
    'Contemplative & Peaceful': '�️',
    'Peaceful & Serene': '🌊',
    
    // Emotional/Deep moods
    'Melancholic & Reflective': '🌙',
    'Melancholic & Thoughtful': '💭',
    'Deeply Emotional': '💫',
    'Atmospheric & Emotional': '🌌',
    'Vulnerable & Heartfelt': '💝',
    
    // Sad/Reflective moods
    'Sad & Reflective': '😔',
    'Introspective & Sad': '🤔',
    'Melancholic & Sad': '😞',
    
    // Intense/Dramatic moods
    'Intense & Dramatic': '🔥',
    'Passionate & Intense': '❤️‍🔥',
    'Dramatic & Powerful': '⚡',
    
    // Other/Undefined
    'Other': '🎵',
    'Undefined': '❓',
    'Mixed': '🌈',
  };
  return emojiMap[mood] || '🎵';
}

export function extractPlaylistId(url: string): string | null {
  try {
    // Handle Spotify URI format (spotify:playlist:ID)
    if (url.startsWith('spotify:playlist:')) {
      const parts = url.split(':');
      return parts[2] || null;
    }
    
    // Handle regular URL formats
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Handle different Spotify URL formats
    if (pathname.includes('/playlist/')) {
      const match = pathname.match(/\/playlist\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    }
    
    return null;
  } catch {
    // If URL parsing fails, try to extract from string directly
    const match = url.match(/playlist[:/]([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }
}

export function isValidSpotifyPlaylistUrl(url: string): boolean {
  return extractPlaylistId(url) !== null;
}
