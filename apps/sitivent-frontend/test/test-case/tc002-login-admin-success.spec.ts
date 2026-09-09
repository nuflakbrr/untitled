import { test, expect } from '@playwright/test';

import { e2eConfig } from '../utils/e2e-config';
import { loginWithCleanState } from '../utils/auth-helper';

test('Admin Login Success', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);

  await expect(page).toHaveURL(new RegExp(`/admin/${e2eConfig.facultyTenantId}/dashboard$`));
});
