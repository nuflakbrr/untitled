import { expect, type Page } from '@playwright/test';

/**
 * Clears browser cookies, localStorage, and sessionStorage, then performs login cleanly.
 */
export async function loginWithCleanState(
  page: Page,
  email: string,
  password = 'password'
): Promise<void> {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email parameter provided to loginWithCleanState');
  }

  // Wipe React client router state by navigating to blank page first
  await page.goto('about:blank').catch(() => {});
  await page.context().clearCookies();
  await page.goto('/login');
  await page
    .evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
    })
    .catch(() => {});

  // Wait for login form inputs to be ready
  const emailInput = page.locator('#login-email');
  await expect(emailInput).toBeVisible({ timeout: 10000 });

  // Clear inputs and type fresh credentials
  await emailInput.click();
  await emailInput.fill(email);

  const passwordInput = page.locator('#login-password');
  await passwordInput.click();
  await passwordInput.fill(password);

  // Click login submit
  await page.click('#btn-login-submit');

  // Self-healing re-submit if server rate limit or cookie propagation delayed the first submit
  try {
    await page.waitForURL((url) => url.pathname !== '/login', { timeout: 4000 });
  } catch (e) {
    if (page.url().includes('/login')) {
      await passwordInput.fill(password);
      await page.click('#btn-login-submit').catch(() => {});
    }
  }

  await expect(page).not.toHaveURL('/login', { timeout: 20000 });
}
