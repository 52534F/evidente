/**
 * CV Functional Tests
 * Comprehensive headless browser tests for RSO CV website
 */

const { test, expect } = require('@playwright/test');
const {
  freshPage,
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
} = require('./helpers');



test.describe('Page Load', () => {
  test('page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await waitForRender(page);
    const filteredErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('net::') && !e.includes('data.en.json') && !e.includes('data.no.json')
    );
    expect(filteredErrors, `Console errors found: ${filteredErrors.join(', ')}`).toHaveLength(0);
  });

  test('page has correct title', async ({ page }) => {
    await freshPage(page);
    await expect(page).toHaveTitle('RSO // CV');
  });
});

test.describe('Hero Section', () => {
  test('hero title renders from JSON', async ({ page }) => {
    await freshPage(page);
    const h1 = await getTextTrim(page, 'h1.glitch');
    expect(h1.trim()).toBe('RASMUS SYLVESTER OLSEN');
  });

  test('hero subtitle renders from JSON', async ({ page }) => {
    await freshPage(page);
    const subtitle = await getTextTrim(page, 'p.typewriter');
    expect(subtitle.trim()).not.toBe('');
  });

  test('uptime counter is present', async ({ page }) => {
    await freshPage(page);
    const uptime = await getTextTrim(page, '#uptime-value');
    const uptimeNum = parseInt(uptime.replace(/,/g, ''), 10);
    expect(uptimeNum).toBeGreaterThan(0);
  });
});

test.describe('Content Rendering', () => {
  test('section headers populate with titles and tags', async ({ page }) => {
    await freshPage(page);
    const sections = ['experience', 'education', 'skills', 'voluntary', 'projects', 'media'];
    for (const id of sections) {
      const h2 = page.locator(`section#${id} h2`);
      await expect(h2).not.toHaveText('');
    }
    const tags = await countElements(page, '.section-tag');
    expect(tags).toBe(sections.length);
  });

  test('experience section has 7 timeline items', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.timeline-item');
    expect(count).toBe(7);
  });

test('experience first item has correct year and title', async ({ page }) => {
    await freshPage(page);
    const year = await getTextTrim(page, '.timeline-item:nth-child(2) .timeline-years');
    const title = await getTextTrim(page, '.timeline-item:nth-child(2) .timeline-title');
    expect(year.trim()).toBe('2022');
    expect(title.trim()).toContain('Product Manager');
  });

  test('experience first item has description list', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.timeline-item:nth-child(2) .timeline-desc-list li');
    expect(count).toBeGreaterThan(0);
  });

  test('education section has 4 cards', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.education-card');
    expect(count).toBe(4);
  });

  test('education first card has degree and school', async ({ page }) => {
    await freshPage(page);
    const degree = await getTextTrim(page, '.education-card:first-child .education-degree');
    const school = await getTextTrim(page, '.education-card:first-child .education-school');
    expect(degree.trim()).not.toBe('');
    expect(school.trim()).not.toBe('');
  });

  test('skills section has language items', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.language-item');
    expect(count).toBeGreaterThan(0);
  });

  test('language items show proficiency bars', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.lang-fill');
    expect(count).toBeGreaterThan(0);
  });

  test('certifications render', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.cert-item');
    expect(count).toBeGreaterThan(0);
  });

  test('driver license badge renders', async ({ page }) => {
    await freshPage(page);
    const badge = await getTextTrim(page, '.license-badge');
    expect(badge.trim()).toBe('B');
  });

  test('voluntary section renders cards', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.voluntary-card');
    expect(count).toBe(3);
  });

  test('projects section renders cards', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.project-card');
    expect(count).toBe(4);
  });

  test('media section renders cards', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.media-card');
    expect(count).toBe(2);
  });

  test('top tags render from section data', async ({ page }) => {
    await freshPage(page);
    const count = await countElements(page, '.top-tags .tag');
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Language Switching', () => {
  test('initial language is English (button shows NO)', async ({ page }) => {
    await freshPage(page);
    const btn = await getTextTrim(page, '#lang-toggle');
    expect(btn.trim()).toBe('NO');
  });

  test('toggle to Norwegian updates content', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    const subtitle = await getTextTrim(page, 'p.typewriter');
    expect(subtitle.trim()).toContain('Pedagogisk');
  });

  test('toggle to Norwegian, then back to English', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    const subtitle = await getTextTrim(page, 'p.typewriter');
    expect(subtitle.trim()).toContain('Pedagogical');
  });

  test('language preference persists in localStorage', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(1000);
    const stored = await getLocalStorage(page, 'cv-lang');
    expect(stored).toBe('no');
  });

  test('experience section title updates in Norwegian', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    const h2 = await getTextTrim(page, 'section#experience h2');
    expect(h2.trim()).toBe('ERFARING');
  });

  test('education section title updates in Norwegian', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(2000);
    const h2 = await getTextTrim(page, 'section#education h2');
    expect(h2.trim()).toBe('UTDANNING');
  });

  test('loaded saved language on page reload', async ({ page }) => {
    await freshPage(page);
    await toggleLanguage(page);
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(2000);
    const subtitle = await getTextTrim(page, 'p.typewriter');
    expect(subtitle.trim()).toContain('Pedagogisk');
  });
});

