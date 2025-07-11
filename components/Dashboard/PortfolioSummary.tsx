"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { 
  usePortfolioTotalValue,
  usePortfolioGain,
  usePortfolioGainPercentage,
  usePortfolioLastUpdated
} from "@/stores/portfolioStore"

export const PortfolioSummary = () => {
  const totalValue = usePortfolioTotalValue();
  const gain = usePortfolioGain();
  const gainPercentage = usePortfolioGainPercentage();
  const lastUpdated = usePortfolioLastUpdated();
  
  // Determine if gain is positive or negative
  const isPositiveGain = gain >= 0;
  const TrendIcon = isPositiveGain ? TrendingUp : TrendingDown;
  const trendColor = isPositiveGain ? "text-lime-200" : "text-red-200";
  const gainText = isPositiveGain ? `+$${gain.toLocaleString()}` : `-$${Math.abs(gain).toLocaleString()}`;

  return (
    <div className="p-3">
      <Card
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg rounded-2xl border-none focus-visible:ring-2 focus-visible:ring-emerald-700 transition-all"
        aria-label="Total Portfolio Value Card"
      >
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium opacity-90 tracking-wide">
              Total Portfolio Value
            </CardTitle>
            {lastUpdated && (
              <span className="text-xs opacity-70">
                Updated {lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'UTC' // Use UTC to ensure server/client consistency
                })}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <span
              className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md"
              aria-label="Portfolio Value"
            >
              ${totalValue.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <TrendIcon className={`h-4 w-4 mr-1 drop-shadow-sm ${trendColor}`} aria-hidden="true" />
              <span className={`text-sm font-medium ${trendColor}`} aria-label="Portfolio Growth">
                {gainText} ({isPositiveGain ? '+' : ''}{gainPercentage}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}