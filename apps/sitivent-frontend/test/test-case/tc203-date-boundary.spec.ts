import { test, expect } from '@playwright/test';

test('unsupported date query at a day boundary is safe', async ({ page }) => {
  await page.goto('/events?date=1970-01-01T00:00:00.000Z');
  await expect(page).toHaveURL(/\/events\?date=1970-01-01T00:00:00\.000Z$/);
  await expect(page.getByRole('heading', { name: 'Jelajahi Event Pilihan' })).toBeVisible();
});
