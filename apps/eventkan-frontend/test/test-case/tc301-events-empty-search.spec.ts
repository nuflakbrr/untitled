import { test, expect } from '@playwright/test';

test('events page handles an empty supported search query', async ({ page }) => {
  await page.goto('/events?q=');
  await expect(page).toHaveURL(/\/events\?q=$/);
  await expect(page.getByPlaceholder('Cari event atau lokasi...')).toHaveValue('');
});
