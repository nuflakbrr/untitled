import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ success: false, permissions: [] }, { status: 401 });
    }

    return NextResponse.json({ success: true, permissions: session.permissions });
  } catch (error) {
    console.error('Fetch permissions error:', error);
    return NextResponse.json({ success: false, permissions: [] }, { status: 500 });
  }
}
