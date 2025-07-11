import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { defaultGoals } from '@/data/portfolio-allocations';

// Define the goal type with progress information
export interface GoalWithProgress {
  name: string;
  icon: string;
  amount: string | number;
  targetDate: string;
  description?: string;
  progressPercent?: number;
  currentAmount?: string;
}

interface GoalsState {
  goals: GoalWithProgress[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface GoalsActions {
  // CRUD operations
  addGoal: (goal: Omit<GoalWithProgress, 'progressPercent' | 'currentAmount'>) => void;
  updateGoal: (index: number, updates: Partial<GoalWithProgress>) => void;
  deleteGoal: (index: number) => void;
  
  // Progress updates
  updateGoalProgress: (index: number, currentAmount: string, progressPercent?: number) => void;
  
  // Batch operations
  setGoals: (goals: GoalWithProgress[]) => void;
  resetGoals: () => void;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility functions
  refreshGoals: () => Promise<void>;
  calculateProgress: (currentAmount: string, targetAmount: string | number) => number;
}

type GoalsStore = GoalsState & GoalsActions;

// Helper function to calculate progress percentage
const calculateProgressPercentage = (currentAmount: string, targetAmount: string | number): number => {
  const current = parseFloat(currentAmount.replace(/[,$]/g, '')) || 0;
  const target = typeof targetAmount === 'number' 
    ? targetAmount 
    : parseFloat(targetAmount.toString().replace(/[,$]/g, '')) || 1;
  
  return Math.min(Math.round((current / target) * 100), 100);
};

// Initial state
const initialState: GoalsState = {
  goals: defaultGoals,
  isLoading: false,
  error: null,
  lastUpdated: new Date(),
};

export const useGoalsStore = create<GoalsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // CRUD operations
        addGoal: (goal) =>
          set(
            (state) => {
              const newGoal: GoalWithProgress = {
                ...goal,
                progressPercent: 0,
                currentAmount: '0',
              };
              
              return {
                ...state,
                goals: [...state.goals, newGoal],
                lastUpdated: new Date(),
              };
            },
            false,
            'addGoal'
          ),

        updateGoal: (index, updates) =>
          set(
            (state) => {
              const updatedGoals = state.goals.map((goal, i) =>
                i === index ? { ...goal, ...updates } : goal
              );
              
              return {
                ...state,
                goals: updatedGoals,
                lastUpdated: new Date(),
              };
            },
            false,
            'updateGoal'
          ),

        deleteGoal: (index) =>
          set(
            (state) => ({
              ...state,
              goals: state.goals.filter((_, i) => i !== index),
              lastUpdated: new Date(),
            }),
            false,
            'deleteGoal'
          ),

        // Progress updates
        updateGoalProgress: (index, currentAmount, progressPercent) =>
          set(
            (state) => {
              const updatedGoals = state.goals.map((goal, i) => {
                if (i === index) {
                  const calculatedProgress = progressPercent !== undefined 
                    ? progressPercent 
                    : calculateProgressPercentage(currentAmount, goal.amount);
                      
                    return {
                      ...goal,
                      currentAmount,
                      progressPercent: calculatedProgress,
                    };
                  }
                  return goal;
                });
                
                return {
                  ...state,
                  goals: updatedGoals,
                  lastUpdated: new Date(),
                };
              },
              false,
              'updateGoalProgress'
            ),

        // Batch operations
        setGoals: (goals) =>
          set(
            (state) => ({
              ...state,
              goals,
              lastUpdated: new Date(),
            }),
            false,
            'setGoals'
          ),

        resetGoals: () =>
          set(
            () => ({
              ...initialState,
              lastUpdated: new Date(),
            }),
            false,
            'resetGoals'
          ),

        // Loading and error states
        setLoading: (loading) =>
          set(
            (state) => ({
              ...state,
              isLoading: loading,
            }),
            false,
            'setLoading'
          ),

        setError: (error) =>
          set(
            (state) => ({
              ...state,
              error,
            }),
            false,
            'setError'
          ),

        clearError: () =>
          set(
            (state) => ({
              ...state,
              error: null,
            }),
            false,
            'clearError'
          ),

        // Utility functions
        refreshGoals: async () => {
          const { setLoading, setError } = get();
          setLoading(true);
          setError(null);
          
          try {
            // Simulate API call to refresh goals data
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // In a real app, this would fetch updated goals from an API
            // For now, we'll just update the timestamp
            set(
              (state) => ({
                ...state,
                lastUpdated: new Date(),
                isLoading: false,
              }),
              false,
              'refreshGoals'
            );
          } catch (error) {
            console.error('Failed to refresh goals:', error);
            setError('Failed to refresh goals. Please try again.');
            setLoading(false);
          }
        },

        calculateProgress: calculateProgressPercentage,
      }),
      {
        name: 'goals-storage', // Storage key
        partialize: (state) => ({
          goals: state.goals,
          lastUpdated: state.lastUpdated,
        }), // Only persist goals and lastUpdated, not loading/error states
      }
    )
  )
);

