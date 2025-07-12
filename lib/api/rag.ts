/**
 * API Service Layer for connecting Next.js frontend to FastAPI RAG backend
 * 
 * This module provides TypeScript interfaces and functions for communicating
 * with the Investim RAG API deployed on Render, with fallback support for
 * when the service is unavailable.
 */

import { getFallbackResponse, shouldUseFallback } from './fallback';
import { performanceMonitor } from './performance';

// Use Next.js API route to avoid CORS issues
const API_URL = '/api/rag';

// TypeScript interfaces matching FastAPI response models
export interface QueryRequest {
  query: string;
  userContext?: {
    riskProfile?: string | null;
    riskScore?: number | null;
    quizAnswers?: Record<number, string>;
    quizCompleted?: boolean;
  };
}

export interface SourceDocument {
  similarity?: number;
  content?: string;
  metadata?: Record<string, any>;
  id?: string;
}

export interface QueryResponse {
  answer: string;
  sources: SourceDocument[];
}

export interface APIError {
  detail: string;
}

/**
 * Enhanced error class for RAG API errors
 */
export class RAGAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError?: boolean,
    public isTimeoutError?: boolean,
    public attempt?: number
  ) {
    super(message);
    this.name = 'RAGAPIError';
  }

  getUserFriendlyMessage(): string {
    if (this.isNetworkError) {
      return 'Unable to connect to the AI assistant. Please check your internet connection.';
    }
    if (this.isTimeoutError) {
      return 'The AI assistant is taking longer than expected. It may be starting up - please try again in a moment.';
    }
    if (this.statusCode === 500) {
      return 'The AI assistant encountered an internal error. Please try again.';
    }
    if (this.statusCode === 503) {
      return 'The AI assistant is temporarily unavailable. Please try again in a few moments.';
    }
    if (this.statusCode === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    return this.message;
  }
}

export interface HealthStatus {
  status: string;
  service: string;
  responseTime?: number;
}

export interface WarmingStatus {
  stage: 'initializing' | 'connecting' | 'loading' | 'ready';
  progress: number;
  message: string;
  estimatedTime?: number;
}

/**
 * Query the RAG system with enhanced error handling and retry logic
 */
export async function queryRAG(
  query: string,
  userContext?: QueryRequest['userContext'],
  maxRetries: number = 3
): Promise<QueryResponse> {
  if (!query.trim()) {
    throw new RAGAPIError('Query cannot be empty');
  }

  const startTime = Date.now();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout per attempt

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, userContext } as QueryRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail: string;
        try {
          const errorData: APIError = await response.json();
          errorDetail = errorData.detail;
        } catch {
          errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new RAGAPIError(
          errorDetail,
          response.status,
          false,
          false,
          attempt + 1
        );
      }

      const data: QueryResponse = await response.json();
      
      if (!data.answer) {
        throw new RAGAPIError(
          'Invalid response: missing answer field',
          response.status,
          false,
          false,
          attempt + 1
        );
      }

      // Record successful query performance
      performanceMonitor.recordQuery(Date.now() - startTime);
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (error instanceof RAGAPIError) {
        // If it's already a RAG error and it's the last attempt, check for fallback
        if (attempt === maxRetries - 1) {
          // Use fallback for service unavailable errors
          if (shouldUseFallback(error)) {
            console.warn('Using fallback response due to service unavailability');
            return getFallbackResponse(query);
          }
          throw error;
        }
      } else if (error instanceof Error) {
        let isNetworkError = false;
        let isTimeoutError = false;
        let errorMessage = error.message;
        
        if (error.name === 'AbortError') {
          isTimeoutError = true;
          errorMessage = 'Request timed out';
        } else if (error.message.includes('Failed to fetch') || 
                   error.message.includes('Network request failed') ||
                   error.message.includes('network')) {
          isNetworkError = true;
          errorMessage = 'Network connection failed';
        }
        
        const ragError = new RAGAPIError(
          errorMessage,
          undefined,
          isNetworkError,
          isTimeoutError,
          attempt + 1
        );
        
        // If it's the last attempt, check for fallback or throw the error
        if (attempt === maxRetries - 1) {
          if (shouldUseFallback(ragError) || ragError.message.includes('Name or service not known')) {
            console.warn('Using fallback response due to service unavailability');
            return getFallbackResponse(query);
          }
          throw ragError;
        }
      }

      // Wait before retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.warn(`Query attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new RAGAPIError(`Max retries (${maxRetries}) exceeded`);
}

/**
 * Check API health status via Next.js API route
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const startTime = Date.now();

    // Test with a simple query to check if the backend is working
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'health check' }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    // Store response time for performance tracking
    if (response.ok && typeof window !== 'undefined') {
      window.localStorage.setItem('lastHealthCheckTime', responseTime.toString());
    }
    
    return response.ok;
  } catch (error) {
    console.warn('Health check failed:', error);
    return false;
  }
}

/**
 * Get detailed health status via Next.js API route
 */
