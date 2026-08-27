import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { OWNER_COOKIE, endSession, ownerCookieOptions } from '@/lib/owner-auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  const store = await cookies();
  await endSession(store.get(OWNER_COOKIE)?.value);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE, '', { ...ownerCookieOptions, maxAge: 0 });
  return res;
}
