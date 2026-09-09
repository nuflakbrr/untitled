import { test, expect } from '@playwright/test';

test('public landmark labels are non-empty when present', async ({ page }) => { await page.goto('/'); for (const landmark of await page.locator('[aria-label]').all()) await expect(landmark).toHaveAttribute('aria-label', /.+/); });
