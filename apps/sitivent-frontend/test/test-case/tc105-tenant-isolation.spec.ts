import { test, expect } from '@playwright/test';

test('anonymous admin tenant route requires authentication', async ({ page }) => {
  const tenantId = '00000000-0000-0000-0000-000000000000';
  await page.goto(`/admin/${tenantId}/dashboard`);
  expect(new URL(page.url()).pathname).toBe('/login');
});
