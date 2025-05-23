import React, { FC, useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, BotMessageSquare, User } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { RiskQuizQuestion } from './RiskQuizQuestion';
import { AssetAllocationChart } from "@/components/ui/AssetAllocationChart";

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

interface QuizOption {
  value: string;
  label: string;
}

interface QuizQuestionData {
  id: number;
  text: string;
  options: QuizOption[];
}

interface AllocationItem {
  name: string; 
  percentage: number;
  color?: string; 
}

interface AssetAllocationData {
  level: 'Moderate' | 'Conservative' | 'Aggressive';
  etfs: AllocationItem[];
}

interface ChatMessage {
  id: string;
  type: 'text' | 'quiz';
  role: "user" | "bot";
  content: string;
  questionData?: QuizQuestionData;
  allocationData?: AssetAllocationData;
  sources?: RagSource[];
  timestamp: Date;
}

const riskQuizQuestions: QuizQuestionData[] = [
  {
    id: 1,
    text: "When investing, how comfortable are you with potential losses in exchange for potentially higher returns?",
    options: [
      { value: 'a', label: "Very uncomfortable (Prioritize safety)" },
      { value: 'b', label: "Somewhat uncomfortable (Balanced approach)" },
      { value: 'c', label: "Comfortable (Focus on growth)" },
    ],
  },
  {
    id: 2,
    text: "What is your investment time horizon (how long until you need the money)?",
    options: [
      { value: 'a', label: "Short-term (Less than 3 years)" },
      { value: 'b', label: "Medium-term (3-10 years)" },
      { value: 'c', label: "Long-term (More than 10 years)" },
    ],
  },
  {
    id: 3,
    text: "Imagine your investment portfolio drops 20% in a month. How would you react?",
    options: [
      { value: 'a', label: "Sell some investments to cut losses" },
      { value: 'b', label: "Do nothing, wait for recovery" },
      { value: 'c', label: "Consider investing more at lower prices" },
    ],
  },
];

const moderateAllocation: AssetAllocationData = {
  level: 'Moderate',
  etfs: [
    { name: 'US Total Stock Market (VTI)', percentage: 40, color: '#34D399' }, // Green
    { name: 'Intl Developed Stocks (VEA)', percentage: 20, color: '#60A5FA' }, // Blue
    { name: 'US Total Bond Market (BND)', percentage: 30, color: '#FBBF24' }, // Amber
    { name: 'Real Estate (VNQ)', percentage: 10, color: '#F87171' }, // Red
  ],
};

export const Chatbot: FC<ChatbotProps> = ({ open, onClose, userAvatarUrl }) => {
  const [question, setQuestion] = useState<string>("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      const initialMessage: ChatMessage = {
        id: `bot-init-${Date.now()}`,
        type: 'text',
        role: "bot",
        content: "Hello! To start, let's quickly assess your risk tolerance.",
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      startQuiz();
    } else {
      setMessages([]);
      setQuestion("");
      setLoading(false);
      setError("");
      setCurrentQuizQuestionIndex(null);
      setQuizAnswers({});
    }
  }, [open]);

  if (!open) return null;

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
    if (!question.trim() || loading || currentQuizQuestionIndex !== null) return;

    setLoading(true);
    setError("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'text',
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    const currentQuestion = question; 
    setQuestion("");

    try {
      const data = await askRag(currentQuestion);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'text',
        role: "bot",
        content: data.answer,
        sources: Array.isArray(data.sources) ? data.sources : [],
        timestamp: new Date(),
      };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (err) {
      setError((err as Error).message);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'text',
        role: "bot", 
        content: `Sorry, an error occurred: ${(err as Error).message}`,
        timestamp: new Date(),
      };
      setMessages((msgs) => [...msgs, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk(e as any); 
    }
  }

  const startQuiz = () => {
    if (riskQuizQuestions.length > 0 && currentQuizQuestionIndex === null) {
      setCurrentQuizQuestionIndex(0);
      const firstQuestion = riskQuizQuestions[0];
      const quizMessage: ChatMessage = {
        id: `quiz-${firstQuestion.id}-${Date.now()}`,
        type: 'quiz',
        content: '', 
        role: 'bot',
        questionData: firstQuestion,
        timestamp: new Date(),
      };
      setTimeout(() => {
         setMessages((prev) => [...prev, quizMessage]);
      }, 500); 
    }
  };

  const handleAnswerSelect = (questionId: number, answerValue: string) => {
    if (loading || quizAnswers[questionId]) return;

    setQuizAnswers((prev) => ({ ...prev, [questionId]: answerValue }));
    setLoading(true); 

    const nextIndex = (currentQuizQuestionIndex ?? -1) + 1;

    setTimeout(() => {
      if (nextIndex < riskQuizQuestions.length) {
        setCurrentQuizQuestionIndex(nextIndex);
        const nextQuestion = riskQuizQuestions[nextIndex];
        const quizMessage: ChatMessage = {
          id: `quiz-${nextQuestion.id}-${Date.now()}`,
          type: 'quiz',
          content: '',
          role: 'bot',
          questionData: nextQuestion,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, quizMessage]);
      } else {
        setCurrentQuizQuestionIndex(null); // Re-enable text input

        // Combine risk level text and allocation data into one message
        const combinedMessage: ChatMessage = {
          id: `quiz-complete-${Date.now()}`,
          type: 'text', // Still 'text' type
          role: 'bot',
          content: "Your risk level is Moderate. Here is a suggested ETF allocation:", // Combined text
          allocationData: moderateAllocation, // Attach the chart data
          timestamp: new Date(),
        };

        // Add the single combined message to state
        setMessages((prev) => [...prev, combinedMessage]);
      }
      setLoading(false);
    }, 500); // Simulate processing time
  };

  return (
    <div className="fixed bottom-16 right-4 w-[calc(100%-2rem)] max-w-md bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] flex flex-col z-50 font-inter">
      <div className="p-3 border-b flex justify-between items-center bg-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <BotMessageSquare className="h-6 w-6 mr-2" />
          <h3 className="text-base font-semibold">Investment Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-emerald-700 h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <Avatar className="h-6 w-6 mr-2 bg-white/50 mt-auto">
                <AvatarFallback>
                  <BotMessageSquare className="h-4 w-4 text-emerald-600" />
                </AvatarFallback>
              </Avatar>
            )}
            
            {msg.type === 'quiz' && msg.questionData ? (
              <RiskQuizQuestion 
                question={msg.questionData} 
                onAnswerSelect={handleAnswerSelect} 
              />
            ) : (
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm text-sm whitespace-pre-line relative ${msg.role === "user"
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
                {msg.allocationData && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <AssetAllocationChart data={msg.allocationData.etfs} /> 
                  </div>
                )}
                <div className={`text-[10px] mt-1 text-right ${msg.role === "user" ? "text-gray-300" : "text-gray-400"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
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
            placeholder={currentQuizQuestionIndex !== null ? "Please select an answer above" : "Type your message..."} 
            className="flex-1 bg-transparent outline-none text-sm"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading || currentQuizQuestionIndex !== null} 
            autoFocus
          />
          <Button
            size="icon"
            className="h-7 w-7 rounded-full bg-emerald-600 hover:bg-emerald-700 ml-2"
            type="submit"
            disabled={loading || !question.trim() || currentQuizQuestionIndex !== null} 
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
