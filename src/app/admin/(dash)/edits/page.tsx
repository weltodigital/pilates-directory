import Link from 'next/link'
import { serverClient } from '@/lib/forms'
import { displayValue, fieldSpec } from '@/lib/editable'
import ReviewActions from '@/components/admin/ReviewActions'
import DecidedAt from '@/components/admin/DecidedAt'

export const dynamic = 'force-dynamic'

async function load() {
  const supabase = serverClient();
  if (!supabase) return null;

  const [pending, decided] = await Promise.all([
    supabase.from('studio_edits')
      .select('*, pilates_studios(name,full_url_path), studio_owners(email,name)')
      .eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('studio_edits')
      .select('id,status,changes,previous,note,created_at,reviewed_at,applied_at,review_note,pilates_studios(name,full_url_path),studio_owners(email,name)')
      .neq('status', 'pending').order('reviewed_at', { ascending: false }).limit(40),
  ]);

  return { pending: pending.data || [], decided: decided.data || [] };
}

export default async function AdminEditsPage() {
  const data = await load();
  if (!data) return <p className="text-ink-muted">The database is not reachable.</p>;

  return (
    <>
      <h1 className="font-fraunces text-2xl font-semibold">
        Edits
        <span className="ml-3 text-base font-normal text-ink-muted">
          {data.pending.length} waiting
        </span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Changes owners have made to their own listings. Nothing here is live until
        you approve it.
      </p>

      {data.pending.length === 0 && <p className="mt-8 text-ink-muted">Nothing waiting.</p>}

      <div className="mt-8 space-y-6">
        {data.pending.map((edit: any) => {
          const studio = edit.pilates_studios;
          const owner = edit.studio_owners;
          const keys = Object.keys(edit.changes || {});

          return (
            <article key={edit.id} className="card-flat p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-fraunces text-xl font-semibold">
                  {studio ? (
                    <Link href={`/${studio.full_url_path}`} className="link-quiet">
                      {studio.name}
                    </Link>
                  ) : 'Listing removed'}
                </h2>
                <span className="text-xs text-ink-faint">
                  {new Date(edit.created_at).toLocaleString('en-GB')}
                </span>
              </div>

              <p className="mt-2 text-sm text-ink-muted">
                {owner?.name ? `${owner.name} · ` : ''}{owner?.email || 'account removed'}
                {' · '}{keys.length} field{keys.length === 1 ? '' : 's'}
              </p>

              {edit.note && (
                <p className="mt-4 rounded-md border border-line-strong bg-surface-sunken px-4 py-3 text-sm">
                  {edit.note}
                </p>
              )}

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[36rem] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                      <th className="py-2 pr-4 font-medium">Field</th>
                      <th className="py-2 pr-4 font-medium">Now</th>
                      <th className="py-2 font-medium">Proposed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {keys.map(key => {
                      const spec = fieldSpec(key);
                      return (
                        <tr key={key} className="align-top">
                          <td className="py-2.5 pr-4 font-medium">{spec?.label || key}</td>
                          <td className="py-2.5 pr-4 text-ink-faint">
                            {displayValue(spec, edit.previous?.[key])}
                          </td>
                          <td className="py-2.5 text-ink">
                            {displayValue(spec, edit.changes[key])}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ReviewActions
                kind="edit"
                id={edit.id}
                choices={[
                  { action: 'approve', label: 'Approve and publish' },
                  { action: 'reject', label: 'Reject', tone: 'quiet' },
                ]}
              />
            </article>
          );
        })}
      </div>

      {data.decided.length > 0 && (
        <>
          <h2 className="mt-14 font-fraunces text-lg font-semibold">Decision log</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            The last {data.decided.length} decisions, most recent first. Open one to
            see exactly what changed.
          </p>

          <div className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {data.decided.map((edit: any) => {
              const keys = Object.keys(edit.changes || {});
              const owner = edit.studio_owners;

              return (
                <details key={edit.id} className="group">
                  <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3.5 text-sm hover:bg-surface-sunken">
                    <span className="min-w-0">
                      <span className="font-medium">{edit.pilates_studios?.name}</span>
                      <span className="text-ink-faint">
                        {' · '}{keys.length} field{keys.length === 1 ? '' : 's'}
                        {owner?.email ? ` · ${owner.email}` : ''}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-3">
                      <span
                        className={
                          edit.status === 'approved'
                            ? 'font-medium text-brand'
                            : 'text-ink-faint'
                        }
                      >
                        {edit.status}
                      </span>
                      <DecidedAt at={edit.reviewed_at} />
                    </span>
                  </summary>

                  <div className="border-t border-line bg-surface-sunken px-5 py-4">
                    <dl className="flex flex-wrap gap-x-8 gap-y-1 text-xs text-ink-muted">
                      <div className="flex gap-2">
                        <dt className="text-ink-faint">Sent</dt>
                        <dd><DecidedAt at={edit.created_at} /></dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-ink-faint">Reviewed</dt>
                        <dd><DecidedAt at={edit.reviewed_at} /></dd>
                      </div>
                      {edit.status === 'approved' && (
                        <div className="flex gap-2">
                          <dt className="text-ink-faint">Published</dt>
                          <dd><DecidedAt at={edit.applied_at} /></dd>
                        </div>
                      )}
                    </dl>

                    {edit.note && (
                      <p className="mt-3 text-sm text-ink-muted">
                        <span className="text-ink-faint">From the owner:</span> {edit.note}
                      </p>
                    )}
                    {edit.review_note && (
                      <p className="mt-1 text-sm text-ink-muted">
                        <span className="text-ink-faint">Your note:</span> {edit.review_note}
                      </p>
                    )}

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[32rem] text-sm">
                        <thead>
                          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                            <th className="py-2 pr-4 font-medium">Field</th>
                            <th className="py-2 pr-4 font-medium">Was</th>
                            <th className="py-2 font-medium">
                              {edit.status === 'approved' ? 'Became' : 'Proposed'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {keys.map(key => {
                            const spec = fieldSpec(key);
                            return (
                              <tr key={key} className="align-top">
                                <td className="py-2 pr-4 font-medium">{spec?.label || key}</td>
                                <td className="py-2 pr-4 text-ink-faint">
                                  {displayValue(spec, edit.previous?.[key])}
                                </td>
                                <td className="py-2">{displayValue(spec, edit.changes[key])}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
