'use client';

import { TextShimmerWave } from './text-shimmer-wave';
import { cn } from '@/lib/utils';

interface ThinkingShimmerProps {
  text?: string;
  className?: string;
  duration?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Custom shimmer component for loading states in the chat interface
 * Uses the text shimmer wave effect with chat-appropriate styling
 */
export function ThinkingShimmer({
  text = 'Thinking...',
  className,
  duration = 1.5,
  size = 'sm',
}: ThinkingShimmerProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TextShimmerWave
      className={cn(
        // Base styling
        sizeClasses[size],
        'font-medium',
        // Chat theme colors - emerald/teal to match the app
        '[--base-color:#6b7280] [--base-gradient-color:#059669]',
        'dark:[--base-color:#9ca3af] dark:[--base-gradient-color:#10b981]',
        className
      )}
      duration={duration}
      spread={0.8}
      zDistance={8}
      xDistance={1}
      yDistance={-1}
      scaleDistance={1.05}
      rotateYDistance={5}
    >
      {text}
    </TextShimmerWave>
  );
}