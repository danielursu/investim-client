import { useState } from 'react';
import { RagResponse, ChatbotApiError } from '@/types';
import { useRAGQuery } from '@/lib/api/useRAGQuery';
import { RAGAPIError } from '@/lib/api/rag';
import { 
  useChatRiskProfile, 
  useChatRiskScore, 
  useChatQuizAnswers,
  useChatQuizCompleted 
} from '@/stores/chatStore';

/**
 * Hook for managing chat API calls and error handling
 * Centralizes RAG API communication logic with enhanced cold start support
 */
export interface UseChatAPIState {
  isLoading: boolean;
  error: string | null;
  isWarmingUp: boolean;
}

export interface UseChatAPIActions {
  askRag: (query: string) => Promise<RagResponse>;
  clearError: () => void;
}

export interface UseChatAPIReturn extends UseChatAPIState, UseChatAPIActions {}

export const useChatAPI = (): UseChatAPIReturn => {
  const { query: queryRAG, loading, error: ragError, isWarmingUp, reset } = useRAGQuery();
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Get user profile data for context
  const riskProfile = useChatRiskProfile();
  const riskScore = useChatRiskScore();
  const quizAnswers = useChatQuizAnswers();
  const quizCompleted = useChatQuizCompleted();

  const askRag = async (query: string): Promise<RagResponse> => {
    setLocalError(null);

    try {
      // Prepare user context if quiz is completed
      const userContext = quizCompleted ? {
        riskProfile,
        riskScore,
        quizAnswers,
        quizCompleted
      } : undefined;

      await queryRAG(query, userContext);
      
      // The queryRAG function handles the API call and updates the manager state
      // We need to get the latest data from the manager
      const { ragQueryManager } = await import('@/lib/api/rag');
      const state = ragQueryManager.getState();
      
      if (state.error) {
        throw new ChatbotApiError(state.error);
      }
      
      if (!state.data) {
        throw new ChatbotApiError('No response received from assistant');
      }

      // Convert QueryResponse to RagResponse format
      const ragResponse: RagResponse = {
        answer: state.data.answer,
        sources: state.data.sources.map(source => ({
          id: source.id,
          content: source.content || '',
          metadata: source.metadata || {},
        })),
      };

      return ragResponse;
    } catch (err) {
      let errorMessage = 'Sorry, there was an issue connecting to the assistant.';
      
      if (err instanceof RAGAPIError) {
        // Use the user-friendly message from RAGAPIError
        errorMessage = err.getUserFriendlyMessage();
        
        // Add specific suggestions based on error type
        if (err.isNetworkError) {
          errorMessage += ' Please check your internet connection and try again.';
        } else if (err.isTimeoutError) {
          errorMessage += ' The service may be starting up - please wait a moment and try again.';
        } else if (err.statusCode === 503) {
          errorMessage += ' Please try again in a few moments.';
        }
      } else if (err instanceof ChatbotApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        // Handle generic errors
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the AI assistant. Please check your internet connection.';
        } else {
          errorMessage = `Connection error: ${err.message}`;
        }
      }
      
      setLocalError(errorMessage);
      throw new ChatbotApiError(errorMessage);
    }
  };

  const clearError = () => {
    setLocalError(null);
    reset();
  };

  return {
    // State
    isLoading: loading,
    error: localError || ragError,
    isWarmingUp,
    // Actions
    askRag,
    clearError,
  };
};