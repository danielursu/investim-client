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
import { Plus } from "lucide-react"
import { AddGoalForm } from "@/components/AddGoalForm"
import { GoalFormValues } from "@/components/goalSchema"
import { GoalCard } from "@/components/ui/GoalCard"
import { Card, CardContent } from "@/components/ui/card"
import { COLORS } from "@/constants/colors"
import { getGoalIcon, IconName } from "@/constants/icons"

// Helper function to get icon with consistent styling
const getIcon = (iconName: string): JSX.Element => {
  return (
    <div className="h-5 w-5">
      {getGoalIcon(iconName as IconName, 20)}
    </div>
  );
};

// Define the extended goal type that includes progress information
export interface GoalWithProgress {
  name: string;
  icon: string;
  amount: string | number;
  targetDate: string;
  description?: string;
  progressPercent?: number;
  currentAmount?: string;
}

interface GoalManagerProps {
  initialGoals?: GoalWithProgress[];
}

export default function GoalManager({ initialGoals = [] }: GoalManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [goals, setGoals] = useState<GoalWithProgress[]>(initialGoals)

  const handleAddGoal = (goal: GoalFormValues) => {
    // Convert GoalFormValues to GoalWithProgress
    const newGoal: GoalWithProgress = {
      ...goal,
      progressPercent: 0,
      currentAmount: "0"
    }
    setGoals(prev => [...prev, newGoal])
    setDialogOpen(false) // Close dialog on submit
  }

  // Placeholder function for AI setup CTA
  const handleAiSetup = () => {
    console.log("AI setup requested!");
    // TODO: Implement AI goal setup logic
  }

  return (
    <div className="space-y-4">
      {/* Display the list of goals or empty state */}
      <div className="mt-4">
        {goals.length === 0 ? (
          <Card className="border-dashed border-gray-300 text-center py-8">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-500">No goals set yet.</p>
              <Button 
                variant="default" 
                className="bg-[#079669] hover:bg-[#067d5a] text-white" 
                onClick={handleAiSetup}
              >
                Let the AI set up my first goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {goals.map((goal, idx) => (
              <GoalCard
                key={idx}
                title={goal.name}
                icon={getIcon(goal.icon)}
                targetDescription={`Target: ${typeof goal.amount === 'number' ? `$${goal.amount}` : goal.amount} by ${goal.targetDate}`}
                progressPercent={goal.progressPercent || 0}
                currentAmount={goal.currentAmount ? `$${goal.currentAmount}` : "$0"}
                targetAmount={typeof goal.amount === 'number' ? `$${goal.amount}` : goal.amount}
              />
            ))}
          </>
        )}
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
