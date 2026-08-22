import { Metadata } from 'next'
import { PlusCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AddStudioForm from '@/components/AddStudioForm'

export const metadata: Metadata = {
  title: 'Add Your Pilates Studio | Free Listing',
  description:
    'Add your pilates studio to the UK\'s largest directory. Free listing with your classes, prices, opening hours and booking link.',
  alternates: { canonical: '/add-studio' },
}

export default function AddStudioPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Add a studio' }]} />

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="blob left-1/2 top-[-30%] h-[30rem] w-[30rem] -translate-x-1/2 bg-brand/15" aria-hidden="true" />
          <div className="shell py-16 text-center sm:py-20">
            <span className="chip chip-brand">
              <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Free listing
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-display-sm sm:text-display">
              Add your pilates studio
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Not listed yet? Tell us about your studio and we&apos;ll add it.
              There&apos;s no charge, and you can claim the listing afterwards to
              keep it up to date.
            </p>
          </div>
        </section>

        <div className="shell py-16 sm:py-20">
          <AddStudioForm />
        </div>
      </main>

      <Footer />
    </>
  )
}
