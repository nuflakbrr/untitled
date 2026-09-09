import { test, expect } from '@playwright/test';

test('gallery empty state is rendered safely', async ({ page }) => { await page.goto('/gallery'); await expect(page.locator('body')).toBeVisible(); await expect(page.locator('body')).not.toContainText('Unhandled Runtime Error'); });
