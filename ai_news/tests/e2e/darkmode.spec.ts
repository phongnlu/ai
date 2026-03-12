import { test, expect } from '@playwright/test';

test.describe('Dark mode', () => {
  test('clicking theme toggle adds dark class to html element', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('button', { name: /toggle theme/i }).click();
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });

  test('dark mode preference persists after page reload', async ({ page }) => {
    await page.goto('/');
    // Click twice to reach dark mode (system -> light -> dark)
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.reload();
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });
});
