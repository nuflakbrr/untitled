import { test, expect } from '@playwright/test';

test('Register Participant Duplicate Email', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#reg-name', 'Peserta Duplikat');
  await page.fill('#reg-email', 'peserta@gmail.com');
  await page.fill('#reg-password', 'Password123');

  await page.click('#btn-register-submit');

  // Wait for auth API response to finish so server DB transaction completes
  await page
    .waitForResponse((res) => res.url().includes('/api/auth'), { timeout: 5000 })
    .catch(() => {});

  // Should remain on register page
  await expect(page).toHaveURL('/register');
});
