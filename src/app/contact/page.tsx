import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageSquare, PlusCircle, ShieldCheck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact Us | Pilates Classes Near',
  description:
    'Get in touch about a listing, a claim, or anything else on Pilates Classes Near. We read everything and usually reply within a day.',
  alternates: { canonical: '/contact' },
}

/**
 * Three things people write in about that they can do faster themselves. Each
 * one answered here is a message neither side has to send.
 */
const SHORTCUTS = [
  {
    icon: PlusCircle,
    title: 'Your studio is missing',
    body: 'Add it yourself and we will publish it once we have checked it.',
    href: '/add-studio',
    action: 'Add your studio',
  },
  {
    icon: ShieldCheck,
    title: 'A listing is wrong',
    body: 'If it is your studio, claim it and you can correct it yourself whenever you like.',
    href: '/for-studios',
    action: 'How claiming works',
  },
  {
    icon: MessageSquare,
    title: 'You have already claimed',
    body: 'Sign in to update your classes, prices, opening hours and booking link.',
    href: '/studio-login',
    action: 'Sign in',
  },
]

export default function ContactPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="blob left-1/2 top-[-30%] h-[30rem] w-[30rem] -translate-x-1/2 bg-brand/15" aria-hidden="true" />
          <div className="shell py-16 text-center sm:py-20">
            <span className="chip chip-brand">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Get in touch
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-display-sm sm:text-display">
              Contact us
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              A wrong listing, a studio we have missed, a claim that needs a
              hand &mdash; whatever it is, write and we&apos;ll sort it out.
            </p>
            <p className="mt-6 text-sm text-ink-muted">
              Prefer email?{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-brand underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>

        <div className="shell space-y-20 py-16 sm:py-20">
          <ContactForm contactEmail={CONTACT_EMAIL} />

          <section>
            <h2 className="text-center font-fraunces text-2xl font-semibold">
              You might not need us
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {SHORTCUTS.map(({ icon: Icon, title, body, href, action }) => (
                <div key={title} className="card-flat flex flex-col p-7">
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-4 font-fraunces text-lg font-semibold">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{body}</p>
                  <Link href={href} className="link-quiet mt-5 text-sm font-medium">
                    {action} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
