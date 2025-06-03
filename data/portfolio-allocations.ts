import { COLORS } from '@/constants/colors';
import { AllocationItem } from '@/types';

// Default asset allocation data for portfolio overview
export const defaultAllocationData: AllocationItem[] = [
  { name: "Stocks", percentage: 45, color: COLORS.CHART.STOCKS },
  { name: "Bonds", percentage: 30, color: COLORS.CHART.BONDS },
  { name: "Real Estate", percentage: 15, color: COLORS.CHART.REAL_ESTATE },
  { name: "Alternatives", percentage: 10, color: COLORS.CHART.ALTERNATIVES },
];

// Moderate risk allocation for chatbot recommendations
export const moderateAllocation: AllocationItem[] = [
  { name: 'US Total Stock Market (VTI)', percentage: 40, color: COLORS.CHART.STOCKS },
  { name: 'Intl Developed Stocks (VEA)', percentage: 20, color: COLORS.CHART.BONDS }, 
  { name: 'US Total Bond Market (BND)', percentage: 30, color: COLORS.CHART.REAL_ESTATE },
  { name: 'Real Estate (VNQ)', percentage: 10, color: COLORS.CHART.ALTERNATIVES },
];

// Mock portfolio performance data
export const portfolioMetrics = {
  totalValue: 87429.65,
  gain: 1245.23,
  gainPercentage: 2.8,
  annualReturn: 12.4,
  riskLevel: 'Moderate' as const,
};

// Mock goal data
export const defaultGoals = [
  {
    name: "Retirement Fund",
    icon: "target" as const,
    amount: "500,000",
    targetDate: "2045",
    progressPercent: 42,
    currentAmount: "210,000"
  },
  {
    name: "Home Down Payment", 
    icon: "home" as const,
    amount: "60,000",
    targetDate: "2026",
    progressPercent: 78,
    currentAmount: "46,800"
  }
];