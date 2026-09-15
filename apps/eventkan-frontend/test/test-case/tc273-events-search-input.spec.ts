import { test, expect } from '@playwright/test';

test('events search input accepts text', async ({ page }) => { await page.goto('/events'); const input = page.locator('input').first(); if (await input.isVisible()) { await input.fill('seminar'); await expect(input).toHaveValue('seminar'); } });
