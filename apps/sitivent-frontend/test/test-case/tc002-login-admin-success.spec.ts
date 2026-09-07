import { test, expect } from '@playwright/test';
import { loginWithCleanState } from '../utils/auth-helper';

test('Admin Login Success', async ({ page }) => {
  await loginWithCleanState(page, 'super.admin@gmail.com', 'password');

  await expect(page).not.toHaveURL('/login');
});
