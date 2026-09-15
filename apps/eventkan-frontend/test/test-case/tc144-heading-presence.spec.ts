import { test, expect } from '@playwright/test';

test('events page has a visible heading', async ({ page }) => { await page.goto('/events'); await expect(page.locator('h1, h2, [role="heading"]').first()).toBeVisible(); });
