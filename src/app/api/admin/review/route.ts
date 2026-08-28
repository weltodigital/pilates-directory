import { NextResponse } from 'next/server'
import { field, serverClient } from '@/lib/forms'
import { isAdmin } from '@/lib/admin-auth'
import {
  approveClaim, approveEdit, approvePhoto, approveSubmission,
  rejectClaim, rejectEdit, rejectPhoto, rejectSubmission,
} from '@/lib/review'

export const dynamic = 'force-dynamic'

/**
 * The single write endpoint behind the review screens.
 *
 * Approving is the only thing on this site that publishes public input, so
 * it lives in one route with one authorisation check rather than being spread
 * across a handler per queue.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const supabase = serverClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const kind = field(body.kind, 20);
  const id = field(body.id, 40);
  const action = field(body.action, 20);
  const note = field(body.note, 1000);

  if (!id || !kind || !action) {
    return NextResponse.json({ error: 'Missing kind, id or action.' }, { status: 400 });
  }

  let result;
  if (kind === 'submission') {
    if (action === 'approve') {
      result = await approveSubmission(supabase, id, {
        countySlug: field(body.county_slug, 80) || '',
        cityName: field(body.city_name, 120) || '',
        note,
      });
    } else if (action === 'reject' || action === 'duplicate') {
      result = await rejectSubmission(supabase, id, action === 'duplicate' ? 'duplicate' : 'rejected', note);
    }
  } else if (kind === 'claim') {
    if (action === 'approve') result = await approveClaim(supabase, id, note);
    else if (action === 'reject') result = await rejectClaim(supabase, id, note);
  } else if (kind === 'edit') {
    if (action === 'approve') result = await approveEdit(supabase, id, note);
    else if (action === 'reject') result = await rejectEdit(supabase, id, note);
  } else if (kind === 'photo') {
    if (action === 'approve') result = await approvePhoto(supabase, id, note);
    else if (action === 'reject') result = await rejectPhoto(supabase, id, note);
  }

  if (!result) {
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  }
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: result.message, path: result.path });
}
