import { render, screen, fireEvent, waitFor } from '../test-utils'
import { Chatbot } from '@/components/Chatbot'
const { server } = require('../../__mocks__/node')
const { http, HttpResponse } = require('msw')
import userEvent from '@testing-library/user-event'

describe('Chatbot Component', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    userAvatarUrl: '/placeholder-user.jpg',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<Chatbot {...defaultProps} />)
    
    expect(screen.getByText('Investment Assistant')).toBeInTheDocument()
    expect(screen.getByText('Hello! To start, let\'s quickly assess your risk tolerance.')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Chatbot {...defaultProps} open={false} />)
    
    expect(screen.queryByText('Investment Assistant')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Chatbot {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('starts with risk assessment quiz', async () => {
    render(<Chatbot {...defaultProps} />)
    
    // Wait for quiz to start
    await waitFor(() => {
      expect(screen.getByText(/What is your investment time horizon/i)).toBeInTheDocument()
    })
  })

  it('handles quiz answer selection', async () => {
    const user = userEvent.setup()
    render(<Chatbot {...defaultProps} />)
    
    // Wait for first quiz question
    await waitFor(() => {
      expect(screen.getByText(/What is your investment time horizon/i)).toBeInTheDocument()
    })

    // Select an answer
    const answerButton = screen.getByText(/5-10 years/i)
    await user.click(answerButton)
    
    // Should proceed to next question
    await waitFor(() => {
      expect(screen.getByText(/comfort level with market volatility/i)).toBeInTheDocument()
    })
  })

  it('disables input during quiz', () => {
    render(<Chatbot {...defaultProps} />)
    
    const input = screen.getByPlaceholderText(/Please select an answer above/i)
    expect(input).toBeDisabled()
  })

  it('enables text input after quiz completion', async () => {
    const user = userEvent.setup()
    render(<Chatbot {...defaultProps} />)
    
    // Complete the quiz by answering all questions
    await waitFor(() => {
      expect(screen.getByText(/What is your investment time horizon/i)).toBeInTheDocument()
    })
    
    // Answer first question
    await user.click(screen.getByText(/5-10 years/i))
    
    await waitFor(() => {
      expect(screen.getByText(/comfort level with market volatility/i)).toBeInTheDocument()
    })
    
    // Answer second question
    await user.click(screen.getByText(/Some fluctuation is acceptable/i))
    
    await waitFor(() => {
      expect(screen.getByText(/primary investment goal/i)).toBeInTheDocument()
    })
    
    // Answer third question
    await user.click(screen.getByText(/Balanced growth/i))
    
    // Quiz should complete and show allocation
    await waitFor(() => {
      expect(screen.getByText(/Your risk level is Moderate/i)).toBeInTheDocument()
      expect(screen.getByText(/suggested ETF allocation/i)).toBeInTheDocument()
    })
    
    // Input should now be enabled
    const input = screen.getByPlaceholderText(/Type your message.../i)
    expect(input).not.toBeDisabled()
  })

  it('sends message and receives response', async () => {
    const user = userEvent.setup()
    
    // Mock the quiz completion first
    render(<Chatbot {...defaultProps} />)
    
    // Complete quiz quickly by manipulating component state
    const chatbot = screen.getByText('Investment Assistant').closest('.fixed')
    fireEvent(chatbot!, new CustomEvent('test-complete-quiz'))
    
    // Wait for input to be enabled
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message.../i)
      expect(input).not.toBeDisabled()
    }, { timeout: 3000 })
    
    const input = screen.getByPlaceholderText(/Type your message.../i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    // Type a message
    await user.type(input, 'What are ETFs?')
    await user.click(sendButton)
    
    // Should show loading state (shimmer component)
    await waitFor(() => {
      expect(screen.getByText('Thinking...')).toBeInTheDocument()
    })
    
    // Should receive response
    await waitFor(() => {
      expect(screen.getByText(/ETFs offer low-cost diversification/i)).toBeInTheDocument()
    })
    
    // Input should be cleared
    expect(input).toHaveValue('')
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock API error
    server.use(
      http.post('/api/rag', () => {
        return HttpResponse.json(
          { error: 'Service unavailable' },
          { status: 500 }
        )
      })
    )
    
    render(<Chatbot {...defaultProps} />)
    
    // Wait for quiz to complete (simulate)
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message.../i)
      expect(input).not.toBeDisabled()
    }, { timeout: 3000 })
    
    const input = screen.getByPlaceholderText(/Type your message.../i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.type(input, 'Test message')
    await user.click(sendButton)
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Assistant error/i)).toBeInTheDocument()
    })
  })

  it('handles Enter key to send message', async () => {
    const user = userEvent.setup()
    render(<Chatbot {...defaultProps} />)
    
    // Wait for quiz completion
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message.../i)
      expect(input).not.toBeDisabled()
    }, { timeout: 3000 })
    
    const input = screen.getByPlaceholderText(/Type your message.../i)
    
    await user.type(input, 'Test message{enter}')
    
    // Should show loading state (shimmer component)
    await waitFor(() => {
      expect(screen.getByText('Thinking...')).toBeInTheDocument()
    })
  })

  it('prevents submission of empty messages', async () => {
    const user = userEvent.setup()
    render(<Chatbot {...defaultProps} />)
    
    // Wait for quiz completion
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message.../i)
      expect(input).not.toBeDisabled()
    }, { timeout: 3000 })
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    // Send button should be disabled when input is empty
    expect(sendButton).toBeDisabled()
    
    // Type and clear input
    const input = screen.getByPlaceholderText(/Type your message.../i)
    await user.type(input, 'test')
    await user.clear(input)
    
    // Send button should be disabled again
    expect(sendButton).toBeDisabled()
  })

  it('displays message timestamps', async () => {
    render(<Chatbot {...defaultProps} />)
    
    // Initial message should have timestamp
    await waitFor(() => {
      expect(screen.getByText(/Hello! To start, let's quickly assess your risk tolerance./)).toBeInTheDocument()
    })
    
    // Check for timestamp pattern (HH:MM format)
    const timestampRegex = /\d{1,2}:\d{2}/
    expect(screen.getByText(timestampRegex)).toBeInTheDocument()
  })

  it('resets state when closed and reopened', async () => {
    const { rerender } = render(<Chatbot {...defaultProps} />)
    
    // Wait for initial state
    await waitFor(() => {
      expect(screen.getByText('Hello! To start, let\'s quickly assess your risk tolerance.')).toBeInTheDocument()
    })
    
    // Close chatbot
    rerender(<Chatbot {...defaultProps} open={false} />)
    
    // Reopen chatbot
    rerender(<Chatbot {...defaultProps} open={true} />)
    
    // Should restart with initial message
    await waitFor(() => {
      expect(screen.getByText('Hello! To start, let\'s quickly assess your risk tolerance.')).toBeInTheDocument()
    })
  })

  it('handles sources in responses', async () => {
    const user = userEvent.setup()
    
    // Mock response with sources
    server.use(
      http.post('/api/rag', () => {
        return HttpResponse.json({
          answer: 'ETFs are exchange-traded funds.',
          sources: [
            {
              id: '1',
              content: 'ETF educational content',
              metadata: { source: 'education.com' }
            }
          ]
        })
      })
    )
    
    render(<Chatbot {...defaultProps} />)
    
    // Complete quiz and send message
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message.../i)
      expect(input).not.toBeDisabled()
    }, { timeout: 3000 })
    
    const input = screen.getByPlaceholderText(/Type your message.../i)
    await user.type(input, 'What are ETFs?')
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Should show response with sources
    await waitFor(() => {
      expect(screen.getByText('ETFs are exchange-traded funds.')).toBeInTheDocument()
      expect(screen.getByText('Sources')).toBeInTheDocument()
    })
  })
})