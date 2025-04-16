import { FC } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, BotMessageSquare } from "lucide-react"

interface ChatbotProps {
  open: boolean
  onClose: () => void
}

export const Chatbot: FC<ChatbotProps> = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className="fixed bottom-16 right-4 w-[calc(100%-2rem)] max-w-md bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] flex flex-col z-50">
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
          onClick={onClose}
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
  )
}
