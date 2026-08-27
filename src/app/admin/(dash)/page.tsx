import Link from 'next/link'
import { serverClient } from '@/lib/forms'

export const dynamic = 'force-dynamic'

async function overview() {
  const supabase = serverClient();
  if (!supabase) return null;

  const pending = (table: string) =>
    supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', 'pending');

  const [subs, claims, edits, verified, owners, actions] = await Promise.all([
    pending('studio_submissions'),
    pending('studio_claims'),
    pending('studio_edits'),
    supabase.from('pilates_studios').select('*', { count: 'exact', head: true })
      .eq('is_active', true).eq('is_verified', true),
    supabase.from('studio_owners').select('*', { count: 'exact', head: true }),
    supabase.from('admin_actions').select('action,note,detail,created_at')
      .not('action', 'like', 'admin.login%')
      .order('created_at', { ascending: false }).limit(12),
  ]);

  return {
    submissions: subs.count || 0,
    claims: claims.count || 0,
    edits: edits.count || 0,
    verified: verified.count || 0,
    owners: owners.count || 0,
    recent: actions.data || [],
  };
}

function Tile({ href, label, value, waiting }: {
  href: string; label: string; value: number; waiting?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card-flat block p-6 transition-colors hover:border-brand"
    >
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`mt-2 font-fraunces text-3xl font-semibold ${waiting && value > 0 ? 'text-brand' : ''}`}>
        {value}
      </p>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const data = await overview();

  if (!data) {
    return <p className="text-ink-muted">The database is not reachable from this deployment.</p>;
  }

  const total = data.submissions + data.claims + data.edits;

  return (
    <>
      <h1 className="font-fraunces text-2xl font-semibold">
        {total === 0 ? 'Nothing waiting' : `${total} waiting for review`}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile href="/admin/submissions" label="Submissions pending" value={data.submissions} waiting />
        <Tile href="/admin/claims" label="Claims pending" value={data.claims} waiting />
        <Tile href="/admin/edits" label="Edits pending" value={data.edits} waiting />
        <Tile href="/admin/claims" label="Verified listings" value={data.verified} />
        <Tile href="/admin/claims" label="Owner accounts" value={data.owners} />
      </div>

      <h2 className="mt-12 font-fraunces text-lg font-semibold">Recent decisions</h2>
      {data.recent.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">Nothing has been approved or rejected yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {data.recent.map((row: any, i: number) => (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3 text-sm">
              <span className="font-medium">{row.action}</span>
              <span className="text-ink-faint">
                {new Date(row.created_at).toLocaleString('en-GB', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
