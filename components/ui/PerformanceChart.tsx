"use client"

import { FC, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { COLORS } from "@/constants/colors";
import { Period, PerformanceChartProps } from "@/types";

const PERIODS = ["1M", "3M", "6M", "12M"] as const;

const twelveMonthData = [
  { date: "Jul '24", value: 11800 },
  { date: "Aug '24", value: 11900 },
  { date: "Sep '24", value: 12100 },
  { date: "Oct '24", value: 12300 },
  { date: "Nov '24", value: 12200 },
  { date: "Dec '24", value: 12400 },
  { date: "Jan '25", value: 12000 },
  { date: "Feb '25", value: 12500 },
  { date: "Mar '25", value: 13000 },
  { date: "Apr '25", value: 12800 },
  { date: "May '25", value: 13500 },
  { date: "Jun '25", value: 14000 },
];

function formatNumber(value: number): string {
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return value.toString();
}

export const PerformanceChart: FC<PerformanceChartProps> = ({ period }) => {
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    let currentData;
    switch (period) {
      case "1M":
        currentData = twelveMonthData.slice(-2);
        break;
      case "3M":
        currentData = twelveMonthData.slice(-3);
        break;
      case "6M":
        currentData = twelveMonthData.slice(-6);
        break;
      case "12M":
      default:
        currentData = twelveMonthData.slice(-12);
        break;
    }
    setChartData(currentData);

    if (currentData && currentData.length > 0) {
      const values = currentData.map(d => d.value);
      const minY = Math.min(...values);
      const maxY = Math.max(...values);
      const rangePadding = (maxY === minY) ? Math.max(500, maxY * 0.1) : (maxY - minY) * 0.1;
      
      setYAxisDomain([
        Math.floor((minY - rangePadding) / 100) * 100,
        Math.ceil((maxY + rangePadding) / 100) * 100
      ]);
    } else {
      setYAxisDomain([0, 1000]);
    }
  }, [period]);

  if (!chartData || chartData.length === 0) {
    return <div className="w-full h-48 rounded-md flex items-center justify-center text-gray-500">Loading chart data...</div>;
  }
  
  return (
    <div className="w-full h-48 rounded-md flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.POSITIVE} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS.POSITIVE} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={yAxisDomain} tickFormatter={formatNumber} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip contentStyle={{ fontSize: 14 }} formatter={formatNumber} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS.POSITIVE}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
