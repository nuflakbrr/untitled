import { test, expect } from '@playwright/test';

test('new-tab links have a destination', async ({ page }) => { await page.goto('/'); const links = page.locator('a[target="_blank"]'); for (const link of await links.all()) expect(await link.getAttribute('href')).toBeTruthy(); });