// Selector hooks for better performance
export const useGoals = () => useGoalsStore((state) => state.goals);

export const useAddGoal = () => useGoalsStore((state) => state.addGoal);
export const useUpdateGoal = () => useGoalsStore((state) => state.updateGoal);
export const useDeleteGoal = () => useGoalsStore((state) => state.deleteGoal);
export const useUpdateGoalProgress = () => useGoalsStore((state) => state.updateGoalProgress);
export const useSetGoals = () => useGoalsStore((state) => state.setGoals);
export const useResetGoals = () => useGoalsStore((state) => state.resetGoals);
export const useRefreshGoals = () => useGoalsStore((state) => state.refreshGoals);
export const useCalculateProgress = () => useGoalsStore((state) => state.calculateProgress);

// Deprecated: useGoalsActions (kept for backward compatibility)
export const useGoalsActions = () =>
  useGoalsStore(
    (state) => ({
      addGoal: state.addGoal,
      updateGoal: state.updateGoal,
      deleteGoal: state.deleteGoal,
      updateGoalProgress: state.updateGoalProgress,
      setGoals: state.setGoals,
      resetGoals: state.resetGoals,
      refreshGoals: state.refreshGoals,
      calculateProgress: state.calculateProgress,
    }),
    shallow
  );

export const useIsGoalsLoading = () => useGoalsStore((state) => state.isLoading);
export const useGoalsError = () => useGoalsStore((state) => state.error);
export const useGoalsLastUpdated = () => useGoalsStore((state) => state.lastUpdated);

// Deprecated: useGoalsState (do not use in components)
export const useGoalsState = () =>
  useGoalsStore(
    (state) => ({
      isLoading: state.isLoading,
      error: state.error,
      lastUpdated: state.lastUpdated,
    }),
    shallow
  );

export const useGoalById = (index: number) =>
  useGoalsStore((state) => state.goals[index]);

export const useGoalsCount = () =>
  useGoalsStore((state) => state.goals.length);

export const useGoalsProgress = () =>
  useGoalsStore(
    (state) => {
      const totalGoals = state.goals.length;
      const completedGoals = state.goals.filter((goal) => (goal.progressPercent || 0) >= 100).length;
      const averageProgress = totalGoals > 0 
        ? state.goals.reduce((sum, goal) => sum + (goal.progressPercent || 0), 0) / totalGoals 
        : 0;
      return {
        totalGoals,
        completedGoals,
        averageProgress: Math.round(averageProgress),
      };
    },
    shallow
  );

export const useGoalsProgressShallow = () =>
  useGoalsStore((state) => {
    const totalGoals = state.goals.length;
    const completedGoals = state.goals.filter((goal) => (goal.progressPercent || 0) >= 100).length;
    const averageProgress = totalGoals > 0 
      ? state.goals.reduce((sum, goal) => sum + (goal.progressPercent || 0), 0) / totalGoals 
      : 0;
    
    return {
      totalGoals,
      completedGoals,
      averageProgress: Math.round(averageProgress),
    };
  }, shallow);