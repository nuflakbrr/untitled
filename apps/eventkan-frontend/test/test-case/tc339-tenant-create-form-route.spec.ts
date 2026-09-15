import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('tenant create form is available to root superadmin', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/managements/tenants/new'));

  await expect(page.getByRole('heading', { name: 'Tambah Tenant' })).toBeVisible();
  await expect(page.getByLabel('Nama Tenant')).toBeVisible();
});
