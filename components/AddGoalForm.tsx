import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
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
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      amount: 10000,
      targetDate: undefined,
      description: "",
      icon: "circle",
      ...defaultValues,
    },
  })
  const sliderValue = watch("amount") || 10000
  const selectedIcon = watch("icon") || "circle"

  return (
    <Card className="bg-white shadow-lg rounded-2xl border-0">
      <CardHeader className="pb-4 relative">
        <CardTitle className="text-lg font-semibold text-gray-900">Add New Investment Goal</CardTitle>
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-sm opacity-70 text-gray-500 transition-opacity hover:opacity-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </CardHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Icon</label>
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
            <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="goal-name">
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
            <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="goal-amount">
              Target Amount
            </label>
            <div className="flex items-center gap-4">
              <Slider
                min={1000}
                max={1000000}
                step={1000}
                value={[sliderValue]}
                onValueChange={([val]) => setValue("amount", val, { shouldValidate: true })}
                className="flex-1"
              />
              <span className="font-semibold min-w-[60px] text-right text-gray-900">${sliderValue.toLocaleString()}</span>
            </div>
            {errors.amount && (
              <div className="text-xs text-red-500 mt-1">{errors.amount.message}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="goal-date">
              Target Date
            </label>
            <Controller
              name="targetDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="goal-date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select target date"
                  disabled={isSubmitting}
                  minDate={new Date()}
                  className={errors.targetDate ? "border-red-500" : ""}
                />
              )}
            />
            {errors.targetDate && (
              <div className="text-xs text-red-500 mt-1">{errors.targetDate.message}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="goal-description">
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
        </CardContent>

        <CardFooter className="flex justify-end pt-2 pb-4 px-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg px-6 text-white"
            style={{ backgroundColor: "#079669" }}
          >
            {isSubmitting ? "Saving..." : "Add Goal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
