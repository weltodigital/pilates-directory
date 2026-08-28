import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import {
  Building2, ShieldCheck, PlusCircle, MapPin, Star, CalendarCheck, ArrowRight,
  KeyRound, Pencil, MailCheck,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'For Studio Owners | List or Claim Your Pilates Studio',
  description:
    'Add your pilates studio to the UK\'s largest directory, or claim an existing listing to keep your classes, prices and opening hours accurate. Free.',
  alternates: { canonical: '/for-studios' },
}

async function getCounts() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return { studios: null, towns: null };

  const supabase = createClient(url, key);
  const [{ count: studios }, { count: towns }] = await Promise.all([
    supabase.from('pilates_studios').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('public_locations').select('*', { count: 'exact', head: true }).gt('butcher_count', 0),
  ]);
  return { studios, towns };
}

const BENEFITS = [
  {
    icon: MapPin,
    title: 'Found by location',
    body: 'Your studio appears on its town page, its postcode district, and in distance searches from nearby postcodes.',
  },
  {
    icon: Star,
    title: 'Your Google reviews',
    body: 'We show your live Google rating and review count, refreshed regularly rather than frozen at whatever we first recorded.',
  },
  {
    icon: CalendarCheck,
    title: 'A direct booking link',
    body: 'Listings can link straight to your booking system, so someone ready to book is not left hunting for it.',
  },
];

export default async function ForStudiosPage() {
  const { studios, towns } = await getCounts();

  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'For studios' }]} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="blob left-1/2 top-[-30%] h-[32rem] w-[32rem] -translate-x-1/2 bg-brand/15" aria-hidden="true" />
          <div className="shell py-16 text-center sm:py-24">
            <span className="chip chip-brand">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              For studio owners
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-display-sm sm:text-display">
              Get your studio in front of people looking for it
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {studios
                ? `We list ${studios.toLocaleString()} pilates studios across ${towns?.toLocaleString()} UK towns and cities.`
                : 'We list pilates studios across the UK.'}{' '}
              Adding or claiming a listing is free.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/add-studio" className="pill-brand">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                Add your studio
              </Link>
              <Link href="#claim" className="pill-outline">
                Claim an existing listing
              </Link>
            </div>

            <p className="mt-6 text-sm text-ink-muted">
              Already claimed yours?{' '}
              <Link href="/studio-login" className="font-semibold text-brand underline-offset-4 hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </section>

        <div className="shell space-y-20 py-20">
          {/* Why */}
          <section>
            <span className="eyebrow">What a listing gives you</span>
            <h2 className="mt-3 text-display-sm">Why be listed</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="card-flat p-7">
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-4 font-fraunces text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Two paths */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="card-flat flex flex-col p-8">
              <PlusCircle className="h-6 w-6 text-brand" aria-hidden="true" />
              <h2 className="mt-5 font-fraunces text-2xl font-semibold">Not listed yet?</h2>
              <p className="mt-4 flex-1 leading-relaxed text-ink-muted">
                Send us your studio and we&apos;ll add it. We only need the name
                and postcode to start; anything else you tell us makes the
                listing better.
              </p>
              <Link href="/add-studio" className="pill-brand mt-8 self-start">
                Add your studio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div id="claim" className="card-flat flex flex-col p-8">
              <ShieldCheck className="h-6 w-6 text-brand" aria-hidden="true" />
              <h2 className="mt-5 font-fraunces text-2xl font-semibold">Already listed?</h2>
              <p className="mt-4 flex-1 leading-relaxed text-ink-muted">
                Find your studio using the search, then press
                &ldquo;Claim this listing&rdquo; beside its name. Claim from an
                email address at your studio&apos;s own domain and there is
                nothing to upload or prove &mdash; holding that address is the
                evidence.
              </p>
              <Link href="/near" className="pill-outline mt-8 self-start">
                Find your studio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* What claiming actually gets you, which the site never said */}
          <section>
            <span className="eyebrow">After you claim</span>
            <h2 className="mt-3 text-display-sm">What happens next</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: MailCheck,
                  step: 'You confirm your email',
                  body: 'We send the address you claimed from a link. Pressing the button on it is what shows the address is yours \u2014 typing an address into a form only shows the domain exists. Nothing reaches us until you do.',
                },
                {
                  icon: ShieldCheck,
                  step: 'We check the claim',
                  body: 'By hand, usually the same day. Your listing gets a Verified badge on its own page and everywhere it is listed, so people can see the details come from you.',
                },
                {
                  icon: KeyRound,
                  step: 'You get a sign-in',
                  body: 'We email the address you claimed from a link to choose a password. Following it is what proves the address really is yours \u2014 typing it into a form only proved the domain existed.',
                },
                {
                  icon: Pencil,
                  step: 'You keep it current',
                  body: 'Sign in whenever you like to update classes, prices, opening hours, booking link and more. We check changes before they go live, and email you when they do.',
                },
              ].map(({ icon: Icon, step, body }, i) => (
                <li key={step} className="card-flat p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-tint text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-fraunces text-xl font-semibold">{step}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface-sunken px-7 py-6">
              <div className="min-w-0 flex-1">
                <h3 className="font-fraunces text-lg font-semibold">
                  Already claimed your studio?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  Sign in with the email address you claimed from.
                </p>
              </div>
              <Link href="/studio-login" className="pill-brand shrink-0">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Link>
            </div>
          </section>

          {/* Honesty about how listings work */}
          <section className="rounded-xl border border-line bg-surface-sunken p-8 sm:p-10">
            <span className="eyebrow">How listings work</span>
            <h2 className="mt-3 font-fraunces text-2xl font-semibold">
              Straight answers
            </h2>
            <dl className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-ink">Does it cost anything?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  No. Listing, claiming and keeping your details current are all
                  free, and always will be. Studios that want to can pay for a
                  featured place at the top of their town page; those are
                  labelled as paid and change nothing about how everything else
                  is ordered.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Where does the data come from?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Google Business Profiles and studios&apos; own websites. Every
                  field records where it came from, and an owner&apos;s
                  correction overrides both.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">How are studios ordered?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  By rating and review volume, or by distance when someone
                  searches from a postcode. No position in that list can be
                  bought, and paying us moves nothing within it. The featured
                  places above a town&apos;s list sit outside the ordering
                  entirely, and say on every card that they are paid for.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">How do you verify a claim?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  You claim from an email address at your studio&apos;s own
                  domain, and we email that address a link you have to confirm
                  before the claim reaches us at all. That is the real proof:
                  typing an address into a form shows only that the domain
                  exists, while confirming shows you read the mail sent to it.
                  We then check the claim by hand. If your listing has no
                  website, or points at Facebook or a booking platform, email us
                  and we&apos;ll verify it another way.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">What can I change once I&apos;ve claimed?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Your description, contact details, booking link, class types
                  and levels, prices, opening hours, equipment, qualifications
                  and accessibility. Not the name, address or postcode &mdash;
                  those set your page&apos;s web address, so email us instead.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Do my changes go live straight away?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  No. We read every change before it publishes, and email you
                  once it is live. It is usually the same day.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Can I be removed?</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Yes. Claim the listing and ask, or get in touch, and
                  we&apos;ll take it down.
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
