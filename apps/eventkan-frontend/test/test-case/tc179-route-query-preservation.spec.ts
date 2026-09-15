import { test, expect } from '@playwright/test';

test('search query stays on application origin', async ({ page }) => { await page.goto('/events?search=seminar%20hybrid'); expect(new URL(page.url()).origin).toBe('http://localhost:3000'); });
