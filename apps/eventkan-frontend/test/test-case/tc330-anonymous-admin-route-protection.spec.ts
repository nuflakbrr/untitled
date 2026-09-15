import { test, expect } from '@playwright/test';

import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('anonymous visitor is redirected from tenant administration', async ({ page }) => {
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/managements/users'));

  await expect(page).toHaveURL(/\/login/);
});
