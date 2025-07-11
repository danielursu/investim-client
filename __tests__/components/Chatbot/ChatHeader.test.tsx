import { render, screen } from '../../test-utils';
import { ChatHeader } from '@/components/Chatbot/ChatHeader';
import userEvent from '@testing-library/user-event';

describe('ChatHeader', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title and close button', () => {
    render(<ChatHeader onClose={mockOnClose} />);
    
    expect(screen.getByText('Investment Assistant')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close chat/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatHeader onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper styling classes', () => {
    render(<ChatHeader onClose={mockOnClose} />);
    
    const headerElement = screen.getByText('Investment Assistant').closest('.bg-emerald-600');
    expect(headerElement).toHaveClass('bg-emerald-600', 'text-white', 'rounded-t-lg');
  });
});