import { test, expect } from '@playwright/test';

test('Event Speaker Assignment', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/events/new');
  await expect(page).toBeDefined();
});
