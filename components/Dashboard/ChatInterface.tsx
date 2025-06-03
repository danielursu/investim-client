"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BotMessageSquare } from "lucide-react"
import { Chatbot } from "@/components/Chatbot"

export const ChatInterface = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
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
    </>
  )
}