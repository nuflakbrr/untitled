import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('faculty superadmin can open event registrations', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);
  await page.goto(adminRoute(e2eConfig.facultyTenantId, '/transactions/registrations'));

  await expect(page.getByRole('heading', { name: /Pendaftaran Event/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Export Excel/ })).toBeVisible();
});
