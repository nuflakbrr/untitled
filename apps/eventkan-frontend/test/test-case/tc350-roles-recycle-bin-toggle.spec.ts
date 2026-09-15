import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('role management switches between active data and recycle bin', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/managements/roles'));

  const recycleBin = page.getByRole('button', { name: 'Recycle bin' });
  await recycleBin.click();
  await expect(recycleBin).toBeVisible();
  await page.getByRole('button', { name: 'Data aktif' }).click();
  await expect(page.getByRole('button', { name: 'Data aktif' })).toBeVisible();
});
