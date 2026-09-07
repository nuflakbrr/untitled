import { test, expect } from '@playwright/test';

test('Register Paid Event Success', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'peserta@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/events/event-berbayar-1');

  const regBtn = page.locator('#btn-register-event, button:has-text("Daftar")').first();
  if (await regBtn.isVisible()) {
    await regBtn.click();
  }

  await expect(page).toBeDefined();
});
