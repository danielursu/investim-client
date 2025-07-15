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
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            <BotMessageSquare className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-medium text-gray-900">AI Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 h-8 w-8 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export memoized component
export const ChatHeader = React.memo(ChatHeaderComponent);