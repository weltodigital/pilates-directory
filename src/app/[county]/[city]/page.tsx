import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Users, Activity, Clock, Phone, Navigation, Award, ArrowRight } from 'lucide-react';
import EquipmentStrip from '@/components/EquipmentStrip';
import ReviewsCta from '@/components/ReviewsCta';
import StudioLocationsMap from '@/components/StudioLocationsMap';
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs';

interface CityPageProps {
  params: Promise<{
    county: string;
    city: string;
  }>;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  county_slug: string;
  full_path: string;
  seo_title: string;
  seo_description: string;
  meta_description: string;
  h1_title: string;
  intro_text: string;
  main_content: string;
  butcher_count: number;
  seo_keywords: string[];
}

interface County {
  id: string;
  name: string;
  slug: string;
}

interface PilatesStudio {
  latitude?: number;
  longitude?: number;
  id: string;
  name: string;
  description: string;
  address: string;
  postcode: string;
  city: string;
  county: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  review_count: number;
  specialties: string[];
  images: string[];
  class_types: string[];
  price_range?: string;
  beginner_friendly: boolean;
  online_booking_available: boolean;
  parking_available: boolean;
  is_active: boolean;
  google_rating?: number;
  full_url_path: string;
}

async function getCityData(countySlug: string, citySlug: string): Promise<{ location: Location | null; county: County | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: countyData } = await supabase
    .from('public_locations')
    .select('id, name, slug')
    .eq('slug', countySlug)
    .eq('type', 'county')
    .single();

  if (!countyData) {
    return { location: null, county: null };
  }

  const { data: locationData } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', citySlug)
    .eq('county_slug', countySlug)
    .in('type', ['city', 'town'])
    .single();

  if (!locationData) {
    return { location: null, county: countyData as County };
  }

  return {
    location: locationData as Location,
    county: countyData as County
  };
}

async function getCityStudios(countySlug: string, citySlug: string): Promise<PilatesStudio[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', countySlug)
    .eq('city_slug', citySlug)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsFirst: false })
    .order('name');

  return data || [];
}

/**
 * Trim a studio to the fields the map actually renders.
 *
 * StudioLocationsMap is a client component, so anything handed to it is
 * serialised into the RSC payload and shipped to the browser twice. A full
 * studio row is ~5KB - description, class_types, opening_hours, field_sources -
 * against the ~270 bytes the map needs. On a county with 479 studios that was
 * 2.25MB of payload nobody reads.
 */
