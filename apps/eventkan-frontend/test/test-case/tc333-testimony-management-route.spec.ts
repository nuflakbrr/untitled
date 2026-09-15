import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('faculty superadmin can open testimony management', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);
  await page.goto(adminRoute(e2eConfig.facultyTenantId, '/publications/testimonies'));

  await expect(page.getByRole('heading', { name: /Ulasan & Testimoni/ })).toBeVisible();
});
