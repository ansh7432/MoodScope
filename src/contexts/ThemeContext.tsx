'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChartTheme {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: string;
    text: string;
    border: string;
  };
  mood: 'energetic' | 'calm' | 'vibrant' | 'neutral' | 'dark' | 'nature';
}

interface ThemeContextType {
  currentTheme: ChartTheme;
  setTheme: (theme: ChartTheme) => void;
  applyTheme: (theme: ChartTheme) => void;
}

const defaultTheme: ChartTheme = {
  id: 'sunset',
  name: 'Sunset Glow',
  icon: () => null,
  description: 'Warm oranges and purples like a beautiful sunset',
  mood: 'energetic',
  colors: {
    primary: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8066', '#E63946'],
    secondary: ['#6A4C93', '#8E44AD', '#9B59B6', '#D63384', '#E91E63'],
    accent: ['#FFE66D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.2)'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ChartTheme>(defaultTheme);

  const applyTheme = (theme: ChartTheme) => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    
    // Set primary colors
    theme.colors.primary.forEach((color, index) => {
      root.style.setProperty(`--chart-color-${index + 1}`, color);
    });
    
    // Set secondary colors
    theme.colors.secondary.forEach((color, index) => {
      root.style.setProperty(`--chart-secondary-${index + 1}`, color);
    });
    
    // Set accent colors
    theme.colors.accent.forEach((color, index) => {
      root.style.setProperty(`--chart-accent-${index + 1}`, color);
    });
    
    // Set background and text
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-border', theme.colors.border);
    
    // Store theme preference
    localStorage.setItem('moodscope-theme', JSON.stringify(theme));
  };

  const setTheme = (theme: ChartTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('moodscope-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentTheme(theme);
        applyTheme(theme);
      } catch {
        applyTheme(defaultTheme);
      }
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
