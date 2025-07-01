import axios, { InternalAxiosRequestConfig } from 'axios';
import { AnalysisResult, ApiError } from './types';
import { performanceMonitor } from './performance';
import { errorTracker } from './error-tracking';

// Store performance data outside of config
const requestTimestamps = new Map<string, number>();

// Configuration for the Python backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '120000', 10);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for performance monitoring
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Store timestamp using a unique request ID
    const requestId = `${Date.now()}_${Math.random()}`;
    config.headers['X-Request-ID'] = requestId;
    requestTimestamps.set(requestId, Date.now());
    return config;
  },
  (error) => {
    errorTracker.captureApiError(error, 'request-interceptor');
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and performance monitoring
api.interceptors.response.use(
  (response) => {
    // Calculate response time for performance monitoring
    const endTime = Date.now();
    const requestId = response.config.headers['X-Request-ID'] as string;
    const startTime = requestTimestamps.get(requestId) || endTime;
    const responseTime = endTime - startTime;
    
    // Clean up timestamp
    requestTimestamps.delete(requestId);
    
    // Report slow API calls
    performanceMonitor.reportSlowOperation(
      `API: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      responseTime,
      5000 // 5 second threshold
    );
    
    return response;
  },
  (error) => {
    // Calculate response time even for errors
    const endTime = Date.now();
    const requestId = error.config?.headers?.['X-Request-ID'] as string;
    const startTime = requestTimestamps.get(requestId) || endTime;
    const responseTime = endTime - startTime;
    
    // Clean up timestamp
    if (requestId) {
      requestTimestamps.delete(requestId);
    }
    
    // Log error details
    const endpoint = `${error.config?.method?.toUpperCase()} ${error.config?.url}`;
    
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      details: error.response?.data?.details || error.response?.statusText,
    };
    
    // Capture error with context
    errorTracker.captureApiError(error, endpoint, {
      status: error.response?.status,
      responseTime,
      requestData: error.config?.data,
    });
    
    return Promise.reject(apiError);
  }
);

export const moodScopeAPI = {
  /**
   * Analyze a Spotify playlist with performance monitoring
   */
  async analyzePlaylist(playlistUrl: string): Promise<AnalysisResult> {
    return performanceMonitor.measureApiCall(
      async () => {
        const response = await api.post('/analyze', {
          playlist_url: playlistUrl,
        });
        return response.data;
      },
      'analyze-playlist'
    );
  },

  /**
   * Get analysis history with performance monitoring
   */
  async getAnalysisHistory(): Promise<AnalysisResult[]> {
    return performanceMonitor.measureApiCall(
      async () => {
        const response = await api.get('/history');
        return response.data;
      },
      'get-history'
    );
  },

  /**
   * Health check with performance monitoring
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    return performanceMonitor.measureApiCall(
      async () => {
        const response = await api.get('/health');
        return response.data;
      },
      'health-check'
    );
  },

  /**
   * Get demo analysis data with performance monitoring
   */
  async getDemoAnalysis(): Promise<AnalysisResult> {
    return performanceMonitor.measureApiCall(
      async () => {
        const response = await api.get('/demo');
        return response.data;
      },
      'demo-analysis'
    );
  },
};

export default api;
