import { NextResponse } from 'next/server'
import { OWNER_COOKIE, consumeLoginToken, ownerCookieOptions } from '@/lib/owner-auth'

export const dynamic = 'force-dynamic'

/**
 * The target of the emailed sign-in link. One use, then the token is spent.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  const base = new URL(request.url).origin;

  if (!token) return NextResponse.redirect(`${base}/studio-login?error=missing`);

  const session = await consumeLoginToken(token, request.headers.get('user-agent'));
  if (!session) return NextResponse.redirect(`${base}/studio-login?error=expired`);

  const res = NextResponse.redirect(`${base}/dashboard`);
  res.cookies.set(OWNER_COOKIE, session, ownerCookieOptions);
  return res;
}
