import { NextResponse } from 'next/server'
import {
  serverClient, field, isEmail, submitterHash, isRateLimited, looksLikeBot,
} from '@/lib/forms'

export const dynamic = 'force-dynamic'

/**
 * POST /api/claim-studio
 *
 * Records an ownership claim for review. Claims never change the studio
 * record directly - is_verified and claimed_by are set by hand once the
 * claimant's connection to the business has actually been checked.
 */
export async function POST(request: Request) {
  const supabase = serverClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Claims are unavailable right now.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (looksLikeBot(body)) {
    return NextResponse.json({ ok: true });
  }

  const studioPath = field(body.studio_path, 300);
  const claimantName = field(body.claimant_name, 120);
  const claimantEmail = field(body.claimant_email, 254);

  const errors: Record<string, string> = {};
  if (!claimantName) errors.claimant_name = 'Enter your name.';
  if (!claimantEmail) errors.claimant_email = 'Enter your email address.';
  else if (!isEmail(claimantEmail)) errors.claimant_email = 'Enter a valid email address.';
  if (!field(body.evidence, 1000)) {
    errors.evidence = 'Tell us how we can verify you are connected to this studio.';
  }
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (!studioPath) {
    return NextResponse.json({ error: 'Missing studio reference.' }, { status: 400 });
  }

  const { data: studio } = await supabase
    .from('pilates_studios')
    .select('id,name')
    .eq('full_url_path', studioPath)
    .eq('is_active', true)
    .single();

  if (!studio) {
    return NextResponse.json({ error: 'We could not find that studio.' }, { status: 404 });
  }

  const hash = submitterHash(request);
  if (await isRateLimited(supabase, 'studio_claims', hash, 3)) {
    return NextResponse.json(
      { error: 'You have submitted several claims recently. Please try again later.' },
      { status: 429 }
    );
  }

  const { error } = await supabase.from('studio_claims').insert({
    studio_id: studio.id,
    claimant_name: claimantName,
    claimant_email: claimantEmail!.toLowerCase(),
    claimant_phone: field(body.claimant_phone, 40),
    claimant_role: field(body.claimant_role, 80),
    evidence: field(body.evidence, 1000),
    message: field(body.message, 2000),
    submitter_hash: hash,
    user_agent: request.headers.get('user-agent')?.slice(0, 300) || null,
  });

  if (error) {
    // The partial unique index rejects a second open claim from the same
    // address for the same studio.
    if (error.code === '23505') {
      return NextResponse.json({
        ok: true,
        already: true,
        studio: studio.name,
      });
    }
    console.error('Claim failed:', error.message);
    return NextResponse.json({ error: 'We could not save your claim. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, studio: studio.name });
}
