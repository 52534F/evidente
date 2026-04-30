/**
 * Test Helpers
 * Shared utility functions for Playwright tests
 */

async function waitForContent(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { timeout, state: 'attached' });
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout });
  return el;
}

async function waitForRender(page, timeout = 15000) {
  await page.waitForSelector('.timeline-item', { timeout, state: 'attached' });
  await page.waitForTimeout(500);
}

async function getTextTrim(page, selector) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'attached' });
  return el.textContent();
}

async function countElements(page, selector) {
  return page.locator(selector).count();
}

async function getAttribute(page, selector, attr) {
  return page.locator(selector).first().getAttribute(attr);
}

async function getLocalStorage(page, key) {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

async function setLocalStorage(page, key, value) {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, v),
    { k: key, v: value }
  );
}

async function clearLocalStorage(page) {
  try {
    await page.evaluate(() => localStorage.clear());
  } catch {
  }
}

async function toggleLanguage(page) {
  const btn = page.locator('#lang-toggle');
  await btn.waitFor({ state: 'attached' });
  await btn.click();
  await page.waitForTimeout(500);
}

async function cycleTheme(page) {
  const btn = page.locator('#theme-cycle');
  await btn.waitFor({ state: 'attached' });
  await btn.click();
  await page.waitForTimeout(300);
}

async function getThemeLink(page) {
  return page.locator('#theme-styles').getAttribute('href');
}

async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
}

async function freshPage(page) {
  await page.goto('/');
  await page.waitForSelector('.timeline-item', { timeout: 15000 });
  await page.waitForTimeout(300);
}

module.exports = {
  freshPage,
  waitForContent,
  waitForRender,
  getTextTrim,
  countElements,
  getAttribute,
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
  toggleLanguage,
  cycleTheme,
  getThemeLink,
};