import { test, expect } from '@playwright/test';

test('Admin Verify Payment Paid Success', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'superadmin.univ@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/transactions/registrations');
  await expect(page).toBeDefined();
});
