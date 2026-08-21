import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="relative overflow-hidden">
        <div
          className="blob left-1/2 top-[-20%] h-[32rem] w-[32rem] -translate-x-1/2 bg-brand/15"
          aria-hidden="true"
        />
        <div className="shell py-24 text-center sm:py-32">
          <span className="eyebrow">Error 404</span>

          <h1 className="mt-5 text-display-sm sm:text-display">
            We couldn&apos;t find that page
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            The studio or location you&apos;re looking for may have moved, closed,
            or never existed here. Try browsing by area instead.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/#browse-counties" className="pill-brand">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Browse all locations
            </Link>
            <Link href="/" className="pill-outline">
              Back to home
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
