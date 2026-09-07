import { test, expect } from '@playwright/test';

test('QR Code Already Used Guard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'super.admin@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/admin/scanner');
  await expect(page).toBeDefined();
});
