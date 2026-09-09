import { test, expect } from '@playwright/test';

test('login password accepts special characters', async ({ page }) => { await page.goto('/login'); const password = page.locator('input[type="password"]'); await password.fill('P@ss!<&>"'); await expect(password).toHaveValue('P@ss!<&>"'); });
