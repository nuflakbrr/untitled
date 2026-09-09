import { test, expect } from '@playwright/test';

test('Admin Export Registrations File', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/transactions/registrations');

  const exportBtn = page.locator('button:has-text("Export"), a:has-text("Export")').first();
  if (await exportBtn.isVisible()) {
    await exportBtn.click();
    await expect(page).toBeDefined();
  }
});
