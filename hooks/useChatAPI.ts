import { useState } from 'react';
import { RagResponse, ChatbotApiError } from '@/types';

/**
 * Hook for managing chat API calls and error handling
 * Centralizes RAG API communication logic
 */
export interface UseChatAPIState {
  isLoading: boolean;
  error: string | null;
}

export interface UseChatAPIActions {
  askRag: (query: string) => Promise<RagResponse>;
  clearError: () => void;
}

export interface UseChatAPIReturn extends UseChatAPIState, UseChatAPIActions {}

export const useChatAPI = (): UseChatAPIReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const askRag = async (query: string): Promise<RagResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        let errorBody = 'Failed to fetch response from the assistant.';
        
        try {
          // Try to parse the error response body as JSON
          const errorJson = await res.json();
          // If it has an 'error' property, use that as the message
          if (errorJson && typeof errorJson.error === 'string') {
            errorBody = `Assistant error: ${errorJson.error}`;
          } else {
            // Fallback if JSON is not as expected or doesn't contain 'error'
            errorBody = `Received status ${res.status}: ${res.statusText}`;
          }
        } catch (parseError) {
          // If parsing fails, use the raw text or a generic message
          try {
            const rawText = await res.text();
            errorBody = rawText || errorBody; // Use raw text if available
          } catch (textError) {
            // Ignore text error, keep the default message
          }
        }
        
        throw new ChatbotApiError(errorBody, res.status, res.statusText);
      }

      try {
        const data = await res.json();
        // Validate the response structure
        if (!data || typeof data.answer !== 'string') {
          throw new ChatbotApiError('Invalid response format from assistant');
        }
        return data as RagResponse;
      } catch (parseError) {
        throw new ChatbotApiError('Failed to parse assistant response');
      }
    } catch (err) {
      let errorMessage = 'Sorry, there was an issue connecting to the assistant. Please check your connection or try again later.';
      
      if (err instanceof ChatbotApiError) {
        errorMessage = `Assistant error: ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = `Connection error: ${err.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    isLoading,
    error,
    // Actions
    askRag,
    clearError,
  };
};