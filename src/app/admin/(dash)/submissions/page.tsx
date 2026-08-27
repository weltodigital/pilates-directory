import Link from 'next/link'
import { serverClient } from '@/lib/forms'
import { slugify } from '@/lib/review'
import ReviewActions from '@/components/admin/ReviewActions'
import DecidedAt from '@/components/admin/DecidedAt'

export const dynamic = 'force-dynamic'

async function load() {
  const supabase = serverClient();
  if (!supabase) return null;

  const [pending, decided, counties] = await Promise.all([
    supabase.from('studio_submissions')
      .select('*, pilates_studios!studio_submissions_possible_duplicate_id_fkey(name,full_url_path)')
      .eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('studio_submissions')
      .select('id,name,town,status,reviewed_at,review_note,created_studio_id')
      .neq('status', 'pending').order('reviewed_at', { ascending: false }).limit(25),
    supabase.from('public_locations')
      .select('name,slug').in('type', ['county', 'country']).order('name'),
  ]);

  return {
    pending: pending.data || [],
    decided: decided.data || [],
    counties: counties.data || [],
  };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex gap-3 py-1.5 text-sm">
      <dt className="w-32 shrink-0 text-ink-faint">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function AdminSubmissionsPage() {
  const data = await load();
  if (!data) return <p className="text-ink-muted">The database is not reachable.</p>;

  const countySlugs = new Set(data.counties.map((c: any) => c.slug));

  return (
    <>
      <h1 className="font-fraunces text-2xl font-semibold">
        Submissions
        <span className="ml-3 text-base font-normal text-ink-muted">
          {data.pending.length} waiting
        </span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Approving creates the listing, its town page if it is the first studio there,
        and emails the sender the live URL. Check the county before you approve:
        it decides the address the page lives at.
      </p>

      {data.pending.length === 0 && (
        <p className="mt-8 text-ink-muted">Nothing waiting.</p>
      )}

      <div className="mt-8 space-y-6">
        {data.pending.map((sub: any) => {
          // Pre-select the county when the postcode's own answer is one this
          // site files studios under; leave it blank rather than guess wrong.
          const guess = slugify(sub.county || '');
          const duplicate = sub.pilates_studios;

          return (
            <article key={sub.id} className="card-flat p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-fraunces text-xl font-semibold">{sub.name}</h2>
                <span className="text-xs text-ink-faint">
                  {new Date(sub.created_at).toLocaleString('en-GB')}
                </span>
              </div>

              {duplicate && (
                <p className="mt-3 rounded-md border border-line-strong bg-surface-sunken px-4 py-3 text-sm">
                  Possible duplicate of{' '}
                  <Link href={`/${duplicate.full_url_path}`} className="link-quiet font-medium">
                    {duplicate.name}
                  </Link>
                </p>
              )}

              <dl className="mt-4 divide-y divide-line">
                <Row label="Address">{sub.address}</Row>
                <Row label="Postcode">{sub.postcode}</Row>
                <Row label="Town / county">{[sub.town, sub.county].filter(Boolean).join(', ')}</Row>
                <Row label="Website">
                  {sub.website && (
                    <a href={sub.website} target="_blank" rel="noopener noreferrer" className="link-quiet">
                      {sub.website}
                    </a>
                  )}
                </Row>
                <Row label="Phone">{sub.phone}</Row>
                <Row label="Class types">{sub.class_types?.join(', ')}</Row>
                <Row label="From">
                  {sub.contact_name}
                  {sub.contact_role ? ` (${sub.contact_role})` : ''} ·{' '}
                  <a href={`mailto:${sub.contact_email}`} className="link-quiet">{sub.contact_email}</a>
                </Row>
                <Row label="Message">{sub.message}</Row>
              </dl>

              <ReviewActions
                kind="submission"
                id={sub.id}
                choices={[
                  { action: 'approve', label: 'Approve and publish' },
                  { action: 'duplicate', label: 'Mark duplicate', tone: 'quiet' },
                  { action: 'reject', label: 'Reject', tone: 'quiet' },
                ]}
                promote={{
                  counties: data.counties as any,
                  defaultCounty: countySlugs.has(guess) ? guess : null,
                  defaultCity: sub.town || '',
                }}
              />
            </article>
          );
        })}
      </div>

      {data.decided.length > 0 && (
        <>
          <h2 className="mt-14 font-fraunces text-lg font-semibold">Decision log</h2>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {data.decided.map((sub: any) => (
              <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span className="min-w-0">
                  <span className="font-medium">{sub.name}</span>
                  {sub.town && <span className="text-ink-faint"> · {sub.town}</span>}
                  {sub.review_note && <span className="text-ink-faint"> · {sub.review_note}</span>}
                </span>
                <span className="flex shrink-0 items-baseline gap-3">
                  <span className={sub.status === 'approved' ? 'font-medium text-brand' : 'text-ink-faint'}>
                    {sub.status}
                  </span>
                  <DecidedAt at={sub.reviewed_at} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
