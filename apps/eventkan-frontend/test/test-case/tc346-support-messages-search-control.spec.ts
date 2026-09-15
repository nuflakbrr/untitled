import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('support inbox provides its scoped search control', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/support/messages'));

  const search = page.getByPlaceholder('Cari nama, email, subjek...');
  await expect(search).toBeVisible();
  await search.fill('pesan-tidak-ada-e2e');
  await expect(search).toHaveValue('pesan-tidak-ada-e2e');
});
