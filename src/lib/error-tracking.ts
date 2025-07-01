'use client';

// Enhanced error handling and logging system
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp: number;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'api' | 'ui' | 'performance' | 'user' | 'system';
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorReport[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Setup global error handlers
  private setupGlobalErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // Handle JavaScript errors
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          component: 'Global',
          action: 'JavaScript Error',
          severity: 'high',
          category: 'system',
        });
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(new Error(event.reason), {
          component: 'Global',
          action: 'Unhandled Promise Rejection',
          severity: 'high',
          category: 'system',
        });
      });
    }
  }

  // Capture and log errors
  captureError(
    error: Error,
    context: Partial<ErrorContext> & { severity: ErrorReport['severity']; category: ErrorReport['category'] }
  ): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        ...context,
      },
      severity: context.severity,
      category: context.category,
    };

    this.errors.push(errorReport);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${context.severity}]`);
      console.error('Message:', error.message);
      console.error('Component:', context.component);
      console.error('Action:', context.action);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // Send to error tracking service in production
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true') {
      this.sendToErrorService(errorReport);
    }

    // Show user-friendly error for critical errors
    if (context.severity === 'critical') {
      this.showUserError(error.message);
    }
  }

  // API-specific error handler
  captureApiError(
    error: unknown,
    endpoint: string,
    requestData?: Record<string, unknown>
  ): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown API error';
    
    this.captureError(new Error(errorMessage), {
      component: 'API',
      action: `API call to ${endpoint}`,
      severity: 'medium',
      category: 'api',
      ...(requestData && { requestData }),
    });
  }

  // User action error handler
  captureUserError(
    error: Error,
    component: string,
    action: string
  ): void {
    this.captureError(error, {
      component,
      action,
      severity: 'low',
      category: 'user',
    });
  }

  // Performance error handler
  capturePerformanceError(
    operation: string,
    duration: number,
    threshold: number
  ): void {
    this.captureError(new Error(`Performance threshold exceeded: ${operation}`), {
      component: 'Performance',
      action: `${operation} took ${duration}ms (threshold: ${threshold}ms)`,
      severity: 'medium',
      category: 'performance',
    });
  }

  // Send error to external service
  private sendToErrorService(errorReport: ErrorReport): void {
    // Implement integration with error tracking services like Sentry, LogRocket, etc.
    if (typeof window !== 'undefined') {
      // Example implementation
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      }).catch(() => {
        // Silently fail if error reporting fails
        console.warn('Failed to send error report');
      });
    }
  }

  // Show user-friendly error message
  private showUserError(message: string): void {
    // This could be replaced with a toast notification or modal
    if (typeof window !== 'undefined') {
      // You might want to replace this with a proper notification system
      console.error('Critical error occurred:', message);
    }
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
    recent: ErrorReport[];
  } {
    const bySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = this.errors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = this.errors
      .filter(error => Date.now() - error.context.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
      .slice(-10); // Last 10 errors

    return {
      total: this.errors.length,
      bySeverity,
      byCategory,
      recent,
    };
  }

  // Clear errors (for testing or cleanup)
  clearErrors(): void {
    this.errors = [];
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// React hook for error boundary
import { useEffect } from 'react';

export const useErrorHandler = (component: string) => {
  useEffect(() => {
    // Component mounted - could add error monitoring setup here
    return () => {
      // Cleanup if needed
    };
  }, [component]);

  return {
    captureError: (error: Error, action: string) => 
      errorTracker.captureUserError(error, component, action),
    captureApiError: (error: unknown, endpoint: string) =>
      errorTracker.captureApiError(error, endpoint),
  };
};

// Error boundary component
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    errorTracker.captureError(error, {
      component: 'ErrorBoundary',
      action: 'Component Crash',
      severity: 'critical',
      category: 'ui',
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return React.createElement(this.props.fallback, {
          error: this.state.error,
          retry: this.retry,
        });
      }

      // Return a simple error message without JSX
      return React.createElement('div', {
        className: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4',
      }, React.createElement('div', {
        className: 'bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full text-center border border-white/20',
      }, [
        React.createElement('div', { 
          key: 'icon',
          className: 'text-red-400 text-6xl mb-4' 
        }, '⚠️'),
        React.createElement('h2', { 
          key: 'title',
          className: 'text-2xl font-bold text-white mb-4' 
        }, 'Something went wrong'),
        React.createElement('p', { 
          key: 'message',
          className: 'text-white/70 mb-6' 
        }, 'We encountered an unexpected error. Our team has been notified.'),
        React.createElement('button', {
          key: 'button',
          onClick: this.retry,
          className: 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity'
        }, 'Try Again')
      ]));
    }

    return this.props.children;
  }
}
