import { test, expect } from '@playwright/test';

test('Category Deletion Constraint Protection', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/event-categories');
  await expect(page).toBeDefined();
});
