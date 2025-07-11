'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  loading: boolean;
  placeholder?: string;
}

/**
 * Chat input component for user message entry
 * Handles text input, validation, and send actions
 */
const ChatInputComponent: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  loading,
  placeholder = "Type your message...",
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled || loading) return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4 text-white" 
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none" 
      />
    </svg>
  );

  const SendIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-label="Send message"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );

  return (
    <form className="p-3 border-t bg-white" onSubmit={handleSubmit}>
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus
          aria-label="Type your message"
        />
        <Button
          size="icon"
          className="h-7 w-7 rounded-full bg-emerald-600 hover:bg-emerald-700 ml-2"
          type="submit"
          disabled={loading || !inputValue.trim() || disabled}
          aria-label="Send message"
        >
          {loading ? <LoadingSpinner /> : <SendIcon />}
        </Button>
      </div>
    </form>
  );
};

// Export memoized component
export const ChatInput = React.memo(ChatInputComponent);