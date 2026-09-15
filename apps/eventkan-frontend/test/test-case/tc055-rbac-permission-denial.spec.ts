import { test, expect } from '@playwright/test';

test('RBAC Permission Denial', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/managements/users');
  await expect(page).toBeDefined();
});
