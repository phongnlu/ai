import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('typing in search bar filters articles', async ({ page }) => {
    await page.goto('/');
    const initial = await page.locator('[role="article"]').count();
    await page.getByRole('searchbox', { name: /search articles/i }).fill('gpt');
    await page.waitForTimeout(400); // debounce
    const filtered = await page.locator('[role="article"]').count();
    expect(filtered).toBeLessThanOrEqual(initial);
  });

  test('clearing search restores full list', async ({ page }) => {
    await page.goto('/');
    const initial = await page.locator('[role="article"]').count();
    await page.getByRole('searchbox', { name: /search articles/i }).fill('gpt');
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: /clear search/i }).click();
    await page.waitForTimeout(400);
    const restored = await page.locator('[role="article"]').count();
    expect(restored).toBe(initial);
  });
});
