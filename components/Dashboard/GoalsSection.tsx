"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { GoalManager } from '@/components/GoalManager'

export const GoalsSection = () => {
  return (
    <div className="px-4 py-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Goals</h2>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 h-9 px-3 rounded-lg transition-all duration-200 font-medium">
          See All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <GoalManager />
    </div>
  )
}