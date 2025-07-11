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
import { getGoalIcon, IconName } from "@/constants/icons"
import { useGoals, useAddGoal, useIsGoalsLoading } from "@/stores/goalsStore"

// Helper function to get icon with consistent styling
const getIcon = (iconName: string): JSX.Element => {
  return (
    <div className="h-5 w-5">
      {getGoalIcon(iconName as IconName, 20)}
    </div>
  );
};

// Re-export the type for backward compatibility
export type { GoalWithProgress } from "@/stores/goalsStore";

interface GoalManagerProps {
  // Remove initialGoals prop as we're now using the store
}

export function GoalManager({}: GoalManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Get goals and actions from the store
  const goals = useGoals();
  const addGoal = useAddGoal();
  const isLoading = useIsGoalsLoading();

  const handleAddGoal = (goal: GoalFormValues) => {
    // Convert Date to string for storage
    const goalWithStringDate = {
      ...goal,
      targetDate: goal.targetDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    };
    
    // Use the store action to add the goal
    addGoal(goalWithStringDate);
    setDialogOpen(false); // Close dialog on submit
  }

  // Placeholder function for AI setup CTA
  const handleAiSetup = () => {
    console.log("AI setup requested!");
    // TODO: Implement AI goal setup logic with store integration
  }

  return (
    <div className="space-y-4">
      {/* Display the list of goals or empty state */}
      <div className="mt-4">
        {isLoading ? (
          <Card className="border-dashed border-gray-300 text-center py-8">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-gray-500">Loading goals...</p>
            </CardContent>
          </Card>
        ) : goals.length === 0 ? (
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
                key={`${goal.name}-${idx}`}
                title={goal.name}
                icon={getIcon(goal.icon)}
                targetDescription={`Target: ${typeof goal.amount === 'number' ? `$${goal.amount.toLocaleString()}` : goal.amount} by ${goal.targetDate}`}
                progressPercent={goal.progressPercent || 0}
                currentAmount={goal.currentAmount ? `$${goal.currentAmount}` : "$0"}
                targetAmount={typeof goal.amount === 'number' ? `$${goal.amount.toLocaleString()}` : goal.amount}
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
            className="w-full border-dashed border-2 border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 mt-6 py-3 text-base font-semibold min-h-[48px]"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Add New Investment Goal</DialogTitle>
          </DialogHeader>
          <AddGoalForm onSubmit={handleAddGoal} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
