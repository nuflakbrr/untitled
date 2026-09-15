import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('certificate list provides its scoped search control', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/master/certificates'));

  const search = page.getByPlaceholder('Cari No. Sertifikat, Event, atau Nama...');
  await expect(search).toBeVisible();
  await search.fill('SERTIFIKAT-TIDAK-ADA-E2E');
  await expect(search).toHaveValue('SERTIFIKAT-TIDAK-ADA-E2E');
});
