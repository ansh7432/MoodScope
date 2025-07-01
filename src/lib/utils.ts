import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const moodColors = {
  'Energetic & Happy': '#FFD700',
  'Calm & Content': '#87CEEB',
  'Intense & Dramatic': '#FF6B6B',
  'Melancholic & Reflective': '#9370DB',
  'Neutral & Balanced': '#98FB98',
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
    'Energetic & Happy': '🎉',
    'Calm & Content': '😌',
    'Intense & Dramatic': '🔥',
    'Melancholic & Reflective': '🌙',
    'Neutral & Balanced': '⚖️',
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
