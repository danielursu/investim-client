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

const AssetAllocationChart = () => {
  const allocations = [
    { name: "Stocks", percentage: 45, color: "#10b981" },
    { name: "Bonds", percentage: 30, color: "#3b82f6" },
    { name: "Real Estate", percentage: 15, color: "#f59e0b" },
    { name: "Alternatives", percentage: 10, color: "#8b5cf6" },
  ]

  const [selectedCategory, setSelectedCategory] = useState("Stocks")

  const instruments = {
    Stocks: [
      { name: "iShares Core S&P 500 ETF", ticker: "IVV", allocation: "20%" },
      { name: "iShares Core MSCI International Developed Markets ETF", ticker: "IDEV", allocation: "10%" },
      { name: "iShares Core MSCI Emerging Markets ETF", ticker: "IEMG", allocation: "7%" },
      { name: "Vanguard Small-Cap ETF", ticker: "VB", allocation: "5%" },
      { name: "Vanguard FTSE All-World ex-US Small-Cap ETF", ticker: "VSS", allocation: "3%" },
    ],
    Bonds: [
      { name: "iShares iBoxx $ Investment Grade Corporate Bond ETF", ticker: "LQD", allocation: "12%" },
      { name: "iShares 1-3 Year Treasury Bond ETF", ticker: "SHY", allocation: "10%" },
      { name: "iShares J.P. Morgan USD Emerging Markets Bond ETF", ticker: "EMB", allocation: "5%" },
      { name: "iShares Floating Rate Bond ETF", ticker: "FLOT", allocation: "3%" },
    ],
    "Real Estate": [
      { name: "Vanguard Real Estate ETF", ticker: "VNQ", allocation: "10%" },
      { name: "iShares International Developed Real Estate ETF", ticker: "IFGL", allocation: "5%" },
    ],
    Alternatives: [
      { name: "iShares Gold Trust", ticker: "IAU", allocation: "4%" },
      { name: "iShares GSCI Commodity Dynamic Roll Strategy ETF", ticker: "COMT", allocation: "3%" },
      { name: "KFA Mount Lucas Managed Futures Index Strategy ETF", ticker: "KMLM", allocation: "3%" },
    ],
  }

  // Use useEffect to render the chart when the component mounts
  useEffect(() => {
    renderPieChart()

    // Re-render on window resize
    window.addEventListener("resize", renderPieChart)
    return () => window.removeEventListener("resize", renderPieChart)
  }, [])

  const renderPieChart = () => {
    const canvas = document.getElementById("allocation-chart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear previous chart
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const centerX = canvas.width / 4
    const centerY = canvas.height / 4
    const radius = Math.min(centerX, centerY) * 0.8

    let startAngle = -0.5 * Math.PI // Start from top

    // Draw pie slices
    allocations.forEach((item) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      // Add a subtle white border
      ctx.strokeStyle = "white"
      ctx.lineWidth = 1
      ctx.stroke()

      startAngle += sliceAngle
    })
  }

  return (
    <div>
      <div className="relative h-64 w-full mb-6">
        <canvas id="allocation-chart" className="w-full h-full"></canvas>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allocations.map((item) => (
          <button
            key={item.name}
            className={`flex items-center text-xs px-3 py-1.5 rounded-full ${
              selectedCategory === item.name ? "bg-gray-200 font-medium" : "bg-gray-100"
            }`}
            onClick={() => setSelectedCategory(item.name)}
          >
            <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></div>
            <span>
              {item.name} ({item.percentage}%)
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium mb-2">{selectedCategory} Holdings</div>
        <div className="space-y-3">
          {instruments[selectedCategory].map((instrument) => (
            <div key={instrument.ticker} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{instrument.ticker}</div>
                <div className="text-xs text-gray-500">{instrument.name}</div>
              </div>
              <div className="font-medium">{instrument.allocation}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function InvestimClient() {
  const [chatOpen, setChatOpen] = useState(false)

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
              <Image src="/logo.svg" alt="Logo" width={64} height={64} className="h-10 w-24 sm:h-14 sm:w-36" />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <h1 className="text-xl font-bold">Welcome back, Alex</h1>
                <p className="text-gray-500 text-sm">Your portfolio is growing steadily</p>
              </div>
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=48&h=48&facepad=2" alt="User" />
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
        <div className="p-3 pt-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Your Goals</h2>
            <Button variant="ghost" size="sm" className="text-emerald-600 h-8 px-2">
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <GoalCard
            title="Retirement Fund"
            icon={<Target className="h-5 w-5 text-emerald-500" />}
            targetDescription="Target: $500,000 by 2045"
            progressPercent={42}
            currentAmount="$210,000"
            targetAmount="$500,000"
          />
          <GoalCard
            title="Home Down Payment"
            icon={<Home className="h-5 w-5 text-emerald-500" />}
            targetDescription="Target: $60,000 by 2026"
            progressPercent={78}
            currentAmount="$46,800"
            targetAmount="$60,000"
          />

          <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-500">
            <Plus className="h-4 w-4 mr-2" /> Add New Goal
          </Button>
        </div>

        {/* Performance Tabs */}
        <div className="p-3 pt-1">
          <h2 className="text-lg font-bold mb-2">Portfolio Performance</h2>
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-4">
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
                      <Button size="sm" className="h-7 px-2 text-xs rounded" variant="outline">1M</Button>
                      <Button size="sm" className="h-7 px-2 text-xs rounded" variant="outline">3M</Button>
                      <Button size="sm" className="h-7 px-2 text-xs rounded" variant="outline">6M</Button>
                      <Button size="sm" className="h-7 px-2 text-xs rounded" variant="default">12M</Button>
                    </div>
                    <PerformanceChart />
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
              <Card>
                <CardHeader className="pb-1 pt-3">
                  <CardTitle className="text-lg">Asset Allocation</CardTitle>
                  <CardDescription>Current distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssetAllocationChart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader className="pb-1 pt-2">
                  <CardTitle className="text-base">Transaction History</CardTitle>
                  <CardDescription>Recent activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Auto-Investment</p>
                        <p className="text-sm text-gray-500">Apr 10, 2023</p>
                      </div>
                      <p className="font-medium text-emerald-600">+$500.00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Dividend Payment</p>
                        <p className="text-sm text-gray-500">Apr 5, 2023</p>
                      </div>
                      <p className="font-medium text-emerald-600">+$78.32</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Auto-Investment</p>
                        <p className="text-sm text-gray-500">Mar 25, 2023</p>
                      </div>
                      <p className="font-medium text-emerald-600">+$500.00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Portfolio Rebalance</p>
                        <p className="text-sm text-gray-500">Mar 15, 2023</p>
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

      {/* Chatbot */}
      {chatOpen ? (
        <div className="fixed bottom-16 right-4 w-[calc(100%-2rem)] max-w-md bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] flex flex-col">
          <div className="p-3 border-b flex justify-between items-center bg-emerald-600 text-white rounded-t-lg">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-white/20">
                <AvatarFallback>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600">
                    <path d="M12 6V2H8"></path>
                    <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"></path>
                    <path d="M2 12h2"></path>
                    <path d="M9 11v2"></path>
                    <path d="M15 11v2"></path>
                    <path d="M20 12h2"></path>
                  </svg>
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Financial Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 min-h-[200px]">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Hello Alex! How can I help with your investments today?</p>
            </div>
            <div className="bg-emerald-100 rounded-lg p-3 ml-auto max-w-[80%]">
              <p className="text-sm">What's my current retirement goal progress?</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">
                Your retirement fund is currently at $210,000, which is 42% of your $500,000 goal. You're on track to
                reach your target by 2045. Would you like to explore options to accelerate your progress?
              </p>
            </div>
          </div>
          <div className="p-3 border-t">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <Button size="icon" className="h-7 w-7 rounded-full bg-emerald-600 hover:bg-emerald-700 ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      ) : (
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
