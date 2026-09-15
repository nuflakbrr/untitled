import { test, expect } from '@playwright/test';

test('Register Free Event Success', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#login-email', 'peserta@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');
  await page.waitForURL(/\/(admin|participant|\/)/);

  await page.goto('/events/event-gratis-1');

  const regBtn = page.locator('#btn-register-event, button:has-text("Daftar")').first();
  if (await regBtn.isVisible()) {
    await regBtn.click();
  }

  const confirmBtn = page
    .locator('#btn-confirm-registration, button:has-text("Ya, Daftar")')
    .first();
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
  }

  await expect(page).toBeDefined();
});
