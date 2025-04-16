import React, { FC, useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, BotMessageSquare, User } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ChatbotProps {
  open: boolean
  onClose: () => void
  userAvatarUrl?: string // optional user profile pic
}

interface RagSource {
  id?: string | number
  content: string
  metadata?: Record<string, unknown>
}

interface RagResponse {
  answer: string
  sources: RagSource[]
  [key: string]: unknown
}

interface ChatMessage {
  role: "user" | "bot"
  content: string
  sources?: RagSource[]
  timestamp: Date
}

export const Chatbot: FC<ChatbotProps> = ({ open, onClose, userAvatarUrl }) => {
  const [question, setQuestion] = useState<string>("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Hello Alex! How can I help with your investments today?",
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  if (!open) return null

  const askRag = async (query: string): Promise<RagResponse> => {
    const res = await fetch("/api/rag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setError("")
    const userMsg: ChatMessage = {
      role: "user",
      content: question,
      timestamp: new Date(),
    }
    setMessages((msgs) => [...msgs, userMsg])
    setQuestion("")
    try {
      const data = await askRag(question)
      const botMsg: ChatMessage = {
        role: "bot",
        content: data.answer,
        sources: Array.isArray(data.sources) ? data.sources : [],
        timestamp: new Date(),
      }
      setMessages((msgs) => [...msgs, botMsg])
    } catch (err) {
      setError((err as Error).message)
    }
    setLoading(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!loading && question.trim()) {
        handleAsk(e as any)
      }
    }
  }

  return (
    <div className="fixed bottom-16 right-4 w-[calc(100%-2rem)] max-w-md bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] flex flex-col z-50 font-inter">
      <div className="p-3 border-b flex justify-between items-center bg-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 bg-white/20">
            <AvatarFallback>
              <BotMessageSquare className="h-5 w-5 text-emerald-600" />
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
      <div className="flex-1 overflow-auto p-4 space-y-2 min-h-[200px] bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <Avatar className="h-6 w-6 mr-2 bg-white/50 mt-auto">
                <AvatarFallback>
                  <BotMessageSquare className="h-4 w-4 text-emerald-600" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm text-sm whitespace-pre-line relative ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white ml-auto"
                  : "bg-white text-gray-900"
              } animate-fadeIn`}
            >
              {msg.content}
              {msg.role === "bot" && msg.sources && msg.sources.length > 0 && (
                <Collapsible className="mt-2">
                  <CollapsibleTrigger className="text-xs text-emerald-700 underline cursor-pointer">Sources</CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <ul className="text-xs space-y-1">
                      {msg.sources.map((src, i) => (
                        <li key={src.id || i} className="border-b border-emerald-100 pb-1 last:border-b-0">
                          <pre className="whitespace-pre-wrap break-words font-mono bg-gray-50 p-1 rounded text-xs mb-1">{src.content}</pre>
                          {src.metadata && (
                            <small className="block text-gray-500">{JSON.stringify(src.metadata)}</small>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}
              <div className={`text-[10px] mt-1 text-right ${msg.role === "user" ? "text-gray-300" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === "user" && (
              <Avatar className="h-6 w-6 ml-2 bg-white/50 mt-auto">
                {userAvatarUrl ? (
                  <AvatarImage src={userAvatarUrl} alt="User avatar" />
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4 text-emerald-600" />
                  </AvatarFallback>
                )}
              </Avatar>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start">
            <Avatar className="h-6 w-6 mr-2 bg-white/50 mt-auto">
              <AvatarFallback>
                <BotMessageSquare className="h-4 w-4 text-emerald-600" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg px-3 py-2 max-w-[80%] shadow-sm text-sm bg-white text-gray-900 animate-pulse">Thinking...</div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg p-3 mt-2">Error: {error}</div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="p-3 border-t bg-white" onSubmit={handleAsk}>
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
            autoFocus
          />
          <Button
            size="icon"
            className="h-7 w-7 rounded-full bg-emerald-600 hover:bg-emerald-700 ml-2"
            type="submit"
            disabled={loading || !question.trim()}
            aria-label="Send"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            ) : (
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
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
