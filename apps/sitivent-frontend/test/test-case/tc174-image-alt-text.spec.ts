import { test, expect } from '@playwright/test';

test('images expose alternative text', async ({ page }) => { await page.goto('/'); for (const image of await page.locator('img').all()) expect((await image.getAttribute('alt')) ?? '').not.toBe(''); });
