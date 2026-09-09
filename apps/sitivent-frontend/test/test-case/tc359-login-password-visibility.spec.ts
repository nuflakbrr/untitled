import { test, expect } from '@playwright/test';

test('login password visibility control changes type and accessible label', async ({ page }) => {
  await page.goto('/login');

  const password = page.locator('#login-password');
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Tampilkan password' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(page.getByRole('button', { name: 'Sembunyikan password' })).toBeVisible();
});
