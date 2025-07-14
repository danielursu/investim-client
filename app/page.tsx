"use client"

import { Suspense, lazy, useState, useCallback } from "react"
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
  const [activeTab, setActiveTab] = useState<"home" | "invest" | "chat" | "goals" | "settings">("home");
  const [previousTab, setPreviousTab] = useState<"home" | "invest" | "goals" | "settings">("home");
  
  const handleTabChange = useCallback((tab: "home" | "invest" | "chat" | "goals" | "settings") => {
    if (tab === "chat") {
      if (activeTab === "chat") {
        // Already in chat - toggle off to previous tab
        setActiveTab(previousTab);
      } else {
        // Opening chat - save current tab as previous
        setPreviousTab(activeTab as "home" | "invest" | "goals" | "settings");
        setActiveTab("chat");
      }
    } else {
      // Normal navigation to non-chat tab
      if (activeTab === "chat") {
        // Coming from chat - don't update previousTab
        setPreviousTab(previousTab);
      } else {
        // Normal tab switching - update previousTab only if not coming from chat
        setPreviousTab(activeTab as "home" | "invest" | "goals" | "settings");
      }
      setActiveTab(tab);
    }
  }, [activeTab, previousTab]);
  
  const handleChatClose = useCallback(() => {
    setActiveTab(previousTab);
  }, [previousTab]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-x-hidden">
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden pb-16 ${activeTab === "chat" ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
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

      <ChatInterface open={activeTab === "chat"} onClose={handleChatClose} />
      <MobileNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
