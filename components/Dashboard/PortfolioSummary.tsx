"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"
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
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine if gain is positive or negative
  const isPositiveGain = gain >= 0;
  const TrendIcon = isPositiveGain ? TrendingUp : TrendingDown;
  const trendColor = isPositiveGain ? "text-green-100" : "text-red-100";
  const gainText = isPositiveGain ? `+$${gain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-$${Math.abs(gain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="px-4 py-3">
      <Card
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg rounded-2xl border-none focus-visible:ring-2 focus-visible:ring-emerald-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform"
        aria-label="Total Portfolio Value Card"
      >
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium opacity-90 tracking-wide">
              Total Portfolio Value
            </CardTitle>
            {mounted && lastUpdated && (
              <span className="text-xs opacity-70">
                Updated {lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <span
              className="text-4xl font-extrabold tracking-tight drop-shadow-md transition-all duration-300"
              aria-label="Portfolio Value"
            >
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon className={`h-5 w-5 mr-1 drop-shadow-sm ${trendColor}`} aria-hidden="true" />
              <span className={`text-base font-semibold ${trendColor} tracking-wide`} aria-label="Portfolio Growth">
                {gainText} ({isPositiveGain ? '+' : ''}{gainPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}