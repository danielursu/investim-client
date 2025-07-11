'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  content: string;
  maxLength?: number;
  className?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  content,
  maxLength = 300,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (content.length <= maxLength) {
    return <div className={className}>{content}</div>;
  }
  
  const truncatedContent = content.substring(0, maxLength);
  const lastSpaceIndex = truncatedContent.lastIndexOf(' ');
  const displayContent = lastSpaceIndex > maxLength * 0.8 
    ? truncatedContent.substring(0, lastSpaceIndex) 
    : truncatedContent;
  
  return (
    <div className={className}>
      <div className="text-gray-700 text-xs leading-relaxed">
        {isExpanded ? content : `${displayContent}...`}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-emerald-600 hover:text-emerald-700 text-xs font-medium mt-1 focus:outline-none"
      >
        {isExpanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
};