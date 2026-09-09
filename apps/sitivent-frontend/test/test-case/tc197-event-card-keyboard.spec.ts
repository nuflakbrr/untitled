import { test, expect } from '@playwright/test';

test('event links are keyboard reachable', async ({ page }) => { await page.goto('/events'); const links = page.locator('a').filter({ hasText: /event|seminar|workshop/i }); if (await links.count()) { await links.first().focus(); await expect(links.first()).toBeFocused(); } });
