import { test, expect } from '@playwright/test';

test('Create Event Invalid Dates Error', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/events/new');

  const startDateInput = page.locator('input[name="startDate"], #startDate');
  if (await startDateInput.isVisible()) {
    await startDateInput.fill('2026-10-10T10:00');
    await page.fill('input[name="endDate"], #endDate', '2026-10-05T10:00');
    await page.click('button[type="submit"]');

    const error = page.locator('text=tanggal, text=sebelum');
    await expect(error).toBeVisible();
  }
});
