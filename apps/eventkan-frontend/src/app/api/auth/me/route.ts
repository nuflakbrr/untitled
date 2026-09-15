import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { hasAdminRole } from '@/lib/roles';

export async function GET() {
  try {
    const session = await auth.api.getSession();

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({ isAdmin: hasAdminRole(session.roles) });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
