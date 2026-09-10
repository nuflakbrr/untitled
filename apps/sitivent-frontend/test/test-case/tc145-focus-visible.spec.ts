import { test, expect } from '@playwright/test';

test('search input can receive focus', async ({ page }) => {
  await page.goto('/events');
  const input = page.getByPlaceholder('Cari event atau lokasi...');
  await expect(input).toBeVisible();
  await input.click();
  await expect(input).toBeFocused();
});
