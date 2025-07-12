import { useCallback } from 'react';
import { ChatMessage, AssetAllocationData } from '@/types';
import { riskQuizQuestions } from '@/data/risk-quiz-questions';
import { moderateAllocation } from '@/data/portfolio-allocations';
import { useChatStore } from '@/stores/chatStore';

/**
 * Calculate risk score based on quiz answers
 * @param answers - Record of question IDs to answer values
 * @returns Object with numerical score and risk level
 */
const calculateRiskProfile = (answers: Record<number, string>) => {
  let totalScore = 0;
  
  // Calculate score based on answer values (a=1, b=2, c=3)
  Object.values(answers).forEach(answer => {
    switch (answer) {
      case 'a': totalScore += 1; break;
      case 'b': totalScore += 2; break;
      case 'c': totalScore += 3; break;
    }
  });
  
  // Determine risk level based on total score (3-9 range)
  let riskLevel: string;
  if (totalScore <= 4) {
    riskLevel = 'Conservative';
  } else if (totalScore <= 6) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'Aggressive';
  }
  
  return {
    score: totalScore,
    level: riskLevel
  };
};

const moderateAllocationData: AssetAllocationData = {
  level: 'Moderate',
  etfs: moderateAllocation,
};

/**
 * Hook for managing risk quiz logic and state
 * Handles quiz progression, answer collection, and completion
 */
export interface UseRiskQuizState {
  currentQuizQuestionIndex: number | null;
  quizAnswers: Record<number, string>;
  isQuizActive: boolean;
}

export interface UseRiskQuizActions {
  startQuiz: () => ChatMessage[];
  handleAnswerSelect: (questionId: number, answerValue: string) => {
    nextMessage?: ChatMessage;
    isComplete: boolean;
    completionMessage?: ChatMessage;
  };
  resetQuiz: () => void;
}

export interface UseRiskQuizReturn extends UseRiskQuizState, UseRiskQuizActions {}

export const useRiskQuiz = (): UseRiskQuizReturn => {
  // Get state and actions from the chat store using individual selectors to avoid re-render loops
  const currentQuizQuestionIndex = useChatStore((state) => state.currentQuizQuestionIndex);
  const quizAnswers = useChatStore((state) => state.quizAnswers);
  const isQuizActive = useChatStore((state) => state.isQuizActive);
  
  const setCurrentQuizQuestion = useChatStore((state) => state.setCurrentQuizQuestion);
  const addQuizAnswer = useChatStore((state) => state.addQuizAnswer);
  const setQuizActive = useChatStore((state) => state.setQuizActive);
  const setQuizCompleted = useChatStore((state) => state.setQuizCompleted);
  const setRiskProfile = useChatStore((state) => state.setRiskProfile);
  const setRiskScore = useChatStore((state) => state.setRiskScore);
  const resetQuizStore = useChatStore((state) => state.resetQuiz);

  const startQuiz = useCallback((): ChatMessage[] => {
    if (riskQuizQuestions.length > 0 && !isQuizActive) {
      // Only reset quiz data if it's not already completed
      // This preserves completed quiz data in localStorage
      if (!useChatStore.getState().quizCompleted) {
        resetQuizStore();
      }
      setQuizActive(true);
      setCurrentQuizQuestion(0);
      const firstQuestion = riskQuizQuestions[0];
      
      const quizMessage: ChatMessage = {
        id: `quiz-${firstQuestion.id}-${Date.now()}`,
        type: 'quiz',
        content: '',
        role: 'bot',
        questionData: firstQuestion,
        timestamp: new Date(),
      };
      
      return [quizMessage];
    }
    return [];
  }, [isQuizActive, setQuizActive, setCurrentQuizQuestion, resetQuizStore]);

  const handleAnswerSelect = useCallback((questionId: number, answerValue: string) => {
    // Prevent duplicate answers
    if (quizAnswers[questionId]) {
      return { isComplete: false };
    }

    // Store the answer
    addQuizAnswer(questionId, answerValue);

    const nextIndex = (currentQuizQuestionIndex ?? -1) + 1;

    // Check if there are more questions
    if (nextIndex < riskQuizQuestions.length) {
      setCurrentQuizQuestion(nextIndex);
      const nextQuestion = riskQuizQuestions[nextIndex];
      
      const nextMessage: ChatMessage = {
        id: `quiz-${nextQuestion.id}-${Date.now()}`,
        type: 'quiz',
        content: '',
        role: 'bot',
        questionData: nextQuestion,
        timestamp: new Date(),
      };

      return {
        nextMessage,
        isComplete: false,
      };
    } else {
      // Quiz complete - calculate actual risk profile
      const updatedAnswers = { ...quizAnswers, [questionId]: answerValue };
      const riskProfile = calculateRiskProfile(updatedAnswers);
      
      setCurrentQuizQuestion(null);
      setQuizActive(false);
      setQuizCompleted(true);
      setRiskProfile(riskProfile.level);
      setRiskScore(riskProfile.score);

      const completionMessage: ChatMessage = {
        id: `quiz-complete-${Date.now()}`,
        type: 'text',
        role: 'bot',
        content: `Your risk level is ${riskProfile.level} (Score: ${riskProfile.score}/9). Here is a suggested ETF allocation:`,
        allocationData: {
          level: riskProfile.level as 'Conservative' | 'Moderate' | 'Aggressive',
          etfs: moderateAllocation, // TODO: Use different allocations based on risk level
        },
        timestamp: new Date(),
      };

      return {
        isComplete: true,
        completionMessage,
      };
    }
  }, [quizAnswers, currentQuizQuestionIndex, addQuizAnswer, setCurrentQuizQuestion, setQuizActive, setQuizCompleted, setRiskProfile, setRiskScore]);

  const resetQuiz = useCallback(() => {
    resetQuizStore();
  }, [resetQuizStore]);

  return {
    // State
    currentQuizQuestionIndex,
    quizAnswers,
    isQuizActive,
    // Actions
    startQuiz,
    handleAnswerSelect,
    resetQuiz,
  };
};