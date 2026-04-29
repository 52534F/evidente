import { test, expect } from '@playwright/test';

test('GrammarDrill loads and displays start screen', async ({ page }) => {
  await page.goto('/index.html');

  // Check title
  await expect(page).toHaveTitle('GrammarDrill');

  // Check start screen elements
  await expect(page.locator('h1').first()).toHaveText('GrammarDrill');
  await expect(page.locator('#start-btn')).toBeVisible();
  await expect(page.locator('#level-select')).toBeVisible();
  await expect(page.locator('#high-score-value')).toHaveText('0');
});

test('Can start a game and see questions', async ({ page }) => {
  await page.goto('/index.html');

  // Click start
  await page.click('#start-btn');

  // Should see game screen
  await expect(page.locator('#game-screen')).toBeVisible();
  await expect(page.locator('#syntax-blocks')).toBeVisible();
  await expect(page.locator('.answer-btn').first()).toBeVisible();
});