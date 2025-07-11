import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ReactNode } from "react"

export interface GoalCardProps {
  title: string
  icon: ReactNode
  targetDescription: string
  progressPercent: number
  currentAmount: string
  targetAmount: string
  className?: string
}

/**
 * GoalCard - reusable card for investment goals
 * - Accessible, mobile-first, touch-friendly
 * - Visual hierarchy, semantic structure, responsive
 */
export function GoalCard({
  title,
  icon,
  targetDescription,
  progressPercent,
  currentAmount,
  targetAmount,
  className = "",
}: GoalCardProps) {
  return (
    <Card className={`group mb-4 shadow-md rounded-2xl border-none bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1 transform cursor-pointer ${className}`} aria-label={`${title} Goal Card`}>
      <div className="flex items-center px-6 pt-6 pb-2">
        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-50 mr-4 transition-all duration-200 group-hover:bg-emerald-100">
          {/* Enlarge icon and center vertically */}
          <span aria-hidden="true" className="flex items-center justify-center h-10 w-10 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600 mt-1 font-medium">
            {targetDescription}
          </CardDescription>
        </div>
      </div>
      <CardContent className="pt-2 px-6 pb-6">
        <div className="space-y-3">
          <div className="flex justify-between text-base text-gray-800">
            <span className="font-medium">Progress</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" aria-label="Progress bar" />
          <div className="flex justify-between text-base text-gray-700">
            <span className="font-semibold">{currentAmount}</span>
            <span className="font-semibold">{targetAmount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
