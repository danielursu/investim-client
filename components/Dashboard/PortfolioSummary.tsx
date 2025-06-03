"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { portfolioMetrics } from "@/data/portfolio-allocations"

export const PortfolioSummary = () => {
  return (
    <div className="p-3">
      <Card
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg rounded-2xl border-none focus-visible:ring-2 focus-visible:ring-emerald-700 transition-all"
        aria-label="Total Portfolio Value Card"
      >
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm font-medium opacity-90 tracking-wide">
            Total Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <span
              className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md"
              aria-label="Portfolio Value"
            >
              ${portfolioMetrics.totalValue.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-lime-200 drop-shadow-sm" aria-hidden="true" />
              <span className="text-sm font-medium text-lime-100" aria-label="Portfolio Growth">
                +${portfolioMetrics.gain.toLocaleString()} ({portfolioMetrics.gainPercentage}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}