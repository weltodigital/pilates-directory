import Link from 'next/link'
import { ExternalLink, Pencil, ShieldCheck } from 'lucide-react'
import { requireOwner, ownedStudios } from '@/lib/owner-auth'
import { serverClient } from '@/lib/forms'
import ReviewsCta from '@/components/ReviewsCta'
import FeaturedControls from '@/components/FeaturedControls'
import {
  FEATURED_SLOTS_PER_TOWN, featuredConfigured, formatPrice, studioFeature,
  townAvailability, townStudioCount,
} from '@/lib/featured'

export const dynamic = 'force-dynamic'

/** Which of this owner's listings have an edit still waiting on us. */
async function pendingByStudio(studioIds: string[]): Promise<Set<string>> {
  const supabase = serverClient();
  if (!supabase || !studioIds.length) return new Set();

  const { data } = await supabase
    .from('studio_edits')
    .select('studio_id')
    .eq('status', 'pending')
    .in('studio_id', studioIds);

  return new Set((data || []).map((row: any) => row.studio_id));
}

/**
 * The featured state of each listing, and how much room is left in its town.
 * Read per studio rather than in one query because an owner with listings in
 * two towns is asking two separate questions.
 */
async function featuredByStudio(studios: any[]) {
  const supabase = serverClient();
  if (!supabase || !studios.length) return {};

  const entries = await Promise.all(studios.map(async (studio: any) => {
    const [feature, availability, townStudios] = await Promise.all([
      studioFeature(supabase, studio.id),
      townAvailability(supabase, studio.county_slug, studio.city_slug),
      townStudioCount(supabase, studio.county_slug, studio.city_slug),
    ]);
    return [studio.id, { feature, availability, townStudios }] as const;
  }));

  return Object.fromEntries(entries);
}

export default async function DashboardPage() {
  const owner = await requireOwner();
  const studios = await ownedStudios(owner.id);
  const pending = await pendingByStudio(studios.map((s: any) => s.id));
  const featured = await featuredByStudio(studios);

  if (!studios.length) {
    return (
      <div className="card-flat mx-auto max-w-xl p-8 text-center">
        <h1 className="font-fraunces text-2xl font-semibold">No listings yet</h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Your account exists, but no listing is attached to it yet. If you have
          claimed a studio and it is still being checked, we will email you as soon
          as it is approved.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <ReviewsCta variant="owner" />
      </div>

      <h1 className="font-fraunces text-2xl font-semibold">
        {studios.length === 1 ? 'Your listing' : 'Your listings'}
      </h1>

      <div className="mt-6 space-y-4">
        {studios.map((studio: any) => (
          <article key={studio.id} className="card-flat p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-fraunces text-xl font-semibold">{studio.name}</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {[studio.city, studio.county].filter(Boolean).join(', ')}
                </p>
                {studio.is_verified && (
                  <span className="chip chip-brand mt-3">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified
                  </span>
                )}
                {pending.has(studio.id) && (
                  <p className="mt-3 text-sm text-ink-muted">
                    Changes waiting to be reviewed.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/dashboard/${studio.id}`} className="pill-brand">
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit details
                </Link>
                <Link href={`/${studio.full_url_path}`} className="pill-outline">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  View listing
                </Link>
              </div>
            </div>

            <div className="mt-7 border-t border-line pt-7">
              <FeaturedControls
                studioId={studio.id}
                townName={studio.city || 'your town'}
                eligible={Boolean(studio.is_verified)}
                available={featuredConfigured()}
                price={formatPrice()}
                slotsTotal={FEATURED_SLOTS_PER_TOWN}
                slotsFree={featured[studio.id]?.availability?.free ?? 0}
                townStudios={featured[studio.id]?.townStudios ?? 0}
                {...(() => {
                  // A pending row is a held place, not a subscription. Only a
                  // slot Stripe has actually collected for counts as featured.
                  const held = featured[studio.id]?.feature;
                  const paid = held && held.status !== 'pending';
                  return {
                    feature: paid ? {
                      status: held.status,
                      currentPeriodEnd: held.current_period_end,
                      cancelAtPeriodEnd: held.cancel_at_period_end,
                    } : null,
                    reservedUntil: held && !paid ? held.reserved_until : null,
                  };
                })()}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
