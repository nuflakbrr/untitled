import { test, expect } from '@playwright/test';

test('public home renders with reduced motion preference', async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); });
