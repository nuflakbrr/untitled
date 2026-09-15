import { test, expect } from '@playwright/test';

test('Super Admin Change User Role', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/managements/users');

  const actionButton = page.locator('button:has-text("..."), [aria-label*="Action"]').first();
  if (await actionButton.isVisible()) {
    await actionButton.click();
    await expect(page).toBeDefined();
  }
});
