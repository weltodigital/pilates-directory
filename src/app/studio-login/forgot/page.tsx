import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StudioForgotForm from '@/components/StudioForgotForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reset Your Password | Pilates Classes Near',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Studio sign in', href: '/studio-login' },
          { label: 'Reset password' },
        ]}
      />

      <main>
        <div className="shell py-16 sm:py-20">
          <h1 className="text-center font-fraunces text-2xl font-semibold">
            Reset your password
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center leading-relaxed text-ink-muted">
            We&apos;ll email a link to choose a new one.
          </p>

          <div className="mt-10">
            <StudioForgotForm />
          </div>

          <p className="mt-8 text-center text-sm">
            <Link href="/studio-login" className="link-quiet inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
