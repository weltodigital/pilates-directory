import { NextResponse } from 'next/server'
import { field, isEmail, looksLikeBot } from '@/lib/forms'
import { OWNER_COOKIE, ownerCookieOptions, signIn } from '@/lib/owner-auth'

export const dynamic = 'force-dynamic'

const MESSAGES = {
  credentials: 'That email address and password do not match.',
  locked: 'Too many attempts. Wait a few minutes and try again.',
  no_password: 'This account has no password yet. Use the link we emailed you, or ask for a new one below.',
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (looksLikeBot(body)) return NextResponse.json({ ok: true });

  const email = field(body.email, 254);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !isEmail(email) || !password) {
    return NextResponse.json({ error: MESSAGES.credentials }, { status: 400 });
  }

  const result = await signIn(email, password, request.headers.get('user-agent'));
  if (!result.ok) {
    return NextResponse.json(
      { error: MESSAGES[result.reason] },
      { status: result.reason === 'locked' ? 429 : 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE, result.session, ownerCookieOptions);
  return res;
}
