import { renderHook, act } from '@testing-library/react';
import { useRiskQuiz } from '@/hooks/useRiskQuiz';

// Mock the data files
jest.mock('@/data/risk-quiz-questions', () => ({
  riskQuizQuestions: [
    {
      id: 1,
      text: 'Question 1',
      options: [
        { value: 'A', label: 'Answer A' },
        { value: 'B', label: 'Answer B' },
      ],
    },
    {
      id: 2,
      text: 'Question 2',
      options: [
        { value: 'A', label: 'Answer A' },
        { value: 'B', label: 'Answer B' },
      ],
    },
  ],
}));

describe('useRiskQuiz', () => {
  it('initializes with null question index', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    expect(result.current.currentQuizQuestionIndex).toBeNull();
    expect(result.current.quizAnswers).toEqual({});
    expect(result.current.isQuizActive).toBe(false);
  });

  it('starts quiz and returns first question', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    let messages: any[] = [];
    act(() => {
      messages = result.current.startQuiz();
    });
    
    expect(result.current.currentQuizQuestionIndex).toBe(0);
    expect(result.current.isQuizActive).toBe(true);
    expect(messages).toHaveLength(1);
    expect(messages[0].type).toBe('quiz');
    expect(messages[0].questionData.id).toBe(1);
  });

  it('does not start quiz if already active', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    act(() => {
      result.current.startQuiz();
    });
    
    let secondMessages: any[] = [];
    act(() => {
      secondMessages = result.current.startQuiz();
    });
    
    expect(secondMessages).toHaveLength(0);
  });

  it('handles answer selection and progresses to next question', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    // Start quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Answer first question
    let response: any;
    act(() => {
      response = result.current.handleAnswerSelect(1, 'A');
    });
    
    expect(result.current.quizAnswers[1]).toBe('A');
    expect(result.current.currentQuizQuestionIndex).toBe(1);
    expect(response.isComplete).toBe(false);
    expect(response.nextMessage).toBeDefined();
    expect(response.nextMessage.questionData.id).toBe(2);
  });

  it('completes quiz after last question', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    // Start quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Answer first question
    act(() => {
      result.current.handleAnswerSelect(1, 'A');
    });
    
    // Answer second (last) question
    let response: any;
    act(() => {
      response = result.current.handleAnswerSelect(2, 'B');
    });
    
    expect(result.current.quizAnswers[2]).toBe('B');
    expect(result.current.currentQuizQuestionIndex).toBeNull();
    expect(result.current.isQuizActive).toBe(false);
    expect(response.isComplete).toBe(true);
    expect(response.completionMessage).toBeDefined();
    expect(response.completionMessage.content).toContain('Moderate');
    expect(response.completionMessage.allocationData).toBeDefined();
  });

  it('prevents duplicate answers', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    // Start quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Answer question
    act(() => {
      result.current.handleAnswerSelect(1, 'A');
    });
    
    // Try to answer same question again
    let response: any;
    act(() => {
      response = result.current.handleAnswerSelect(1, 'B');
    });
    
    expect(result.current.quizAnswers[1]).toBe('A'); // Should not change
    expect(response.isComplete).toBe(false);
    expect(response.nextMessage).toBeUndefined();
  });

  it('resets quiz state', () => {
    const { result } = renderHook(() => useRiskQuiz());
    
    // Start quiz and answer question
    act(() => {
      result.current.startQuiz();
      result.current.handleAnswerSelect(1, 'A');
    });
    
    // Reset
    act(() => {
      result.current.resetQuiz();
    });
    
    expect(result.current.currentQuizQuestionIndex).toBeNull();
    expect(result.current.quizAnswers).toEqual({});
    expect(result.current.isQuizActive).toBe(false);
  });
});