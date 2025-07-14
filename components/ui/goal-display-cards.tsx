"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { Plus } from "lucide-react";

interface GoalDisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  currentAmount?: string;
  targetAmount?: string;
  progressPercent?: number;
  targetDate?: string;
  description?: string;
  isAddCard?: boolean;
  onClick?: () => void;
}

function GoalDisplayCard({
  className,
  icon,
  title = "Investment Goal",
  currentAmount = "$0",
  targetAmount = "$1,000",
  progressPercent = 0,
  targetDate = "Dec 2024",
  description,
  isAddCard = false,
  onClick,
}: GoalDisplayCardProps) {
  // Create progress description
  const progressDescription = description || `${currentAmount} of ${targetAmount} (${progressPercent}%)`;
  
  // Format target date
  const formattedDate = targetDate ? new Date(targetDate).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  }) : 'Dec 2024';

  // Icon background color based on progress
  // Using emerald minimalist design
  const iconBgColor = progressPercent >= 75 ? "bg-emerald-100" : 
                     progressPercent >= 50 ? "bg-emerald-50" : 
                     progressPercent >= 25 ? "bg-gray-100" : "bg-gray-50";
  
  const iconColor = progressPercent >= 75 ? "text-emerald-600" : 
                   progressPercent >= 50 ? "text-emerald-500" : 
                   progressPercent >= 25 ? "text-gray-600" : "text-gray-500";

  // If this is an add card, render a different design
  if (isAddCard) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "relative flex h-28 w-[260px] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-dashed border-emerald-400/70 bg-emerald-50/80 backdrop-blur-sm px-4 py-3 transition-all duration-700 hover:border-emerald-500 cursor-pointer overflow-hidden [&>*]:flex [&>*]:items-center [&>*]:gap-2 shadow-lg shadow-emerald-100/50",
          className
        )}
      >
        {/* Empty top section */}
        <div></div>
        
        {/* Center section */}
        <div></div>
        
        {/* Bottom section with icon and text */}
        <div>
          <span className="relative inline-block rounded-full p-2 bg-emerald-100 border border-emerald-200">
            <Plus className="h-4 w-4 text-emerald-600" />
          </span>
          <p className="text-base font-semibold text-emerald-700">Add New Goal</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-28 w-[260px] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 transition-all duration-700 hover:border-gray-300 hover:bg-white overflow-hidden [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      {/* Header with icon and title */}
      <div>
        <span className={cn("relative inline-block rounded-full p-2", iconBgColor)}>
          <div className={iconColor}>
            {icon}
          </div>
        </span>
        <p className="text-base font-medium text-gray-900">{title}</p>
      </div>

      {/* Progress description with bar */}
      <div className="!flex-col !items-stretch !gap-1">
        <p className="text-sm text-gray-600">
          {progressDescription}
        </p>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              progressPercent >= 75 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
              progressPercent >= 50 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
              progressPercent >= 25 ? "bg-gradient-to-r from-emerald-300 to-emerald-400" : "bg-gradient-to-r from-emerald-200 to-emerald-300"
            )}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Target date */}
      <p className="text-xs text-gray-500">Target: {formattedDate}</p>
    </div>
  );
}

interface GoalDisplayCardsProps {
  goals?: GoalDisplayCardProps[];
  className?: string;
}

export function GoalDisplayCards({ goals = [], className }: GoalDisplayCardsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  
  // Handle infinite scrolling with smooth transitions
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedIndex((prev) => (prev + 1) % goals.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [goals.length, isTransitioning]);
  
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedIndex((prev) => (prev - 1 + goals.length) % goals.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [goals.length, isTransitioning]);

  // Touch/Mouse swipe handling with velocity detection
  const handleStart = (clientX: number) => {
    if (isTransitioning) return;
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging.current || isTransitioning) return;
    
    const diff = startX.current - clientX;
    const threshold = 30; // reduced threshold for more responsive swiping
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handlePrev(); // Swipe left
      } else {
        handleNext(); // Swipe right
      }
    }
    
    isDragging.current = false;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Subtle hint animation - only show once per session
  const [showHint, setShowHint] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  
  useEffect(() => {
    // Hide hint after first interaction
    if (selectedIndex !== 0) {
      setShowHint(false);
      setHasShownHint(true);
    }
  }, [selectedIndex]);
  
  useEffect(() => {
    // Only show hint once on initial mount and never again
    if (goals.length > 1 && !hasShownHint) {
      const timer = setTimeout(() => {
        setShowHint(true);
        // Auto-hide after animation completes
        setTimeout(() => {
          setShowHint(false);
          setHasShownHint(true);
        }, 3500);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [goals.length, hasShownHint]);


  if (goals.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        <p>No goals to display</p>
      </div>
    );
  }

  // Reorder goals array based on selected index to show selected card in front
  const orderedGoals = [...goals.slice(selectedIndex), ...goals.slice(0, selectedIndex)];

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full overflow-x-hidden", className)}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={(e) => handleEnd(e.clientX)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchEnd={(e) => e.changedTouches[0] && handleEnd(e.changedTouches[0].clientX)}
    >
      <div className="relative flex justify-end items-center min-h-[225px] overflow-x-hidden overflow-y-visible pt-18 pr-8">
        {/* Static stack of cards */}
        <div className="relative w-[360px] h-[90px]" style={{ right: '-75px' }}>
          {orderedGoals.slice(0, 3).map((goal, index) => (
            <div
              key={`goal-${goals.indexOf(goal)}`}
              className="absolute smooth-card-transition"
              style={{
                transform: `translateX(${-index * 25}px) translateY(${-index * 35 + 20}px)`,
                zIndex: 30 - (index * 10),
                opacity: index === 0 ? 1 : index === 1 ? 0.98 : 0.95,
              }}
            >
              <div className="relative">
                <GoalDisplayCard 
                  {...goal}
                  onClick={index === 0 && goal.isAddCard ? goal.onClick : undefined}
                  className={cn(
                    "transition-all duration-300 ease-out",
                    index === 0 ? "cursor-pointer" : "pointer-events-none",
                    index === 1 && "hover:translate-x-1",
                    index === 2 && "hover:translate-x-2"
                  )}
                />
                
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Swipe hint above slider */}
      {showHint && goals.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-50">
          <div className="animate-slide-finger">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
              <span className="text-xl text-white">👆</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Minimalist infinite slider */}
      {goals.length > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-1.5">
            {goals.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "h-1.5 rounded-full smooth-dot-transition",
                  selectedIndex === index 
                    ? "w-8 bg-emerald-500" 
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`View goal ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { GoalDisplayCard };