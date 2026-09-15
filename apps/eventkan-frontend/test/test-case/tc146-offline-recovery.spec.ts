import { test, expect } from '@playwright/test';

test('page remains usable after offline recovery', async ({ page, context }) => { await page.goto('/events'); await context.setOffline(true); await context.setOffline(false); await expect(page.locator('body')).toBeVisible(); });
