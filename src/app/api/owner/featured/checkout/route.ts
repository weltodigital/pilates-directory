import { NextResponse } from 'next/server'
import { field, serverClient } from '@/lib/forms'
import { getOwner, ownsStudio } from '@/lib/owner-auth'
import { siteUrl } from '@/lib/email'
import {
  FEATURED_SLOTS_PER_TOWN, extendReservation, featuredConfigured, reserveSlot,
  stripeClient, studioFeature,
} from '@/lib/featured'

export const dynamic = 'force-dynamic'

/**
 * POST /api/owner/featured/checkout
 *
 * Holds a slot, then hands the owner to Stripe. The slot is taken before
 * payment so that nobody pays for a place that went while they were typing
 * their card in; it is released automatically if they never finish.
 */
export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const stripe = stripeClient();
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!stripe || !priceId || !featuredConfigured()) {
    return NextResponse.json(
      { error: 'Featured listings are not available right now.' },
      { status: 503 }
    );
  }

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

  const { data: studio } = await supabase
    .from('pilates_studios')
    .select('id,name,county_slug,city_slug,city,is_verified,is_active')
    .eq('id', studioId)
    .single();

  if (!studio || !studio.is_active) {
    return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
  }
  if (!studio.is_verified) {
    return NextResponse.json(
      { error: 'A listing has to be verified before it can be featured.' },
      { status: 403 }
    );
  }

  // An abandoned checkout leaves the slot held. Resume it rather than
  // refusing: the owner still wants the place they were part-way through
  // buying, and asking them to wait half an hour for it to lapse is absurd.
  const existing = await studioFeature(supabase, studioId);
  if (existing && existing.status !== 'pending') {
    return NextResponse.json({ error: 'This listing is already featured.' }, { status: 409 });
  }

  let reservationId: string;
  if (existing) {
    await extendReservation(supabase, existing.id);
    reservationId = existing.id;
  } else {
    const reservation = await reserveSlot(supabase, studio, owner.id);
    if (!reservation.ok) {
      const messages = {
        full: `All ${FEATURED_SLOTS_PER_TOWN} featured places in ${studio.city} are taken.`,
        exists: 'This listing is already featured.',
        error: 'We could not start that. Please try again.',
      };
      return NextResponse.json({ error: messages[reservation.reason] }, { status: 409 });
    }
    reservationId = reservation.id;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: owner.email,
      success_url: `${siteUrl()}/dashboard?featured=success`,
      cancel_url: `${siteUrl()}/dashboard?featured=cancelled`,
      // Carried through to the webhook, which is the only place the slot is
      // confirmed. Reading it back beats trusting the browser's return trip.
      client_reference_id: reservationId,
      subscription_data: {
        metadata: {
          featured_listing_id: reservationId,
          studio_id: studio.id,
          studio_name: studio.name,
        },
      },
      metadata: { featured_listing_id: reservationId },
    });

    await supabase
      .from('featured_listings')
      .update({ stripe_checkout_session_id: session.id, updated_at: new Date().toISOString() })
      .eq('id', reservationId);

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err: any) {
    // Give the slot straight back rather than leaving it held for half an
    // hour by a checkout that never opened.
    await supabase
      .from('featured_listings')
      .update({ status: 'cancelled', ended_at: new Date().toISOString() })
      .eq('id', reservationId);

    console.error('Stripe checkout failed:', err?.message);
    return NextResponse.json({ error: 'We could not reach the payment page. Please try again.' }, { status: 502 });
  }
}
