import { test, expect } from '@playwright/test';
import { loginWithCleanState } from '../utils/auth-helper';

test('Participant Login Success', async ({ page }) => {
  await loginWithCleanState(page, 'peserta@gmail.com', 'password');

  await expect(page).not.toHaveURL('/login');
});
