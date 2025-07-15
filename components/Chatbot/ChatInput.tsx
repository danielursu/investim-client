'use client';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      className="animate-spin h-4 w-4 text-muted-foreground" 
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
    <div className="bg-gray-50">
      {/* Enhanced Prompt Suggestions */}
      {showSuggestions && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-100/50">
          <div className="mb-2">
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Suggested Questions
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {filteredSuggestions.slice(0, 5).map(suggestion => (
              <Badge
                key={suggestion.id}
                variant="outline"
                className="cursor-pointer border border-emerald-600 text-emerald-700 font-normal hover:bg-emerald-50 hover:border-emerald-700 transition-all duration-200 whitespace-nowrap text-xs py-2 px-4 rounded-full"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                {suggestion.text}
              </Badge>
            ))}
          </div>
        </div>
      )}


      {/* Enhanced Input Form */}
      <div className="border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center px-6 py-4 gap-3 relative">
            <input
              type="text"
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:placeholder-gray-400"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoFocus
              aria-label="Type your message"
            />
              <Button
                size="icon"
                className={`h-8 w-8 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                  inputValue.trim() && !disabled && !loading
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md transform hover:scale-105'
                    : 'bg-transparent hover:bg-accent text-muted-foreground hover:text-accent-foreground'
                }`}
                type="submit"
                disabled={loading || !inputValue.trim() || disabled}
                aria-label="Send message"
              >
                {loading ? <LoadingSpinner /> : <SendIcon />}
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
};

// Export memoized component
export const ChatInput = React.memo(ChatInputComponent);