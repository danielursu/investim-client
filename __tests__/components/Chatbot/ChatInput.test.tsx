import { render, screen } from '../../test-utils';
import { ChatInput } from '@/components/Chatbot/ChatInput';
import userEvent from '@testing-library/user-event';

describe('ChatInput', () => {
  const mockOnSendMessage = jest.fn();

  const defaultProps = {
    onSendMessage: mockOnSendMessage,
    disabled: false,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with default placeholder', () => {
    render(<ChatInput {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders custom placeholder when provided', () => {
    render(
      <ChatInput 
        {...defaultProps} 
        placeholder="Please select an answer above" 
      />
    );
    
    expect(screen.getByPlaceholderText('Please select an answer above')).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    await user.type(input, 'Test message');
    await user.click(sendButton);
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('calls onSendMessage when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    await user.type(input, 'Test message{enter}');
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('clears input after sending message', async () => {
    const user = userEvent.setup();
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    expect(input).toHaveValue('');
  });

  it('disables input and button when disabled prop is true', () => {
    render(<ChatInput {...defaultProps} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<ChatInput {...defaultProps} loading={true} />);
    
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('disables sending empty messages', async () => {
    const user = userEvent.setup();
    render(<ChatInput {...defaultProps} />);
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    // Button should be disabled when input is empty
    expect(sendButton).toBeDisabled();
    
    // Type and clear input
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'test');
    await user.clear(input);
    
    // Button should be disabled again
    expect(sendButton).toBeDisabled();
  });

  it('handles Enter key to send message', async () => {
    const user = userEvent.setup();
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    await user.type(input, 'Test{enter}');
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test');
    expect(input).toHaveValue('');
  });
});