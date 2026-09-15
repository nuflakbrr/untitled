import { test, expect } from '@playwright/test';

test('Banned User Login Blocked', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#login-email', 'banned.user@gmail.com');
  await page.fill('#login-password', 'password');

  await page.click('#btn-login-submit');

  await expect(page).toHaveURL('/login');
});
