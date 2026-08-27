import Link from 'next/link'
import { ExternalLink, Pencil, ShieldCheck } from 'lucide-react'
import { requireOwner, ownedStudios } from '@/lib/owner-auth'
import { serverClient } from '@/lib/forms'

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

export default async function DashboardPage() {
  const owner = await requireOwner();
  const studios = await ownedStudios(owner.id);
  const pending = await pendingByStudio(studios.map((s: any) => s.id));

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
          </article>
        ))}
      </div>
    </>
  );
}
