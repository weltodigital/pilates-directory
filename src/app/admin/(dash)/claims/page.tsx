import Link from 'next/link'
import { serverClient, domainOf } from '@/lib/forms'
import ReviewActions from '@/components/admin/ReviewActions'

export const dynamic = 'force-dynamic'

async function load() {
  const supabase = serverClient();
  if (!supabase) return null;

  const [pending, decided] = await Promise.all([
    supabase.from('studio_claims')
      .select('*, pilates_studios(name,city,county,website,full_url_path,is_verified)')
      .eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('studio_claims')
      .select('id,claimant_email,status,reviewed_at,review_note,pilates_studios(name,full_url_path)')
      .neq('status', 'pending').order('reviewed_at', { ascending: false }).limit(25),
  ]);

  return { pending: pending.data || [], decided: decided.data || [] };
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

export default async function AdminClaimsPage() {
  const data = await load();
  if (!data) return <p className="text-ink-muted">The database is not reachable.</p>;

  return (
    <>
      <h1 className="font-fraunces text-2xl font-semibold">
        Claims
        <span className="ml-3 text-base font-normal text-ink-muted">
          {data.pending.length} waiting
        </span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        The claim form already checked that the address is at the studio&apos;s own
        domain. Approving marks the listing verified, creates an owner account,
        and emails a sign-in link &mdash; and it is that email arriving, not the
        form, that proves they really read mail at the domain.
      </p>

      {data.pending.length === 0 && <p className="mt-8 text-ink-muted">Nothing waiting.</p>}

      <div className="mt-8 space-y-6">
        {data.pending.map((claim: any) => {
          const studio = claim.pilates_studios;
          const siteDomain = domainOf(studio?.website);
          const emailDomain = domainOf(claim.claimant_email);

          return (
            <article key={claim.id} className="card-flat p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-fraunces text-xl font-semibold">
                  {studio ? (
                    <Link href={`/${studio.full_url_path}`} className="link-quiet">
                      {studio.name}
                    </Link>
                  ) : 'Listing removed'}
                </h2>
                <span className="text-xs text-ink-faint">
                  {new Date(claim.created_at).toLocaleString('en-GB')}
                </span>
              </div>

              <p className="mt-2 text-sm text-ink-muted">
                {[studio?.city, studio?.county].filter(Boolean).join(', ')}
              </p>

              <div className="mt-4 rounded-md border border-line-strong bg-surface-sunken px-4 py-3 text-sm">
                Listing domain <strong>{siteDomain || 'none'}</strong>, claiming from{' '}
                <strong>{emailDomain}</strong>
                {siteDomain && emailDomain === siteDomain && ' — matches'}
              </div>

              <dl className="mt-4 divide-y divide-line">
                <Row label="Name">{claim.claimant_name}</Row>
                <Row label="Email">
                  <a href={`mailto:${claim.claimant_email}`} className="link-quiet">
                    {claim.claimant_email}
                  </a>
                </Row>
                <Row label="Phone">{claim.claimant_phone}</Row>
                <Row label="Role">{claim.claimant_role}</Row>
                <Row label="Evidence">{claim.evidence}</Row>
                <Row label="Message">{claim.message}</Row>
              </dl>

              <ReviewActions
                kind="claim"
                id={claim.id}
                choices={[
                  { action: 'approve', label: 'Approve and send sign-in link' },
                  { action: 'reject', label: 'Reject', tone: 'quiet' },
                ]}
              />
            </article>
          );
        })}
      </div>

      {data.decided.length > 0 && (
        <>
          <h2 className="mt-14 font-fraunces text-lg font-semibold">Already decided</h2>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {data.decided.map((claim: any) => (
              <li key={claim.id} className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3 text-sm">
                <span>
                  <span className="font-medium">{claim.pilates_studios?.name}</span>
                  <span className="text-ink-faint"> · {claim.claimant_email}</span>
                </span>
                <span className="text-ink-faint">{claim.status}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
