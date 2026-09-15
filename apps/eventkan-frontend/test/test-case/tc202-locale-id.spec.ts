import { test, expect } from '@playwright/test';

test('public page renders Indonesian UI text', async ({ page }) => { await page.goto('/'); await expect(page.locator('body')).toContainText(/Beranda|Event|Artikel|Galeri/i); });
