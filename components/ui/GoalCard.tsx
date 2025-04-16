import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <CardHeader className="pb-1 pt-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            {title}
            <span aria-hidden="true">{icon}</span>
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-gray-500">
          {targetDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
