import { test, expect } from '@playwright/test';

test('empty title payload does not crash list', async ({ page }) => { await page.goto('/articles'); await expect(page.locator('body')).not.toContainText('Unhandled Runtime Error'); });
