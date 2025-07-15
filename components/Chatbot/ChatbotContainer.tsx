'use client';
import React, { useEffect, useCallback, useRef, useState } from 'react';
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
  useChatQuizCompleted,
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
  // State for managing animations
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  
  // Get state from stores using individual selectors
  const messages = useChatMessages();
  const loading = useChatIsLoading();
  const error = useChatError();
  const isQuizActive = useChatIsQuizActive();
  const quizCompleted = useChatQuizCompleted();
  
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

  const { askRag, isWarmingUp, warmingStatus } = useChatAPI();
  
  // Create a ref for auto-scrolling
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Sync open state with store and handle animations
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
      setIsOpen(true);
    } else if (shouldRender) {
      setIsClosing(true);
      setIsOpen(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match the animation duration
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // setIsOpen is stable from Zustand

  // Use a ref to track initialization to prevent double mounting issues
  const initializationRef = useRef(false);
  
  // Initialize chat when opened
  useEffect(() => {
    if (open && messages.length === 0 && !initializationRef.current) {
      initializationRef.current = true;
      
      // Different initialization based on quiz completion status
      if (quizCompleted) {
        // User has completed the quiz before - show welcome back message
        const welcomeBackMessage: ChatMessage = {
          id: `bot-welcome-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          type: 'text',
          role: 'bot',
          content: 'Welcome back! How can I help you with your investment questions today?',
          timestamp: new Date(),
        };
        addMessage(welcomeBackMessage);
      } else {
        // First time or quiz not completed - start with quiz
        const initialMessage: ChatMessage = {
          id: `bot-init-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
    }
    
    // Reset initialization flag when chat is closed
    if (!open) {
      initializationRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length, quizCompleted]); // Depend on quiz completion state

  // Handle quiz answer selection
  const onQuizAnswerSelect = useCallback((questionId: number, answerValue: string) => {
    if (loading) {
      return;
    }

    setLoading(true);

    // Process quiz answer immediately for better UX
    try {
      const result = handleAnswerSelect(questionId, answerValue);
      
      if (result.nextMessage) {
        addMessage(result.nextMessage);
      }
      
      if (result.isComplete && result.completionMessage) {
        addMessage(result.completionMessage);
      }
      
      setLoading(false);
    } catch (error) {
      setError('Failed to process quiz answer. Please try again.');
      setLoading(false);
    }
  }, [loading, setLoading, handleAnswerSelect, addMessage, setError]);

  // Handle text message sending
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || loading || isQuizActive) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        type: 'text',
        role: 'bot',
        content: response.answer || 'Sorry, I received an empty response.',
        sources: response.sources || [],
        timestamp: new Date(),
      };

      addMessage(botMessage);
    } catch (err) {
      let errorMessage = 'Sorry, there was an issue connecting to the assistant.';
      
      if (err instanceof Error) {
        // Use the error message from useChatAPI which already handles RAGAPIError formatting
        errorMessage = err.message;
      }
      
      // Add a helpful retry suggestion if not already included
      if (!errorMessage.includes('try again')) {
        errorMessage += ' Please try again.';
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

  // Handle close with store update but preserve messages in localStorage
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Don't clear messages - let them persist for better UX
    // Only clear if user explicitly wants a fresh start
    setPendingPrompt(null); // Clear any pending prompt
    onClose();
  }, [onClose, setIsOpen]);

  // Handle suggested prompt selection during warming
  const handleSuggestedPrompt = useCallback((prompt: string) => {
    if (isWarmingUp) {
      // Save the prompt to send when warming is complete
      setPendingPrompt(prompt);
    } else {
      // Send immediately if not warming
      handleSendMessage(prompt);
    }
  }, [isWarmingUp, handleSendMessage]);

  // Send pending prompt when warming completes
  React.useEffect(() => {
    if (!isWarmingUp && pendingPrompt && !loading) {
      handleSendMessage(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [isWarmingUp, pendingPrompt, loading, handleSendMessage]);

  // Don't render if not open and not closing
  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 bg-gray-50 flex flex-col z-40 font-inter transform transition-transform duration-300 ${
        isClosing ? 'animate-slide-down' : 'animate-slide-up'
      }`}
      data-chat-active="true"
      style={{
        // Ensure solid background during closing animation
        backgroundColor: isClosing ? '#f9fafb' : undefined,
        // Prevent any potential flicker by ensuring we're always on top during close
        zIndex: isClosing ? 50 : 40
      }}
    >
      <ChatHeader onClose={handleClose} />
      
      <MessageList
        messages={messages}
        loading={loading}
        error={error || ''}
        chatEndRef={chatEndRef}
        onAnswerSelect={onQuizAnswerSelect}
        isWarmingUp={isWarmingUp}
        warmingStatus={warmingStatus}
        onSuggestedPrompt={handleSuggestedPrompt}
      />
      
      <div className="pb-16">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isQuizActive}
          loading={loading}
          placeholder={getInputPlaceholder()}
          showSuggestions={!isQuizActive && messages.length > 0}
        />
      </div>
    </div>
  );
};