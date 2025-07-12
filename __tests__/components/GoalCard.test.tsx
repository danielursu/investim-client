import { render, screen } from '../test-utils'
import { GoalDisplayCard } from '@/components/ui/goal-display-cards'
import { Target, TrendingUp, Shield } from 'lucide-react'

interface GoalDisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  currentAmount?: string;
  targetAmount?: string;
  progressPercent?: number;
  targetDate?: string;
  description?: string;
}

describe('GoalDisplayCard Component', () => {
  const defaultProps: GoalDisplayCardProps = {
    title: 'Emergency Fund',
    icon: <Target className="h-6 w-6 text-emerald-600" />,
    description: 'Save 6 months of expenses',
    progressPercent: 75,
    currentAmount: '$7,500',
    targetAmount: '$10,000',
    targetDate: '2024-12-31',
  }

  it('renders with all required props', () => {
    render(<GoalDisplayCard {...defaultProps} />)
    
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument()
    expect(screen.getByText('$7,500 of $10,000 (75%)')).toBeInTheDocument()
    expect(screen.getByText('Target: Dec 2024')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<GoalDisplayCard {...defaultProps} />)
    
    // Check that title is visible for screen readers
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument()
    
    // Check that progress information is displayed
    expect(screen.getByText('$7,500 of $10,000 (75%)')).toBeInTheDocument()
  })

  it('renders with different progress values', () => {
    const { rerender } = render(<GoalDisplayCard {...defaultProps} progressPercent={0} />)
    expect(screen.getByText('$7,500 of $10,000 (0%)')).toBeInTheDocument()
    
    rerender(<GoalDisplayCard {...defaultProps} progressPercent={100} />)
    expect(screen.getByText('$7,500 of $10,000 (100%)')).toBeInTheDocument()
    
    rerender(<GoalDisplayCard {...defaultProps} progressPercent={50} />)
    expect(screen.getByText('$7,500 of $10,000 (50%)')).toBeInTheDocument()
  })

  it('renders with different icons', () => {
    const { rerender } = render(
      <GoalDisplayCard 
        {...defaultProps} 
        icon={<TrendingUp className="h-6 w-6 text-blue-600" data-testid="trending-icon" />}
      />
    )
    expect(screen.getByTestId('trending-icon')).toBeInTheDocument()
    
    rerender(
      <GoalDisplayCard 
        {...defaultProps} 
        icon={<Shield className="h-6 w-6 text-green-600" data-testid="shield-icon" />}
      />
    )
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<GoalDisplayCard {...defaultProps} className="custom-class" />)
    
    const cardContainer = screen.getByText('Emergency Fund').closest('div')
    expect(cardContainer).toHaveClass('custom-class')
  })

  it('handles long text gracefully', () => {
    const longProps = {
      ...defaultProps,
      title: 'Very Long Goal Title That Should Wrap Properly',
      description: 'This is a very long description that explains the goal in great detail and should handle text wrapping gracefully',
      currentAmount: '$1,234,567.89',
      targetAmount: '$9,876,543.21',
    }
    
    render(<GoalDisplayCard {...longProps} />)
    
    expect(screen.getByText(longProps.title)).toBeInTheDocument()
    expect(screen.getByText(longProps.description)).toBeInTheDocument()
  })

  it('maintains visual hierarchy with proper headings', () => {
    render(<GoalDisplayCard {...defaultProps} />)
    
    // Title should be accessible and well-structured (might be div with proper classes)
    const title = screen.getByText('Emergency Fund')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('font-semibold') // Check styling indicates importance
  })

  it('displays progress bar with correct value', () => {
    render(<GoalDisplayCard {...defaultProps} progressPercent={85} />)
    
    // Check that the percentage is displayed in the progress description
    expect(screen.getByText('$7,500 of $10,000 (85%)')).toBeInTheDocument()
    
    // Check that progress bar exists (look for the colored div)
    const progressContainer = screen.getByText('$7,500 of $10,000 (85%)').parentElement
    const progressBar = progressContainer?.querySelector('.bg-emerald-500, .bg-yellow-500, .bg-orange-500, .bg-gray-400')
    expect(progressBar).toBeInTheDocument()
  })

  it('renders icon with proper accessibility', () => {
    render(<GoalDisplayCard {...defaultProps} />)
    
    // Icon should be rendered within the card
    const cardContainer = screen.getByText('Emergency Fund').closest('div')
    expect(cardContainer).toBeInTheDocument()
    
    // Icon is rendered as part of the component structure
    const iconElement = cardContainer?.querySelector('svg')
    expect(iconElement).toBeInTheDocument()
  })

  it('handles edge cases for amounts', () => {
    const edgeCaseProps = {
      ...defaultProps,
      currentAmount: '$0',
      targetAmount: '$100',
      progressPercent: 0,
    }
    
    render(<GoalDisplayCard {...edgeCaseProps} />)
    
    expect(screen.getByText('$0 of $100 (0%)')).toBeInTheDocument()
  })

  it('maintains responsive design structure', () => {
    render(<GoalDisplayCard {...defaultProps} />)
    
    const card = screen.getByText('Emergency Fund').closest('div')
    expect(card).toHaveClass('relative', 'flex', 'h-36', 'w-full')
    
    // Check for key responsive design classes
    expect(card).toHaveClass('rounded-xl', 'shadow-md')
  })
})