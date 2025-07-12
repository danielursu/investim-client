"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { GoalDisplayCard } from "@/components/ui/goal-display-cards"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {goals.map((goal, index) => (
            <CarouselItem key={index} className="pl-2 basis-[85%] sm:basis-[75%]">
              <div className="flex justify-center">
                <GoalDisplayCard
                  {...goal}
                  className="transform-none hover:scale-105 transition-transform duration-200"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Dot indicators */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index + 1 
                  ? "bg-emerald-600 w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}