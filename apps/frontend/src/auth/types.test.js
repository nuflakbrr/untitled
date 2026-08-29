// eslint-disable-next-line import/no-unresolved
import { test, expect, describe } from 'bun:test';

import { safeReturnTo, hasPermission, sessionSchema } from './types';

const session = sessionSchema.parse({
  user: {
    id: 'user-1',
    email: 'user@example.com',
    name: 'User',
    email_verified: true,
    role: 'panitia',
    role_id: 'role-1',
  },
  tenant: null,
  role: 'panitia',
  permissions: ['events.read'],
  is_super_admin: false,
});

describe('auth guards', () => {
  test('matches PBAC permissions and superadmin bypass', () => {
    expect(hasPermission(session, 'events.read')).toBe(true);
    expect(hasPermission(session, 'events.delete')).toBe(false);
    expect(hasPermission({ ...session, is_super_admin: true }, 'events.delete')).toBe(true);
  });

  test('accepts only local return URLs', () => {
    expect(safeReturnTo('/dashboard/events?tab=active')).toBe('/dashboard/events?tab=active');
    expect(safeReturnTo('//evil.example')).toBe('/dashboard');
    expect(safeReturnTo('/\\evil.example')).toBe('/dashboard');
    expect(safeReturnTo('///[')).toBe('/dashboard');
    expect(safeReturnTo('https://evil.example')).toBe('/dashboard');
  });
});
