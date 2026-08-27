import { Metadata } from 'next'
import Link from 'next/link'
import { requireOwner } from '@/lib/owner-auth'
import SignOutButton from '@/components/admin/SignOutButton'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Studio | Pilates Classes Near',
  robots: { index: false, follow: false, nocache: true },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const owner = await requireOwner();

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/dashboard" className="font-fraunces text-lg font-semibold">
            Your studio
          </Link>
          <div className="flex items-center gap-5">
            <span className="text-sm text-ink-faint">{owner.email}</span>
            <SignOutButton endpoint="/api/owner/logout" to="/studio-login" />
          </div>
        </div>
      </header>

      <main className="shell py-10 sm:py-14">{children}</main>

      <Footer />
    </>
  );
}
