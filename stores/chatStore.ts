import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChatMessage } from '@/types';

interface ChatPreferences {
  autoScroll: boolean;
  persistHistory: boolean;
  maxHistorySize: number;
  soundEnabled: boolean;
  showTimestamps: boolean;
}

interface ChatState {
  // Messages
  messages: ChatMessage[];
  
  // UI states
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Quiz states
  isQuizActive: boolean;
  currentQuizQuestionIndex: number | null;
  quizAnswers: Record<number, string>;
  quizCompleted: boolean;
  riskProfile: string | null;
  
  // Preferences
  preferences: ChatPreferences;
  
  // Meta
  lastUpdated: Date | null;
  sessionId: string;
}

interface ChatActions {
  // Message management
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  
  // UI actions
  setIsOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Quiz management
  setQuizActive: (active: boolean) => void;
  setCurrentQuizQuestion: (index: number | null) => void;
  addQuizAnswer: (questionId: number, answer: string) => void;
  setQuizCompleted: (completed: boolean) => void;
  setRiskProfile: (profile: string) => void;
  resetQuiz: () => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<ChatPreferences>) => void;
  resetPreferences: () => void;
  
  // Session management
  startNewSession: () => void;
  resetChat: () => void;
}

type ChatStore = ChatState & ChatActions;

// Default preferences
const defaultPreferences: ChatPreferences = {
  autoScroll: true,
  persistHistory: false, // Default to false for privacy
  maxHistorySize: 100,
  soundEnabled: false,
  showTimestamps: true,
};

// Generate session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Initial state
const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,
  isQuizActive: false,
  currentQuizQuestionIndex: null,
  quizAnswers: {},
  quizCompleted: false,
  riskProfile: null,
  preferences: defaultPreferences,
  lastUpdated: null,
  sessionId: generateSessionId(),
};

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Message management
        addMessage: (message) =>
          set(
            (state) => {
              const newMessages = [...state.messages, message];
              const { maxHistorySize } = state.preferences;
              
              // Trim messages if they exceed max history size
              const trimmedMessages = newMessages.length > maxHistorySize
                ? newMessages.slice(-maxHistorySize)
                : newMessages;
              
              return {
                ...state,
                messages: trimmedMessages,
                lastUpdated: new Date(),
              };
            },
            false,
            'addMessage'
          ),

        addMessages: (messages) =>
          set(
            (state) => {
              const newMessages = [...state.messages, ...messages];
              const { maxHistorySize } = state.preferences;
              
              // Trim messages if they exceed max history size
              const trimmedMessages = newMessages.length > maxHistorySize
                ? newMessages.slice(-maxHistorySize)
                : newMessages;
              
              return {
                ...state,
                messages: trimmedMessages,
                lastUpdated: new Date(),
              };
            },
            false,
            'addMessages'
          ),

        updateMessage: (messageId, updates) =>
          set(
            (state) => ({
              ...state,
              messages: state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
              lastUpdated: new Date(),
            }),
            false,
            'updateMessage'
          ),

        clearMessages: () =>
          set(
            (state) => ({
              ...state,
              messages: [],
              lastUpdated: new Date(),
            }),
            false,
            'clearMessages'
          ),

        // UI actions
        setIsOpen: (isOpen) =>
          set(
            (state) => {
              // Avoid unnecessary state updates to prevent render loops
              if (state.isOpen === isOpen) return state;
              return {
                ...state,
                isOpen,
                // Clear error when closing
                error: isOpen ? state.error : null,
              };
            },
            false,
            'setIsOpen'
          ),

        setLoading: (loading) =>
          set(
            (state) => ({
              ...state,
              isLoading: loading,
            }),
            false,
            'setLoading'
          ),

        setError: (error) =>
          set(
            (state) => ({
              ...state,
              error,
            }),
            false,
            'setError'
          ),

        clearError: () =>
          set(
            (state) => ({
              ...state,
              error: null,
            }),
            false,
            'clearError'
          ),

        // Quiz management
        setQuizActive: (active) =>
          set(
            (state) => ({
              ...state,
              isQuizActive: active,
            }),
            false,
            'setQuizActive'
          ),

        setCurrentQuizQuestion: (index) =>
          set(
            (state) => ({
              ...state,
              currentQuizQuestionIndex: index,
            }),
            false,
            'setCurrentQuizQuestion'
          ),

        addQuizAnswer: (questionId, answer) =>
          set(
            (state) => ({
              ...state,
              quizAnswers: {
                ...state.quizAnswers,
                [questionId]: answer,
              },
            }),
            false,
            'addQuizAnswer'
          ),

        setQuizCompleted: (completed) =>
          set(
            (state) => ({
              ...state,
              quizCompleted: completed,
              isQuizActive: !completed,
            }),
            false,
            'setQuizCompleted'
          ),

        setRiskProfile: (profile) =>
          set(
            (state) => ({
              ...state,
              riskProfile: profile,
            }),
            false,
            'setRiskProfile'
          ),

        resetQuiz: () =>
          set(
            (state) => ({
              ...state,
              isQuizActive: false,
              currentQuizQuestionIndex: null,
              quizAnswers: {},
              quizCompleted: false,
              riskProfile: null,
            }),
            false,
            'resetQuiz'
          ),

        // Preferences
        updatePreferences: (preferences) =>
          set(
            (state) => ({
              ...state,
              preferences: {
                ...state.preferences,
                ...preferences,
              },
            }),
            false,
            'updatePreferences'
          ),

        resetPreferences: () =>
          set(
            (state) => ({
              ...state,
              preferences: defaultPreferences,
            }),
            false,
            'resetPreferences'
          ),

        // Session management
        startNewSession: () =>
          set(
            (state) => ({
              ...state,
              sessionId: generateSessionId(),
              messages: [],
              error: null,
              isLoading: false,
              lastUpdated: new Date(),
            }),
            false,
            'startNewSession'
          ),

        resetChat: () =>
          set(
            () => ({
              ...initialState,
              sessionId: generateSessionId(),
              preferences: get().preferences, // Keep preferences
            }),
            false,
            'resetChat'
          ),
      }),
      {
        name: 'chat-storage',
        // Simple persistence - just persist the essential state
        partialize: (state) => ({
          preferences: state.preferences,
          quizAnswers: state.quizAnswers,
          quizCompleted: state.quizCompleted,
          riskProfile: state.riskProfile,
        }),
      }
    ),
    {
      name: 'chat-store',
    }
  )
);

