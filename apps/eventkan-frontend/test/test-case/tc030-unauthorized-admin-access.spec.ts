import { test, expect } from '@playwright/test';

test('Unauthorized Admin Page Access Blocked', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard');

  await expect(page).not.toHaveURL('/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard');
});
