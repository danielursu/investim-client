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
import { GoalCarousel } from "@/components/GoalCarousel"
import { Card, CardContent } from "@/components/ui/card"
import { getGoalIcon, IconName } from "@/constants/icons"
import { useGoals, useAddGoal, useIsGoalsLoading } from "@/stores/goalsStore"

// Helper function to get icon with consistent styling for display cards
const getIcon = (iconName: string): JSX.Element => {
  return (
    <div className="h-4 w-4">
      {getGoalIcon(iconName as IconName, 16)}
    </div>
  );
};

// Re-export the type for backward compatibility
export type { GoalWithProgress } from "@/stores/goalsStore";

// Removed AddGoalTrigger - no longer needed as GoalDisplayCards handles clicks directly

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

  // Prepare the goals array with the add card
  const goalsWithAddCard = [
    ...goals.map((goal) => ({
      title: goal.name,
      icon: getIcon(goal.icon),
      currentAmount: goal.currentAmount ? `$${goal.currentAmount}` : "$0",
      targetAmount: typeof goal.amount === 'number' ? `$${goal.amount.toLocaleString()}` : goal.amount,
      progressPercent: goal.progressPercent || 0,
      targetDate: goal.targetDate,
      description: goal.description,
    })),
    // Add the "Add Goal" card as the last item
    {
      title: "Add New Goal",
      icon: <Plus className="h-4 w-4 text-gray-600" />,
      isAddCard: true,
      onClick: () => setDialogOpen(true),
    }
  ];

  console.log('Goals count:', goalsWithAddCard.length);

  return (
    <div>
      {/* Display the list of goals or empty state */}
      <div className="relative overflow-visible">
        {isLoading ? (
          <Card className="border-dashed border-gray-300 text-center py-8">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-gray-500">Loading goals...</p>
            </CardContent>
          </Card>
        ) : goals.length === 0 ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <GoalCarousel
              goals={[{
                title: "Add New Goal",
                icon: <Plus className="h-4 w-4 text-gray-600" />,
                isAddCard: true,
                onClick: () => setDialogOpen(true),
              }]}
              className=""
            />
            <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-lg">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Investment Goal</DialogTitle>
              </DialogHeader>
              <AddGoalForm onSubmit={handleAddGoal} onCancel={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <GoalCarousel
              goals={goalsWithAddCard}
              className=""
            />
            <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-lg">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Investment Goal</DialogTitle>
              </DialogHeader>
              <AddGoalForm onSubmit={handleAddGoal} onCancel={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
