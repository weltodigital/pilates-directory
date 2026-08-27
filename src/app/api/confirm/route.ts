import { NextResponse } from 'next/server'
import { field, serverClient } from '@/lib/forms'
import { consumeVerification } from '@/lib/verification'

export const dynamic = 'force-dynamic'

/**
 * POST /api/confirm
 *
 * A button, not a link. Mail scanners follow links in email as a matter of
 * course, and a link that confirms on being fetched would be confirmed by
 * software rather than by the person we are trying to reach.
 */
export async function POST(request: Request) {
  const supabase = serverClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Unavailable right now.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const token = field(body.token, 200);
  if (!token) return NextResponse.json({ error: 'That link is not valid.' }, { status: 400 });

  const result = await consumeVerification(supabase, token);
  if (!result) {
    return NextResponse.json(
      { error: 'That link has expired or has already been used.' },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, kind: result.kind, studio: result.studioName });
}
