import { test, expect } from '@playwright/test';

import { e2eConfig } from '../utils/e2e-config';

test('login rejects an external callback URL after successful authentication', async ({ page }) => {
  await page.goto('/login?callbackURL=https%3A%2F%2Fevil.example%2Fsteal-session');
  await page.locator('#login-email').fill(e2eConfig.rootAdminEmail);
  await page.locator('#login-password').fill(e2eConfig.password);
  await page.locator('#btn-login-submit').click();

  await expect(page).toHaveURL(new RegExp(`/admin/${e2eConfig.rootTenantId}/dashboard$`));
  await expect(new URL(page.url()).origin).toBe(
    new URL(process.env.E2E_BASE_URL ?? 'http://localhost:3000').origin
  );
});
