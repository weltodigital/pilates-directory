import { NextResponse } from 'next/server'
import {
  serverClient, field, isEmail, normaliseUrl, normalisePostcode, lookupPostcode,
  submitterHash, isRateLimited, looksLikeBot, cleanClassTypes,
} from '@/lib/forms'
import { notifyAdmin, siteUrl } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * POST /api/submit-studio
 *
 * Accepts a proposed studio into studio_submissions for review. Nothing here
 * writes to pilates_studios: submissions are promoted by hand.
 */
export async function POST(request: Request) {
  const supabase = serverClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Submissions are unavailable right now.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Silently accept and discard bot traffic: telling it what failed only
  // helps it try again.
  if (looksLikeBot(body)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name, 200);
  const contactName = field(body.contact_name, 120);
  const contactEmail = field(body.contact_email, 254);
  const rawPostcode = field(body.postcode, 12);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Enter the studio name.';
  if (!contactName) errors.contact_name = 'Enter your name.';
  if (!contactEmail) errors.contact_email = 'Enter your email address.';
  else if (!isEmail(contactEmail)) errors.contact_email = 'Enter a valid email address.';

  const postcode = normalisePostcode(rawPostcode);
  if (!rawPostcode) errors.postcode = 'Enter the studio postcode.';
  else if (!postcode) errors.postcode = 'That does not look like a UK postcode.';

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const hash = submitterHash(request);
  if (await isRateLimited(supabase, 'studio_submissions', hash)) {
    return NextResponse.json(
      { error: 'You have submitted several studios recently. Please try again later.' },
      { status: 429 }
    );
  }

  // Confirm the postcode exists, and use it for the town and county rather
  // than trusting free text.
  const place = await lookupPostcode(postcode!);
  if (!place) {
    return NextResponse.json(
      { errors: { postcode: 'We could not find that postcode. Please check it.' } },
      { status: 400 }
    );
  }

  // Flag a likely duplicate for the reviewer rather than rejecting outright:
  // a second studio at one address is plausible.
  let duplicateId: string | null = null;
  let duplicateName: string | null = null;
  const { data: nearby } = await supabase
    .from('pilates_studios')
    .select('id,name,full_url_path')
    .eq('is_active', true)
    .ilike('postcode', postcode!)
    .limit(20);

  if (nearby?.length) {
    const target = name!.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hit = nearby.find((s: any) => {
      const existing = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return existing.includes(target) || target.includes(existing);
    });
    if (hit) { duplicateId = hit.id; duplicateName = hit.name; }
  }

  const { error } = await supabase.from('studio_submissions').insert({
    name,
    address: field(body.address, 300),
    postcode,
    town: field(body.town, 120) || place.town,
    county: place.county,
    website: normaliseUrl(field(body.website, 300)),
    phone: field(body.phone, 40),
    class_types: cleanClassTypes(body.class_types),
    contact_name: contactName,
    contact_email: contactEmail!.toLowerCase(),
    contact_role: field(body.contact_role, 80),
    message: field(body.message, 2000),
    possible_duplicate_id: duplicateId,
    submitter_hash: hash,
    user_agent: request.headers.get('user-agent')?.slice(0, 300) || null,
  });

  if (error) {
    console.error('Studio submission failed:', error.message);
    return NextResponse.json({ error: 'We could not save your submission. Please try again.' }, { status: 500 });
  }

  await notifyAdmin(
    `Studio submitted: ${name}`,
    [
      `${contactName} <${contactEmail}> submitted ${name}, ${postcode}.`,
      duplicateName ? `\nPossible duplicate of ${duplicateName}.` : '',
      '',
      `Review: ${siteUrl()}/admin/submissions`,
    ].filter(Boolean).join('\n')
  );

  return NextResponse.json({
    ok: true,
    duplicate: duplicateName ? { name: duplicateName } : null,
  });
}
