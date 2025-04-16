import { z } from "zod"

export const goalSchema = z.object({
  name: z.string().min(2, "Goal name is required"),
  amount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be positive"),
  targetDate: z.string().min(1, "Target date is required"),
  description: z.string().optional(),
  icon: z.string().min(1, "Please select an icon"),
})

export type GoalFormValues = z.infer<typeof goalSchema>
