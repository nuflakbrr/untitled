import { test, expect } from '@playwright/test';

test('Terms and Privacy Legal Pages Accessible', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /Syarat & Ketentuan/ })).toBeVisible();
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: /Kebijakan Privasi/ })).toBeVisible();
});
