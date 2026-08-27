import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { serverClient } from '@/lib/forms'
import SignOutButton from '@/components/admin/SignOutButton'

export const dynamic = 'force-dynamic'

const TABS = [
  { href: '/admin', label: 'Overview', table: null },
  { href: '/admin/submissions', label: 'Submissions', table: 'studio_submissions' },
  { href: '/admin/claims', label: 'Claims', table: 'studio_claims' },
  { href: '/admin/edits', label: 'Edits', table: 'studio_edits' },
]

/** How many rows are waiting in each queue, shown against the tab. */
async function pendingCounts(): Promise<Record<string, number>> {
  const supabase = serverClient();
  if (!supabase) return {};

  const tables = TABS.map(t => t.table).filter(Boolean) as string[];
  const results = await Promise.all(
    tables.map(table =>
      supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', 'pending')
    )
  );
  return Object.fromEntries(tables.map((table, i) => [table, results[i].count || 0]));
}

export default async function AdminDashLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = await pendingCounts();

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-4">
          <nav className="flex flex-wrap items-center gap-1">
            {TABS.map(tab => {
              const pending = tab.table ? counts[tab.table] || 0 : 0;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
                >
                  {tab.label}
                  {pending > 0 && (
                    <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                      {pending}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <SignOutButton endpoint="/api/admin/logout" to="/admin/login" />
        </div>
      </header>

      <main className="shell py-10">{children}</main>
    </>
  );
}
