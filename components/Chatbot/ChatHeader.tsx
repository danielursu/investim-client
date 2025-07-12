'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, BotMessageSquare } from 'lucide-react';

export interface ChatHeaderProps {
  onClose: () => void;
}

/**
 * Chat header component with title and close button
 * Displays the chatbot branding and provides close functionality
 */
const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="relative bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-center">
        <BotMessageSquare className="h-5 w-5 text-emerald-600 mr-2" />
        <h3 className="text-base font-medium text-gray-900">AI Assistant</h3>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 rounded-full transition-colors"
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Export memoized component
export const ChatHeader = React.memo(ChatHeaderComponent);