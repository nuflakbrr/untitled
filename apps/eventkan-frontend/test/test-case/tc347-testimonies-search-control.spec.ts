import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('testimony list provides its scoped search control', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/publications/testimonies'));

  const search = page.getByPlaceholder('Cari ulasan, nama peserta, atau event...');
  await expect(search).toBeVisible();
  await search.fill('ulasan-tidak-ada-e2e');
  await expect(search).toHaveValue('ulasan-tidak-ada-e2e');
});
