import { test, expect } from '@playwright/test';

test('login password value is not exposed in page text', async ({ page }) => { await page.goto('/login'); const password = page.locator('input[type="password"]'); await password.fill('secret-value'); await expect(page.locator('body')).not.toContainText('secret-value'); });
