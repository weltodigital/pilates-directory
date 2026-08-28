import Stripe from 'stripe'

/**
 * Featured listings: three paid slots at the top of each town page.
 *
 * The cap lives in a unique index on (town, slot number), so claiming a slot
 * is an insert that either succeeds or collides. Nothing here counts rows and
 * then writes on the strength of the count.
 */

export const FEATURED_SLOTS_PER_TOWN = 3
export const FEATURED_PRICE_PENCE = 2900

/** How long an unpaid reservation holds its slot while Stripe collects. */
const RESERVATION_MINUTES = 30

/** Statuses that occupy a slot. past_due is included deliberately: a card that
 *  failed this morning should not cost a studio its place before Stripe has
 *  finished retrying. */
export const OCCUPYING = ['pending', 'active', 'past_due']

export function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function featuredConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

export function formatPrice(pence = FEATURED_PRICE_PENCE): string {
  return pence % 100 === 0 ? `£${pence / 100}` : `£${(pence / 100).toFixed(2)}`;
}

/**
 * Drop reservations nobody paid for.
 *
 * Called before any question about availability, because the only moment a
 * stale reservation matters is when someone is asking for a slot.
 */
export async function releaseExpiredReservations(supabase: any, county: string, city: string) {
  await supabase
    .from('featured_listings')
    .update({ status: 'cancelled', ended_at: new Date().toISOString() })
    .eq('status', 'pending')
    .eq('county_slug', county)
    .eq('city_slug', city)
    .lt('reserved_until', new Date().toISOString());
}

export interface TownAvailability {
  taken: number;
  free: number;
  slots: number[];
}

/** How many studios a town already lists, which is what a featured place is
 *  bought to stand out from. */
export async function townStudioCount(
  supabase: any, county: string, city: string
): Promise<number> {
  const { count } = await supabase
    .from('pilates_studios')
    .select('*', { count: 'exact', head: true })
    .eq('county_slug', county)
    .eq('city_slug', city)
    .eq('is_active', true);
  return count || 0;
}

export async function townAvailability(
  supabase: any, county: string, city: string
): Promise<TownAvailability> {
  await releaseExpiredReservations(supabase, county, city);

  const { data } = await supabase
    .from('featured_listings')
    .select('slot')
    .eq('county_slug', county)
    .eq('city_slug', city)
    .in('status', OCCUPYING);

  const used = new Set((data || []).map((r: any) => r.slot));
  const slots = [1, 2, 3].filter(n => !used.has(n));
  return { taken: used.size, free: slots.length, slots };
}

/**
 * Hold a slot for one studio, or explain why not.
 *
 * Tries each free number in turn: a collision means somebody else took that
 * number in the moment between reading and writing, which is the case this
 * design exists to handle rather than avoid.
 */
export async function reserveSlot(
  supabase: any,
  studio: { id: string; county_slug: string; city_slug: string },
  ownerId: string
): Promise<{ ok: true; id: string; slot: number } | { ok: false; reason: 'full' | 'exists' | 'error' }> {
  const { slots } = await townAvailability(supabase, studio.county_slug, studio.city_slug);
  if (!slots.length) return { ok: false, reason: 'full' };

  const reservedUntil = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000).toISOString();

  for (const slot of slots) {
    const { data, error } = await supabase
      .from('featured_listings')
      .insert({
        studio_id: studio.id,
        owner_id: ownerId,
        county_slug: studio.county_slug,
        city_slug: studio.city_slug,
        slot,
        status: 'pending',
        reserved_until: reservedUntil,
      })
      .select('id')
      .single();

    if (!error) return { ok: true, id: data.id, slot };

    if (error.code !== '23505') {
      console.error('Slot reservation failed:', error.message);
      return { ok: false, reason: 'error' };
    }

    // A unique violation on the per-studio index means this studio already
    // holds a slot; on the per-slot index it means the number went. Only the
    // second is worth retrying.
    const { count } = await supabase
      .from('featured_listings')
      .select('*', { count: 'exact', head: true })
      .eq('studio_id', studio.id)
      .in('status', OCCUPYING);
    if (count) return { ok: false, reason: 'exists' };
  }

  return { ok: false, reason: 'full' };
}

/**
 * Whatever slot this studio currently holds, paid for or merely reserved.
 *
 * The caller has to tell the two apart. A pending row is a place held while
 * Stripe collects, and reading it as a subscription tells an owner they are
 * featured when they have paid nothing - which is exactly what it did.
 *
 * Reservations that have run out are released first, so an abandoned checkout
 * from an hour ago does not keep the owner out of their own slot.
 */
export async function studioFeature(supabase: any, studioId: string) {
  await supabase
    .from('featured_listings')
    .update({ status: 'cancelled', ended_at: new Date().toISOString() })
    .eq('studio_id', studioId)
    .eq('status', 'pending')
    .lt('reserved_until', new Date().toISOString());

  const { data } = await supabase
    .from('featured_listings')
    .select('*')
    .eq('studio_id', studioId)
    .in('status', OCCUPYING)
    .order('created_at', { ascending: false })
    .limit(1);
  return data?.[0] ?? null;
}

/** Push a held slot's expiry out, for an owner returning to finish paying. */
export async function extendReservation(supabase: any, id: string) {
  await supabase
    .from('featured_listings')
    .update({
      reserved_until: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'pending');
}

/**
 * The featured studios on a town page, longest-standing first.
 *
 * A slot whose payment is being retried keeps showing. Pulling a studio off
 * the page the moment a card is declined punishes them for something Stripe
 * has not finished deciding.
 */
export async function featuredForTown(supabase: any, county: string, city: string) {
  const { data } = await supabase
    .from('featured_listings')
    .select(`
      id, slot, started_at,
      pilates_studios (
        id, name, address, city, county, full_url_path, description,
        google_rating, google_review_count, class_types, price_drop_in,
        booking_url, phone, is_verified
      )
    `)
    .eq('county_slug', county)
    .eq('city_slug', city)
    .in('status', ['active', 'past_due'])
    .order('started_at', { ascending: true, nullsFirst: false })
    .limit(FEATURED_SLOTS_PER_TOWN);

  return (data || [])
    .map((row: any) => row.pilates_studios)
    .filter(Boolean);
}
