import { test, expect } from '@playwright/test';

test('events page safely ignores an unsupported negative page query', async ({ page }) => {
  await page.goto('/events?page=-1');
  await expect(page).toHaveURL(/\/events\?page=-1$/);
  await expect(page.getByRole('heading', { name: 'Jelajahi Event Pilihan' })).toBeVisible();
});
