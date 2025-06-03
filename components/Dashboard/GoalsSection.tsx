"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import GoalManager from '@/components/GoalManager'
import { defaultGoals } from "@/data/portfolio-allocations"

export const GoalsSection = () => {
  return (
    <div className="p-3 pt-1 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Your Goals</h2>
        <Button variant="ghost" size="sm" className="text-emerald-600 h-8 px-2">
          See All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <GoalManager initialGoals={defaultGoals} />
    </div>
  )
}