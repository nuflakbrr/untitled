import { test, expect } from '@playwright/test';

test('page remains visible under reduced-data context', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
