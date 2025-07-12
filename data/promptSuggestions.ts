export const promptSuggestions = [
  // Getting Started
  {
    id: 'getting-started-1',
    category: 'Getting Started',
    text: 'How do I start investing with little money?',
    priority: 1
  },
  {
    id: 'getting-started-2',
    category: 'Getting Started',
    text: 'What is the minimum amount I need to invest?',
    priority: 2
  },
  {
    id: 'getting-started-3',
    category: 'Getting Started',
    text: 'How do I open an investment account?',
    priority: 3
  },

  // Investment Basics
  {
    id: 'basics-1',
    category: 'Investment Basics',
    text: 'What are ETFs and how do they work?',
    priority: 1
  },
  {
    id: 'basics-2',
    category: 'Investment Basics',
    text: 'What is the difference between stocks and bonds?',
    priority: 2
  },
  {
    id: 'basics-3',
    category: 'Investment Basics',
    text: 'What is diversification and why is it important?',
    priority: 3
  },

  // Risk and Returns
  {
    id: 'risk-1',
    category: 'Risk & Returns',
    text: 'How do I determine my risk tolerance?',
    priority: 1
  },
  {
    id: 'risk-2',
    category: 'Risk & Returns',
    text: 'What returns can I expect from investing?',
    priority: 2
  },
  {
    id: 'risk-3',
    category: 'Risk & Returns',
    text: 'How can I minimize investment risks?',
    priority: 3
  },

  // Goal Planning
  {
    id: 'goals-1',
    category: 'Goal Planning',
    text: 'How much should I save for retirement?',
    priority: 1
  },
  {
    id: 'goals-2',
    category: 'Goal Planning',
    text: 'How do I invest for a house down payment?',
    priority: 2
  },
  {
    id: 'goals-3',
    category: 'Goal Planning',
    text: 'What is dollar-cost averaging?',
    priority: 3
  },

  // Portfolio Management
  {
    id: 'portfolio-1',
    category: 'Portfolio Management',
    text: 'How often should I rebalance my portfolio?',
    priority: 1
  },
  {
    id: 'portfolio-2',
    category: 'Portfolio Management',
    text: 'What is asset allocation?',
    priority: 2
  },
  {
    id: 'portfolio-3',
    category: 'Portfolio Management',
    text: 'Should I invest in international markets?',
    priority: 3
  },

  // Tax and Fees
  {
    id: 'tax-1',
    category: 'Tax & Fees',
    text: 'What are the tax implications of investing?',
    priority: 1
  },
  {
    id: 'tax-2',
    category: 'Tax & Fees',
    text: 'What fees should I watch out for?',
    priority: 2
  },
  {
    id: 'tax-3',
    category: 'Tax & Fees',
    text: 'What is a tax-advantaged account?',
    priority: 3
  }
];

export type PromptSuggestion = typeof promptSuggestions[0];