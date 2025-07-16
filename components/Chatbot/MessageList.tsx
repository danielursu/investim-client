'use client';
import React, { Suspense, lazy, useEffect } from 'react';
import { FileText, BarChart3, BookOpen, Target, Lightbulb, FileSearch } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RiskQuizQuestion } from '@/components/RiskQuizQuestion';
import { AssetAllocationChart } from '@/components/ui/AssetAllocationChart';
import { sanitizeMarkdown, sanitizeSourceContent } from '@/lib/sanitize';
import { ChatMessage } from '@/types';
import { ThinkingShimmer } from '@/components/ui/thinking-shimmer';
import { WarmingProgress } from '@/components/ui/warming-progress';
import { WarmingSuggestions } from '@/components/ui/warming-suggestions';
import { WarmingStatus } from '@/lib/api/rag';
import { toast } from 'sonner';
import { CodeBlock } from '@/components/ui/code-block';

// Lazy load heavy markdown processing components
const ReactMarkdown = lazy(() => import('react-markdown'));

// Simple text fallback for when markdown is loading
const TextFallback = ({ content }: { content: string }) => (
  <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
    {content}
  </div>
);

// Enhanced text processing that emphasizes important investment concepts
const processInvestmentContent = (content: string): string => {
  // Enhanced processing - emphasize key investment terms and strategies
  let processedContent = content
    // Emphasize key investment terms and concepts for better readability
    .replace(/\b(ETF|ETFs|Exchange-Traded Funds?|diversification|portfolio|asset allocation|expense ratio|liquidity|transparency|risk tolerance|investment strategy|market volatility|compound interest|dividend|yield|growth|value|index fund|mutual fund|bonds|stocks|securities|emergency fund|retirement|401k|IRA|Roth IRA|financial goals|time horizon|inflation)\b/gi, '**$1**')
    
    // Emphasize important financial concepts and advice
    .replace(/\b(start investing|dollar-cost averaging|long-term|short-term|high-risk|low-risk|moderate risk|conservative|aggressive|balanced|rebalancing)\b/gi, '**$1**')
    
    // Preserve original bullet points and numbers exactly as they come from RAG
    // Just ensure consistent markdown formatting
    .replace(/^\* /gm, '- ')  // Convert * to - for consistency
    .replace(/^• /gm, '- ')   // Convert • to - for consistency
    
    // Clean up excessive spacing
    .replace(/\n\n\n+/g, '\n\n')
    .replace(/  +/g, ' ')
    .trim();
  
  return processedContent;
};

