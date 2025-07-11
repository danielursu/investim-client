"use client"

import { Button } from "@/components/ui/button"
import { Period } from "@/types"

const PERIODS = ["1M", "3M", "6M", "12M"] as const;

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export const PeriodSelector = ({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) => {
  return (
    <div className="flex justify-end gap-x-2 mt-1 mb-4">
      {PERIODS.map((period) => (
        <button 
          key={period}
          className={`h-8 px-3 text-sm rounded-lg transition-colors duration-150 font-medium min-w-[44px] inline-flex items-center justify-center will-change-auto transform-gpu ${
            selectedPeriod === period 
              ? "bg-primary text-white shadow-sm" 
              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-primary hover:text-primary"
          }`}
          onClick={() => onPeriodChange(period)}
        >
          {period}
        </button>
      ))}
    </div>
  )
}