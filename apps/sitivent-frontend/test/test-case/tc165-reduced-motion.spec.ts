import { test, expect } from '@playwright/test';

test('content remains visible with reduced motion', async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); });
