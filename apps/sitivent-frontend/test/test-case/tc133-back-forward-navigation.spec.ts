import { test, expect } from '@playwright/test';

test('browser history navigation remains stable', async ({ page }) => {
  await page.goto('/events'); await page.goto('/articles'); await page.goBack(); await expect(page).toHaveURL(/events/); await page.goForward(); await expect(page).toHaveURL(/articles/);
});
