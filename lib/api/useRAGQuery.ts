/**
 * React Hook for RAG Query Integration
 * 
 * This custom hook provides an easy way to integrate the RAG API
 * into React components with proper loading states and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { ragQueryManager, QueryResponse, UseRAGQueryState, checkAPIHealth } from './rag';

export interface UseRAGQueryReturn {
  query: (question: string) => Promise<void>;
  data: QueryResponse | null;
  loading: boolean;
  error: string | null;
  isWarmingUp: boolean;
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

  const query = useCallback(async (question: string) => {
    try {
      await ragQueryManager.query(question);
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