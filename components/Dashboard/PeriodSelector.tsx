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
        <Button 
          key={period}
          size="sm" 
          className="h-7 px-2 text-xs rounded" 
          variant={selectedPeriod === period ? "default" : "outline"}
          onClick={() => onPeriodChange(period)}
        >
          {period}
        </Button>
      ))}
    </div>
  )
}