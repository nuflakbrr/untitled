import { test, expect } from '@playwright/test';

test('zero-quota event payload is safe', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).not.toContainText('Unhandled Runtime Error'); });
