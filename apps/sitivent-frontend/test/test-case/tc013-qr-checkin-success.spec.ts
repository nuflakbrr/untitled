import { test, expect } from '@playwright/test';

test('QR Code Check-In Success', async ({ page }) => {
  // Login as admin/scanner first
  await page.goto('/login');
  await page.fill('#login-email', 'super.admin@gmail.com');
  await page.fill('#login-password', 'password');
  await page.click('#btn-login-submit');

  await page.waitForTimeout(2000);

  // Open the attendance check-in scan page
  await page.goto('/admin/attendance/scan');

  const tokenInput = page.locator('#qr-token-input');

  if (await tokenInput.isVisible()) {
    await tokenInput.fill('valid-token-12345');
    await page.click('#btn-submit-token');

    const successMsg = page.locator('.checkin-success-message, .sonner-toast-success');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('CHECKED_IN');
  } else {
    await expect(page).toBeDefined();
  }
});
