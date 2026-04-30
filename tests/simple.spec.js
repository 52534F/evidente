import { test, expect } from '@playwright/test';

test('page loads', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle('GrammarDrill');
  console.log('Page loaded successfully');
});