'use client';
import React, { Suspense, lazy } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BotMessageSquare, User } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RiskQuizQuestion } from '@/components/RiskQuizQuestion';
import { AssetAllocationChart } from '@/components/ui/AssetAllocationChart';
import { sanitizeMarkdown, sanitizeSourceContent } from '@/lib/sanitize';
import { ChatMessage } from '@/types';
import { ThinkingShimmer } from '@/components/ui/thinking-shimmer';
import { WarmingProgress } from '@/components/ui/warming-progress';
import { WarmingSuggestions } from '@/components/ui/warming-suggestions';
import { WarmingStatus } from '@/lib/api/rag';

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
        
        console.log('Math plugins loaded successfully:', {
          gfm: !!gfmModule.default,
          math: !!mathModule.default,
          katex: !!katexModule.default
        });
        
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

  // Show loading state while plugins are loading
  if (!plugins.gfm || !plugins.math || !plugins.katex) {
    return <TextFallback content={content} />;
  }

  try {
    return (
      <ReactMarkdown
        remarkPlugins={[plugins.gfm, plugins.math]}
        rehypePlugins={[plugins.katex]}
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
              className="bg-gray-100 rounded px-1 text-[13px]" 
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
  } catch (error) {
    console.error('Error rendering markdown with math:', error);
    return <TextFallback content={content} />;
  }
};

export interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  error: string;
  userAvatarUrl?: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onAnswerSelect: (questionId: number, answerValue: string) => void;
  isWarmingUp?: boolean;
  warmingStatus?: WarmingStatus;
  onSuggestedPrompt?: (prompt: string) => void;
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
  isWarmingUp = false,
  warmingStatus,
  onSuggestedPrompt,
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
        className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm text-sm ${
          msg.role === 'user' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-gray-50 text-gray-900 border border-gray-100'
        } font-inter prose prose-sm max-w-none break-words animate-scale-in`}
      >
        <Suspense fallback={<TextFallback content={sanitizeMarkdown(msg.content)} />}>
          <LazyMarkdownRenderer content={sanitizeMarkdown(msg.content)} />
        </Suspense>

        {/* Enhanced Sources section */}
        {msg.sources && msg.sources.length > 0 && (
          <Collapsible className="mt-3">
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sources ({msg.sources.length})
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-2">
                {msg.sources.map((src, i) => {
                  // Extract clean metadata
                  const metadata = src.metadata || {};
                  const source = (metadata.source as string) || 'Unknown Document';
                  const pageNum = (metadata.page_num as number) || (metadata.page as number);
                  const documentTitle = source.includes('/') ? source.split('/').pop() : source;
                  const cleanTitle = documentTitle?.replace(/\.(pdf|md|txt)$/i, '') || 'Document';
                  
                  // Create content excerpt (first 200 chars with proper word break)
                  let excerpt = src.content || '';
                  if (excerpt.length > 200) {
                    excerpt = excerpt.substring(0, 200);
                    const lastSpace = excerpt.lastIndexOf(' ');
                    if (lastSpace > 150) {
                      excerpt = excerpt.substring(0, lastSpace);
                    }
                    excerpt += '...';
                  }
                  
                  return (
                    <div key={src.id || i} className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-3 text-sm">
                      {/* Source header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-xs mb-1">
                            📄 {cleanTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            {pageNum && (
                              <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                Page {pageNum}
                              </span>
                            )}
                            {typeof metadata.similarity === 'number' && (
                              <span className="text-gray-500 text-[10px]">
                                {Math.round(metadata.similarity * 100)}% match
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content excerpt */}
                      <div className="border-l-2 border-emerald-200 pl-2">
                        <div className="text-gray-700 text-xs leading-relaxed italic">
                          &ldquo;{excerpt}&rdquo;
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
    <div className="flex-1 overflow-y-auto p-6 pb-2 space-y-4 bg-white">
      {uniqueMessages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {/* Bot avatar */}
          {msg.role === 'bot' && (
            <Avatar className="h-6 w-6 mr-2 bg-gray-100 mt-auto">
              <AvatarFallback className="bg-gray-100">
                <BotMessageSquare className="h-4 w-4 text-emerald-600" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* Message content */}
          {renderMessage(msg)}
          
          {/* User avatar */}
          {msg.role === 'user' && (
            <Avatar className="h-6 w-6 ml-2 bg-gray-100 mt-auto">
              {userAvatarUrl ? (
                <AvatarImage src={userAvatarUrl} alt="User avatar" />
              ) : (
                <AvatarFallback className="bg-gray-100">
                  <User className="h-4 w-4 text-emerald-600" />
                </AvatarFallback>
              )}
            </Avatar>
          )}
        </div>
      ))}

      {/* Enhanced API Warming Up indicator */}
      {isWarmingUp && !loading && (
        <div className="w-full space-y-4">
          <div className="flex w-full justify-start">
            <Avatar className="h-6 w-6 mr-2 bg-gray-100 mt-auto">
              <AvatarFallback className="bg-gray-100">
                <BotMessageSquare className="h-4 w-4 text-emerald-600" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[85%]">
              <WarmingProgress status={warmingStatus} isVisible={true} />
            </div>
          </div>
          
          {onSuggestedPrompt && (
            <div className="px-8">
              <WarmingSuggestions 
                isVisible={true} 
                onSelectSuggestion={onSuggestedPrompt}
              />
            </div>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {loading && !isWarmingUp && (
        <div className="flex w-full justify-start">
          <Avatar className="h-6 w-6 mr-2 bg-gray-100 mt-auto">
            <AvatarFallback className="bg-gray-100">
              <BotMessageSquare className="h-4 w-4 text-emerald-600" />
            </AvatarFallback>
          </Avatar>
          <div className="rounded-2xl px-4 py-3 max-w-[85%] shadow-sm text-sm bg-gray-50 text-gray-900 border border-gray-100 animate-scale-in">
            <ThinkingShimmer />
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