import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { goalSchema, GoalFormValues } from "./goalSchema"
import { COLORS } from "@/constants/colors"
import { GOAL_ICONS, getGoalIcon } from "@/constants/icons"

function formatK(amount: number) {
  return amount >= 1000 ? `${amount / 1000}K` : amount.toString()
}

// Use centralized icon configuration
const ICONS = GOAL_ICONS.map(icon => ({
  name: icon.name,
  icon: getGoalIcon(icon.name, 24)
}));

interface AddGoalFormProps {
  onSubmit: (data: GoalFormValues) => void
  onCancel: () => void
  defaultValues?: Partial<GoalFormValues>
}

export function AddGoalForm({ onSubmit, onCancel, defaultValues }: AddGoalFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      amount: 10000,
      targetDate: "",
      description: "",
      icon: "circle",
      ...defaultValues,
    },
  })
  const sliderValue = watch("amount") || 10000
  const selectedIcon = watch("icon") || "circle"

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow p-4 space-y-4"
      autoComplete="off"
    >
      {/* Icon Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Icon</label>
        <div className="flex gap-3">
          {ICONS.map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              className={`p-1 rounded-full border transition
                ${selectedIcon === name ? "ring-2 ring-[#079669] border-[#079669] bg-[#e6f6f1]" : "border-gray-200 bg-white"}
                focus:outline-none focus:ring-2 focus:ring-[#079669]`}
              onClick={() => setValue("icon", name, { shouldValidate: true })}
              tabIndex={0}
            >
              {icon}
            </button>
          ))}
        </div>
        {errors.icon && (
          <div className="text-xs text-red-500 mt-1">{errors.icon.message}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="goal-name">
          Goal Name
        </label>
        <Input
          id="goal-name"
          {...register("name")}
          placeholder="E.g. Buy a house"
          className={`rounded-lg ${errors.name ? "border-red-500" : ""}`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <div className="text-xs text-red-500 mt-1">{errors.name.message}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="goal-amount">
          Target Amount
        </label>
        <div className="flex items-center gap-4">
          <Slider
            min={1000}
            max={1000000}
            step={1000}
            value={[sliderValue]}
            onValueChange={([val]) => setValue("amount", val, { shouldValidate: true })}
            className="flex-1
              [&_[data-state=active]]:bg-[#079669]
              [&_[data-state=active]]:border-[#079669]
              [&_.bg-primary]:bg-[#079669]
              [&_.bg-primary]:border-[#079669]
              [&_[role=slider]]:bg-[#079669]"
            style={{
              // These styles affect the root, but we need to target the thumb and range
              // We'll use Tailwind's arbitrary selector for the inner parts below
            }}
          />
          <span className="font-semibold min-w-[48px] text-right">{formatK(sliderValue)}</span>
        </div>
        {errors.amount && (
          <div className="text-xs text-red-500 mt-1">{errors.amount.message}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="goal-date">
          Target Date
        </label>
        <Input
          id="goal-date"
          type="date"
          {...register("targetDate")}
          className={`rounded-lg ${errors.targetDate ? "border-red-500" : ""}`}
          disabled={isSubmitting}
        />
        {errors.targetDate && (
          <div className="text-xs text-red-500 mt-1">{errors.targetDate.message}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="goal-description">
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <Textarea
          id="goal-description"
          rows={2}
          {...register("description")}
          placeholder="Add extra details (optional)"
          className="rounded-lg"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg px-6 text-white"
          style={{ backgroundColor: "#079669" }}
        >
          {isSubmitting ? "Saving..." : "Add Goal"}
        </Button>
      </div>
    </form>
  )
}
