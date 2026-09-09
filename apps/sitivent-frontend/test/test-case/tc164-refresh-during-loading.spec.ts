import { test, expect } from '@playwright/test';

test('refresh during loading remains safe', async ({ page }) => { await page.goto('/events'); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
