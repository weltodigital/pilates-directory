import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ShieldCheck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClaimStudioForm from '@/components/ClaimStudioForm'
import { domainOf, isSharedHost } from '@/lib/forms'
import { CONTACT_EMAIL } from '@/lib/site'

interface ClaimPageProps {
  params: Promise<{ path: string[] }>;
}

async function getStudio(fullPath: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;

  const { data } = await createClient(url, key)
    .from('pilates_studios')
    .select('name,city,county,full_url_path,is_verified,website')
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

  // Claims are proved by an email at the studio's own domain. A listing with
  // no website, or one pointing at Facebook or a booking platform, has no
  // domain to check against.
  const studioDomain = domainOf(studio.website);
  const canSelfVerify = Boolean(studioDomain) && !isSharedHost(studioDomain);

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
              {canSelfVerify
                ? `Claim it with an email address at ${studioDomain}. Once we've checked the claim, you get a sign-in of your own for keeping the classes, prices, opening hours and booking link current.`
                : 'Claim it to correct its details and keep classes, prices and opening hours current.'}
            </p>
          </div>
        </section>

        <div className="shell py-16 sm:py-20">
          {canSelfVerify ? (
            <ClaimStudioForm
              studioPath={fullPath}
              studioName={studio.name}
              studioDomain={studioDomain!}
            />
          ) : (
            <div className="card-flat mx-auto max-w-xl p-8 text-center">
              <h2 className="font-fraunces text-2xl font-semibold">
                We&apos;ll need to check this one by hand
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                We confirm ownership using an email address at the studio&apos;s
                own domain.{' '}
                {studio.website
                  ? 'This listing points at a shared host rather than its own website, so there is no domain to check against.'
                  : 'This listing has no website on record, so there is no domain to check against.'}
              </p>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Email us and we&apos;ll sort it out directly.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Claim listing: ${studio.name}`)}`}
                className="pill-brand mt-8"
              >
                Email us about this listing
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
