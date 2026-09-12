'use client';

import { signInAction, signUpAction, signOutAction } from '@/services/public/session';

export const signIn = {
  email: async (values: { email: string; password: string; callbackURL?: string }) => {
    try { return { data: await signInAction(values.email, values.password), error: null }; }
    catch (error) { return { data: null, error: { message: error instanceof Error && error.message === 'INVALID_CREDENTIALS' ? 'Email atau password salah.' : 'Server sedang tidak dapat dihubungi.', code: error instanceof Error && error.message === 'INVALID_CREDENTIALS' ? 'INVALID_EMAIL_OR_PASSWORD' : 'AUTH_NETWORK_ERROR', status: error instanceof Error && error.message === 'INVALID_CREDENTIALS' ? 401 : 503 } }; }
  },
};

export const signUp = {
  email: async (values: Record<string, unknown>) => {
    try { return { data: await signUpAction(values), error: null }; }
    catch (error) { return { data: null, error: { message: error instanceof Error ? error.message : 'Registrasi gagal', status: 400 } }; }
  },
};

export const signOut = async () => {
  try {
    return { ...(await signOutAction()), error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Logout gagal diproses.',
        status: 503,
      },
    };
  }
};
export const authClient = {
  signOut,
  updateUser: async (_values: unknown) => ({ error: null as { message: string; code?: string } | null }),
  changePassword: async (_values: unknown) => ({ error: null as { message: string; code?: string } | null }),
  requestPasswordReset: async (_values: unknown) => ({ error: null as { message: string; code?: string } | null }),
  resetPassword: async (_values: unknown) => ({ error: null as { message: string; code?: string } | null }),
};
