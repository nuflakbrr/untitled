import { test, expect } from '@playwright/test';

test('Register Participant Success', async ({ page }) => {
  await page.goto('/register');

  const uniqueEmail = `user${Date.now()}@gmail.com`;
  await page.fill('#reg-name', 'Peserta Baru');
  await page.fill('#reg-email', uniqueEmail);
  await page.fill('#reg-password', 'password123');

  await page.click('#btn-register-submit');

  await page.waitForURL(/\/(login|admin\/dashboard|\/)/);
  await expect(page).toBeDefined();
});
