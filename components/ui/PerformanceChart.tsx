"use client"

import { FC } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface PerformanceChartProps {
  data?: { date: string; value: number }[]
}

const defaultData = [
  { date: "Jan", value: 12000 },
  { date: "Feb", value: 12500 },
  { date: "Mar", value: 13000 },
  { date: "Apr", value: 12800 },
  { date: "May", value: 13500 },
  { date: "Jun", value: 14000 },
]

function formatNumber(value: number): string {
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B"
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
  return value.toString()
}

export const PerformanceChart: FC<PerformanceChartProps> = ({ data = defaultData }) => (
  <div className="w-full h-48 rounded-md flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[12000, 14500]} tickFormatter={formatNumber} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip contentStyle={{ fontSize: 14 }} formatter={formatNumber} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default PerformanceChart
