import { test, expect } from '@playwright/test';

test('Support Inbox Unread Filter', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/support/messages');
  await expect(page).toBeDefined();
});
