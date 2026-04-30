const { test, expect } = require('@playwright/test');

test('language flag button shows dropdown', async ({ page }) => {
  await page.goto('/index.html');
  
  // Wait for language to load
  await page.waitForFunction(() => {
    const flag = document.querySelector('#current-flag');
    return flag && flag.textContent.length > 0;
  }, { timeout: 10000 });
  
  // Click language flag button
  await page.click('#language-flag-btn');
  
  // Dropdown should be visible
  await expect(page.locator('#language-dropdown')).not.toHaveClass(/hidden/);
  
  // Click a language option
  await page.locator('#language-dropdown .language-option').first().click();
  
  // Dropdown should close
  await expect(page.locator('#language-dropdown')).toHaveClass(/hidden/);
});

test('level indicator button shows dropdown', async ({ page }) => {
  await page.goto('/index.html');
  
  // Wait for level to be populated
  await page.waitForFunction(() => {
    const select = document.querySelector('#level-select');
    return select && select.options.length > 0;
  }, { timeout: 10000 });
  
  await page.selectOption('#level-select', 'A1');
  await page.click('#start-btn');
  await page.waitForSelector('#game-screen:not(.hidden)');
  
  // Click level indicator button
  await page.click('#level-indicator-btn');
  
  // Dropdown should be visible
  await expect(page.locator('#level-dropdown')).not.toHaveClass(/hidden/);
  
  // Click a level option
  await page.locator('#level-dropdown .level-option').first().click();
  
  // Dropdown should close
  await expect(page.locator('#level-dropdown')).toHaveClass(/hidden/);
});
