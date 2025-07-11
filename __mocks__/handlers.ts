const { http, HttpResponse } = require('msw')

// Mock responses for the RAG API
const handlers = [
  // Mock the RAG API endpoint
  http.post('/api/rag', async ({ request }) => {
    const body = await request.json() as any;
    const { question, context } = body;

    // Simulate different response types based on question content
    if (question.toLowerCase().includes('risk')) {
      return HttpResponse.json({
        answer: "Based on your risk assessment, I recommend a moderate investment approach with 60% stocks and 40% bonds. This allocation balances growth potential with stability.",
        sources: [
          { title: "Risk Assessment Guide", url: "https://example.com/risk" },
          { title: "Portfolio Allocation Strategies", url: "https://example.com/allocation" }
        ]
      });
    }

    if (question.toLowerCase().includes('goal')) {
      return HttpResponse.json({
        answer: "To help you achieve your financial goals, consider setting up automatic contributions and diversifying your portfolio across different asset classes.",
        sources: [
          { title: "Goal Setting for Investors", url: "https://example.com/goals" },
          { title: "Automatic Investment Plans", url: "https://example.com/auto-invest" }
        ]
      });
    }

    if (question.toLowerCase().includes('etf')) {
      return HttpResponse.json({
        answer: "ETFs offer low-cost diversification and are excellent for long-term investing. Consider broad market ETFs like VTI for U.S. stocks and VXUS for international exposure.",
        sources: [
          { title: "ETF Investment Guide", url: "https://example.com/etf-guide" },
          { title: "Best ETFs for Beginners", url: "https://example.com/best-etfs" }
        ]
      });
    }

    // Default response
    return HttpResponse.json({
      answer: "I'm here to help with your investment questions. Could you please provide more specific details about what you'd like to know?",
      sources: []
    });
  }),

  // Mock API endpoint for testing error scenarios
  http.post('/api/rag/error', () => {
    return HttpResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }),

  // Mock external API calls that might be made during testing
  http.get('http://127.0.0.1:8000/query', () => {
    return HttpResponse.json({
      answer: "This is a mocked response from the FastAPI backend.",
      sources: []
    });
  }),
]

module.exports = { handlers }