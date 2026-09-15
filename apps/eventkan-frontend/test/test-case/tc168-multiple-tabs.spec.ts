import { test, expect } from '@playwright/test';

test('two pages can render independently', async ({ browser }) => { const context = await browser.newContext(); const first = await context.newPage(); const second = await context.newPage(); await Promise.all([first.goto('/events'), second.goto('/events')]); await expect(first.locator('body')).toBeVisible(); await expect(second.locator('body')).toBeVisible(); await context.close(); });
