/**
 * Fallback mock responses when the RAG API is unavailable
 * Provides a better development experience and graceful degradation
 */

import { QueryResponse } from './rag';

const fallbackResponses: Record<string, QueryResponse> = {
  default: {
    answer: "I'm sorry, but I'm currently unable to connect to the investment advisory service. This might be because the service is starting up or temporarily unavailable. Please try again in a few moments, or feel free to ask me general investment questions.",
    sources: []
  },
  investment: {
    answer: "For investment advice, I'd typically analyze your risk profile and suggest appropriate ETF allocations. Since the advisory service is temporarily unavailable, I recommend consulting with a financial advisor for personalized investment guidance.",
    sources: []
  },
  portfolio: {
    answer: "Portfolio analysis requires connection to our investment database. Please try again when the service is available, or consider reviewing your portfolio allocation with the suggested ETFs from your risk assessment.",
    sources: []
  },
  risk: {
    answer: "Based on typical risk assessments, a moderate risk profile usually includes 60-70% stock ETFs and 30-40% bond ETFs. However, for personalized advice, please try again when our advisory service is available.",
    sources: []
  }
};

/**
 * Get a contextual fallback response based on the query content
 */
export function getFallbackResponse(query: string): QueryResponse {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes('invest') || lowercaseQuery.includes('stock') || lowercaseQuery.includes('etf')) {
    return fallbackResponses.investment;
  }
  
  if (lowercaseQuery.includes('portfolio') || lowercaseQuery.includes('allocation')) {
    return fallbackResponses.portfolio;
  }
  
  if (lowercaseQuery.includes('risk') || lowercaseQuery.includes('tolerance')) {
    return fallbackResponses.risk;
  }
  
  return fallbackResponses.default;
}

/**
 * Check if we should use fallback mode based on error characteristics
 */
export function shouldUseFallback(error: Error): boolean {
  const errorMessage = error.message.toLowerCase();
  
  // Use fallback for network errors, 404s, and service unavailable errors
  return (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('404') ||
    errorMessage.includes('503') ||
    errorMessage.includes('not found') ||
    errorMessage.includes('service unavailable')
  );
}