import { test, expect } from '@playwright/test';

test('public home renders a visible body', async ({ page }) => { await page.goto('/'); await expect(page.locator('body')).toBeVisible(); });