test.describe('Theme Switching', () => {
  test('theme cycle button exists', async ({ page }) => {
    await freshPage(page);
    const btn = page.locator('#theme-cycle');
    await expect(btn).toBeAttached();
  });

  test('default theme is cyberpunk', async ({ page }) => {
    await freshPage(page);
    const href = await getThemeLink(page);
    expect(href).toContain('style.cyberpunk.css');
  });

  test('cycle theme switches to formal', async ({ page }) => {
    await freshPage(page);
    await cycleTheme(page);
    const href = await getThemeLink(page);
    expect(href).toContain('formal.css');
  });

  test('cycle theme twice returns to cyberpunk', async ({ page }) => {
    await freshPage(page);
    await cycleTheme(page);
    await cycleTheme(page);
    const href = await getThemeLink(page);
    expect(href).toContain('cyberpunk.css');
  });

  test('theme preference persists in localStorage', async ({ page }) => {
    await freshPage(page);
    await cycleTheme(page);
    const stored = await getLocalStorage(page, 'cv-theme');
    expect(stored).toBe('formal');
  });

  test('loaded saved theme on page reload', async ({ page }) => {
    await page.goto('/');
    await setLocalStorage(page, 'cv-theme', 'formal');
    await page.reload();
    await waitForRender(page);
    const href = await getThemeLink(page);
    expect(href).toContain('formal.css');
  });
});

test.describe('Navigation & Links', () => {
  test('email link is correct', async ({ page }) => {
    await freshPage(page);
    const href = await getAttribute(page, 'a[href^="mailto:"]', 'href');
    expect(href).toBe('mailto:rasmus@gavrilo.net');
  });

  test('phone link is correct', async ({ page }) => {
    await freshPage(page);
    const href = await getAttribute(page, 'a[href^="tel:"]', 'href');
    expect(href).toBe('tel:+4747465420');
  });

  test('linkedin link is correct', async ({ page }) => {
    await freshPage(page);
    const href = await getAttribute(page, 'a[aria-label="LinkedIn"]', 'href');
    expect(href).toContain('linkedin.com');
  });
});

test.describe('Responsive Design', () => {
  test('mobile viewport renders without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await waitForRender(page);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vpWidth = page.viewportSize().width;
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 100);
  });

  test('all sections visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await waitForRender(page);
    const sections = ['#experience', '#education', '#skills', '#voluntary', '#projects', '#media'];
    for (const sel of sections) {
      const el = page.locator(sel);
      await expect(el).toBeVisible();
    }
  });
});