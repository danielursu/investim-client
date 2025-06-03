"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  BotMessageSquare,
  ChevronRight,
  Home,
  LineChart,
  MessageCircle,
  Plus,
  Settings,
  Target,
  TrendingUp,
  X,
  Shield,
  Info,
} from "lucide-react"
import { useState, useEffect } from "react"
import PerformanceChart from "@/components/ui/PerformanceChart"
import Image from "next/image"
import { GoalCard } from "@/components/ui/GoalCard"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { MobileNavBar } from "@/components/ui/MobileNavBar"
import { Chatbot } from "@/components/Chatbot"
import GoalManager from '@/components/GoalManager';
import AssetAllocationChart from "@/components/ui/AssetAllocationChart"
import { COLORS } from "@/constants/colors"
import { Period } from "@/types"

// Asset allocation data for the chart
const allocationData = [
  { name: "Stocks", percentage: 45, color: COLORS.CHART.STOCKS },
  { name: "Bonds", percentage: 30, color: COLORS.CHART.BONDS },
  { name: "Real Estate", percentage: 15, color: COLORS.CHART.REAL_ESTATE },
  { name: "Alternatives", percentage: 10, color: COLORS.CHART.ALTERNATIVES },
]

const PERIODS = ["1M", "3M", "6M", "12M"] as const;

export default function InvestimClient() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("12M");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Status Bar */}
      {/* <div className="bg-white px-4 py-2 flex justify-between items-center">
        <div className="text-sm font-medium">9:41</div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3">
            <svg viewBox="0 0 24 24" className="h-full w-full">
              <path
                fill="currentColor"
                d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21"
              />
              <path
                fill="currentColor"
                d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3"
              />
              <path
                fill="currentColor"
                d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
              />
            </svg>
          </div>
          <div className="h-3 w-4">
            <svg viewBox="0 0 24 24" className="h-full w-full">
              <path
                fill="currentColor"
                d="M2,22H4V20H22V4H4V2H2V22M6,18V6H20V18H6M8,8H18V10H8V8M8,12H18V14H8V12M8,16H13V17H8V16Z"
              />
            </svg>
          </div>
          <div className="text-sm font-bold">100%</div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/logo.svg" alt="Logo" width={64} height={64} className="h-10 w-24 sm:h-14 sm:w-36" priority />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <h1 className="text-xl font-bold">Welcome back, Alex</h1>
                <p className="text-gray-500 text-sm">Your portfolio is growing steadily</p>
              </div>
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&w=48&h=48&facepad=2" alt="User" />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
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
                  $87,429.65
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-lime-200 drop-shadow-sm" aria-hidden="true" />
                  <span className="text-sm font-medium text-lime-100" aria-label="Portfolio Growth">
                    +$1,245.23 (2.8%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Goals */}
        <div className="p-3 pt-1 mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Your Goals</h2>
            <Button variant="ghost" size="sm" className="text-emerald-600 h-8 px-2">
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <GoalManager 
            initialGoals={[
              {
                name: "Retirement Fund",
                icon: "target",
                amount: "500,000",
                targetDate: "2045",
                progressPercent: 42,
                currentAmount: "210,000"
              },
              {
                name: "Home Down Payment",
                icon: "home",
                amount: "60,000",
                targetDate: "2026",
                progressPercent: 78,
                currentAmount: "46,800"
              }
            ]}
          />
        </div>

        {/* Performance Tabs */}
        <div className="p-3 pt-1 mt-6">
          <h2 className="text-lg font-bold">Portfolio Performance</h2>
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-4 mt-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <TooltipProvider>
                <Card className="mb-2 shadow-md rounded-2xl border-none bg-white">
                  <div className="px-4 pt-4 pb-1">
                    <CardTitle className="text-base font-semibold text-gray-900">Growth Trend</CardTitle>
                  </div>
                  <CardContent className="pt-1">
                    <div className="flex justify-end gap-x-2 mt-1 mb-4">
                      <Button 
                        size="sm" 
                        className="h-7 px-2 text-xs rounded" 
                        variant={selectedPeriod === "1M" ? "default" : "outline"}
                        onClick={() => setSelectedPeriod("1M")}
                      >
                        1M
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-2 text-xs rounded" 
                        variant={selectedPeriod === "3M" ? "default" : "outline"}
                        onClick={() => setSelectedPeriod("3M")}
                      >
                        3M
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-2 text-xs rounded" 
                        variant={selectedPeriod === "6M" ? "default" : "outline"}
                        onClick={() => setSelectedPeriod("6M")}
                      >
                        6M
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-2 text-xs rounded" 
                        variant={selectedPeriod === "12M" ? "default" : "outline"}
                        onClick={() => setSelectedPeriod("12M")}
                      >
                        12M
                      </Button>
                    </div>
                    <PerformanceChart period={selectedPeriod} />
                    <div className="flex justify-evenly items-center mt-4">
                      <div className="flex flex-row items-center gap-2 w-32 justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-700" />
                        <span className="font-semibold text-black text-lg">+12.4%</span>
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
                        <span className="font-semibold text-black text-lg">Moderate</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0} aria-label="Risk Level Info">
                              <Info className="h-4 w-4 text-gray-700 cursor-pointer" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            An assessment of your portfolio's volatility and potential for loss.
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
                  <AssetAllocationChart data={allocationData} />
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
      </div>

      {/* Chatbot Overlay */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Chatbot */}
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Chatbot Button (if closed) */}
      {!chatOpen && (
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
        >
          <BotMessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Bottom Navigation */}
      <MobileNavBar />
    </div>
  )
}
