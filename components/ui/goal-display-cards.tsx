"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect, useRef } from "react";

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
          "relative flex h-32 w-[280px] sm:w-[320px] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer overflow-hidden [&>*]:flex [&>*]:items-center [&>*]:gap-2",
          className
        )}
      >
        {/* Empty top section */}
        <div></div>
        
        {/* Center section */}
        <div></div>
        
        {/* Bottom section with icon and text */}
        <div>
          <span className="relative inline-block rounded-full p-2 bg-gray-100">
            {icon}
          </span>
          <p className="text-base font-medium text-gray-700">Add New Goal</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-32 w-[280px] sm:w-[320px] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 transition-all duration-700 hover:border-gray-300 hover:bg-white overflow-hidden [&>*]:flex [&>*]:items-center [&>*]:gap-2",
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
              progressPercent >= 75 ? "bg-emerald-600" :
              progressPercent >= 50 ? "bg-yellow-600" :
              progressPercent >= 25 ? "bg-orange-600" : "bg-gray-500"
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
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to collapse cards
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveCardIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (goals.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        <p>No goals to display</p>
      </div>
    );
  }

  // For single goal, display without stacking
  if (goals.length === 1) {
    return (
      <div className={cn("flex justify-center px-4", className)}>
        <GoalDisplayCard {...goals[0]} />
      </div>
    );
  }

  // For multiple goals, create stacked effect - most prominent at bottom-right
  // When there's an add card, we want it to be at the bottom-left (last position)
  const hasAddCard = goals.some(g => g.isAddCard);
  const regularGoals = goals.filter(g => !g.isAddCard);
  const addCardGoal = goals.find(g => g.isAddCard);
  
  // Reorder goals to put add card last (will appear at bottom)
  const orderedGoals = hasAddCard && addCardGoal ? [...regularGoals, addCardGoal] : goals;

  return (
    <div 
      ref={containerRef}
      className={cn("relative flex justify-end items-center opacity-100 animate-in fade-in-0 duration-700 min-h-[180px] overflow-visible py-4 pr-8", className)}
    >
      <div className="relative w-[320px] h-[160px]" style={{ right: '-40px' }}>
        {orderedGoals.slice(0, 3).map((goal, index) => (
          <div 
            key={`goal-${index}`}
            onClick={(e) => {
              if (goal.isAddCard && goal.onClick) {
                goal.onClick();
              } else {
                e.stopPropagation();
                setActiveCardIndex(activeCardIndex === index ? null : index);
              }
            }}
            className="absolute cursor-pointer"
            style={{
              transform: `translateX(${-index * 8}px) translateY(${-index * 6}px)`,
              zIndex: 30 - (index * 10),
            }}
          >
            <GoalDisplayCard 
              {...goal} 
              className={cn(
                "transition-all duration-300",
                index === 0 ? "" : index === 1 ? "opacity-98" : "opacity-95",
                activeCardIndex === index ? "-translate-y-8" : "",
                "hover:-translate-y-6"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { GoalDisplayCard };