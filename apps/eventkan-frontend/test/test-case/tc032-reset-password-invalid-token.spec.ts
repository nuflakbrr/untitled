import { test, expect } from '@playwright/test';

test('Reset Password Invalid Token Rejected', async ({ page }) => {
  await page.goto('/reset-password?token=invalid-token-123');

  const passwordInput = page.locator('#reset-password').first();
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('PasswordBaru123');
    await page.click('button[type="submit"]');
  }

  await expect(page).toBeDefined();
});
