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
    <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-2xl">
      <div className="flex items-center">
        <BotMessageSquare className="h-6 w-6 mr-2" />
        <h3 className="text-base font-semibold">Investment Assistant</h3>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="text-white hover:bg-emerald-700 h-7 w-7"
        aria-label="Close chat"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Export memoized component
export const ChatHeader = React.memo(ChatHeaderComponent);