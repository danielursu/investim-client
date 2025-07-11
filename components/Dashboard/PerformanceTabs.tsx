"use client"

import { useState, Suspense, lazy } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Period } from "@/types"
import { defaultAllocationData, portfolioMetrics } from "@/data/portfolio-allocations"
import { PeriodSelector } from "./PeriodSelector"

// Lazy load chart components
const PerformanceChart = lazy(() => import("@/components/ui/PerformanceChart").then(module => ({ default: module.PerformanceChart })));
const AssetAllocationChart = lazy(() => import("@/components/ui/AssetAllocationChart").then(module => ({ default: module.AssetAllocationChart })));

// Loading components for charts
const ChartLoading = () => (
  <div className="w-full h-48 rounded-md flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="text-sm text-gray-500">Loading chart...</div>
  </div>
);

const AllocationLoading = () => (
  <div className="w-full h-[300px] rounded-md flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="text-sm text-gray-500">Loading allocation chart...</div>
  </div>
);

export const PerformanceTabs = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("12M");

  return (
    <div className="px-4 py-6 animate-in fade-in duration-500 delay-200">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio Performance</h2>
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 mb-6 mt-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <TooltipProvider>
            <Card className="mb-2 shadow-md rounded-2xl border-none bg-white">
              <div className="px-4 pt-4 pb-1">
                <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">Growth Trend</CardTitle>
              </div>
              <CardContent className="pt-1">
                <PeriodSelector 
                  selectedPeriod={selectedPeriod} 
                  onPeriodChange={setSelectedPeriod} 
                />
                <Suspense fallback={<ChartLoading />}>
                  <PerformanceChart period={selectedPeriod} />
                </Suspense>
                <div className="flex justify-evenly items-center mt-4">
                  <div className="flex flex-row items-center gap-2 w-32 justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-700" />
                    <span className="font-semibold text-black text-lg">+{portfolioMetrics.annualReturn}%</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} aria-label="Annual Return Info">
                          <Info className="h-4 w-4 text-gray-700 cursor-pointer" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        The percentage gain or loss on your portfolio over the past year.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-row items-center gap-2 w-32 justify-center">
                    <Shield className="h-5 w-5 text-emerald-700" />
                    <span className="font-semibold text-black text-lg">{portfolioMetrics.riskLevel}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} aria-label="Risk Level Info">
                          <Info className="h-4 w-4 text-gray-700 cursor-pointer" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        An assessment of your portfolio&apos;s volatility and potential for loss.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TooltipProvider>
        </TabsContent>
        
        <TabsContent value="allocation">
          <Card className="mb-2 shadow-md rounded-2xl border-none bg-white">
            <div className="px-4 pt-4 pb-1">
              <CardTitle className="text-base font-semibold text-gray-900">Asset Allocation</CardTitle>
            </div>
            <CardContent className="pt-1">
              <Suspense fallback={<AllocationLoading />}>
                <AssetAllocationChart data={defaultAllocationData} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="mb-2 shadow-md rounded-2xl border-none bg-white">
            <div className="px-4 pt-4 pb-1">
              <CardTitle className="text-base font-semibold text-gray-900">Transaction History</CardTitle>
            </div>
            <CardContent className="pt-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Auto-Investment</p>
                    <p className="text-sm text-gray-500">Apr 10, 2025</p>
                  </div>
                  <p className="font-medium text-emerald-600">+$500.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Dividend Payment</p>
                    <p className="text-sm text-gray-500">Apr 5, 2025</p>
                  </div>
                  <p className="font-medium text-emerald-600">+$78.32</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Auto-Investment</p>
                    <p className="text-sm text-gray-500">Mar 25, 2025</p>
                  </div>
                  <p className="font-medium text-emerald-600">+$500.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Portfolio Rebalance</p>
                    <p className="text-sm text-gray-500">Mar 15, 2025</p>
                  </div>
                  <p className="font-medium text-gray-500">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}