import { test, expect } from '@playwright/test';

test('login fields expose their labels and validation form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('label[for="login-email"]')).toHaveText('Email');
  await expect(page.locator('label[for="login-password"]')).toHaveText('Password');
  await expect(page.locator('#btn-login-submit')).toBeVisible();
});
