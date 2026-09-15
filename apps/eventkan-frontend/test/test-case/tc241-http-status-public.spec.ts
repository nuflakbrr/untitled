import { test, expect } from '@playwright/test';

test('home returns a successful status', async ({ page }) => { const response = await page.goto('/'); expect(response?.status()).toBeLessThan(400); });
