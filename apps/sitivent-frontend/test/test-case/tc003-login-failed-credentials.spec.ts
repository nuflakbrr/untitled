import { test, expect } from '@playwright/test';

test('Login Failed due to Invalid Credentials', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#login-email', 'wronguser@gmail.com');
  await page.fill('#login-password', 'wrongpassword');

  await page.click('#btn-login-submit');

  await expect(page).toHaveURL('/login');
});
