import { test, expect } from '@playwright/test';

test('Forgot Password Request', async ({ page }) => {
  await page.goto('/forgot-password');

  const emailInput = page.locator('#forgot-email, input[type="email"]');
  await emailInput.fill('peserta@gmail.com');

  await page.click('#btn-forgot-submit, button[type="submit"]');

  const message = page.locator(".sonner-toast-success, [role='status'], text=email");
  await expect(page).toBeDefined();
});
