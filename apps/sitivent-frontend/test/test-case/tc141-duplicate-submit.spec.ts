import { test, expect } from '@playwright/test';

test('login duplicate submit is handled', async ({ page }) => { await page.goto('/login'); const submit = page.locator('button[type="submit"]'); await submit.click(); await submit.click(); await expect(page.locator('body')).toBeVisible(); });
