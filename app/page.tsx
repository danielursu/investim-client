"use client"

import { MobileNavBar } from "@/components/ui/MobileNavBar"
import { 
  UserHeader, 
  PortfolioSummary, 
  GoalsSection, 
  PerformanceTabs, 
  ChatInterface 
} from "@/components/Dashboard"

export default function InvestimClient() {

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16">
        <UserHeader />
        <PortfolioSummary />
        <GoalsSection />
        <PerformanceTabs />
      </div>

      <ChatInterface />
      <MobileNavBar />
    </div>
  )
}
