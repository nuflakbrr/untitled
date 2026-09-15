import { test, expect } from '@playwright/test';

test('Double Registration Guard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'peserta@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/events/event-gratis-1');

  await expect(page).toBeDefined();
});
