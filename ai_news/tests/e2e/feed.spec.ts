import { test, expect } from '@playwright/test';

test.describe('Feed page', () => {
  test('home page loads and shows articles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /ai news/i })).toBeVisible();
    await expect(page.locator('[role="article"]').first()).toBeVisible();
  });

  test('clicking Research tab filters to research articles', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /research/i }).click();
    const badges = page.locator('[role="article"] >> text=research');
    await expect(badges.first()).toBeVisible();
  });

  test('clicking an article card navigates to detail page', async ({ page }) => {
    await page.goto('/');
    await page.locator('[role="article"]').first().click();
    await expect(page).toHaveURL(/\/article\/.+/);
    await expect(page.getByText(/AI Summary/i)).toBeVisible();
  });
});
