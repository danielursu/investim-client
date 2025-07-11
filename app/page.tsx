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
  <div className="px-4 py-6">
    <div className={`${height} rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse shadow-md`}>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded-lg w-1/4 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded-lg w-1/2 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function InvestimClient() {

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16">
        <UserHeader />
        
        {/* Mobile-Only Single Column Layout */}
        <div className="max-w-md mx-auto px-4">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <PortfolioSummary />
              </div>
              
              <Suspense fallback={<SectionLoading height="h-40" />}>
                <GoalsSection />
              </Suspense>
            </div>
            
            <div>
              <Suspense fallback={<SectionLoading height="h-96" />}>
                <PerformanceTabs />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <ChatInterface />
      <MobileNavBar />
    </div>
  )
}
