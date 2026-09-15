import { test, expect } from '@playwright/test';

import { e2eConfig } from '../utils/e2e-config';
import { loginWithCleanState } from '../utils/auth-helper';

test('Root superadmin login success', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.rootAdminEmail);

  await expect(page).toHaveURL(new RegExp(`/admin/${e2eConfig.rootTenantId}/dashboard$`));
});
