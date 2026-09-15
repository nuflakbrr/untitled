import { test, expect } from '@playwright/test';

test('login rejects malformed email through native validation', async ({ page }) => { await page.goto('/login'); const email = page.locator('input[type="email"]'); await email.fill('invalid-email'); await expect(email).toBeVisible(); expect(await email.evaluate((input) => (input as HTMLInputElement).validity.typeMismatch)).toBeTruthy(); });
