import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('root superadmin lands on its own tenant dashboard', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);

  await expect(page).toHaveURL(adminRoute(e2eConfig.rootTenantId, '/dashboard'));
  await expect(page.getByText('Dashboard', { exact: true }).first()).toBeVisible();
});
