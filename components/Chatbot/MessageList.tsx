'use client';
import React, { Suspense, lazy } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BotMessageSquare, User } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RiskQuizQuestion } from '@/components/RiskQuizQuestion';
import { AssetAllocationChart } from '@/components/ui/AssetAllocationChart';
import { sanitizeMarkdown, sanitizeSourceContent } from '@/lib/sanitize';
import { ChatMessage } from '@/types';

// Lazy load heavy markdown processing components
const ReactMarkdown = lazy(() => import('react-markdown'));

// Simple text fallback for when markdown is loading
const TextFallback = ({ content }: { content: string }) => (
  <div className="text-sm whitespace-pre-wrap break-words">
    {content}
  </div>
);

// Lazy markdown renderer that dynamically imports plugins
const LazyMarkdownRenderer = ({ content }: { content: string }) => {
  const [plugins, setPlugins] = React.useState<any>({ gfm: null, math: null, katex: null });
  
  React.useEffect(() => {
    const loadPlugins = async () => {
      try {
        const [gfmModule, mathModule, katexModule] = await Promise.all([
          import('remark-gfm'),
          import('remark-math'), 
          import('rehype-katex')
        ]);
        setPlugins({ 
          gfm: gfmModule.default, 
          math: mathModule.default, 
          katex: katexModule.default 
        });
      } catch (error) {
        console.warn('Failed to load markdown plugins:', error);
        // Fallback to no plugins
        setPlugins({ gfm: null, math: null, katex: null });
      }
    };
    loadPlugins();
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={plugins.gfm && plugins.math ? [plugins.gfm, plugins.math] : []}
      rehypePlugins={plugins.katex ? [plugins.katex] : []}
      components={{
        a: ({ node, ...props }) => (
          <a 
            {...props} 
            className="text-emerald-600 underline" 
            target="_blank" 
            rel="noopener noreferrer" 
          />
        ),
        code: ({ node, ...props }) => (
          <code 
            {...props} 
            className="bg-gray-100 dark:bg-gray-800 rounded px-1 text-[13px]" 
          />
        ),
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-disc ml-5" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-decimal ml-5" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  error: string;
  userAvatarUrl?: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onAnswerSelect: (questionId: number, answerValue: string) => void;
}

/**
 * Message list component that renders all chat messages
 * Handles different message types: text, quiz, with sources and allocation data
 */
const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  loading,
  error,
  userAvatarUrl,
  chatEndRef,
  onAnswerSelect,
}) => {
  const renderMessage = (msg: ChatMessage) => {
    if (msg.type === 'quiz' && msg.questionData) {
      return (
        <RiskQuizQuestion 
          question={msg.questionData} 
          onAnswerSelect={onAnswerSelect} 
        />
      );
    }

    return (
      <div
        className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm text-sm ${
          msg.role === 'user' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-white text-gray-900'
        } font-inter prose prose-sm max-w-none break-words`}
      >
        <Suspense fallback={<TextFallback content={sanitizeMarkdown(msg.content)} />}>
          <LazyMarkdownRenderer content={sanitizeMarkdown(msg.content)} />
        </Suspense>

        {/* Sources section */}
        {msg.sources && msg.sources.length > 0 && (
          <Collapsible className="mt-2">
            <CollapsibleTrigger className="text-xs text-emerald-600 underline">
              Sources
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1">
              <ul className="text-xs space-y-1">
                {msg.sources.map((src, i) => (
                  <li key={src.id || i} className="border-b border-emerald-100 pb-1 last:border-b-0">
                    <pre className="whitespace-pre-wrap break-words font-mono bg-gray-50 p-1 rounded text-xs mb-1">
                      {sanitizeSourceContent(src.content)}
                    </pre>
                    {src.metadata && (
                      <small className="block text-gray-500">
                        {sanitizeSourceContent(JSON.stringify(src.metadata))}
                      </small>
                    )}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Asset allocation chart */}
        {msg.allocationData && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <AssetAllocationChart data={msg.allocationData.etfs} />
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-1 text-right ${
          msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'
        }`}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  // Filter out any potential duplicate messages by ID
  const uniqueMessages = React.useMemo(() => {
    const seenIds = new Set();
    return messages.filter(msg => {
      if (seenIds.has(msg.id)) {
        return false;
      }
      seenIds.add(msg.id);
      return true;
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white">
      {uniqueMessages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {/* Bot avatar */}
          {msg.role === 'bot' && (
            <Avatar className="h-6 w-6 mr-2 bg-white/50 mt-auto">
              <AvatarFallback>
                <BotMessageSquare className="h-4 w-4 text-emerald-600" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* Message content */}
          {renderMessage(msg)}
          
          {/* User avatar */}
          {msg.role === 'user' && (
            <Avatar className="h-6 w-6 ml-2 bg-white/50 mt-auto">
              {userAvatarUrl ? (
                <AvatarImage src={userAvatarUrl} alt="User avatar" />
              ) : (
                <AvatarFallback>
                  <User className="h-4 w-4 text-emerald-600" />
                </AvatarFallback>
              )}
            </Avatar>
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="flex w-full justify-start">
          <Avatar className="h-6 w-6 mr-2 bg-white/50 mt-auto">
            <AvatarFallback>
              <BotMessageSquare className="h-4 w-4 text-emerald-600" />
            </AvatarFallback>
          </Avatar>
          <div className="rounded-lg px-3 py-2 max-w-[80%] shadow-sm text-sm bg-white text-gray-900 animate-pulse">
            Thinking...
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mt-2">
          Error: {error}
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={chatEndRef} />
    </div>
  );
};

// Export memoized component
export const MessageList = React.memo(MessageListComponent);