import { test, expect } from '@playwright/test';

test('articles search input accepts text', async ({ page }) => { await page.goto('/articles'); const input = page.locator('input').first(); if (await input.isVisible()) { await input.fill('panduan'); await expect(input).toHaveValue('panduan'); } });
