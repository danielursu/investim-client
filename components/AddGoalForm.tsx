import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const goalSchema = z.object({
  name: z.string().min(2, "Goal name is required"),
  amount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be positive"),
  targetDate: z.string().min(1, "Target date is required"),
  description: z.string().optional(),
})

export type GoalFormValues = z.infer<typeof goalSchema>

interface AddGoalFormProps {
  onSubmit: (data: GoalFormValues) => void | Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<GoalFormValues>
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onSubmit, onCancel, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      targetDate: "",
      description: "",
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Goal Name</label>
        <Input {...register("name")}
          placeholder="e.g. Buy a house" autoFocus disabled={isSubmitting} />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Target Amount</label>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...register("amount", { valueAsNumber: true })}
          placeholder="e.g. 100000"
          disabled={isSubmitting}
        />
        {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Target Date</label>
        <Input type="date" {...register("targetDate")}
          disabled={isSubmitting} />
        {errors.targetDate && <p className="text-xs text-red-600 mt-1">{errors.targetDate.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description <span className="text-gray-400">(optional)</span></label>
        <Textarea {...register("description")}
          placeholder="Add details or notes..." rows={2} disabled={isSubmitting} />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Goal"}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline" className="w-full" disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
