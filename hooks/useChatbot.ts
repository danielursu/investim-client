import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/types';

/**
 * Central state management hook for chatbot functionality
 * Manages message history, loading states, errors, and scroll behavior
 */
export interface UseChatbotState {
  messages: ChatMessage[];
  loading: boolean;
  error: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export interface UseChatbotActions {
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  resetChat: () => void;
}

export interface UseChatbotReturn extends UseChatbotState, UseChatbotActions {}

export const useChatbot = (isOpen: boolean): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Define resetChat with useCallback first
  const resetChat = useCallback(() => {
    setMessages([]);
    setLoading(false);
    setError('');
  }, []);

  // Reset chat when closed
  useEffect(() => {
    if (!isOpen) {
      resetChat();
    }
  }, [isOpen, resetChat]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Memoize setLoading and setError for consistency
  const memoizedSetLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const memoizedSetError = useCallback((error: string) => {
    setError(error);
  }, []);

  return {
    // State
    messages,
    loading,
    error,
    chatEndRef,
    // Actions
    addMessage,
    addMessages,
    setLoading: memoizedSetLoading,
    setError: memoizedSetError,
    clearError,
    resetChat,
  };
};