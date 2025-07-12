"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { 
  usePortfolioTotalValue,
  usePortfolioGain,
  usePortfolioGainPercentage,
  usePortfolioLastUpdated
} from "@/stores/portfolioStore"
import { 
  useChatRiskProfile, 
  useChatRiskScore 
} from "@/stores/chatStore"

export const PortfolioSummary = () => {
  const totalValue = usePortfolioTotalValue();
  const gain = usePortfolioGain();
  const gainPercentage = usePortfolioGainPercentage();
  const lastUpdated = usePortfolioLastUpdated();
  const riskProfile = useChatRiskProfile();
  const riskScore = useChatRiskScore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine if gain is positive or negative
  const isPositiveGain = gain >= 0;
  const TrendIcon = isPositiveGain ? TrendingUp : TrendingDown;
  const gainText = isPositiveGain ? `+$${gain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-$${Math.abs(gain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Risk badge styling
  const getRiskBadgeStyle = (profile: string | null) => {
    switch (profile) {
      case 'Conservative':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aggressive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="px-4 pt-6 pb-2">
      <Card
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg rounded-2xl border-none transition-shadow duration-200 hover:shadow-xl"
        aria-label="Total Portfolio Value Card"
      >
        <CardHeader className="pb-1 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-white/90">
              Total Portfolio Value
            </CardTitle>
            {mounted && riskProfile && riskScore && (
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30"
                title={`Risk Level: ${riskProfile} (${riskScore}/9)`}
              >
                {riskProfile}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex flex-col">
            <span
              className="text-3xl font-semibold text-white tracking-tight"
              aria-label="Portfolio Value"
            >
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <TrendIcon className={`h-4 w-4 ${isPositiveGain ? 'text-white' : 'text-red-200'}`} aria-hidden="true" />
                <span className={`text-sm font-medium ${isPositiveGain ? 'text-white' : 'text-red-200'}`} aria-label="Portfolio Growth">
                  {gainText} ({isPositiveGain ? '+' : ''}{gainPercentage.toFixed(1)}%)
                </span>
              </div>
              {mounted && lastUpdated && (
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">
                    {lastUpdated.toLocaleTimeString([], { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}