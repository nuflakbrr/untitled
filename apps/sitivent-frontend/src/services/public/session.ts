'use server';

import { auth } from '@/lib/auth';

export async function signInAction(email: string, password: string) {
  return auth.api.signInEmail({ body: { email, password } });
}

export async function signOutAction() {
  return auth.api.signOut();
}

export async function signUpAction(values: Record<string, unknown>) {
  return auth.api.signUpEmail({ body: values });
}
