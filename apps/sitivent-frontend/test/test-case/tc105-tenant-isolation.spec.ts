import { test, expect } from '@playwright/test';

test('admin tenant route preserves tenant context', async ({ page }) => {
  const tenantId = '00000000-0000-0000-0000-000000000000';
  await page.goto(`/admin/${tenantId}/dashboard`);
  expect(new URL(page.url()).pathname).toMatch(new RegExp(`/admin/${tenantId}/`));
});
