/**
 * React Hook for RAG Query Integration
 * 
 * This custom hook provides an easy way to integrate the RAG API
 * into React components with proper loading states and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { ragQueryManager, QueryResponse, UseRAGQueryState, checkAPIHealth, QueryRequest, WarmingStatus } from './rag';

export interface UseRAGQueryReturn {
  query: (question: string, userContext?: QueryRequest['userContext']) => Promise<void>;
  data: QueryResponse | null;
  loading: boolean;
  error: string | null;
  isWarmingUp: boolean;
  warmingStatus?: WarmingStatus;
  reset: () => void;
}

/**
 * Custom hook for querying the RAG API
 */
export function useRAGQuery(): UseRAGQueryReturn {
  const [state, setState] = useState<UseRAGQueryState>(ragQueryManager.getState());

  useEffect(() => {
    return ragQueryManager.subscribe(setState);
  }, []);

  const query = useCallback(async (question: string, userContext?: QueryRequest['userContext']) => {
    try {
      await ragQueryManager.query(question, userContext);
    } catch (error) {
      // Error is already handled in the manager
      console.error('Query failed:', error);
    }
  }, []);

  const reset = useCallback(() => {
    ragQueryManager.reset();
  }, []);

  return {
    query,
    data: state.data,
    loading: state.loading,
    error: state.error,
    isWarmingUp: state.isWarmingUp,
    warmingStatus: state.warmingStage && state.warmingProgress !== undefined ? {
      stage: state.warmingStage,
      progress: state.warmingProgress,
      message: getWarmingMessage(state.warmingStage, state.warmingProgress),
      estimatedTime: getEstimatedTime(state.warmingStage)
    } : undefined,
    reset,
  };
}

/**
 * Hook for checking API health
 */
export function useAPIHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const healthy = await checkAPIHealth();
      setIsHealthy(healthy);
    } catch (error) {
      console.error('Health check failed:', error);
      setIsHealthy(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    checking,
    checkHealth,
  };
}

// Helper functions for warming status
function getWarmingMessage(stage: string, progress: number): string {
  const messages = {
    initializing: 'Starting AI assistant...',
    connecting: 'Connecting to server...',
    loading: 'Loading AI models...',
    ready: 'AI assistant is ready!'
  };
  return messages[stage as keyof typeof messages] || 'Preparing AI assistant...';
}

function getEstimatedTime(stage: string): number {
  const times = {
    initializing: 30,
    connecting: 20,
    loading: 10,
    ready: 0
  };
  return times[stage as keyof typeof times] || 15;
}