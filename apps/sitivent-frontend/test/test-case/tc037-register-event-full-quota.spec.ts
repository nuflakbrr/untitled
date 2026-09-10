import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';
import { e2eConfig } from '../utils/e2e-config';

test('Register Event Full Quota Blocked', async ({ page }) => {
  await loginWithCleanState(page, e2eConfig.participantEmail);
  await page.goto('/events/event-kuota-penuh-e2e');

  const fullEventButton = page.getByRole('button', { name: 'Kuota Penuh' });
  await expect(fullEventButton).toBeVisible();
  await expect(fullEventButton).toBeDisabled();
});
