import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('faculty superadmin lands on its own tenant dashboard', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);

  await expect(page).toHaveURL(adminRoute(e2eConfig.facultyTenantId, '/dashboard'));
  await expect(page.getByText('Dashboard', { exact: true }).first()).toBeVisible();
});
