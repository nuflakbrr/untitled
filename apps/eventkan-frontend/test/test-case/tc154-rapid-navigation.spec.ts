import { test, expect } from '@playwright/test';

test('sequential navigation stays stable', async ({ page }) => {
  await page.goto('/events');
  await expect(page).toHaveURL(/\/events$/);
  await page.goto('/articles');
  await expect(page).toHaveURL(/\/articles$/);
  await expect(page.locator('body')).toBeVisible();
});
