import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('faculty superadmin can open support inbox', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);
  await page.goto(adminRoute(e2eConfig.facultyTenantId, '/support/messages'));

  await expect(page.getByRole('heading', { name: /Inbox Pengaduan/ })).toBeVisible();
});
