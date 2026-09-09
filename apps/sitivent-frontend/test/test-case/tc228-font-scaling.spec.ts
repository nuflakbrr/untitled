import { test, expect } from '@playwright/test';

test('login remains visible at scaled text size', async ({ page }) => { await page.goto('/login'); await page.addStyleTag({ content: 'html { font-size: 125%; }' }); await expect(page.locator('button[type="submit"]')).toBeVisible(); });
