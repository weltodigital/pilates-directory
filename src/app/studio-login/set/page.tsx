import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SetPasswordForm from '@/components/SetPasswordForm'
import { peekPasswordToken } from '@/lib/owner-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Choose a Password | Pilates Classes Near',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function SetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  // Checked, not spent: the token is only used up once a password is saved,
  // so landing on this page twice does not burn the link.
  const owner = token ? await peekPasswordToken(token) : null;

  return (
    <>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Studio sign in', href: '/studio-login' },
          { label: 'Choose a password' },
        ]}
      />

      <main>
        <div className="shell py-16 sm:py-20">
          <h1 className="text-center font-fraunces text-2xl font-semibold">
            Choose a password
          </h1>

          <div className="mt-10">
            {owner ? (
              <SetPasswordForm token={token!} email={owner.email} />
            ) : (
              <div className="card-flat mx-auto max-w-md p-8 text-center">
                <h2 className="font-fraunces text-xl font-semibold">
                  That link has expired
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Links work once, and only for a limited time. Ask for a new one
                  and it will arrive in a moment.
                </p>
                <Link href="/studio-login/forgot" className="pill-brand mt-8">
                  Send me a new link
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
