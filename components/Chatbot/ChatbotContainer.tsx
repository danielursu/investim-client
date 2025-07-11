'use client';
import React, { useEffect, useCallback, useRef } from 'react';
import { useRiskQuiz } from '@/hooks/useRiskQuiz';
import { useChatAPI } from '@/hooks/useChatAPI';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatMessage } from '@/types';
import { 
  useChatMessages, 
  useChatIsLoading,
  useChatError,
  useChatIsQuizActive,
  useChatCurrentQuizQuestionIndex,
  useChatAddMessage,
  useChatAddMessages,
  useChatClearMessages,
  useChatSetLoading,
  useChatSetError,
  useChatClearError,
  useChatSetIsOpen
} from '@/stores/chatStore';

export interface ChatbotContainerProps {
  open: boolean;
  onClose: () => void;
  userAvatarUrl?: string;
}

/**
 * Main chatbot container component that orchestrates all chatbot functionality
 * Manages state interactions between chat, quiz, and API hooks using Zustand stores
 */
export const ChatbotContainer: React.FC<ChatbotContainerProps> = ({
  open,
  onClose,
  userAvatarUrl,
}) => {
  // Get state from stores using individual selectors
  const messages = useChatMessages();
  const loading = useChatIsLoading();
  const error = useChatError();
  const isQuizActive = useChatIsQuizActive();
  const currentQuizQuestionIndex = useChatCurrentQuizQuestionIndex();
  
  // Get actions from stores
  const addMessage = useChatAddMessage();
  const addMessages = useChatAddMessages();
  const clearMessages = useChatClearMessages();
  const setLoading = useChatSetLoading();
  const setError = useChatSetError();
  const clearError = useChatClearError();
  const setIsOpen = useChatSetIsOpen();

  const {
    startQuiz,
    handleAnswerSelect,
  } = useRiskQuiz();

  const { askRag } = useChatAPI();
  
  // Create a ref for auto-scrolling
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Sync open state with store
  useEffect(() => {
    setIsOpen(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // setIsOpen is stable from Zustand

  // Use a ref to track initialization to prevent double mounting issues
  const initializationRef = useRef(false);
  
  // Initialize chat when opened
  useEffect(() => {
    if (open && messages.length === 0 && !initializationRef.current) {
      initializationRef.current = true;
      
      const initialMessage: ChatMessage = {
        id: `bot-init-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        role: 'bot',
        content: 'Hello! To start, let\'s quickly assess your risk tolerance.',
        timestamp: new Date(),
      };
      
      addMessage(initialMessage);
      
      // Start quiz after a short delay
      setTimeout(() => {
        const quizMessages = startQuiz();
        if (quizMessages.length > 0) {
          addMessages(quizMessages);
        }
      }, 500);
    }
    
    // Reset initialization flag when chat is closed
    if (!open) {
      initializationRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length]); // Depend on both open state and message length

  // Handle quiz answer selection
  const onQuizAnswerSelect = useCallback((questionId: number, answerValue: string) => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      const result = handleAnswerSelect(questionId, answerValue);
      
      if (result.nextMessage) {
        addMessage(result.nextMessage);
      }
      
      if (result.isComplete && result.completionMessage) {
        addMessage(result.completionMessage);
      }
      
      setLoading(false);
    }, 500); // Simulate processing time
  }, [loading, setLoading, handleAnswerSelect, addMessage]);

  // Handle text message sending
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || loading || isQuizActive) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setLoading(true);
    clearError();

    try {
      const response = await askRag(messageText);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        role: 'bot',
        content: response.answer || 'Sorry, I received an empty response.',
        sources: response.sources || [],
        timestamp: new Date(),
      };

      addMessage(botMessage);
    } catch (err) {
      console.error('Error asking RAG:', err);
      
      let errorMessage = 'Sorry, there was an issue connecting to the assistant. Please check your connection or try again later.';
      
      if (err instanceof Error) {
        errorMessage = `Connection error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, isQuizActive, addMessage, setLoading, clearError, askRag, setError]);

  // Determine input placeholder based on quiz state
  const getInputPlaceholder = useCallback(() => {
    if (isQuizActive) {
      return 'Please select an answer above';
    }
    return 'Type your message...';
  }, [isQuizActive]);

  // Handle close with store update and clear messages for fresh start
  const handleClose = useCallback(() => {
    setIsOpen(false);
    clearMessages(); // Clear messages for fresh start next time
    onClose();
  }, [onClose, setIsOpen, clearMessages]);

  // Don't render if not open
  if (!open) return null;

  return (
    <div className="fixed bottom-16 right-4 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200/50 max-h-[70vh] flex flex-col z-50 font-inter backdrop-blur-sm">
      <ChatHeader onClose={handleClose} />
      
      <MessageList
        messages={messages}
        loading={loading}
        error={error || ''}
        userAvatarUrl={userAvatarUrl}
        chatEndRef={chatEndRef}
        onAnswerSelect={onQuizAnswerSelect}
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isQuizActive}
        loading={loading}
        placeholder={getInputPlaceholder()}
      />
    </div>
  );
};