export async function getHealthStatus(): Promise<HealthStatus | null> {
  try {
    // Use health check method since we're going through API route
    const isHealthy = await checkAPIHealth();
    
    if (isHealthy) {
      return {
        status: 'healthy',
        service: 'Investim RAG API (via Next.js proxy)'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get health status:', error);
    return null;
  }
}

/**
 * Advanced API warming with multi-stage progress tracking
 */
export async function warmUpAPI(
  onProgress?: (status: WarmingStatus) => void
): Promise<boolean> {
  const stages: WarmingStatus[] = [
    { stage: 'initializing', progress: 0, message: 'Starting AI assistant...', estimatedTime: 10 },
    { stage: 'connecting', progress: 25, message: 'Connecting to server...', estimatedTime: 20 },
    { stage: 'loading', progress: 50, message: 'Loading AI models...', estimatedTime: 15 },
    { stage: 'ready', progress: 100, message: 'AI assistant is ready!', estimatedTime: 0 }
  ];

  const warmupStartTime = Date.now();
  const isColdStart = !(await checkAPIHealth());

  try {
    let stageIndex = 0;
    const maxAttempts = 6; // Up to 60 seconds total
    let attempts = 0;
    
    // Report initial stage
    if (onProgress) onProgress(stages[stageIndex]);
    
    while (attempts < maxAttempts) {
      const isHealthy = await checkAPIHealth();
      
      if (isHealthy) {
        // Move through remaining stages quickly
        for (let i = stageIndex + 1; i < stages.length; i++) {
          if (onProgress) onProgress(stages[i]);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Record warmup performance
        performanceMonitor.recordWarmup(Date.now() - warmupStartTime, isColdStart);
        return true;
      }
      
      // Progress through stages based on attempts
      const newStageIndex = Math.min(Math.floor((attempts / maxAttempts) * 3), 2);
      if (newStageIndex > stageIndex && onProgress) {
        stageIndex = newStageIndex;
        onProgress(stages[stageIndex]);
      }
      
      // Wait with exponential backoff, max 10s between attempts
      const delay = Math.min(5000 + attempts * 2000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to warm up API:', error);
    return false;
  }
}

/**
 * Hook for React components to use the API with loading states
 */
export interface UseRAGQueryState {
  data: QueryResponse | null;
  loading: boolean;
  error: string | null;
  isWarmingUp: boolean;
  warmingStage?: 'initializing' | 'connecting' | 'loading' | 'ready';
  warmingProgress?: number;
}

export class RAGQueryManager {
  private state: UseRAGQueryState = {
    data: null,
    loading: false,
    error: null,
    isWarmingUp: false,
    warmingStage: undefined,
    warmingProgress: undefined,
  };

  private listeners: Set<(state: UseRAGQueryState) => void> = new Set();
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private lastQueryTime: number = 0;

  constructor() {
    // Load performance metrics on initialization
    if (typeof window !== 'undefined') {
      performanceMonitor.loadMetrics();
    }
  }

  subscribe(listener: (state: UseRAGQueryState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  async query(query: string, userContext?: QueryRequest['userContext']): Promise<QueryResponse> {
    this.state.loading = true;
    this.state.error = null;
    this.notify();

    try {
      // Check if we need to warm up the API
      if (!(await checkAPIHealth())) {
        this.state.isWarmingUp = true;
        this.notify();
        
        const warmingSuccess = await warmUpAPI((status) => {
          this.state.warmingStage = status.stage;
          this.state.warmingProgress = status.progress;
          this.notify();
        });
        
        if (!warmingSuccess) {
          throw new RAGAPIError('Failed to start AI assistant after multiple attempts', 503);
        }
        
        this.state.isWarmingUp = false;
        this.state.warmingStage = undefined;
        this.state.warmingProgress = undefined;
        this.notify();
      }

      const data = await queryRAG(query, userContext);
      this.state.data = data;
      this.state.loading = false;
      this.lastQueryTime = Date.now();
      this.notify();
      
      // Start keep-alive if not already running
      this.startKeepAlive();
      
      return data;
    } catch (error) {
      this.state.error = error instanceof RAGAPIError 
        ? error.getUserFriendlyMessage() 
        : 'An unexpected error occurred';
      this.state.loading = false;
      this.state.isWarmingUp = false;
      this.state.warmingStage = undefined;
      this.state.warmingProgress = undefined;
      this.notify();
      
      throw error;
    }
  }

  getState(): UseRAGQueryState {
    return { ...this.state };
  }

  reset() {
    this.state = {
      data: null,
      loading: false,
      error: null,
      isWarmingUp: false,
      warmingStage: undefined,
      warmingProgress: undefined,
    };
    this.notify();
    this.stopKeepAlive();
  }

  /**
   * Start keep-alive pings to prevent cold starts
   */
  private startKeepAlive() {
    if (this.keepAliveInterval) return;
    
    // Ping every 5 minutes to keep the API warm
    this.keepAliveInterval = setInterval(async () => {
      // Only ping if there was recent activity (within 10 minutes)
      if (Date.now() - this.lastQueryTime < 10 * 60 * 1000) {
        console.log('Sending keep-alive ping to API');
        await checkAPIHealth();
      } else {
        // Stop keep-alive if no recent activity
        this.stopKeepAlive();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Stop keep-alive pings
   */
  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Proactively warm the API (useful on app start)
   */
  async preWarm(): Promise<void> {
    if (await checkAPIHealth()) {
      console.log('API is already warm');
      return;
    }

    this.state.isWarmingUp = true;
    this.notify();

    try {
      await warmUpAPI((status) => {
        this.state.warmingStage = status.stage;
        this.state.warmingProgress = status.progress;
        this.notify();
      });
    } finally {
      this.state.isWarmingUp = false;
      this.state.warmingStage = undefined;
      this.state.warmingProgress = undefined;
      this.notify();
    }
  }
}

// Export singleton instance
export const ragQueryManager = new RAGQueryManager();