import { NextResponse } from 'next/server'
import { field } from '@/lib/forms'
import { OWNER_COOKIE, ownerCookieOptions, setPasswordWithToken } from '@/lib/owner-auth'
import { passwordProblem } from '@/lib/password'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const token = field(body.token, 200);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!token) {
    return NextResponse.json({ error: 'That link is not valid.' }, { status: 400 });
  }

  const problem = passwordProblem(password);
  if (problem) {
    return NextResponse.json({ errors: { password: problem } }, { status: 400 });
  }

  const session = await setPasswordWithToken(token, password, request.headers.get('user-agent'));
  if (!session) {
    return NextResponse.json(
      { error: 'That link has expired or has already been used. Ask for a new one.' },
      { status: 400 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE, session, ownerCookieOptions);
  return res;
}
