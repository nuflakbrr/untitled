import { test, expect } from '@playwright/test';

test('login page remains functional with an internal callback URL', async ({ page }) => {
  await page.goto('/login?callbackURL=%2Fevents');

  await expect(page.locator('#login-email')).toBeVisible();
  await expect(page.locator('#login-password')).toBeVisible();
  await expect(page.locator('#btn-login-submit')).toBeEnabled();
});
