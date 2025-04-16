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
    <Card className={`mb-2 shadow-md rounded-2xl border-none bg-white ${className}`} aria-label={`${title} Goal Card`}>
      <div className="flex items-center px-4 pt-4 pb-1">
        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-50 mr-4">
          {/* Enlarge icon and center vertically */}
          <span aria-hidden="true" className="flex items-center justify-center h-10 w-10">
            {icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-gray-500 mt-0.5">
            {targetDescription}
          </CardDescription>
        </div>
      </div>
      <CardContent className="pt-1">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" aria-label="Progress bar" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{currentAmount}</span>
            <span>{targetAmount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
