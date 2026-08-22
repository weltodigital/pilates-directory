import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Users, Activity, Star, ArrowRight } from 'lucide-react';
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs';
import EquipmentStrip from '@/components/EquipmentStrip';
import ReviewsCta from '@/components/ReviewsCta';
import StudioLocationsMap from '@/components/StudioLocationsMap';
import PostcodeDirectory from '@/components/PostcodeDirectory';
import { isOutwardCode } from '@/lib/geo';

interface CountyPageProps {
  params: Promise<{
    county: string;
  }>;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  full_path: string;
  seo_title: string;
  seo_description: string;
  meta_description: string;
  h1_title: string;
  intro_text: string;
  main_content: string;
  butcher_count: number;
  seo_keywords: string[];
  parent_id?: string;
  county_slug?: string;
  studio_count?: number;
}

interface PilatesStudio {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  county_slug: string;
  city_slug: string;
  slug?: string;
  full_url_path?: string;
  google_rating?: number;
  phone?: string;
  website?: string;
  description?: string;
  city: string;
  county: string;
}


async function getCountyData(countySlug: string): Promise<Location | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', countySlug)
    .eq('type', 'county')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getCitiesAndTowns(countySlug: string, countyId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Try both approaches - parent_id and county_slug
  let { data, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('parent_id', countyId)
    .in('type', ['city', 'town'])
    .order('name');

  // If no results with parent_id, try county_slug
  if (!data || data.length === 0) {
    console.log('No results with parent_id, trying county_slug...');
    const result = await supabase
      .from('public_locations')
      .select('*')
      .eq('county_slug', countySlug)
      .in('type', ['city', 'town'])
      .order('name');

    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Error fetching cities and towns:', error);
  }

  // Get studio counts for each city
  const citiesWithStudioCounts = await Promise.all(
    (data || []).map(async (city) => {
      const { count } = await supabase
        .from('pilates_studios')
        .select('*', { count: 'exact', head: true })
        .eq('county_slug', countySlug)
        .eq('city_slug', city.slug)
        .eq('is_active', true);

      return {
        ...city,
        studio_count: count || 0
      };
    })
  );

  // Filter out cities with 0 studios only for Greater Manchester
  const citiesWithStudios = countySlug === 'greater-manchester'
    ? citiesWithStudioCounts.filter(city => (city.studio_count || 0) > 0)
    : citiesWithStudioCounts;

  console.log(`Cities/towns for county ${countySlug} (${countyId}):`, citiesWithStudios?.length || 0);

  return citiesWithStudios || [];
}

async function getCountyStudios(countySlug: string): Promise<PilatesStudio[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', countySlug)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsFirst: false })
    .order('name'); // Remove coordinate filter and limit to include ALL studios

  if (error) {
    console.error('Error fetching county studios:', error);
    return [];
  }

  return data || [];
}

/**
 * Postcode districts live at the root alongside counties (/sw11, /kent).
 * Next.js allows only one dynamic segment per level, so this route serves
 * both and branches on the shape of the slug. No county slug matches the
 * outward-code pattern, so the two can never collide.
 */
async function getPostcodeStudios(code: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('id,name,city,county,county_slug,address,postcode,latitude,longitude,google_rating,google_review_count,full_url_path')
    .eq('is_active', true)
    .ilike('outward_code', code)
    .order('google_rating', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching postcode studios:', error);
    return [];
  }
  return data || [];
}

/** Other districts sharing this one's postcode area, e.g. SW11 -> SW1, SW4. */
async function getNeighbouringCodes(code: string) {
  const area = code.replace(/[0-9].*$/, '');
  if (!area) return [];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
  const { data } = await supabase
    .from('pilates_studios')
    .select('outward_code')
    .eq('is_active', true)
    .ilike('outward_code', `${area}%`)
    .limit(1000);

  const counts = (data || []).reduce<Record<string, number>>((acc, r: any) => {
    const c = (r.outward_code || '').toUpperCase();
    if (c && c !== code.toUpperCase()) acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([c, count]) => ({ code: c, count }));
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

export async function generateMetadata({ params }: CountyPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  if (isOutwardCode(resolvedParams.county)) {
    const code = resolvedParams.county.toUpperCase();
    const studios = await getPostcodeStudios(resolvedParams.county);
    if (!studios.length) {
      return { title: 'Postcode Not Found | Pilates Classes Near' };
    }
    const towns = Array.from(new Set(studios.map((s: any) => s.city).filter(Boolean))).slice(0, 3);
    return {
      title: `Pilates Studios in ${code} | ${studios.length} Studios Near You`,
      description: `Find ${studios.length} pilates studios in the ${code} postcode district${towns.length ? ` covering ${towns.join(', ')}` : ''}. Compare ratings, opening hours and verified Google reviews.`,
      alternates: { canonical: `/${resolvedParams.county}` },
      robots: { index: true, follow: true },
    };
  }

  const location = await getCountyData(resolvedParams.county);

  if (!location) {
    return {
      title: 'County Not Found | Pilates Classes Near',
      description: 'The requested county page could not be found.',
    };
  }

  const pilatesKeywords = [
    `pilates ${location.name}`,
    `pilates studios ${location.name}`,
    `pilates classes ${location.name}`,
    `pilates near me ${location.name}`,
    `reformer pilates ${location.name}`,
    `mat pilates ${location.name}`,
    `clinical pilates ${location.name}`,
    `${location.name} pilates directory`,
    `${location.name} fitness studios`,
    `best pilates ${location.name}`
  ];

  return {
    title: location.seo_title || `Pilates Studios in ${location.name} | Find Pilates Classes Near You`,
    alternates: { canonical: `/${resolvedParams.county}` },
    description: location.meta_description || `Find the best pilates studios in ${location.name}. Browse reformer, mat & clinical pilates classes. Read reviews, check schedules & book online. ${location.butcher_count}+ studios listed.`,
    keywords: [...pilatesKeywords, ...(location.seo_keywords || [])].join(', '),
    openGraph: {
      title: location.seo_title || `Pilates Studios in ${location.name}`,
      description: location.meta_description || `Find the best pilates studios in ${location.name}. Browse reformer, mat & clinical pilates classes.`,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Pilates Classes Near',
    },
    twitter: {
      card: 'summary_large_image',
      title: location.seo_title || `Pilates Studios in ${location.name}`,
      description: location.meta_description || `Find the best pilates studios in ${location.name}.`,
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

export default async function CountyPage({ params }: CountyPageProps) {
  const resolvedParams = await params;

  // Postcode district rather than a county.
  if (isOutwardCode(resolvedParams.county)) {
    const code = resolvedParams.county.toUpperCase();
    const [studios, neighbours] = await Promise.all([
      getPostcodeStudios(resolvedParams.county),
      getNeighbouringCodes(code),
    ]);
    if (!studios.length) notFound();

    let areaName: string | null = null;
    try {
      const res = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(code)}`, {
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const j = await res.json();
        areaName = j.result?.admin_district?.[0] || j.result?.region || null;
      }
    } catch {
      // Area name is decoration; the page stands without it.
    }

    return (
      <PostcodeDirectory
        code={code}
        areaName={areaName}
        studios={studios as any}
        neighbours={neighbours}
      />
    );
  }

  const location = await getCountyData(resolvedParams.county);

  if (!location) {
    notFound();
  }

  const citiesAndTowns = await getCitiesAndTowns(resolvedParams.county, location.id);
  const studios = await getCountyStudios(resolvedParams.county);

  const totalStudioCount = studios.length;

  // A county page listing every studio is unusable and enormous: London's 479
  // cards produce 3.5MB of HTML. Show the best of them and let the town pages
  // carry the rest - they are the better landing pages anyway, and this
  // concentrates internal links on them.
  const COUNTY_LIST_LIMIT = 24;
  const countyMean = studios.length
    ? studios.reduce((sum, s: any) => sum + (s.google_rating || 0), 0) / studios.length
    : 0;
  const rank = (s: any) => {
    const v = s.google_review_count || 0;
    const r = s.google_rating || 0;
    const m = 50;   // same Bayesian prior as the homepage
    return (v / (v + m)) * r + (m / (v + m)) * countyMean;
  };
  const listedStudios = [...studios].sort((a, b) => rank(b) - rank(a)).slice(0, COUNTY_LIST_LIMIT);
  const hasMoreStudios = studios.length > listedStudios.length;

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
          { '@type': 'ListItem', position: 2, name: location.name, item: `${BASE}/${resolvedParams.county}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Pilates studios in ${location.name}`,
        numberOfItems: listedStudios.length,
        itemListElement: listedStudios.map((s: any, i: number) => ({
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

  const mappableStudios = studios.filter(s => s.latitude && s.longitude).length;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
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
              <span className="eyebrow">County guide</span>
              <h1 className="mt-4 text-display-sm sm:text-display">
                {location.h1_title || `Pilates studios in ${location.name}`}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
                {location.intro_text ||
                  `Discover the best pilates studios in ${location.name}. Browse reformer, mat and clinical pilates classes with verified reviews and online booking.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="chip chip-brand">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {location.name}
                </span>
                <span className="chip">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {citiesAndTowns.length} locations
                </span>
                <span className="chip">
                  <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                  {totalStudioCount} studios
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="shell space-y-20 py-20">
          <EquipmentStrip />

          {/* ------------------------------------------------- Locations */}
          <section id="browse-towns">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Towns &amp; cities</span>
                <h2 className="mt-3 text-display-sm">
                  Pilates locations in {location.name}
                </h2>
              </div>
              <span className="text-sm text-ink-faint">
                {citiesAndTowns.length} locations
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {citiesAndTowns.map((city) => (
                <article key={city.id} className="card-flat flex flex-col p-7">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-fraunces text-xl font-semibold">
                      {city.name}
                    </h3>
                    <span className="chip shrink-0">
                      {(city.studio_count || 0) > 0
                        ? `${city.studio_count} studios`
                        : 'None yet'}
                    </span>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                    {(city.studio_count || 0) > 0
                      ? `Find pilates classes and studios in ${city.name}. Browse reformer, mat and clinical pilates options.`
                      : `Explore ${city.name} for pilates opportunities. Be the first to discover studios in this area.`}
                  </p>
                  <Link
                    href={`/${resolvedParams.county}/${city.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 border-t border-line pt-5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                  >
                    {(city.studio_count || 0) > 0 ? 'View studios' : 'Explore area'}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <ReviewsCta locationName={location.name} />

          {/* ------------------------------------------------------- Map */}
          {studios.length > 0 && (
            <section>
              <div className="card-flat overflow-hidden">
                <div className="border-b border-line p-6">
                  <h3 className="font-fraunces text-xl font-semibold">
                    Studios with locations in {location.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {mappableStudios} of {studios.length} studios shown on the map
                  </p>
                </div>
                <StudioLocationsMap studios={studios.map(toMapStudio)} heightClass="h-[28rem]" />
              </div>
            </section>
          )}

          {/* ---------------------------------------------- Studio index */}
          {studios.length > 0 && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="eyebrow">Full directory</span>
                  <h2 className="mt-3 text-display-sm">
                    {hasMoreStudios
                      ? `Top rated studios in ${location.name}`
                      : `All pilates studios in ${location.name}`}
                  </h2>
                </div>
                <span className="text-sm text-ink-faint">
                  {hasMoreStudios
                    ? `${listedStudios.length} of ${studios.length} studios`
                    : `${studios.length} studios`}
                </span>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {listedStudios.map((studio) => (
                  <Link
                    key={studio.id}
                    href={`/${studio.full_url_path || `${studio.county_slug}/${studio.city_slug}/${studio.slug || studio.id}`}`}
                    className="card-flat block p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-ink">
                        {studio.name}
                      </h3>
                      {studio.google_rating && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand">
                          <Star className="h-3 w-3 fill-brand" aria-hidden="true" />
                          {studio.google_rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {studio.address}
                    </p>
                    {studio.phone && (
                      <p className="mt-1 text-xs text-ink-faint">{studio.phone}</p>
                    )}
                  </Link>
                ))}
              </div>

              {hasMoreStudios && (
                <p className="mt-8 text-sm text-ink-muted">
                  Showing the {listedStudios.length} highest rated of{' '}
                  {studios.length} studios in {location.name}.{' '}
                  <a href="#browse-towns" className="font-semibold text-brand underline-offset-4 hover:underline">
                    Browse by town
                  </a>{' '}
                  to see them all.
                </p>
              )}
            </section>
          )}

          {/* --------------------------------------------------- Content */}
          {location.main_content && (
            <section className="prose-editorial">
              <div dangerouslySetInnerHTML={{ __html: location.main_content }} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}


export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data } = await supabase
    .from('public_locations')
    .select('slug')
    .eq('type', 'county')
    .gt('butcher_count', 0);

  const counties = (data || []).map((county) => ({ county: county.slug }));

  // Prerender postcode districts carrying enough studios to be worth a page.
  // Thinner districts still resolve, rendered on demand.
  let studios: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data: page } = await supabase
      .from('pilates_studios')
      .select('outward_code')
      .eq('is_active', true)
      .not('outward_code', 'is', null)
      .range(from, from + 999);
    if (!page || !page.length) break;
    studios = studios.concat(page);
    if (page.length < 1000) break;
  }

  const counts = studios.reduce<Record<string, number>>((acc, r) => {
    const c = (r.outward_code || '').toLowerCase();
    if (c) acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const postcodes = Object.entries(counts)
    .filter(([, n]) => n >= 3)
    .map(([code]) => ({ county: code }));

  return [...counties, ...postcodes];
}