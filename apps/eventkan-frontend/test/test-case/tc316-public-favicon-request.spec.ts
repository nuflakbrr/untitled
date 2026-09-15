import { test, expect } from '@playwright/test';

test('public page responds to favicon request without page failure', async ({ page }) => { const response = await page.request.get('/favicon.ico'); expect(response.status()).toBeLessThan(500); });
