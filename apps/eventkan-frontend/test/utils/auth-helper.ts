import { expect, type Page } from '@playwright/test';

import { e2eConfig } from './e2e-config';

/**
 * Clears browser cookies, localStorage, and sessionStorage, then performs login cleanly.
 */
export async function loginWithCleanState(
  page: Page,
  email: string,
  password = e2eConfig.password
): Promise<void> {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email parameter provided to loginWithCleanState');
  }

  await page.context().clearCookies();
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Wait for login form inputs to be ready
  const emailInput = page.locator('#login-email');
  await expect(emailInput).toBeVisible({ timeout: 10000 });

  // Clear inputs and type fresh credentials
  await emailInput.click();
  await emailInput.fill(email);

  const passwordInput = page.locator('#login-password');
  await passwordInput.click();
  await passwordInput.fill(password);

  await page.locator('#btn-login-submit').click();

  await expect(page).not.toHaveURL('/login', { timeout: 20000 });
}
