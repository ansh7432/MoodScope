'use client';

// Performance optimization utilities
import { useEffect, useCallback, useState } from 'react';

// Debounce hook for search inputs and API calls
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Optimized state updater for complex objects
export function useOptimizedState<T extends Record<string, unknown>>(
  initialState: T
) {
  const [state, setState] = useState<T>(initialState);

  const updateState = useCallback((updates: Partial<T>) => {
    setState(prevState => {
      // Only update if there are actual changes
      const hasChanges = Object.keys(updates).some(
        key => prevState[key] !== updates[key]
      );

      if (!hasChanges) {
        return prevState;
      }

      return { ...prevState, ...updates };
    });
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, updateState, resetState] as const;
}

// Image optimization helper
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width?: number,
  height?: number
) {
  return {
    src,
    alt,
    width,
    height,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  const criticalEndpoints = ['/api/health', '/api/demo'];
  criticalEndpoints.forEach(endpoint => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = endpoint;
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Bundle size analysis (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('📦 Performance Analysis:', {
    timing: typeof window !== 'undefined' ? window.performance.timing : 'N/A',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
  });
}