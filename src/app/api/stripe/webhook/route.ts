import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/forms'
import { notifyAdmin, sendEmail, siteUrl } from '@/lib/email'
import { stripeClient } from '@/lib/featured'

export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/webhook
 *
 * Where a slot actually becomes paid for. The browser's return trip from
 * Stripe is a redirect anyone can forge by typing the success URL, so it
 * changes nothing; this does.
 *
 * Stripe delivers events more than once by design, so every event id is
 * recorded and a repeat is dropped.
 */
export async function POST(request: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Unsigned.' }, { status: 400 });

  // The raw body, before any parsing: the signature covers the exact bytes.
  const payload = await request.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, secret);
  } catch (err: any) {
    console.error('Stripe signature check failed:', err?.message);
    return NextResponse.json({ error: 'Bad signature.' }, { status: 400 });
  }

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });

  // Claim the event id. A duplicate delivery collides here and stops.
  const { error: seen } = await supabase
    .from('stripe_events')
    .insert({ id: event.id, type: event.type });
  if (seen) {
    if (seen.code === '23505') return NextResponse.json({ received: true, duplicate: true });
    console.error('Could not record Stripe event:', seen.message);
  }

  const now = new Date().toISOString();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const id = session.client_reference_id || session.metadata?.featured_listing_id;
        if (!id) break;

        const { data: row } = await supabase
          .from('featured_listings')
          .update({
            status: 'active',
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
            stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
            started_at: now,
            reserved_until: null,
            updated_at: now,
          })
          .eq('id', id)
          .in('status', ['pending', 'cancelled'])
          .select('studio_id, pilates_studios(name, city, county_slug, city_slug, full_url_path), studio_owners(email, name)')
          .single();

        if (row) {
          const studio = (row as any).pilates_studios;
          const owner = (row as any).studio_owners;

          if (owner?.email) {
            await sendEmail({
              to: owner.email,
              subject: `${studio?.name} is now featured in ${studio?.city}`,
              text: [
                owner.name ? `Hi ${owner.name},` : 'Hi,',
                '',
                `${studio?.name} now appears at the top of the ${studio?.city} page:`,
                '',
                `${siteUrl()}/${studio?.county_slug}/${studio?.city_slug}`,
                '',
                'It renews monthly. You can change your card or cancel any time from your dashboard:',
                '',
                `${siteUrl()}/dashboard`,
                '',
                'Pilates Classes Near',
              ].join('\n'),
            });
          }

          await notifyAdmin(
            `Featured listing started: ${studio?.name}`,
            `${studio?.name} is now featured in ${studio?.city}.\n\n${siteUrl()}/${studio?.county_slug}/${studio?.city_slug}`
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const periodEnd = sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end;

        // Stripe can express "this is ending" in more than one way, and which
        // one arrives depends on how it was cancelled and on the API version
        // the account sends events in. Reading a single field got this wrong
        // once already: a cancellation came through as an ordinary update and
        // the slot stayed live. Any of these means the same thing.
        const endingSoon = Boolean(
          sub.cancel_at_period_end || sub.cancel_at || sub.cancellation_details?.reason
        );
        const ended = sub.status === 'canceled' || sub.status === 'incomplete_expired';

        await supabase
          .from('featured_listings')
          .update({
            // A subscription Stripe considers unpaid keeps its slot while
            // Stripe retries; anything past that releases it.
            status: ended
              ? 'cancelled'
              : sub.status === 'past_due' || sub.status === 'unpaid'
                ? 'past_due'
                : 'active',
            cancel_at_period_end: endingSoon,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            ended_at: ended ? now : null,
            updated_at: now,
          })
          .eq('stripe_subscription_id', sub.id);

        // Worth knowing about, and the only signal that a slot is due back.
        if (endingSoon && !ended) {
          const { data: row } = await supabase
            .from('featured_listings')
            .select('pilates_studios(name, city)')
            .eq('stripe_subscription_id', sub.id)
            .single();
          const studio = (row as any)?.pilates_studios;
          if (studio) {
            await notifyAdmin(
              `Featured listing cancelled: ${studio.name}`,
              `${studio.name} has cancelled and will stop being featured in ${studio.city} at the end of the period it has paid for.`
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const { data: row } = await supabase
          .from('featured_listings')
          .update({ status: 'cancelled', ended_at: now, updated_at: now })
          .eq('stripe_subscription_id', sub.id)
          .select('pilates_studios(name, city)')
          .single();

        if (row) {
          const studio = (row as any).pilates_studios;
          await notifyAdmin(
            `Featured listing ended: ${studio?.name}`,
            `${studio?.name} is no longer featured in ${studio?.city}. The slot is free.`
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.parent?.subscription_details?.subscription;
        if (subId) {
          await supabase
            .from('featured_listings')
            .update({ status: 'past_due', updated_at: now })
            .eq('stripe_subscription_id', subId);
        }
        break;
      }
    }
  } catch (err: any) {
    // Answer 500 so Stripe retries: the event id is recorded, but the row it
    // describes is not yet right, and a silent 200 would strand it.
    console.error(`Stripe webhook ${event.type} failed:`, err?.message);
    await supabase.from('stripe_events').delete().eq('id', event.id);
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
