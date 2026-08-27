import { NextResponse } from 'next/server'
import { field, isEmail, looksLikeBot, submitterHash } from '@/lib/forms'
import { requestPasswordLink } from '@/lib/owner-auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/owner/forgot
 *
 * Always answers the same way. Whether an address belongs to a studio owner
 * is not something an anonymous caller gets to find out by asking.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (looksLikeBot(body)) return NextResponse.json({ ok: true });

  const email = field(body.email, 254);
  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { errors: { email: 'Enter a valid email address.' } },
      { status: 400 }
    );
  }

  await requestPasswordLink(email, 'reset', submitterHash(request));
  return NextResponse.json({ ok: true });
}
