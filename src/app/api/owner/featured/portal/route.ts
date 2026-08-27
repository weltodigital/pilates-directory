import { NextResponse } from 'next/server'
import { field, serverClient } from '@/lib/forms'
import { getOwner, ownsStudio } from '@/lib/owner-auth'
import { siteUrl } from '@/lib/email'
import { stripeClient } from '@/lib/featured'

export const dynamic = 'force-dynamic'

/**
 * POST /api/owner/featured/portal
 *
 * Hands the owner to Stripe's billing portal to change a card or cancel.
 * Cancelling there is a subscription event we hear about on the webhook, so
 * there is no second place where a slot can be ended and no chance of the two
 * disagreeing.
 */
export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const stripe = stripeClient();
  if (!stripe) return NextResponse.json({ error: 'Not available right now.' }, { status: 503 });

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const studioId = field(body.studio_id, 40);
  if (!studioId || !(await ownsStudio(owner.id, studioId))) {
    return NextResponse.json({ error: 'That is not one of your listings.' }, { status: 403 });
  }

  const { data: feature } = await supabase
    .from('featured_listings')
    .select('stripe_customer_id')
    .eq('studio_id', studioId)
    .in('status', ['active', 'past_due'])
    .limit(1)
    .single();

  if (!feature?.stripe_customer_id) {
    return NextResponse.json({ error: 'There is no subscription for this listing.' }, { status: 404 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: feature.stripe_customer_id,
      return_url: `${siteUrl()}/dashboard`,
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (err: any) {
    console.error('Stripe portal failed:', err?.message);
    return NextResponse.json({ error: 'We could not open the billing page. Please try again.' }, { status: 502 });
  }
}
