"use client"

import { GoalManager } from '@/components/GoalManager'

export const GoalsSection = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="px-4 pt-2 pb-4">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your Goals</h2>
      </div>

      <div className="relative">
        <GoalManager />
      </div>
    </div>
  )
}