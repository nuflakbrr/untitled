import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('participant create form is isolated under the tenant route', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/managements/participants/new'));

  await expect(page.getByRole('heading', { name: 'Tambah Pengguna' })).toBeVisible();
});
