import { test, expect } from '@playwright/test';

test('event navigation link is keyboard reachable', async ({ page }) => {
  await page.goto('/events');
  const link = page.getByRole('link', { name: 'Event', exact: true }).first();
  await expect(link).toBeVisible();
  await link.focus();
  await expect(link).toBeFocused();
});
