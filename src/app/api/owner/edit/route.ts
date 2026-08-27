import { NextResponse } from 'next/server'
import { field, serverClient } from '@/lib/forms'
import { getOwner, ownsStudio } from '@/lib/owner-auth'
import { notifyAdmin, siteUrl } from '@/lib/email'
import { EDITABLE_FIELDS, EDITABLE_KEYS, parseValue, sameValue } from '@/lib/editable'

export const dynamic = 'force-dynamic'

/**
 * POST /api/owner/edit
 *
 * Queues an owner's changes for review. Nothing here touches the live
 * listing: an owner is the best source we have for their own details, but
 * "best source" is not the same as "unreviewed write access to a public
 * directory", and the review step is what keeps the two apart.
 */
export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const studioId = field(body.studio_id, 40);
  if (!studioId) return NextResponse.json({ error: 'Missing studio.' }, { status: 400 });
  if (!(await ownsStudio(owner.id, studioId))) {
    return NextResponse.json({ error: 'That is not one of your listings.' }, { status: 403 });
  }

  const submitted = (body.changes && typeof body.changes === 'object')
    ? body.changes as Record<string, unknown>
    : {};

  const { data: studio } = await supabase
    .from('pilates_studios')
    .select(['id', 'name', 'full_url_path', ...EDITABLE_KEYS].join(','))
    .eq('id', studioId)
    .single();
  if (!studio) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });

  // Validate everything before recording anything, so a single bad field does
  // not leave the owner with a half-saved edit.
  const errors: Record<string, string> = {};
  const parsed: Record<string, unknown> = {};

  for (const spec of EDITABLE_FIELDS) {
    if (!(spec.key in submitted)) continue;
    const result = parseValue(spec, submitted[spec.key]);
    if ('error' in result) errors[spec.key] = result.error;
    else parsed[spec.key] = result.value;
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Only what actually differs, so review shows the change and not the form.
  const changes: Record<string, unknown> = {};
  const previous: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed)) {
    const current = (studio as any)[key] ?? null;
    if (sameValue(current, value)) continue;
    changes[key] = value;
    previous[key] = current;
  }

  if (!Object.keys(changes).length) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  // Replace any edit of this listing still waiting, rather than queueing a
  // second one: approving them in the wrong order would republish stale values.
  await supabase
    .from('studio_edits')
    .update({ status: 'withdrawn', reviewed_at: new Date().toISOString() })
    .eq('studio_id', studioId)
    .eq('status', 'pending');

  const { error } = await supabase.from('studio_edits').insert({
    studio_id: studioId,
    owner_id: owner.id,
    changes,
    previous,
    note: field(body.note, 1000),
  });

  if (error) {
    console.error('Edit insert failed:', error.message);
    return NextResponse.json({ error: 'We could not save your changes. Please try again.' }, { status: 500 });
  }

  await notifyAdmin(
    `Edit pending: ${(studio as any).name}`,
    [
      `${owner.name || owner.email} changed ${Object.keys(changes).length} field(s) on ${(studio as any).name}.`,
      '',
      Object.keys(changes).map(k => `  - ${k}`).join('\n'),
      '',
      `Review: ${siteUrl()}/admin/edits`,
    ].join('\n')
  );

  return NextResponse.json({ ok: true, fields: Object.keys(changes).length });
}
