import { test, expect } from '@playwright/test';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

async function startGame(page, level = 'A1') {
  await page.goto('/index.html');
  await page.selectOption('#level-select', level);
  await page.click('#start-btn');
  await page.waitForSelector('#game-screen:not(.hidden)');
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
    
    const cat = await page.evaluate(() => ({
      l1: document.querySelector('.category-level.l1')?.textContent,
      l2: document.querySelector('.category-level.l2')?.textContent,
    }));
    
    expect(cat.l1).toBeTruthy();
    expect(cat.l2).toBeTruthy();
  }
});