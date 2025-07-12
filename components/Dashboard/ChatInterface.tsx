"use client"

import { Suspense, lazy, useState, useEffect } from "react"
import { BotMessageSquare } from "lucide-react"

// Lazy load the Chatbot component (moved outside component to prevent re-creation)
const Chatbot = lazy(() => import("@/components/Chatbot"));

// Loading component for the Chatbot
const ChatbotLoading = () => (
  <div className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg animate-pulse">
    <BotMessageSquare className="h-6 w-6 text-white" />
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