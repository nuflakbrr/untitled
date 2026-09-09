import { test, expect } from '@playwright/test';

test('rapid navigation stays stable', async ({ page }) => { await Promise.all([page.goto('/events'), page.goto('/articles')]); await expect(page.locator('body')).toBeVisible(); });
