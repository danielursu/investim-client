import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AllocationItem, Period } from '@/types';
import { portfolioMetrics, defaultAllocationData, moderateAllocation } from '@/data/portfolio-allocations';

// Portfolio performance data for different periods
interface PerformanceData {
  period: Period;
  data: Array<{
    date: string;
    value: number;
  }>;
}

interface PortfolioState {
  // Portfolio metrics
  totalValue: number;
  gain: number;
  gainPercentage: number;
  annualReturn: number;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  
  // Allocation data
  currentAllocation: AllocationItem[];
  recommendedAllocation: AllocationItem[];
  
  // Performance data
  performanceData: PerformanceData[];
  selectedPeriod: Period;
  
  // Loading states
  isLoading: boolean;
  lastUpdated: Date | null;
}

interface PortfolioActions {
  // Portfolio updates
  updatePortfolioMetrics: (metrics: Partial<Pick<PortfolioState, 'totalValue' | 'gain' | 'gainPercentage' | 'annualReturn'>>) => void;
  setRiskLevel: (level: PortfolioState['riskLevel']) => void;
  
  // Allocation updates
  updateCurrentAllocation: (allocation: AllocationItem[]) => void;
  updateRecommendedAllocation: (allocation: AllocationItem[]) => void;
  
  // Performance data
  setSelectedPeriod: (period: Period) => void;
  updatePerformanceData: (period: Period, data: PerformanceData['data']) => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  refreshPortfolio: () => Promise<void>;
  resetPortfolio: () => void;
}

type PortfolioStore = PortfolioState & PortfolioActions;

// Generate mock performance data for different periods
const generateMockPerformanceData = (): PerformanceData[] => {
  const baseValue = portfolioMetrics.totalValue;
  const currentDate = new Date();
  
  return [
    {
      period: '1M',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(currentDate.getTime() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: baseValue + (Math.random() - 0.5) * 5000 + (i * 100),
      })),
    },
    {
      period: '3M',
      data: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(currentDate.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: baseValue + (Math.random() - 0.5) * 8000 + (i * 500),
      })),
    },
    {
      period: '6M',
      data: Array.from({ length: 26 }, (_, i) => ({
        date: new Date(currentDate.getTime() - (25 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: baseValue + (Math.random() - 0.5) * 12000 + (i * 800),
      })),
    },
    {
      period: '12M',
      data: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(currentDate.getTime() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: baseValue + (Math.random() - 0.5) * 15000 + (i * 1200),
      })),
    },
  ];
};

// Initial state
const initialState: PortfolioState = {
  totalValue: portfolioMetrics.totalValue,
  gain: portfolioMetrics.gain,
  gainPercentage: portfolioMetrics.gainPercentage,
  annualReturn: portfolioMetrics.annualReturn,
  riskLevel: portfolioMetrics.riskLevel,
  currentAllocation: defaultAllocationData,
  recommendedAllocation: moderateAllocation,
  performanceData: generateMockPerformanceData(),
  selectedPeriod: '3M',
  isLoading: false,
  lastUpdated: new Date(),
};

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Portfolio updates
      updatePortfolioMetrics: (metrics) =>
        set(
          (state) => ({
            ...state,
            ...metrics,
            lastUpdated: new Date(),
          }),
          false,
          'updatePortfolioMetrics'
        ),

      setRiskLevel: (level) =>
        set(
          (state) => ({
            ...state,
            riskLevel: level,
            lastUpdated: new Date(),
          }),
          false,
          'setRiskLevel'
        ),

      // Allocation updates
      updateCurrentAllocation: (allocation) =>
        set(
          (state) => ({
            ...state,
            currentAllocation: allocation,
            lastUpdated: new Date(),
          }),
          false,
          'updateCurrentAllocation'
        ),

      updateRecommendedAllocation: (allocation) =>
        set(
          (state) => ({
            ...state,
            recommendedAllocation: allocation,
            lastUpdated: new Date(),
          }),
          false,
          'updateRecommendedAllocation'
        ),

      // Performance data
      setSelectedPeriod: (period) =>
        set(
          (state) => ({
            ...state,
            selectedPeriod: period,
          }),
          false,
          'setSelectedPeriod'
        ),

      updatePerformanceData: (period, data) =>
        set(
          (state) => {
            const updatedPerformanceData = state.performanceData.map((item) =>
              item.period === period ? { ...item, data } : item
            );
            return {
              ...state,
              performanceData: updatedPerformanceData,
              lastUpdated: new Date(),
            };
          },
          false,
          'updatePerformanceData'
        ),

      // Utility actions
      setLoading: (loading) =>
        set(
          (state) => ({
            ...state,
            isLoading: loading,
          }),
          false,
          'setLoading'
        ),

      refreshPortfolio: async () => {
        const { setLoading } = get();
        setLoading(true);
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // In a real app, this would fetch data from an API
          // For now, we'll just update the timestamp and regenerate performance data
          set(
            (state) => ({
              ...state,
              performanceData: generateMockPerformanceData(),
              lastUpdated: new Date(),
              isLoading: false,
            }),
            false,
            'refreshPortfolio'
          );
        } catch (error) {
          console.error('Failed to refresh portfolio:', error);
          setLoading(false);
        }
      },

      resetPortfolio: () =>
        set(
          () => ({
            ...initialState,
            performanceData: generateMockPerformanceData(),
            lastUpdated: new Date(),
          }),
          false,
          'resetPortfolio'
        ),
    }),
    {
      name: 'portfolio-store',
    }
  )
);

// Individual selector hooks for better performance (prevents re-renders)
export const usePortfolioTotalValue = () => usePortfolioStore((state) => state.totalValue);
export const usePortfolioGain = () => usePortfolioStore((state) => state.gain);
export const usePortfolioGainPercentage = () => usePortfolioStore((state) => state.gainPercentage);
export const usePortfolioAnnualReturn = () => usePortfolioStore((state) => state.annualReturn);
export const usePortfolioRiskLevel = () => usePortfolioStore((state) => state.riskLevel);
export const usePortfolioLastUpdated = () => usePortfolioStore((state) => state.lastUpdated);

export const useCurrentAllocation = () => usePortfolioStore((state) => state.currentAllocation);
export const useRecommendedAllocation = () => usePortfolioStore((state) => state.recommendedAllocation);

export const usePortfolioSelectedPeriod = () => usePortfolioStore((state) => state.selectedPeriod);
export const usePerformanceDataByPeriod = () => usePortfolioStore((state) => state.performanceData);
export const usePortfolioIsLoading = () => usePortfolioStore((state) => state.isLoading);