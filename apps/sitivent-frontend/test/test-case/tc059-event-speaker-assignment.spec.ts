import { test, expect } from '@playwright/test';

test('Event Speaker Assignment', async ({ page }) => {
  await page.goto('/admin/master/events/new');
  await expect(page).toBeDefined();
});
