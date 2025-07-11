/**
 * Backward compatibility export for the refactored Chatbot component
 * This file maintains the old import path while using the new architecture
 */

import { ChatbotContainer } from './Chatbot/ChatbotContainer';
import { withComponentErrorBoundary } from './ErrorBoundary';
import type { ChatbotProps } from '@/types';

// Export the main Chatbot component with error boundary
export const Chatbot = withComponentErrorBoundary(ChatbotContainer);

// Default export for backward compatibility
export default Chatbot;

// Re-export the props type
export type { ChatbotProps };