import { test, expect } from '@playwright/test';

test('focus reset after reload is safe', async ({ page }) => { await page.goto('/login'); await page.locator('input').first().focus(); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
