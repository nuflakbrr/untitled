import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('article create form uses the tenant route', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);
  await page.goto(adminRoute(e2eConfig.facultyTenantId, '/publications/articles/new'));

  await expect(page.getByRole('heading', { name: 'Tambah Artikel' })).toBeVisible();
  await expect(page.locator('input[name="title"]')).toBeVisible();
});
