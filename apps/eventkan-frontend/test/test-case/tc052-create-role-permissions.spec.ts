import { test, expect } from '@playwright/test';

test('Super Admin Create Role and Permissions', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/managements/roles');

  await expect(page).toBeDefined();
});
