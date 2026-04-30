import { test, expect } from '@playwright/test';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

async function startGame(page, level = 'A1') {
  await page.goto('/index.html');

  // Wait for language to load (flag appears = language module loaded)
  await page.waitForFunction(() => {
    const flag = document.querySelector('#current-flag');
    return flag && flag.textContent.length > 0;
  }, { timeout: 10000 });

  // Wait for level dropdown to be populated (check option count, not visibility)
  await page.waitForFunction(() => {
    const select = document.querySelector('#level-select');
    return select && select.options.length > 0;
  }, { timeout: 10000 });
  await page.selectOption('#level-select', level);

  await page.click('#start-btn');
  await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 10000 });
}

async function getQuestionData(page) {
  return page.evaluate(() => {
    const blocksEl = document.querySelector('#syntax-blocks');
    const blocks = Array.from(blocksEl.children).map(el => ({
      text: el.textContent,
      role: el.dataset.role,
      replyIndex: el.dataset.replyIndex || null
    }));
    
    const cat = {
      l1: document.querySelector('.category-level.l1')?.textContent || '',
      l2: document.querySelector('.category-level.l2')?.textContent || '',
      l3: document.querySelector('.category-level.l3')?.textContent || ''
    };
    
    return { blocks, cat };
  });
}

for (const level of LEVELS) {
  test(`${level} generates questions`, async ({ page }) => {
    await startGame(page, level);

    // Wait for syntax blocks to be rendered
    await page.waitForSelector('#syntax-blocks .syntax-block', { timeout: 10000 });

    const data = await getQuestionData(page);
    expect(data.blocks.length).toBeGreaterThan(0);
    expect(data.cat.l2).toBeTruthy();
  });
}

test('clicking answer shows feedback', async ({ page }) => {
  await startGame(page, 'A1');
  
  await page.locator('.answer-btn').first().click();
  await page.waitForTimeout(500);
  
  const feedbackVisible = await page.isVisible('#feedback-overlay:not(.hidden)');
  expect(feedbackVisible).toBe(true);
});

test('category levels display correctly', async ({ page }) => {
  for (const level of ['A1', 'A2', 'B1']) {
    await startGame(page, level);

    // Wait for category to be rendered
    await page.waitForSelector('.category-level.l1:not(:empty)', { timeout: 10000 });

    const cat = await page.evaluate(() => ({
      l1: document.querySelector('.category-level.l1')?.textContent,
      l2: document.querySelector('.category-level.l2')?.textContent,
    }));

    expect(cat.l1).toBeTruthy();
    expect(cat.l2).toBeTruthy();
  }
});