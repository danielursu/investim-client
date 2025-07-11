"use client"

import { useState, Suspense, lazy, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { BotMessageSquare } from "lucide-react"

// Lazy load the Chatbot component (moved outside component to prevent re-creation)
const Chatbot = lazy(() => import("@/components/Chatbot"));

// Loading component for the Chatbot
const ChatbotLoading = () => (
  <div className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg animate-pulse">
    <BotMessageSquare className="h-6 w-6 text-white" />
  </div>
);

export const ChatInterface = () => {
  const [chatOpen, setChatOpen] = useState(false);
  
  // Memoize the onClose callback to prevent re-renders
  const handleChatClose = useCallback(() => {
    setChatOpen(false);
  }, []);

  return (
    <>
      {/* Chatbot Overlay */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Chatbot with Suspense for lazy loading */}
      {chatOpen && (
        <Suspense fallback={<ChatbotLoading />}>
          <Chatbot open={chatOpen} onClose={handleChatClose} />
        </Suspense>
      )}

      {/* Chatbot Button (if closed) */}
      {!chatOpen && (
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <BotMessageSquare className="h-6 w-6" />
        </Button>
      )}
    </>
  )
}