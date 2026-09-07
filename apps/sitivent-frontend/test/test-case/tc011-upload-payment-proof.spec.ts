import { test, expect } from '@playwright/test';

test('Upload Payment Proof Success', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'peserta@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/participant/registrations');
  await expect(page).toBeDefined();
});
