import { test, expect } from '@playwright/test';

test('public error page does not expose credentials', async ({ page }) => { await page.goto('/route-that-does-not-exist'); const text = await page.locator('body').innerText(); expect(text.toLowerCase()).not.toMatch(/password|secret|authorization: bearer/); });
