import { test, expect } from '@playwright/test';

test.describe('Bookmarks', () => {
  test('bookmarking an article and navigating to /bookmarks shows it', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('[role="article"]').first();
    const title = await firstCard.locator('h2').textContent();

    await firstCard.getByRole('button', { name: /bookmark article/i }).click();
    await expect(page.getByRole('status')).toContainText(/saved/i);

    await page.goto('/bookmarks');
    await expect(page.locator('[role="article"]')).toContainText(title!);
  });
});
