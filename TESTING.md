# Testing Infrastructure Documentation

This document outlines the comprehensive testing setup for the Investim client application.

## Overview

The testing infrastructure includes:
- **Jest** for unit and integration testing
- **React Testing Library** for component testing
- **Playwright** for end-to-end testing
- **Mock Service Worker (MSW)** for API mocking
- **GitHub Actions** for continuous integration

## Test Scripts

```bash
# Run all unit tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci

# Run E2E tests
npm run test:e2e

# Run E2E tests with visible browser
npm run test:e2e:headed

# Run E2E tests with UI mode
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## Directory Structure

```
├── __tests__/                 # Unit and integration tests
│   ├── components/           # Component tests
│   ├── api/                 # API route tests
│   └── test-utils.tsx       # Testing utilities
├── __mocks__/               # Mock implementations
│   ├── handlers.ts          # MSW request handlers
│   ├── browser.ts           # MSW browser setup
│   └── node.ts              # MSW Node.js setup
├── e2e/                     # Playwright E2E tests
│   ├── chatbot.spec.ts      # Chatbot E2E tests
│   └── dashboard.spec.ts    # Dashboard E2E tests
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup file
└── playwright.config.ts     # Playwright configuration
```

## Jest Configuration

### Key Features
- **Next.js Integration**: Uses `next/jest` for optimal Next.js support
- **TypeScript Support**: Full TypeScript testing with `ts-jest`
- **Path Mapping**: Supports `@/` path aliases
- **Coverage Reporting**: Comprehensive coverage with thresholds
- **Environment Setup**: JSDOM for DOM testing

### Coverage Thresholds
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## React Testing Library

### Best Practices
- Use semantic queries (getByRole, getByLabelText, getByText)
- Test behavior, not implementation
- Focus on user interactions
- Use `userEvent` for realistic user interactions

### Example Test
```typescript
import { render, screen } from '../test-utils'
import { GoalCard } from '@/components/ui/GoalCard'
import userEvent from '@testing-library/user-event'

test('renders goal card with progress', async () => {
  const user = userEvent.setup()
  
  render(
    <GoalCard 
      title="Emergency Fund"
      progressPercent={75}
      currentAmount="$7,500"
      targetAmount="$10,000"
    />
  )
  
  expect(screen.getByText('Emergency Fund')).toBeInTheDocument()
  expect(screen.getByText('75%')).toBeInTheDocument()
})
```

## Mock Service Worker (MSW)

### Purpose
- Mock API requests during testing
- Consistent mock responses
- Test error scenarios
- Isolate frontend tests from backend

### Handler Examples
```typescript
// __mocks__/handlers.ts
export const handlers = [
  http.post('/api/rag', ({ request }) => {
    return HttpResponse.json({
      answer: 'Mocked investment advice',
      sources: []
    })
  })
]
```

### Current Status
**Note**: MSW v2 integration is in progress. The import paths may need adjustment for ES modules compatibility.

## Playwright E2E Testing

### Configuration
- **Multi-browser**: Tests run on Chromium, Firefox, and WebKit
- **Mobile Testing**: Includes mobile viewport tests
- **Visual Testing**: Screenshots and videos on failure
- **Parallel Execution**: Fast test execution

### Key Features
- Automatic server startup before tests
- Network request interception
- Cross-browser compatibility testing
- Mobile-responsive testing

### Example E2E Test
```typescript
test('user completes risk assessment', async ({ page }) => {
  await page.goto('/')
  
  // Open chatbot
  await page.click('[data-testid="chatbot-trigger"]')
  
  // Complete quiz
  await page.click('text=5-10 years')
  await page.click('text=Some fluctuation is acceptable')
  await page.click('text=Balanced growth')
  
  // Verify results
  await expect(page.locator('text=Your risk level is Moderate')).toBeVisible()
})
```

## Test Examples

### 1. Component Testing (GoalCard)
- ✅ Renders with all required props
- ✅ Has proper accessibility attributes
- ✅ Handles different progress values
- ✅ Applies custom styling
- ✅ Handles edge cases

### 2. API Testing (RAG Route)
- ✅ Processes valid requests
- ✅ Validates input parameters
- ✅ Handles backend errors
- ✅ Manages environment validation
- ✅ Forwards requests correctly

### 3. Complex Component Testing (Chatbot)
- ✅ Risk assessment quiz flow
- ✅ Message sending and receiving
- ✅ API error handling
- ✅ Keyboard interactions
- ✅ State management

### 4. E2E Testing
- ✅ Complete user workflows
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness
- ✅ Error scenarios
- ✅ Performance validation

## Continuous Integration

### GitHub Actions Workflow
The CI pipeline includes 5 jobs:

1. **Unit Tests**: Run on Node.js 18.x and 20.x
2. **E2E Tests**: Full browser testing with Playwright
3. **Lint & Type Check**: Code quality validation
4. **Build Test**: Verify production build
5. **Security Audit**: Dependency vulnerability scanning

### Triggered On
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

## Known Issues & TODOs

### MSW v2 Integration
- **Issue**: MSW v2 uses ES modules which require special Jest configuration
- **Status**: Basic setup complete, imports need refinement
- **Workaround**: MSW imports temporarily commented out in jest.setup.js

### Build Issues
- **Issue**: ErrorBoundary component needs 'use client' directive
- **Impact**: Affects E2E test server startup
- **Priority**: High - blocks E2E testing

## Development Workflow

### Adding New Tests

1. **Unit Tests**: Add to `__tests__/` directory
2. **Component Tests**: Use React Testing Library patterns
3. **API Tests**: Mock with MSW handlers
4. **E2E Tests**: Add to `e2e/` directory

### Running Tests During Development

```bash
# Watch mode for immediate feedback
npm run test:watch

# Specific test file
npm test MyComponent.test.tsx

# E2E with browser visible
npm run test:e2e:headed
```

### Best Practices

1. **Test Naming**: Descriptive test names explaining the scenario
2. **Arrange-Act-Assert**: Clear test structure
3. **Mock External Dependencies**: Use MSW for API calls
4. **Accessibility Testing**: Include aria-label and role checks
5. **Error Scenarios**: Test both happy and error paths

## Performance Considerations

- **Parallel Execution**: Jest runs tests in parallel by default
- **Coverage Collection**: Only when explicitly requested
- **E2E Optimization**: Playwright uses efficient browser instances
- **CI Optimization**: Separate jobs for faster feedback

## Maintenance

### Regular Tasks
- Update test snapshots when UI changes
- Review and update MSW handlers for API changes
- Monitor test execution times
- Update browser versions for E2E tests

### Dependencies
- Keep testing libraries updated
- Monitor for breaking changes in major versions
- Regularly review and update CI configuration

---

This testing infrastructure provides a solid foundation for safe refactoring and feature development, ensuring code quality and user experience consistency.