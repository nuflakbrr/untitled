import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('event category list provides its scoped search control', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);
  await page.goto(adminRoute(e2eConfig.rootTenantId, '/master/event-categories'));

  const search = page.getByPlaceholder('Cari kategori...');
  await expect(search).toBeVisible();
  await search.fill('tidak-ada-kategori-e2e');
  await expect(search).toHaveValue('tidak-ada-kategori-e2e');
});
