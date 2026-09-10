import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig, adminRoute } from '../utils/e2e-config';

test('gallery create form marks image upload as required', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.facultyAdminEmail);
  await page.goto(adminRoute(e2eConfig.facultyTenantId, '/master/galleries/new'));

  await expect(page.getByRole('heading', { name: 'Tambah Foto' })).toBeVisible();
  await expect(page.getByText(/Cover \/ Gambar Thumbnail/)).toContainText('*');
  await expect(page.locator('input[type="file"][accept="image/*"]')).toHaveCount(1);
});
