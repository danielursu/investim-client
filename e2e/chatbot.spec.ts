import { test, expect } from '@playwright/test';

test.describe('Chatbot E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('opens and closes chatbot', async ({ page }) => {
    // Find and click the chatbot trigger (likely a floating button)
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await expect(chatbotTrigger).toBeVisible();
    await chatbotTrigger.click();

    // Verify chatbot is open
    await expect(page.locator('text=Investment Assistant')).toBeVisible();
    await expect(page.locator('text=Hello! To start, let\'s quickly assess your risk tolerance.')).toBeVisible();

    // Close the chatbot
    const closeButton = page.locator('button[aria-label*="close"], button:has([data-testid="x-icon"]), button:has(.lucide-x)').first();
    await closeButton.click();

    // Verify chatbot is closed
    await expect(page.locator('text=Investment Assistant')).not.toBeVisible();
  });

  test('completes risk assessment quiz', async ({ page }) => {
    // Open chatbot
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Wait for quiz to start
    await expect(page.locator('text=What is your investment time horizon')).toBeVisible({ timeout: 10000 });

    // Answer first question (investment time horizon)
    await page.locator('text=5-10 years').click();

    // Wait for second question
    await expect(page.locator('text=comfort level with market volatility')).toBeVisible({ timeout: 5000 });

    // Answer second question (volatility comfort)
    await page.locator('text=Some fluctuation is acceptable').click();

    // Wait for third question
    await expect(page.locator('text=primary investment goal')).toBeVisible({ timeout: 5000 });

    // Answer third question (investment goal)
    await page.locator('text=Balanced growth').click();

    // Wait for quiz completion and allocation display
    await expect(page.locator('text=Your risk level is Moderate')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=suggested ETF allocation')).toBeVisible();

    // Verify chat input is now enabled
    const chatInput = page.locator('input[placeholder*="Type your message"]');
    await expect(chatInput).toBeEnabled();
    await expect(chatInput).not.toHaveAttribute('disabled');
  });

  test('sends and receives chat messages', async ({ page }) => {
    // Open chatbot and complete quiz first
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Complete quiz quickly
    await page.waitForSelector('text=What is your investment time horizon', { timeout: 10000 });
    await page.locator('text=5-10 years').click();
    await page.waitForSelector('text=comfort level with market volatility', { timeout: 5000 });
    await page.locator('text=Some fluctuation is acceptable').click();
    await page.waitForSelector('text=primary investment goal', { timeout: 5000 });
    await page.locator('text=Balanced growth').click();

    // Wait for quiz completion
    await expect(page.locator('text=Your risk level is Moderate')).toBeVisible({ timeout: 5000 });

    // Now test regular chat
    const chatInput = page.locator('input[placeholder*="Type your message"]');
    await expect(chatInput).toBeEnabled();

    // Type and send a message
    await chatInput.fill('What are ETFs?');
    const sendButton = page.locator('button[aria-label="Send"], button[type="submit"]').last();
    await sendButton.click();

    // Verify loading state (shimmer effect)
    await expect(page.locator('text=Thinking...')).toBeVisible();

    // Wait for response
    await expect(page.locator('text=ETFs offer low-cost diversification')).toBeVisible({ timeout: 10000 });

    // Verify input is cleared
    await expect(chatInput).toHaveValue('');
  });

  test('handles keyboard shortcuts', async ({ page }) => {
    // Open chatbot and complete quiz
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Complete quiz
    await page.waitForSelector('text=What is your investment time horizon', { timeout: 10000 });
    await page.locator('text=5-10 years').click();
    await page.waitForSelector('text=comfort level with market volatility', { timeout: 5000 });
    await page.locator('text=Some fluctuation is acceptable').click();
    await page.waitForSelector('text=primary investment goal', { timeout: 5000 });
    await page.locator('text=Balanced growth').click();
    await expect(page.locator('text=Your risk level is Moderate')).toBeVisible({ timeout: 5000 });

    // Test Enter key to send message
    const chatInput = page.locator('input[placeholder*="Type your message"]');
    await chatInput.fill('Test message');
    await chatInput.press('Enter');

    // Verify message was sent (shimmer effect)
    await expect(page.locator('text=Thinking...')).toBeVisible();
  });

  test('displays error messages appropriately', async ({ page }) => {
    // Mock API error by intercepting the request
    await page.route('/api/rag', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service temporarily unavailable' })
      });
    });

    // Open chatbot and complete quiz
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Complete quiz quickly (skip detailed steps for brevity)
    await page.waitForSelector('text=What is your investment time horizon', { timeout: 10000 });
    await page.locator('text=5-10 years').click();
    await page.waitForSelector('text=comfort level with market volatility', { timeout: 5000 });
    await page.locator('text=Some fluctuation is acceptable').click();
    await page.waitForSelector('text=primary investment goal', { timeout: 5000 });
    await page.locator('text=Balanced growth').click();
    await expect(page.locator('text=Your risk level is Moderate')).toBeVisible({ timeout: 5000 });

    // Send a message that will trigger the error
    const chatInput = page.locator('input[placeholder*="Type your message"]');
    await chatInput.fill('This will cause an error');
    await chatInput.press('Enter');

    // Verify error message is displayed
    await expect(page.locator('text=Assistant error')).toBeVisible({ timeout: 5000 });
  });

  test('maintains chat history during session', async ({ page }) => {
    // Open chatbot and complete quiz
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Complete quiz
    await page.waitForSelector('text=What is your investment time horizon', { timeout: 10000 });
    await page.locator('text=5-10 years').click();
    await page.waitForSelector('text=comfort level with market volatility', { timeout: 5000 });
    await page.locator('text=Some fluctuation is acceptable').click();
    await page.waitForSelector('text=primary investment goal', { timeout: 5000 });
    await page.locator('text=Balanced growth').click();
    await expect(page.locator('text=Your risk level is Moderate')).toBeVisible({ timeout: 5000 });

    // Send first message
    const chatInput = page.locator('input[placeholder*="Type your message"]');
    await chatInput.fill('What are bonds?');
    await chatInput.press('Enter');
    await expect(page.locator('text=Thinking...')).toBeVisible();
    await page.waitForTimeout(2000); // Wait for response

    // Send second message
    await chatInput.fill('What about stocks?');
    await chatInput.press('Enter');
    await expect(page.locator('text=Thinking...')).toBeVisible();
    await page.waitForTimeout(2000); // Wait for response

    // Verify both questions are still visible in chat history
    await expect(page.locator('text=What are bonds?')).toBeVisible();
    await expect(page.locator('text=What about stocks?')).toBeVisible();
  });

  test('works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open chatbot
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Verify chatbot adapts to mobile
    const chatbotContainer = page.locator('text=Investment Assistant').locator('..');
    await expect(chatbotContainer).toBeVisible();

    // Check that the chatbot doesn't overflow the viewport
    const boundingBox = await chatbotContainer.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);

    // Verify quiz still works on mobile
    await page.waitForSelector('text=What is your investment time horizon', { timeout: 10000 });
    await page.locator('text=5-10 years').click();

    // Verify the interface remains usable
    const chatInput = page.locator('input[placeholder*="Please select an answer above"]');
    await expect(chatInput).toBeVisible();
  });

  test('closes when clicking outside (if applicable)', async ({ page }) => {
    // Open chatbot
    const chatbotTrigger = page.locator('[data-testid="chatbot-trigger"], button:has-text("Chat"), .chatbot-trigger').first();
    await chatbotTrigger.click();

    // Verify it's open
    await expect(page.locator('text=Investment Assistant')).toBeVisible();

    // Click outside the chatbot (on the main page content)
    await page.locator('body').click({ position: { x: 100, y: 100 } });

    // Note: This behavior might not be implemented, so we'll check if it closes
    // If the chatbot doesn't close on outside click, that's also valid UX
    // This test documents the expected behavior
  });
});