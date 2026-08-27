import { Metadata } from 'next'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfirmButton from '@/components/ConfirmButton'
import { serverClient } from '@/lib/forms'
import { peekVerification } from '@/lib/verification'
import { CONTACT_EMAIL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Confirm Your Email | Pilates Classes Near',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

/** The name of whatever the token points at, for the confirmation to name it. */
async function subjectName(supabase: any, kind: string, targetId: string) {
  if (kind === 'claim') {
    const { data } = await supabase
      .from('studio_claims')
      .select('pilates_studios(name)')
      .eq('id', targetId)
      .single();
    return (data as any)?.pilates_studios?.name ?? null;
  }
  const { data } = await supabase
    .from('studio_submissions')
    .select('name')
    .eq('id', targetId)
    .single();
  return data?.name ?? null;
}

export default async function ConfirmPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const supabase = serverClient();

  // Checked, not spent. Following the link only shows the page; the token is
  // used up when the button is pressed.
  const pending = token && supabase ? await peekVerification(supabase, token) : null;
  const name = pending ? await subjectName(supabase, pending.kind, pending.targetId) : null;

  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Confirm your email' }]} />

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="blob left-1/2 top-[-30%] h-[26rem] w-[26rem] -translate-x-1/2 bg-brand/15" aria-hidden="true" />
          <div className="shell py-14 text-center sm:py-16">
            <span className="chip chip-brand">
              <MailCheck className="h-3.5 w-3.5" aria-hidden="true" />
              One last step
            </span>
          </div>
        </section>

        <div className="shell py-16 sm:py-20">
          <div className="card-flat mx-auto max-w-xl p-8 sm:p-10">
            {pending ? (
              <ConfirmButton token={token!} kind={pending.kind} studioName={name} />
            ) : (
              <div className="text-center">
                <h1 className="font-fraunces text-2xl font-semibold">
                  That link has expired
                </h1>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Confirmation links work once and last three days. Send your
                  claim or your studio again and a fresh one will arrive, or
                  write to us and we&apos;ll sort it out.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/contact" className="pill-brand">Contact us</Link>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="pill-outline">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
