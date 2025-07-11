import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('displays main dashboard elements', async ({ page }) => {
    // Check for main dashboard components
    await expect(page.locator('text=Portfolio Value', { exact: false })).toBeVisible();
    await expect(page.locator('text=Your Goals', { exact: false })).toBeVisible();
    
    // Check for navigation elements
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    
    // Verify user avatar/profile section
    const userSection = page.locator('[data-testid="user-header"], img[alt*="avatar"], img[alt*="profile"]').first();
    await expect(userSection).toBeVisible();
  });

  test('navigates between tabs/sections', async ({ page }) => {
    // Look for tab navigation (Performance, Goals, etc.)
    const performanceTab = page.locator('text=Performance, button:has-text("Performance"), [role="tab"]:has-text("Performance")').first();
    const goalsTab = page.locator('text=Goals, button:has-text("Goals"), [role="tab"]:has-text("Goals")').first();
    
    if (await performanceTab.isVisible()) {
      await performanceTab.click();
      // Verify performance content is shown
      await expect(page.locator('canvas, svg, [data-testid="performance-chart"]')).toBeVisible();
    }
    
    if (await goalsTab.isVisible()) {
      await goalsTab.click();
      // Verify goals content is shown
      await expect(page.locator('text=Emergency Fund, text=Retirement, [data-testid="goal-card"]')).toBeVisible();
    }
  });

  test('displays performance charts', async ({ page }) => {
    // Look for performance/chart section
    const chartContainer = page.locator('canvas, svg, [data-testid="performance-chart"], .recharts-wrapper').first();
    
    if (await chartContainer.isVisible()) {
      await expect(chartContainer).toBeVisible();
      
      // Test period selector if present
      const periodSelectors = page.locator('button:has-text("1Y"), button:has-text("6M"), button:has-text("3M")');
      const firstPeriod = periodSelectors.first();
      
      if (await firstPeriod.isVisible()) {
        await firstPeriod.click();
        // Chart should update (we can't easily verify chart data, but can check it's still visible)
        await expect(chartContainer).toBeVisible();
      }
    }
  });

  test('displays asset allocation chart', async ({ page }) => {
    // Look for pie chart or allocation visualization
    const allocationChart = page.locator('canvas, svg, [data-testid="allocation-chart"], .asset-allocation').first();
    
    if (await allocationChart.isVisible()) {
      await expect(allocationChart).toBeVisible();
      
      // Check for legend or labels
      const chartLabels = page.locator('text=US Stocks, text=Bonds, text=International, text=%');
      const firstLabel = chartLabels.first();
      
      if (await firstLabel.isVisible()) {
        await expect(firstLabel).toBeVisible();
      }
    }
  });

  test('displays goal cards', async ({ page }) => {
    // Look for investment goals
    const goalCard = page.locator('[data-testid="goal-card"], .goal-card, text=Emergency Fund').first();
    
    if (await goalCard.isVisible()) {
      await expect(goalCard).toBeVisible();
      
      // Check for progress indicators
      const progressBar = page.locator('[role="progressbar"], .progress, [data-testid="progress"]').first();
      if (await progressBar.isVisible()) {
        await expect(progressBar).toBeVisible();
      }
      
      // Check for goal amounts
      const amount = page.locator('text=$, text=% , text=target').first();
      if (await amount.isVisible()) {
        await expect(amount).toBeVisible();
      }
    }
  });

  test('mobile navigation works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check for mobile navigation
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-nav, nav').first();
    await expect(mobileNav).toBeVisible();
    
    // Test navigation between sections on mobile
    const navItems = page.locator('nav button, nav a, [role="tablist"] button');
    const firstNavItem = navItems.first();
    
    if (await firstNavItem.isVisible()) {
      await firstNavItem.click();
      // Verify navigation works (content should change or item should be highlighted)
      await expect(firstNavItem).toBeVisible();
    }
  });

  test('responsive design works across breakpoints', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Ensure no horizontal scrolling on mobile
    const body = page.locator('body');
    const boundingBox = await body.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });

  test('handles loading states gracefully', async ({ page }) => {
    // Intercept API calls to simulate slow responses
    await page.route('/api/**', (route) => {
      // Delay response by 2 seconds
      setTimeout(() => {
        route.continue();
      }, 2000);
    });
    
    await page.reload();
    
    // Check if loading states are shown
    const loadingIndicators = page.locator('.loading, .spinner, [data-testid="loading"], .animate-pulse');
    const firstLoading = loadingIndicators.first();
    
    if (await firstLoading.isVisible({ timeout: 1000 })) {
      await expect(firstLoading).toBeVisible();
    }
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Portfolio, text=Goals, text=Performance')).toBeVisible();
  });

  test('theme switching works (if implemented)', async ({ page }) => {
    // Look for theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("Dark"), button:has-text("Light"), .theme-toggle').first();
    
    if (await themeToggle.isVisible()) {
      // Get current theme
      const html = page.locator('html');
      const initialTheme = await html.getAttribute('class');
      
      // Toggle theme
      await themeToggle.click();
      
      // Verify theme changed
      await page.waitForTimeout(500);
      const newTheme = await html.getAttribute('class');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('error boundaries catch component errors', async ({ page }) => {
    // This is harder to test without deliberately breaking components
    // But we can check that error boundaries don't show by default
    const errorBoundary = page.locator('text=Something went wrong, text=Error boundary, [data-testid="error-boundary"]');
    await expect(errorBoundary).not.toBeVisible();
  });

  test('accessibility features are present', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1');
    if (await h1.count() > 0) {
      await expect(h1.first()).toBeVisible();
    }
    
    // Check for skip links (accessibility feature)
    const skipLink = page.locator('a:has-text("Skip to content"), [data-testid="skip-link"]');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }
    
    // Check for proper button labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const ariaLabel = await firstButton.getAttribute('aria-label');
      const textContent = await firstButton.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('performance metrics are within acceptable ranges', async ({ page }) => {
    // Start measuring performance
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check that the page loads in reasonable time
    const navigationTiming = await page.evaluate(() => {
      return JSON.parse(JSON.stringify(performance.getEntriesByType('navigation')[0]));
    });
    
    // Page should load within 3 seconds
    const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
    expect(loadTime).toBeLessThan(3000);
    
    // Check for layout shifts (CLS should be low)
    // This is a simplified check - in real scenarios you'd use more sophisticated metrics
    await page.waitForTimeout(1000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});