import { test, expect } from '@playwright/test';

test('unknown event status is handled', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).not.toContainText('Unhandled Runtime Error'); });
