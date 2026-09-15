import { test, expect } from '@playwright/test';

test('public robots request is handled', async ({ page }) => { const response = await page.request.get('/robots.txt'); expect(response.status()).toBeLessThan(500); });
