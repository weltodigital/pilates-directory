import Link from 'next/link'
import { serverClient } from '@/lib/forms'
import { displayValue, fieldSpec } from '@/lib/editable'
import ReviewActions from '@/components/admin/ReviewActions'

export const dynamic = 'force-dynamic'

async function load() {
  const supabase = serverClient();
  if (!supabase) return null;

  const [pending, decided] = await Promise.all([
    supabase.from('studio_edits')
      .select('*, pilates_studios(name,full_url_path), studio_owners(email,name)')
      .eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('studio_edits')
      .select('id,status,reviewed_at,review_note,pilates_studios(name),studio_owners(email)')
      .neq('status', 'pending').order('reviewed_at', { ascending: false }).limit(25),
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
          <h2 className="mt-14 font-fraunces text-lg font-semibold">Already decided</h2>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {data.decided.map((edit: any) => (
              <li key={edit.id} className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3 text-sm">
                <span>
                  <span className="font-medium">{edit.pilates_studios?.name}</span>
                  <span className="text-ink-faint"> · {edit.studio_owners?.email}</span>
                </span>
                <span className="text-ink-faint">{edit.status}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