// Selector hooks for better performance
export const useChatMessages = () =>
  useChatStore((state) => state.messages);

// Individual selectors for better performance (prevents re-renders)
export const useChatIsOpen = () => useChatStore((state) => state.isOpen);
export const useChatIsLoading = () => useChatStore((state) => state.isLoading);
export const useChatError = () => useChatStore((state) => state.error);

// Individual quiz selectors for better performance
export const useChatIsQuizActive = () => useChatStore((state) => state.isQuizActive);
export const useChatCurrentQuizQuestionIndex = () => useChatStore((state) => state.currentQuizQuestionIndex);
export const useChatQuizAnswers = () => useChatStore((state) => state.quizAnswers);
export const useChatQuizCompleted = () => useChatStore((state) => state.quizCompleted);
export const useChatRiskProfile = () => useChatStore((state) => state.riskProfile);

export const useChatPreferences = () =>
  useChatStore((state) => state.preferences);

// Individual action selectors for better performance
export const useChatAddMessage = () => useChatStore((state) => state.addMessage);
export const useChatAddMessages = () => useChatStore((state) => state.addMessages);
export const useChatUpdateMessage = () => useChatStore((state) => state.updateMessage);
export const useChatClearMessages = () => useChatStore((state) => state.clearMessages);
export const useChatSetIsOpen = () => useChatStore((state) => state.setIsOpen);
export const useChatSetLoading = () => useChatStore((state) => state.setLoading);
export const useChatSetError = () => useChatStore((state) => state.setError);
export const useChatClearError = () => useChatStore((state) => state.clearError);
export const useChatSetQuizActive = () => useChatStore((state) => state.setQuizActive);
export const useChatSetCurrentQuizQuestion = () => useChatStore((state) => state.setCurrentQuizQuestion);
export const useChatAddQuizAnswer = () => useChatStore((state) => state.addQuizAnswer);
export const useChatSetQuizCompleted = () => useChatStore((state) => state.setQuizCompleted);
export const useChatSetRiskProfile = () => useChatStore((state) => state.setRiskProfile);
export const useChatResetQuiz = () => useChatStore((state) => state.resetQuiz);
export const useChatUpdatePreferences = () => useChatStore((state) => state.updatePreferences);
export const useChatResetPreferences = () => useChatStore((state) => state.resetPreferences);
export const useChatStartNewSession = () => useChatStore((state) => state.startNewSession);
export const useChatResetChat = () => useChatStore((state) => state.resetChat);

export const useChatSessionId = () => useChatStore((state) => state.sessionId);
export const useChatLastUpdated = () => useChatStore((state) => state.lastUpdated);