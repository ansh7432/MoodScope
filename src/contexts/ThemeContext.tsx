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
  id: 'midnight',
  name: 'Midnight Sky',
  icon: () => null,
  description: 'Dark blues and silvers for a professional night-time feel',
  mood: 'dark',
  colors: {
    primary: ['#191970', '#000080', '#0000CD', '#4169E1', '#1E90FF'],
    secondary: ['#2F4F4F', '#708090', '#778899', '#B0C4DE', '#C0C0C0'],
    accent: ['#FFFAF0', '#F5F5DC', '#FFEFD5', '#FFE4B5', '#FFDAB9'],
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
