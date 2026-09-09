import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('root superadmin can open organization management', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/managements/tenants'));

  await expect(page.getByRole('heading', { name: /Organisasi/ })).toBeVisible();
  await expect(page.getByText('Data aktif', { exact: true })).toBeVisible();
  await expect(page.getByText('Recycle bin', { exact: true })).toBeVisible();
});
