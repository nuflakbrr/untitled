import { test, expect } from '@playwright/test';

test('home response is available for security-header inspection', async ({ page }) => { const response = await page.goto('/'); expect(response).toBeTruthy(); });
