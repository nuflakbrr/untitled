import { test, expect } from '@playwright/test';

test('management users page renders soft-delete controls when available', async ({ page }) => {
  await page.goto('/admin/invalid-tenant/managements/users');
  await expect(page.locator('body')).toBeVisible();
  const tabs = page.getByText(/Data aktif|Recycle bin/);
  if (await tabs.count()) await expect(tabs.first()).toBeVisible();
});
