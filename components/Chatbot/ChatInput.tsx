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
    <form className="p-4 border-t border-gray-200/50 bg-white rounded-b-2xl" onSubmit={handleSubmit}>
      <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 transition-all duration-200 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus
          aria-label="Type your message"
        />
        <Button
          size="icon"
          className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 ml-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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