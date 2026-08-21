import Link from 'next/link'
import { MapPin, Star, Phone, ArrowRight, Navigation } from 'lucide-react'
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs'
import StudioLocationsMap from '@/components/StudioLocationsMap'
import ReviewsCta from '@/components/ReviewsCta'

export interface PostcodeStudio {
  id: string;
  name: string;
  city: string | null;
  county: string | null;
  county_slug: string | null;
  address: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  google_rating: number | null;
  google_review_count: number | null;
  full_url_path: string | null;
}

interface PostcodeDirectoryProps {
  /** Outward code, uppercase: "SW11". */
  code: string;
  /** Area name from postcodes.io, e.g. "London". */
  areaName?: string | null;
  studios: PostcodeStudio[];
  /** Nearby outward codes that also have studios. */
  neighbours?: { code: string; count: number }[];
}

export default function PostcodeDirectory({
  code, areaName, studios, neighbours = [],
}: PostcodeDirectoryProps) {
  const rated = studios.filter(s => s.google_rating);
  const averageRating = rated.length
    ? (rated.reduce((sum, s) => sum + (s.google_rating || 0), 0) / rated.length).toFixed(1)
    : null;

  // Most studios in one postcode district share a town.
  const townCounts = studios.reduce<Record<string, number>>((acc, s) => {
    if (s.city) acc[s.city] = (acc[s.city] || 0) + 1;
    return acc;
  }, {});
  const towns = Object.entries(townCounts).sort((a, b) => b[1] - a[1]);

  const BASE = 'https://www.pilatesclassesnear.com';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: `Pilates studios in ${code}`, item: `${BASE}/${code.toLowerCase()}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Pilates studios in ${code}`,
        numberOfItems: studios.length,
        itemListElement: studios.slice(0, 30).map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'HealthAndBeautyBusiness',
            name: s.name,
            ...(s.full_url_path ? { url: `${BASE}/${s.full_url_path}` } : {}),
            address: {
              '@type': 'PostalAddress',
              streetAddress: s.address || undefined,
              addressLocality: s.city || undefined,
              postalCode: s.postcode || undefined,
              addressCountry: 'GB',
            },
            ...(s.latitude && s.longitude ? {
              geo: { '@type': 'GeoCoordinates', latitude: s.latitude, longitude: s.longitude },
            } : {}),
            ...(s.google_rating && s.google_review_count ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: s.google_rating,
                reviewCount: s.google_review_count,
                bestRating: 5,
              },
            } : {}),
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HeaderWithBreadcrumbs
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: code }]}
      />

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div
            className="blob left-[-12%] top-[-40%] h-[30rem] w-[30rem] bg-brand/15"
            aria-hidden="true"
          />
          <div className="shell py-16 sm:py-20">
            <div className="max-w-3xl">
              <span className="eyebrow">Postcode district</span>
              <h1 className="mt-4 text-display-sm sm:text-display">
                Pilates studios in {code}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
                {studios.length === 1
                  ? `One pilates studio in the ${code} postcode district`
                  : `${studios.length} pilates studios in the ${code} postcode district`}
                {areaName ? `, ${areaName}` : ''}. Sorted by rating, with
                addresses, opening hours and verified Google reviews.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="chip chip-brand">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {code}
                </span>
                <span className="chip">{studios.length} studios</span>
                {averageRating && (
                  <span className="chip">
                    <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                    {averageRating} average
                  </span>
                )}
              </div>

              <div className="mt-10">
                <Link href="/near" className="pill-outline">
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Search another area
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="shell space-y-20 py-20">
          {/* Map */}
          <section>
            <div className="card-flat overflow-hidden">
              <div className="border-b border-line p-6">
                <h2 className="font-fraunces text-xl font-semibold">
                  Studios in {code}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {towns.length > 0 && `Covering ${towns.slice(0, 3).map(([t]) => t).join(', ')}`}
                </p>
              </div>
              <StudioLocationsMap studios={studios as any} heightClass="h-[28rem]" />
            </div>
          </section>

          {/* Listing */}
          <section>
            <span className="eyebrow">Every studio</span>
            <h2 className="mt-3 text-display-sm">Pilates in {code}</h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <article key={studio.id} className="card-flat flex flex-col p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-fraunces text-xl font-semibold leading-snug">
                        {studio.full_url_path ? (
                          <Link href={`/${studio.full_url_path}`} className="transition-colors hover:text-brand">
                            {studio.name}
                          </Link>
                        ) : studio.name}
                      </h3>
                      <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{studio.address}</span>
                      </p>
                    </div>
                    {studio.google_rating && (
                      <span className="chip shrink-0">
                        <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                        <span className="font-semibold text-ink">
                          {studio.google_rating.toFixed(1)}
                        </span>
                      </span>
                    )}
                  </div>

                  {studio.google_review_count ? (
                    <p className="mt-4 text-sm text-ink-faint">
                      {studio.google_review_count} Google review
                      {studio.google_review_count === 1 ? '' : 's'}
                    </p>
                  ) : null}

                  {studio.full_url_path && (
                    <Link
                      href={`/${studio.full_url_path}`}
                      className="mt-auto inline-flex items-center gap-1.5 border-t border-line pt-5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                    >
                      View studio
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Nearby districts */}
          {neighbours.length > 0 && (
            <section>
              <span className="eyebrow">Nearby</span>
              <h2 className="mt-3 text-display-sm">Other postcode districts</h2>
              <div className="mt-8 flex flex-wrap gap-2">
                {neighbours.map((n) => (
                  <Link key={n.code} href={`/${n.code.toLowerCase()}`} className="chip hover:border-brand hover:text-brand">
                    {n.code}
                    <span className="text-ink-faint">{n.count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <ReviewsCta locationName={code} />
        </div>
      </main>
    </>
  );
}
