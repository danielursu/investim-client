import { QuizQuestionData } from '@/types';

export const riskQuizQuestions: QuizQuestionData[] = [
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