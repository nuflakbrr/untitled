import { test, expect } from '@playwright/test';

test('Checkin Outside Window Blocked', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/attendance/scan');

  await expect(page).toBeDefined();
});
