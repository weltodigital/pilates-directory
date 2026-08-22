import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ShieldCheck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClaimStudioForm from '@/components/ClaimStudioForm'

interface ClaimPageProps {
  params: Promise<{ path: string[] }>;
}

async function getStudio(fullPath: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;

  const { data } = await createClient(url, key)
    .from('pilates_studios')
    .select('name,city,county,full_url_path,is_verified')
    .eq('full_url_path', fullPath)
    .eq('is_active', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: ClaimPageProps): Promise<Metadata> {
  const { path } = await params;
  const studio = await getStudio(path.join('/'));
  if (!studio) return { title: 'Studio Not Found | Pilates Classes Near' };
  return {
    title: `Claim ${studio.name} | Pilates Classes Near`,
    description: `Claim the listing for ${studio.name} to keep its classes, prices and opening hours up to date.`,
    robots: { index: false, follow: true },
  };
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { path } = await params;
  const fullPath = path.join('/');
  const studio = await getStudio(fullPath);
  if (!studio) notFound();

  return (
    <>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: studio.name, href: `/${fullPath}` },
          { label: 'Claim' },
        ]}
      />

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="blob left-1/2 top-[-30%] h-[28rem] w-[28rem] -translate-x-1/2 bg-brand/15" aria-hidden="true" />
          <div className="shell py-16 text-center sm:py-20">
            <span className="chip chip-brand">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Free to claim
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-display-sm">
              Claim {studio.name}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {studio.city ? `${studio.city}, ${studio.county}. ` : ''}
              Claim this listing to correct its details and keep classes, prices
              and opening hours current.
            </p>
          </div>
        </section>

        <div className="shell py-16 sm:py-20">
          <ClaimStudioForm studioPath={fullPath} studioName={studio.name} />
        </div>
      </main>

      <Footer />
    </>
  )
}
