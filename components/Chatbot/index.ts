/**
 * Barrel exports for Chatbot components
 * Provides clean imports for all chatbot-related components and hooks
 */

// Main container component
export { ChatbotContainer } from './ChatbotContainer';
export type { ChatbotContainerProps } from './ChatbotContainer';

// Individual components
export { ChatHeader } from './ChatHeader';
export type { ChatHeaderProps } from './ChatHeader';

export { MessageList } from './MessageList';
export type { MessageListProps } from './MessageList';

export { ChatInput } from './ChatInput';
export type { ChatInputProps } from './ChatInput';

// Re-export hooks for convenience
export { useChatbot } from '@/hooks/useChatbot';
export type { UseChatbotReturn, UseChatbotState, UseChatbotActions } from '@/hooks/useChatbot';

export { useRiskQuiz } from '@/hooks/useRiskQuiz';
export type { UseRiskQuizReturn, UseRiskQuizState, UseRiskQuizActions } from '@/hooks/useRiskQuiz';

export { useChatAPI } from '@/hooks/useChatAPI';
export type { UseChatAPIReturn, UseChatAPIState, UseChatAPIActions } from '@/hooks/useChatAPI';