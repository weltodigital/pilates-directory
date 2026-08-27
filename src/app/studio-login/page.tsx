import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { KeyRound } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StudioLoginForm from '@/components/StudioLoginForm'
import { getOwner } from '@/lib/owner-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Studio Sign In | Pilates Classes Near',
  description: 'Sign in to manage your claimed pilates studio listing.',
  robots: { index: false, follow: false },
}

export default async function StudioLoginPage() {
  if (await getOwner()) redirect('/dashboard');

  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Studio sign in' }]} />

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="blob left-1/2 top-[-30%] h-[28rem] w-[28rem] -translate-x-1/2 bg-brand/15" aria-hidden="true" />
          <div className="shell py-16 text-center sm:py-20">
            <span className="chip chip-brand">
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              Studio owners
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-display-sm">Sign in</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Manage the listing you claimed &mdash; classes, prices, opening hours
              and booking link.
            </p>
          </div>
        </section>

        <div className="shell py-16 sm:py-20">
          <StudioLoginForm />
          <p className="mx-auto mt-8 max-w-md text-center text-sm leading-relaxed text-ink-faint">
            Not claimed your listing yet? Find your studio on the site and use the
            &ldquo;Claim this listing&rdquo; button on its page.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
