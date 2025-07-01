// Performance monitoring utility
interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start measuring page load time
  startPageLoad(page: string): void {
    const startTime = performance.now();
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        this.updateMetric(page, { pageLoadTime: loadTime });
      });
    }
  }

  // Measure API response time
  async measureApiCall<T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const responseTime = performance.now() - startTime;
      this.updateMetric(endpoint, { apiResponseTime: responseTime });
      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      this.updateMetric(endpoint, { apiResponseTime: responseTime });
      throw error;
    }
  }

  // Measure component render time
  measureRender(componentName: string): () => void {
    const startTime = performance.now();
    return () => {
      const renderTime = performance.now() - startTime;
      this.updateMetric(componentName, { renderTime });
    };
  }

  // Get memory usage (if available)
  getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
      return memory?.usedJSHeapSize;
    }
    return undefined;
  }

  // Update metrics
  private updateMetric(key: string, update: Partial<PerformanceMetrics>): void {
    const existing = this.metrics.get(key) || {
      pageLoadTime: 0,
      apiResponseTime: 0,
      renderTime: 0,
    };
    
    this.metrics.set(key, { ...existing, ...update });
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance [${key}]:`, this.metrics.get(key));
    }
  }

  // Get all metrics
  getAllMetrics(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics);
  }

  // Report slow operations
  reportSlowOperation(operation: string, duration: number, threshold = 1000): void {
    if (duration > threshold) {
      console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      
      // In production, you might want to send this to an analytics service
      if (process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true') {
        this.sendToAnalytics('slow_operation', {
          operation,
          duration,
          timestamp: Date.now(),
        });
      }
    }
  }

  // Send metrics to analytics service
  private sendToAnalytics(event: string, data: Record<string, unknown>): void {
    // Implement your analytics integration here
    // e.g., Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Analytics integration
      console.log('📈 Analytics:', event, data);
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
import { useEffect } from 'react';

export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    const endMeasurement = performanceMonitor.measureRender(componentName);
    return endMeasurement;
  }, [componentName]);
};

// HOC for performance monitoring
import React from 'react';

export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    usePerformanceMonitoring(componentName);
    return React.createElement(WrappedComponent, props);
  };
}