function toMapStudio(s: any) {
  return {
    id: s.id,
    name: s.name,
    latitude: s.latitude,
    longitude: s.longitude,
    full_url_path: s.full_url_path,
    address: s.address,
    google_rating: s.google_rating,
    google_review_count: s.google_review_count,
  };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { location } = await getCityData(resolvedParams.county, resolvedParams.city);

  if (!location) {
    return {
      title: 'Location Not Found | Pilates Classes Near',
      description: 'The requested location could not be found.',
    };
  }

  const localKeywords = [
    `pilates ${location.name}`,
    `pilates near me ${location.name}`,
    `pilates studios near me ${location.name}`,
    `pilates classes near me ${location.name}`,
    `reformer pilates ${location.name}`,
    `mat pilates ${location.name}`,
    `clinical pilates ${location.name}`,
    `pilates instructors ${location.name}`,
    `best pilates ${location.name}`,
    `${location.name} pilates directory`,
    `${location.name} fitness studios`,
    `pilates ${location.name} booking`
  ];

  return {
    title: location.seo_title || `Pilates Studios in ${location.name} | Pilates Near Me | Pilates Classes Near`,
    description: location.meta_description || `Find the best pilates studios in ${location.name}. Browse reformer, mat & clinical pilates classes near you. Read reviews, check schedules & book online. ${location.butcher_count}+ local studios.`,
    keywords: [...localKeywords, ...(location.seo_keywords || [])].join(', '),
    alternates: { canonical: `/${resolvedParams.county}/${resolvedParams.city}` },
    openGraph: {
      title: `Pilates Studios in ${location.name} | Pilates Classes Near`,
      description: `Discover ${location.butcher_count}+ pilates studios in ${location.name}. Find reformer, mat & clinical pilates classes near you with verified reviews.`,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Pilates Classes Near',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Pilates Near Me in ${location.name} | Pilates Classes Near`,
      description: `Find the best pilates studios in ${location.name}. Browse classes, read reviews & book online.`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

const CITY_BENEFITS = [
  {
    icon: Activity,
    title: 'Professional instruction',
    body: (name: string) =>
      `Studios in ${name} feature certified instructors with extensive training across pilates methodologies. Classical, contemporary or clinical — you'll find qualified professionals to guide your practice.`,
  },
  {
    icon: Users,
    title: 'Community & support',
    body: (name: string) =>
      `Join a welcoming pilates community in ${name}. Featured studios foster supportive environments where beginners feel comfortable and experienced practitioners can push themselves.`,
  },
  {
    icon: Award,
    title: 'Modern equipment',
    body: (name: string) =>
      `Studios in ${name} invest in high-quality apparatus — reformers, cadillacs, chairs and barrels — from leading manufacturers, for safe and effective sessions.`,
  },
  {
    icon: Clock,
    title: 'Flexible scheduling',
    body: (name: string) =>
      `Classes run throughout the day in ${name}, with early morning, lunchtime and evening sessions, plus weekend options to fit around work.`,
  },
];

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const { location, county } = await getCityData(resolvedParams.county, resolvedParams.city);

  if (!location || !county) {
    notFound();
  }

  const studios = await getCityStudios(resolvedParams.county, resolvedParams.city);

  // Postcode districts covered by this town, so the district pages are
  // reachable rather than orphaned.
  const districtCounts = studios.reduce<Record<string, number>>((acc, s: any) => {
    const code = (s.postcode || '').trim().split(/\s+/)[0];
    if (code) acc[code.toUpperCase()] = (acc[code.toUpperCase()] || 0) + 1;
    return acc;
  }, {});
  const postcodeDistricts = Object.entries(districtCounts)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => ({ code, count }));


  // ItemList so a location page is machine-readable as a ranked directory
  // listing, matching what the postcode pages already emit.
  const BASE = 'https://www.pilatesclassesnear.com';
  const listSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: county.name, item: `${BASE}/${county.slug}` },
          { '@type': 'ListItem', position: 3, name: location.name, item: `${BASE}/${county.slug}/${location.slug}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Pilates studios in ${location.name}`,
        numberOfItems: studios.length,
        itemListElement: studios.slice(0, 30).map((s: any, i: number) => ({
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

  const ratedStudios = studios.filter(s => s.google_rating);
  const averageRating = ratedStudios.length
    ? (ratedStudios.reduce((acc, s) => acc + (s.google_rating || 0), 0) / ratedStudios.length).toFixed(1)
    : null;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: county.name, href: `/${county.slug}` },
    { label: location.name }
  ];

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <HeaderWithBreadcrumbs breadcrumbs={breadcrumbs} />

      <main>
        {/* ---------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div
            className="blob left-[-12%] top-[-40%] h-[30rem] w-[30rem] bg-brand/15"
            aria-hidden="true"
          />
          <div className="shell py-16 sm:py-20">
            <div className="max-w-3xl">
              <span className="eyebrow">{county.name}</span>
              <h1 className="mt-4 text-display-sm sm:text-display">
                {location.h1_title || `Pilates studios in ${location.name}`}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
                {location.intro_text ||
                  `Find the best pilates studios in ${location.name}, ${county.name}. Browse reformer, mat and clinical pilates classes with verified reviews and online booking.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="chip chip-brand">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {location.name}, {county.name}
                </span>
                <span className="chip">
                  <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                  {studios.length} studios
                </span>
                {averageRating && (
                  <span className="chip">
                    <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                    {averageRating} average
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="shell space-y-20 py-20">
          <EquipmentStrip />

          {postcodeDistricts.length > 0 && (
            <section>
              <span className="eyebrow">By postcode</span>
              <h2 className="mt-3 text-display-sm">
                Postcode districts in {location.name}
              </h2>
              <div className="mt-8 flex flex-wrap gap-2">
                {postcodeDistricts.map(({ code, count }) => (
                  <Link
                    key={code}
                    href={`/${code.toLowerCase()}`}
                    className="chip hover:border-brand hover:text-brand"
                  >
                    {code}
                    <span className="text-ink-faint">{count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <ReviewsCta locationName={location.name} />

          {/* ------------------------------------------------------- Map */}
          {studios.length > 0 && (
            <section>
              <div className="card-flat overflow-hidden">
                <div className="border-b border-line p-6">
                  <h3 className="font-fraunces text-xl font-semibold">Studio locations</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {studios.filter(s => s.latitude && s.longitude).length} of {studios.length} studios shown on the map
                  </p>
                </div>
                <StudioLocationsMap studios={studios.map(toMapStudio)} heightClass="h-[28rem]" />
              </div>
            </section>
          )}

          {/* --------------------------------------------------- Studios */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Directory</span>
                <h2 className="mt-3 text-display-sm">
                  Pilates studios in {location.name}
                </h2>
              </div>
              <span className="text-sm text-ink-faint">{studios.length} studios</span>
            </div>

            {studios.length > 0 ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {studios.map((studio) => {
                  const blurb = studio.description ||
                    `Professional pilates studio offering classes for all levels in ${location.name}.`;
                  const words = blurb.split(' ');
                  const excerpt = words.slice(0, 20).join(' ') + (words.length > 20 ? '…' : '');

                  return (
                    <article key={studio.id} className="card-flat flex flex-col p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-fraunces text-xl font-semibold leading-snug">
                            <Link
                              href={`/${studio.full_url_path}`}
                              className="transition-colors hover:text-brand"
                            >
                              {studio.name}
                            </Link>
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

                      <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                        {excerpt}
                      </p>

                      <dl className="mt-5 space-y-2.5 text-sm text-ink-muted">
                        {studio.phone && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                            <dd>{studio.phone}</dd>
                          </div>
                        )}
                        {studio.price_range && (
                          <div className="flex items-center gap-2.5">
                            <Activity className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                            <dd>{studio.price_range}</dd>
                          </div>
                        )}
                      </dl>

                      {studio.class_types && studio.class_types.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {studio.class_types.slice(0, 3).map((type: string, index: number) => (
                            <span key={index} className="chip chip-brand">{type}</span>
                          ))}
                          {studio.class_types.length > 3 && (
                            <span className="chip">+{studio.class_types.length - 3}</span>
                          )}
                        </div>
                      )}

                      {(studio.beginner_friendly || studio.online_booking_available || studio.parking_available) && (
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-faint">
                          {studio.beginner_friendly && (
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" aria-hidden="true" />
                              Beginner friendly
                            </span>
                          )}
                          {studio.online_booking_available && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              Online booking
                            </span>
                          )}
                          {studio.parking_available && (
                            <span className="inline-flex items-center gap-1.5">
                              <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                              Parking
                            </span>
                          )}
                        </div>
                      )}

                      <Link
                        href={`/${studio.full_url_path}`}
                        className="mt-auto inline-flex items-center gap-1.5 border-t border-line pt-5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                      >
                        View studio
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="card-flat mt-10 px-8 py-16 text-center">
                <Activity className="mx-auto h-12 w-12 text-ink-faint" aria-hidden="true" />
                <h3 className="mt-6 font-fraunces text-xl font-semibold">
                  No pilates studios in {location.name} yet
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                  Try a nearby area, or get in touch to have studios added here.
                </p>
                <Link href={`/${county.slug}`} className="pill-outline mt-8">
                  Browse {county.name} studios
                </Link>
              </div>
            )}
          </section>

          {/* -------------------------------------------------- Benefits */}
          <section>
            <span className="eyebrow">What to expect</span>
            <h2 className="mt-3 text-display-sm">
              Why choose pilates in {location.name}?
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {CITY_BENEFITS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="card-flat p-7">
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-4 font-fraunces text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {body(location.name)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* --------------------------------------------- Guide + facts */}
          <section className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="eyebrow">Local guide</span>
              <h2 className="mt-3 text-display-sm">
                Complete guide to pilates in {location.name}
              </h2>
              <div className="prose-editorial mt-8">
                <div dangerouslySetInnerHTML={{
                  __html: location.main_content || `<p>Discover the world of pilates in ${location.name}, ${county.name}. Our directory showcases ${studios.length} studios, each offering their own approach — from traditional mat work to reformer classes.</p><p>Whether you are seeking rehabilitation through clinical pilates, specialised prenatal classes, or a way to enhance athletic performance, studios in ${location.name} offer expert instruction and personal attention. Many run trial classes and introductory packages, so it is easy to find the right fit.</p>`
                }} />
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="card-flat p-7 lg:sticky lg:top-28">
                <h3 className="font-fraunces text-xl font-semibold">At a glance</h3>
                <dl className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-ink-muted">Total studios</dt>
                    <dd className="font-semibold text-ink">{studios.length}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-ink-muted">Location</dt>
                    <dd className="font-semibold text-ink">{location.name}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-ink-muted">County</dt>
                    <dd className="font-semibold text-ink">{county.name}</dd>
                  </div>
                  {averageRating && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-ink-muted">Average rating</dt>
                      <dd className="inline-flex items-center gap-1 font-semibold text-ink">
                        <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                        {averageRating}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data: citiesAndTowns } = await supabase
      .from('public_locations')
      .select('slug, county_slug')
      .in('type', ['city', 'town']);

    return citiesAndTowns?.map((location) => ({
      county: location.county_slug,
      city: location.slug,
    })) || [];
  } catch (error) {
    console.error('Error generating city static params:', error);
    return [];
  }
}