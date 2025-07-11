// Shared type definitions for the application

// Quiz and Risk Assessment Types
export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestionData {
  id: number;
  text: string;
  options: QuizOption[];
}

// Asset Allocation Types
export interface AllocationItem {
  name: string; 
  percentage: number;
  color?: string; 
}

export interface AssetAllocationData {
  level: 'Moderate' | 'Conservative' | 'Aggressive';
  etfs: AllocationItem[];
}

// RAG API Types
export interface RagSource {
  id?: string | number;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface RagResponse {
  answer: string;
  sources: RagSource[];
  [key: string]: unknown;
}

// Chat Types
export interface ChatMessage {
  id: string;
  type: 'text' | 'quiz';
  role: "user" | "bot";
  content: string;
  questionData?: QuizQuestionData;
  allocationData?: AssetAllocationData;
  sources?: RagSource[];
  timestamp: Date;
}

// Period Types for Charts
export type Period = "1M" | "3M" | "6M" | "12M";

// Component Props Types
export interface ChatbotProps {
  open: boolean;
  onClose: () => void;
  userAvatarUrl?: string;
}

// Refactored Chatbot Component Props
export interface ChatbotContainerProps {
  open: boolean;
  onClose: () => void;
  userAvatarUrl?: string;
}

export interface ChatHeaderProps {
  onClose: () => void;
}

export interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  error: string;
  userAvatarUrl?: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onAnswerSelect: (questionId: number, answerValue: string) => void;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  loading: boolean;
  placeholder?: string;
}

export interface AssetAllocationChartProps {
  data: AllocationItem[];
}

export interface PerformanceChartProps {
  period: Period;
}

// Error Types
export interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

export class ChatbotApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ChatbotApiError';
  }
}