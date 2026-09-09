import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('payment list provides its scoped search control', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/transactions/payments'));

  const search = page.getByPlaceholder('Cari no. registrasi, event, atau peserta...');
  await expect(search).toBeVisible();
  await search.fill('REG-TIDAK-ADA-E2E');
  await expect(search).toHaveValue('REG-TIDAK-ADA-E2E');
});
