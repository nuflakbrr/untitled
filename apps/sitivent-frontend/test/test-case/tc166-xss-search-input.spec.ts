import { test, expect } from '@playwright/test';

test('search input does not execute markup', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/events'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) await input.fill('<script>throw new Error("xss")</script>'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
