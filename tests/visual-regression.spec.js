/**
 * Visual Regression Tests
 * Screenshot-based visual comparison tests
 */

const { test, expect } = require('@playwright/test');
const {
  freshPage,
  waitForRender,
  toggleLanguage,
  cycleTheme,
} = require('./helpers');

async function screenshot(page, name) {
  await page.screenshot({
    path: `./test-results/screenshots/${name}.png`,
    fullPage: false,
  });
}

async function fullPageScreenshot(page, name) {
  await page.screenshot({
    path: `./test-results/screenshots/${name}.png`,
    fullPage: true,
  });
}

test.describe('Visual Regression - Hero Section', () => {
  test('hero EN cyberpunk desktop', async ({ page }) => {
    await freshPage(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, 'hero-en-cyberpunk');
    await expect(page.locator('h1.glitch')).toHaveText('RASMUS SYLVESTER OLSEN');
  });

  test('hero NO cyberpunk desktop', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, 'hero-no-cyberpunk');
    await expect(page.locator('h1.glitch')).toHaveText('RASMUS SYLVESTER OLSEN');
  });

  test('hero EN formal desktop', async ({ page }) => {
    await freshPage(page);
    await cycleTheme(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, 'hero-en-formal');
    await expect(page.locator('h1.glitch')).toHaveText('RASMUS SYLVESTER OLSEN');
  });

  test('hero NO formal desktop', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    await cycleTheme(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, 'hero-no-formal');
    await expect(page.locator('h1.glitch')).toHaveText('RASMUS SYLVESTER OLSEN');
  });
});

test.describe('Visual Regression - Full Page', () => {
  test('full page EN cyberpunk', async ({ page }) => {
    await freshPage(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await fullPageScreenshot(page, 'full-en-cyberpunk');
  });

  test('full page NO cyberpunk', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await fullPageScreenshot(page, 'full-no-cyberpunk');
  });

  test('full page EN formal', async ({ page }) => {
    await freshPage(page);
    await cycleTheme(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await fullPageScreenshot(page, 'full-en-formal');
  });

  test('full page NO formal', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    await cycleTheme(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await fullPageScreenshot(page, 'full-no-formal');
  });
});

test.describe('Visual Regression - Mobile', () => {
  test('hero EN cyberpunk mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await waitForRender(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, 'hero-en-cyberpunk-mobile');
  });

  test('hero NO cyberpunk mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await waitForRender(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, 'hero-no-cyberpunk-mobile');
  });
});

test.describe('Visual Regression - Individual Sections', () => {
  test('experience section scrolling', async ({ page }) => {
    await freshPage(page);
    await page.evaluate(() => {
      document.querySelector('#experience')?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await screenshot(page, 'section-experience');
  });

  test('education section scrolling', async ({ page }) => {
    await freshPage(page);
    await page.evaluate(() => {
      document.querySelector('#education')?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await screenshot(page, 'section-education');
  });

  test('skills section scrolling', async ({ page }) => {
    await freshPage(page);
    await page.evaluate(() => {
      document.querySelector('#skills')?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await screenshot(page, 'section-skills');
  });
});