"use client"

import { Suspense, lazy, useState, useEffect } from "react"
import { BotMessageSquare } from "lucide-react"

// Lazy load the Chatbot component (moved outside component to prevent re-creation)
const Chatbot = lazy(() => import("@/components/Chatbot"));

// Loading component for the Chatbot - subtle overlay instead of floating button
const ChatbotLoading = () => (
  <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-40">
    <div className="flex flex-col items-center space-y-3">
      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center animate-pulse">
        <BotMessageSquare className="h-4 w-4 text-white" />
      </div>
      <p className="text-sm text-gray-600 font-medium">Loading AI Chat...</p>
    </div>
  </div>
);

export interface ChatInterfaceProps {
  open: boolean;
  onClose: () => void;
}

export const ChatInterface = ({ open, onClose }: ChatInterfaceProps) => {
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    }
  }, [open]);

  // Update shouldRender when chat finishes closing
  useEffect(() => {
    if (!open && shouldRender) {
      // Wait for the closing animation to complete
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

  return (
    <>
      {/* Chatbot with Suspense for lazy loading - No overlay needed for full-screen */}
      {shouldRender && (
        <Suspense fallback={<ChatbotLoading />}>
          <Chatbot open={open} onClose={onClose} />
        </Suspense>
      )}
    </>
  )
}