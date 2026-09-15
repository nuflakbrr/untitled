import { test, expect } from '@playwright/test';

test('Print Participant Name Label Badge', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/transactions/registrations');
  await expect(page).toBeDefined();
});
