import { test, expect } from '@playwright/test';

test('event history empty state is safe', async ({ page }) => { await page.goto('/participant/event-history'); await expect(page.locator('body')).not.toContainText('Cannot read properties'); });
