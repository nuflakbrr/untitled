import { test, expect } from '@playwright/test';

test('login required fields are marked', async ({ page }) => { await page.goto('/login'); const required = page.locator('input[required]'); await expect(required.first()).toBeVisible(); });
