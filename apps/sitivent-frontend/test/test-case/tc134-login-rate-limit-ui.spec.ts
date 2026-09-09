import { test, expect } from '@playwright/test';

test('repeated invalid login stays on login page', async ({ page }) => {
  await page.goto('/login'); const email = page.locator('input[type="email"]'); const password = page.locator('input[type="password"]');
  for (let attempt = 0; attempt < 3; attempt += 1) { await email.fill(`invalid-${attempt}@example.com`); await password.fill('wrong-password'); await page.locator('button[type="submit"]').click(); }
  await expect(page).toHaveURL(/login/);
});
