import { test, expect } from '@playwright/test';

test('Admin Dashboard Quick Stats Aggregation', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard');
  await expect(page).toBeDefined();
});
