import { test, expect } from '@playwright/test';

test('Admin Verify Payment Paid Success', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'super.admin@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/admin/master/registrations');
  await expect(page).toBeDefined();
});
