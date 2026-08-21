import { Metadata } from 'next'
import { Navigation } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NearSearch from '@/components/NearSearch'

export const metadata: Metadata = {
  title: 'Pilates Studios Near Me | Find Classes by Postcode',
  description:
    'Find pilates studios near you. Search by postcode or share your location to see the closest reformer, mat and clinical pilates classes, ranked by distance.',
  alternates: { canonical: '/near' },
  robots: { index: true, follow: true },
}

export default function NearPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Near me' }]} />

      <main>
        <section className="relative overflow-hidden">
          <div
            className="blob left-1/2 top-[-25%] h-[32rem] w-[32rem] -translate-x-1/2 bg-brand/15"
            aria-hidden="true"
          />
          <div className="shell py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="chip chip-brand">
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                Distance search
              </span>
              <h1 className="mt-6 text-display-sm sm:text-display">
                Pilates studios near you
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                Enter a postcode or share your location. We&apos;ll show the
                closest studios first, with distances, ratings and a map.
              </p>
            </div>

            <NearSearch />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
