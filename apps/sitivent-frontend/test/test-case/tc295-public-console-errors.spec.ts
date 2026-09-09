import { test, expect } from '@playwright/test';

test('public home does not log console errors', async ({ page }) => { const errors: string[] = []; page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); }); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
