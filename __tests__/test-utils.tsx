import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data for testing
export const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/placeholder-user.jpg',
}

export const mockGoal = {
  id: '1',
  title: 'Emergency Fund',
  targetAmount: 10000,
  currentAmount: 7500,
  targetDate: '2024-12-31',
  description: 'Build emergency fund for 6 months expenses',
  priority: 'high' as const,
}

export const mockPortfolioData = [
  { date: '2024-01', value: 95000 },
  { date: '2024-02', value: 97000 },
  { date: '2024-03', value: 99000 },
  { date: '2024-04', value: 101000 },
  { date: '2024-05', value: 103000 },
  { date: '2024-06', value: 105000 },
]

export const mockAllocationData = [
  { name: 'US Stocks', value: 60, color: '#3b82f6' },
  { name: 'International Stocks', value: 25, color: '#10b981' },
  { name: 'Bonds', value: 10, color: '#f59e0b' },
  { name: 'Cash', value: 5, color: '#6b7280' },
]

// Helper function to create mock API responses
export const createMockResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response)
}

// Helper to wait for async operations in tests
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout after ${timeout}ms`))
    }, timeout)

    const interval = setInterval(() => {
      try {
        callback()
        clearInterval(interval)
        clearTimeout(timeoutId)
        resolve(undefined)
      } catch (error) {
        // Continue waiting
      }
    }, 10)
  })
}

// Simple test to satisfy Jest's requirement
describe('test-utils', () => {
  it('exports utility functions', () => {
    expect(typeof render).toBe('function')
    expect(typeof createMockResponse).toBe('function')
  })
})