import { test, expect } from '@playwright/test';

test('events page handles a positive page query', async ({ page }) => { await page.goto('/events?page=1'); await expect(page.locator('body')).toBeVisible(); });