// Lazy markdown renderer that dynamically imports plugins
const LazyMarkdownRenderer = ({ content, isUser = false }: { content: string; isUser?: boolean }) => {
  const [plugins, setPlugins] = React.useState<any>({ gfm: null, math: null, katex: null });
  
  React.useEffect(() => {
    const loadPlugins = async () => {
      try {
        const [gfmModule, mathModule, katexModule] = await Promise.all([
          import('remark-gfm'),
          import('remark-math'), 
          import('rehype-katex'),
          import('@/lib/katex').then(({ loadKatexCss }) => loadKatexCss())
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
          // Simple, clean typography hierarchy with ultra-tight spacing
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-lg font-semibold text-foreground mt-4 mb-2 first:mt-0" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-base font-semibold text-foreground mt-4 mb-2 first:mt-0" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-sm font-medium text-foreground mt-3 mb-1 first:mt-0" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="text-sm font-medium text-gray-800 mt-3 mb-1 first:mt-0" />
          ),
          h5: ({ node, ...props }) => (
            <h5 {...props} className="text-sm font-medium text-gray-700 mt-2 mb-1 first:mt-0" />
          ),
          h6: ({ node, ...props }) => (
            <h6 {...props} className="text-xs font-medium text-gray-700 mt-2 mb-1 first:mt-0" />
          ),
          
          // Simple paragraph styling with ultra-tight spacing
          p: ({ node, ...props }) => (
            <p {...props} className={`text-sm leading-normal mb-2 last:mb-0 ${isUser ? 'text-white' : 'text-gray-900'}`} />
          ),
          
          // Enhanced emphasis for key terms
          strong: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            // Special styling for bullet point headers
            if (text.startsWith('•')) {
              return <strong {...props} className={`font-bold block mb-1 ${isUser ? 'text-white' : 'text-gray-900'}`} />;
            }
            // Strong emphasis for important content
            return <strong {...props} className={`font-semibold ${isUser ? 'text-white' : 'text-gray-900'}`} />;
          },
          
          // Simple blockquote styling with ultra-tight spacing
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-border pl-4 my-2 text-sm text-muted-foreground italic">
              {props.children}
            </blockquote>
          ),
          
          // Links with better styling
          a: ({ node, ...props }) => (
            <a 
              {...props} 
              className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer" 
            />
          ),
          
          // Code blocks using our enhanced CodeBlock component
          pre: ({ node, ...props }) => {
            const child = React.Children.toArray(props.children)[0];
            if (React.isValidElement(child) && child.props.className) {
              const language = child.props.className.replace('language-', '');
              return (
                <CodeBlock language={language}>
                  {child.props.children}
                </CodeBlock>
              );
            }
            return <CodeBlock>{props.children}</CodeBlock>;
          },
          
          // Inline code with better styling
          code: ({ node, inline, ...props }) => {
            if (inline) {
              return (
                <CodeBlock inline>
                  {props.children}
                </CodeBlock>
              );
            }
            return <code {...props} />;
          },
          
          // Simple, clean list styling with ultra-tight spacing
          ul: ({ node, ...props }) => {
            const { ordered, ...cleanProps } = props;
            return (
              <ul {...cleanProps} className="list-disc ml-8 pl-4 space-y-0.5 mb-2 text-sm" />
            );
          },
          ol: ({ node, ...props }) => {
            const { ordered, ...cleanProps } = props;
            return (
              <ol {...cleanProps} className="list-decimal ml-8 pl-4 space-y-0.5 mb-2 text-sm" />
            );
          },
          li: ({ node, ...props }) => {
            const { ordered, ...cleanProps } = props;
            return (
              <li {...cleanProps} className={`leading-normal pl-2 ${isUser ? 'text-white marker:text-white/70' : 'text-gray-900 marker:text-gray-700'}`} />
            );
          },
          
          // Horizontal rule for section breaks
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-6 border-border" />
          ),
          
          // Tables with better styling
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3">
              <table {...props} className="min-w-full divide-y divide-gray-200 text-sm" />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} className="bg-gray-50" />
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-3 py-2 text-sm text-gray-800 border-b border-gray-100" />
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
  chatEndRef,
  onAnswerSelect,
  isWarmingUp = false,
  warmingStatus,
  onSuggestedPrompt,
}) => {
  // Display error as toast notification
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 5000,
        description: 'Please check your connection and try again.',
      });
    }
  }, [error]);
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
      <div className={`${
        msg.role === 'user' 
          ? 'ml-12 flex justify-end' 
          : 'flex justify-start'
      }`}>
        <div className={`${
          msg.role === 'user' 
            ? 'bg-emerald-500 text-white rounded-2xl rounded-tr-md max-w-[80%] break-words overflow-wrap-anywhere' 
            : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md w-full'
        } px-4 py-3 transition-all duration-200`}>
        <Suspense fallback={<TextFallback content={sanitizeMarkdown(msg.content)} />}>
          <LazyMarkdownRenderer 
            content={processInvestmentContent(sanitizeMarkdown(msg.content))} 
            isUser={msg.role === 'user'}
          />
        </Suspense>

        {/* Enhanced Sources section */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-4">
            <Separator className="mb-3" />
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-muted/50">
                <FileSearch className="w-4 h-4" />
                <span>Research Sources ({msg.sources.length})</span>
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
                    
                    // Minimal icons
                    const getDocumentIcon = (title: string) => {
                      if (title.toLowerCase().includes('framework')) return <Target className="w-3 h-3" />;
                      if (title.toLowerCase().includes('recommendation')) return <Lightbulb className="w-3 h-3" />;
                      if (title.toLowerCase().includes('analysis')) return <BarChart3 className="w-3 h-3" />;
                      if (title.toLowerCase().includes('guide')) return <BookOpen className="w-3 h-3" />;
                      return <FileText className="w-3 h-3" />;
                    };
                    
                    // Create content excerpt (first 180 chars with proper word break)
                    let excerpt = src.content || '';
                    if (excerpt.length > 180) {
                      excerpt = excerpt.substring(0, 180);
                      const lastSpace = excerpt.lastIndexOf(' ');
                      if (lastSpace > 130) {
                        excerpt = excerpt.substring(0, lastSpace);
                      }
                      excerpt += '...';
                    }
                    
                    return (
                      <Card key={src.id || i} className="bg-muted/50 border-border">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="text-muted-foreground mt-1">
                              {getDocumentIcon(cleanTitle)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-foreground mb-1">
                                {cleanTitle}
                                {pageNum && (
                                  <span className="text-muted-foreground font-normal ml-2">
                                    p. {pageNum}
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {excerpt}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Asset allocation chart */}
        {msg.allocationData && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <AssetAllocationChart data={msg.allocationData.etfs} />
          </div>
        )}

        {/* Enhanced Timestamp */}
        <div className={`text-[11px] mt-1 text-right ${
          msg.role === 'user' 
            ? 'text-emerald-100' 
            : 'text-gray-500'
        }`}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
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
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
      {uniqueMessages.map((msg) => (
        <div 
          key={msg.id} 
          className="w-full animate-fade-in"
        >
          {/* Message content with enhanced styling */}
          {renderMessage(msg)}
        </div>
      ))}

      {/* Enhanced API Warming Up indicator */}
      {isWarmingUp && !loading && (
        <div className="w-full space-y-6 animate-fade-in">
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md w-full px-4 py-3 transition-all duration-200">
              <WarmingProgress status={warmingStatus} isVisible={true} />
            </div>
          </div>
          
          {onSuggestedPrompt && (
            <div className="px-2">
              <WarmingSuggestions 
                isVisible={true} 
                onSelectSuggestion={onSuggestedPrompt}
              />
            </div>
          )}
        </div>
      )}

      {/* Enhanced loading indicator */}
      {loading && !isWarmingUp && (
        <div className="w-full animate-fade-in">
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md w-full px-4 py-3 transition-all duration-200">
              <ThinkingShimmer />
            </div>
          </div>
        </div>
      )}

      {/* Error display removed - now using toast notifications */}

      {/* Scroll anchor */}
      <div ref={chatEndRef} />
    </div>
  );
};

// Export memoized component
export const MessageList = React.memo(MessageListComponent);