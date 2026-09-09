import { test, expect } from '@playwright/test';

test('login remains usable with a long password value', async ({ page }) => { await page.goto('/login'); const password = page.locator('input[type="password"]'); await password.fill('a'.repeat(256)); await expect(password).toHaveValue('a'.repeat(256)); });
