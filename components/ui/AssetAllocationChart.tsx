'use client'; // Mark as client component for recharts

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_FALLBACK_COLORS, COLORS } from '@/constants/colors';
import { AllocationItem, AssetAllocationChartProps } from '@/types';

// Types now imported from shared types

// Use imported fallback colors

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-4">No allocation data available.</div>;
  }

  // Ensure data has colors, using fallbacks if necessary
  const chartData = data.map((item: AllocationItem, index: number) => ({
    ...item,
    color: item.color || CHART_FALLBACK_COLORS[index % CHART_FALLBACK_COLORS.length],
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
          fill={COLORS.NEUTRAL} // Default fill (overridden by Cell)
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
