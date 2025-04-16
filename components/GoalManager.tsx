"use client"
import { useState } from "react"
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import { AddGoalForm, GoalFormValues } from "@/components/AddGoalForm"
import { GoalCard } from "@/components/ui/GoalCard"

export default function GoalManager() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [goals, setGoals] = useState<GoalFormValues[]>([])

  const handleAddGoal = (goal: GoalFormValues) => {
    setGoals(prev => [...prev, goal])
    setDialogOpen(false) // Close dialog on submit
  }

  return (
    <div>
      {/* Display the list of goals using the imported GoalCard */}
      <div className="mt-4">
        {goals.map((goal, idx) => (
          <GoalCard
            key={idx}
            title={goal.name}
            icon={<Target className="h-5 w-5 text-blue-500" />} 
            targetDescription={`Target: $${goal.amount} by ${goal.targetDate}`}
            progressPercent={0}
            currentAmount="$0"
            targetAmount={`$${goal.amount}`}
          />
        ))}
      </div>

      {/* Dialog (Add New Goal button) always at the bottom */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-gray-300 text-gray-500 mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Investment Goal</DialogTitle>
          </DialogHeader>
          <AddGoalForm onSubmit={handleAddGoal} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
