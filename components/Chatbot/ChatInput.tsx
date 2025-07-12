'use client';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { promptSuggestions } from '@/data/promptSuggestions';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  loading: boolean;
  placeholder?: string;
  showSuggestions?: boolean;
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
  showSuggestions = false,
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

  // Filter and sort suggestions based on input
  const filteredSuggestions = useMemo(() => {
    let filtered = promptSuggestions;
    
    // Filter by input text if present
    if (inputValue.trim()) {
      const searchTerm = inputValue.toLowerCase();
      filtered = filtered.filter(s => 
        s.text.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by priority and show all that fit
    return filtered.sort((a, b) => a.priority - b.priority);
  }, [inputValue]);


  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    // Auto-submit the suggestion
    onSendMessage(text);
    setInputValue('');
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
    <div className="border-t border-gray-100 bg-white">
      {/* Prompt Suggestions */}
      {showSuggestions && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {filteredSuggestions.slice(0, 10).map(suggestion => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="inline-flex items-center px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-50 rounded-full whitespace-nowrap transition-all border border-gray-200 hover:border-gray-300"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Input Form */}
      <form className="p-4 pb-safe" onSubmit={handleSubmit}>
        <div className="flex items-center bg-gray-50 rounded-full px-5 py-4 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:shadow-md">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder-gray-400 min-h-[24px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus
            aria-label="Type your message"
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 ml-3 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            type="submit"
            disabled={loading || !inputValue.trim() || disabled}
            aria-label="Send message"
          >
            {loading ? <LoadingSpinner /> : <SendIcon />}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Export memoized component
export const ChatInput = React.memo(ChatInputComponent);