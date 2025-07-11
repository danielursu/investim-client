"use client"

import { Suspense, lazy } from "react"
import { MobileNavBar } from "@/components/ui/MobileNavBar"
import { 
  UserHeader, 
  PortfolioSummary, 
  ChatInterface 
} from "@/components/Dashboard"

// Lazy load heavy components
const GoalsSection = lazy(() => import("@/components/Dashboard").then(module => ({ default: module.GoalsSection })));
const PerformanceTabs = lazy(() => import("@/components/Dashboard").then(module => ({ default: module.PerformanceTabs })));

// Loading components
const SectionLoading = ({ height = "h-32" }: { height?: string }) => (
  <div className={`${height} rounded-lg bg-gray-100 animate-pulse mx-3 my-4 flex items-center justify-center`}>
    <div className="text-sm text-gray-500">Loading...</div>
  </div>
);

export default function InvestimClient() {

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16">
        <UserHeader />
        <PortfolioSummary />
        
        <Suspense fallback={<SectionLoading height="h-40" />}>
          <GoalsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading height="h-96" />}>
          <PerformanceTabs />
        </Suspense>
      </div>

      <ChatInterface />
      <MobileNavBar />
    </div>
  )
}
