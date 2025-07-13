"use client"

import { GoalDisplayCards } from "@/components/ui/goal-display-cards"

interface GoalCarouselProps {
  goals: Array<{
    title?: string;
    icon?: React.ReactNode;
    currentAmount?: string;
    targetAmount?: string;
    progressPercent?: number;
    targetDate?: string;
    description?: string;
    isAddCard?: boolean;
    onClick?: () => void;
  }>;
  className?: string;
}

export function GoalCarousel({ goals, className }: GoalCarouselProps) {
  return <GoalDisplayCards goals={goals} className={className} />
}