/**
 * MobileNavBar - Glassmorphic bottom navigation bar for mobile UX
 * Uses shadcn/ui Button and Lucide icons. Glassmorphic, accessible, Inter font.
 */
import { Home, BarChart3, Target, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

export interface MobileNavBarProps {
  /**
   * The current active tab (e.g. "home", "invest", "goals", "settings")
   */
  activeTab?: "home" | "invest" | "goals" | "settings"
  /**
   * Callback when a nav button is pressed
   */
  onTabChange?: (tab: "home" | "invest" | "goals" | "settings") => void
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab = "home",
  onTabChange,
}) => {
  const navItems = [
    { key: "home", label: "Home", icon: Home },
    { key: "invest", label: "Invest", icon: BarChart3 },
    { key: "goals", label: "Goals", icon: Target },
    { key: "settings", label: "Settings", icon: Settings },
  ] as const

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200/60 shadow-[0_-4px_20px_0_rgba(0,0,0,0.1)] flex justify-around py-2 font-inter"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant="ghost"
          className="flex flex-col items-center h-auto py-2 px-4 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary data-[active=true]:text-primary data-[active=true]:bg-primary/10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 min-h-[56px]"
          aria-current={activeTab === key ? "page" : undefined}
          data-active={activeTab === key}
          tabIndex={0}
          onClick={() => onTabChange?.(key)}
        >
          <Icon className="h-6 w-6 mb-1.5" />
          <span className="text-xs font-medium tracking-wide">{label}</span>
        </Button>
      ))}
    </nav>
  )
}
