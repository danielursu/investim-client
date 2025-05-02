'use client'; // Mark as client component for recharts

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the structure for a single allocation item (matching Chatbot.tsx)
interface AllocationItem {
  name: string;
  percentage: number;
  color?: string;
}

// Define props for the chart component
interface AssetAllocationChartProps {
  data: AllocationItem[]; // Expects an array of allocation items
}

// Default colors if not provided in data
const FALLBACK_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-4">No allocation data available.</div>;
  }

  // Ensure data has colors, using fallbacks if necessary
  const chartData = data.map((item: AllocationItem, index: number) => ({
    ...item,
    color: item.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }));

  return (
    // Make chart responsive
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" // Center X
          cy="50%" // Center Y
          labelLine={false}
          // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Optional: Labels on slices
          outerRadius={80} // Size of the pie
          fill="#8884d8" // Default fill (overridden by Cell)
          dataKey="percentage" // Value determining slice size
          nameKey="name" // Key for legend/tooltip names
        >
          {/* Map data points to Pie Cells with specific colors */}
          {chartData.map((entry: AllocationItem & { color: string }, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {/* Tooltip on hover */}
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
        {/* Legend below the chart */}
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Default export
export default AssetAllocationChart;
