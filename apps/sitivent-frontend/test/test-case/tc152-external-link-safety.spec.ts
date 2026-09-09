import { test, expect } from '@playwright/test';

test('public page external links are well formed', async ({ page }) => { await page.goto('/'); const links = page.locator('a[href^="http"]'); for (const link of await links.all()) expect(await link.getAttribute('href')).toMatch(/^https?:\/\//); });
