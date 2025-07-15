'use client';
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  inline?: boolean;
}

export function CodeBlock({ children, className, language, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract text content from children
  const textContent = React.Children.toArray(children)
    .map(child => 
      typeof child === 'string' ? child : 
      React.isValidElement(child) && child.props.children ? 
      child.props.children : ''
    )
    .join('');
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Inline code
  if (inline) {
    return (
      <code className="bg-gray-100 text-gray-900 rounded px-1.5 py-0.5 text-[13px] font-mono">
        {children}
      </code>
    );
  }
  
  // Block code with copy button
  return (
    <div className="relative group my-3">
      <pre className={cn(
        "bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-[13px] font-mono",
        className
      )}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
      
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-md transition-all",
          "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-100",
          "opacity-0 group-hover:opacity-100",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        )}
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      
      {/* Language badge */}
      {language && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {language}
        </div>
      )}
    </div>
  );
}