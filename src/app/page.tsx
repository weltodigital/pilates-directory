import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Phone, Clock, Activity, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Navigation } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import SEOSchemaMarkup from '@/components/SEOSchemaMarkup'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface County {
  id: string;
  name: string;
  slug: string;
  butcher_count: number; // Keep same name for compatibility with existing views
}

interface CityTown {
  id: string;
  name: string;
  slug: string;
  full_path: string;
  county_slug: string;
  butcher_count: number; // Keep same name for compatibility with existing views
  type: 'city' | 'town';
}

interface CountyWithLocations {
  county: County;
  locations: CityTown[];
}

interface PilatesStudio {
  id: string;
  name: string;
  slug?: string;
  description: string;
  address: string;
  postcode: string;
  city: string;
  county: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  review_count: number;
  specialties: string[];
  opening_hours: Record<string, string>;
  images: string[];
  class_types: string[];
  instructor_names: string[];
  price_range?: string;
  membership_options: Record<string, any>;
  equipment_available: string[];
  accessibility_features: string[];
  parking_available: boolean;
  online_booking_available: boolean;
  beginner_friendly: boolean;
  is_verified: boolean;
  is_active: boolean;
  google_place_id?: string;
  google_rating?: number;
  google_review_count: number;
  last_scraped_at?: string;
  created_at: string;
  updated_at: string;
  county_slug: string;
  city_slug: string;
  full_url_path: string;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error('Supabase env vars missing.');
    return null;
  }

  return createClient(url, key);
}

async function getCountiesWithLocations(): Promise<CountyWithLocations[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  // Get all counties
  const { data: counties, error: countiesError } = await supabase
    .from('public_locations')
    .select('id, name, slug, butcher_count')
    .eq('type', 'county')
    .order('name');

  if (countiesError) {
    console.error('Error fetching counties:', countiesError);
    return [];
  }

  // Get all cities and towns
  const { data: citiesAndTowns, error: locationsError } = await supabase
    .from('public_locations')
    .select('id, name, slug, full_path, county_slug, butcher_count, type')
    .in('type', ['city', 'town'])
    .order('name');

  if (locationsError) {
    console.error('Error fetching cities and towns:', locationsError);
    return [];
  }

  // Group locations by county
  return counties.map(county => ({
    county,
    locations: citiesAndTowns.filter(location => location.county_slug === county.slug)
  }));
}

// A studio needs real review volume before a perfect score means anything.
const TOP_RATED_MIN_REVIEWS = 20;
const TOP_RATED_MIN_RATING = 4.5;
// Bayesian prior: how many "average" reviews a studio is credited with before
// its own reviews dominate. Stops 5.0-from-4-reviews outranking 5.0-from-900.
const TOP_RATED_PRIOR_WEIGHT = 50;

async function getTopRatedStudios(limit: number = 6): Promise<PilatesStudio[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('is_active', true)
    .eq('business_status', 'OPERATIONAL')
    .not('google_rating', 'is', null)
    .not('full_url_path', 'is', null)
    .not('county_slug', 'is', null)
    .not('city_slug', 'is', null)
    .gte('google_rating', TOP_RATED_MIN_RATING)
    .gte('google_review_count', TOP_RATED_MIN_REVIEWS)
    // Most-reviewed first so the 1000-row cap keeps the studios that can
    // actually win, making the selection deterministic.
    .order('google_review_count', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('Error fetching top rated studios:', error);
    return [];
  }

  const candidates = (studios || []).filter(studio => {
    if (!studio.full_url_path) return false;
    // Google has no pilates category, so the name is the available signal.
    // Featuring only six studios means precision matters far more than
    // recall - this is what kept a doula off the homepage.
    return /pilates|reformer/i.test(studio.name);
  });

  if (!candidates.length) return [];

  const meanRating =
    candidates.reduce((sum, s) => sum + (s.google_rating || 0), 0) / candidates.length;

  const score = (s: PilatesStudio) => {
    const v = s.google_review_count || 0;
    const r = s.google_rating || 0;
    return (v / (v + TOP_RATED_PRIOR_WEIGHT)) * r +
           (TOP_RATED_PRIOR_WEIGHT / (v + TOP_RATED_PRIOR_WEIGHT)) * meanRating;
  };

  return candidates.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/**
 * Mean Google rating across every rated active studio. PostgREST aggregate
 * functions are disabled on this project, so the ratings are paged through
 * and averaged here. This runs at build time, not per request.
 */
async function getAverageRating(): Promise<number | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const ratings: number[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('pilates_studios')
      .select('google_rating')
      .eq('is_active', true)
      .not('google_rating', 'is', null)
      .range(from, from + 999);

    if (error) {
      console.error('Error fetching ratings:', error);
      return null;
    }
    ratings.push(...data.map(r => r.google_rating as number));
    if (data.length < 1000) break;
  }

  if (!ratings.length) return null;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

function studioHref(studio: PilatesStudio) {
  return `/${studio.full_url_path || `${studio.county_slug}/${studio.city_slug}/${studio.slug || studio.id}`}`;
}

export default async function Home() {
  // Get counties with their associated locations and top rated studios
  const [countiesWithLocations, topRatedStudios, averageRating] = await Promise.all([
    getCountiesWithLocations(),
    getTopRatedStudios(6),
    getAverageRating()
  ]);

  const totalLocations = countiesWithLocations.reduce(
    (sum, { locations }) => sum + locations.length,
    0
  );

  return (
    <>
      <Header />
      <SEOSchemaMarkup page="home" />

      <main>
        {/* ============================================================
            Hero
            ============================================================ */}
        <section className="relative overflow-hidden">
          {/* Organic colour fields */}
          <div
            className="blob left-[-10%] top-[-12%] h-[36rem] w-[36rem] animate-drift bg-brand/20"
            aria-hidden="true"
          />
          <div
            className="blob right-[-14%] top-[6%] h-[30rem] w-[30rem] animate-drift bg-brand-deep/10 [animation-delay:-6s]"
            aria-hidden="true"
          />

          <div className="shell pb-20 pt-16 sm:pb-28 sm:pt-20">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
              {/* Copy */}
              <div className="text-center lg:text-left">
                <span className="chip chip-brand">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  The UK&apos;s pilates directory
                </span>

                <h1 className="mt-7 text-display-sm sm:text-display">
                  Find the perfect pilates studio{' '}
                  <em className="not-italic text-brand [font-variation-settings:'SOFT'_60,'WONK'_1]">
                    near you
                  </em>
                </h1>

                <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted lg:mx-0">
                  Reformer, mat and clinical pilates across the UK — with class
                  schedules, verified reviews and studio details in one place.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link href="#browse-counties" className="pill-brand">
                    Browse all locations
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href="/near" className="pill-outline">
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Find studios near me
                  </Link>
                </div>
              </div>

              {/* Image bubble, with the trust badges orbiting it */}
              <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
                <div className="relative aspect-square">
                  {/* Soft ring behind the photo */}
                  <div
                    className="absolute -inset-4 rounded-full bg-brand/10 blur-2xl"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-0 overflow-hidden rounded-full border-4 border-surface shadow-[0_20px_60px_-20px_hsl(var(--brand)/0.45)]">
                    <Image
                      src="/pilates-classes-near.png"
                      alt="A reformer pilates class in a UK studio"
                      fill
                      priority
                      sizes="(max-width: 1024px) 26rem, 30rem"
                      className="object-cover"
                      style={{ objectPosition: '38% 50%' }}
                    />
                  </div>

                  {/* Orbiting badges. Percentage offsets keep them on the
                      circle's edge as it scales. */}
                  <span className="orbit-chip absolute left-[-6%] top-[10%]">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    Verified listings
                  </span>

                  <span className="orbit-chip absolute right-[-9%] top-[42%]">
                    <Star className="h-4 w-4 shrink-0 fill-brand text-brand" aria-hidden="true" />
                    Real Google reviews
                  </span>

                  <span className="orbit-chip absolute bottom-[8%] left-[2%]">
                    <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    Nationwide coverage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            Stats
            ============================================================ */}
        <section className="shell">
          <div className="rule-fade" />
          <dl className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3">
            {[
              { value: countiesWithLocations.length || '—', label: 'Counties covered' },
              { value: totalLocations || '—', label: 'Towns & cities' },
              {
                value: averageRating ? averageRating.toFixed(1) : '—',
                label: 'Average studio rating',
              },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-fraunces text-4xl font-semibold tracking-tight text-ink">
                  {stat.value}
                </dd>
                <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </dl>
          <div className="rule-fade" />
        </section>

        {/* ============================================================
            Top rated
            ============================================================ */}
        <section id="top-rated-studios" className="band">
          <div className="shell">
            <div className="max-w-2xl">
              <span className="eyebrow">By rating</span>
              <h2 className="mt-4 text-display-sm">Top rated pilates studios</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">
                The highest rated studios in the directory, ranked on verified
                Google reviews — each with at least {TOP_RATED_MIN_REVIEWS} of
                them, so a perfect score actually means something.
              </p>
            </div>

            {topRatedStudios.length > 0 ? (
              <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topRatedStudios.map((studio) => (
                  <article key={studio.id} className="card-flat flex flex-col p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-fraunces text-xl font-semibold leading-snug">
                          <Link
                            href={studioHref(studio)}
                            className="transition-colors hover:text-brand"
                          >
                            {studio.name}
                          </Link>
                        </h3>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">
                            {studio.city}, {studio.county}
                          </span>
                        </p>
                      </div>

                      {studio.google_rating && (
                        <span className="chip shrink-0">
                          <Star
                            className="h-3.5 w-3.5 fill-brand text-brand"
                            aria-hidden="true"
                          />
                          <span className="font-semibold text-ink">
                            {studio.google_rating.toFixed(1)}
                          </span>
                        </span>
                      )}
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                      {studio.description ||
                        `Professional pilates studio in ${studio.city}, ${studio.county} offering expert instruction and quality equipment.`}
                    </p>

                    <dl className="mt-6 space-y-2.5 text-sm text-ink-muted">
                      {studio.opening_hours &&
                        Object.keys(studio.opening_hours).length > 0 && (
                          <div className="flex items-center gap-2.5">
                            <Clock className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                            <dd className="truncate">
                              {Object.values(studio.opening_hours)[0] || 'Opening hours available'}
                            </dd>
                          </div>
                        )}
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
                      <div className="mt-6 flex flex-wrap gap-2">
                        {studio.class_types.slice(0, 3).map((classType, index) => (
                          <span key={index} className="chip chip-brand">
                            {classType}
                          </span>
                        ))}
                        {studio.class_types.length > 3 && (
                          <span className="chip">
                            +{studio.class_types.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-7 flex items-center gap-5 border-t border-line pt-5">
                      <Link
                        href={studioHref(studio)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                      >
                        View studio
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      {studio.website && (
                        <a
                          href={studio.website}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                        >
                          Website
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-14 text-ink-muted">
                No top rated studios available at the moment.
              </p>
            )}
          </div>
        </section>

        {/* ============================================================
            Browse by county
            ============================================================ */}
        <section id="browse-counties" className="band border-t border-line bg-surface-sunken">
          <div className="shell">
            <div className="max-w-2xl">
              <span className="eyebrow">Every corner of the UK</span>
              <h2 className="mt-4 text-display-sm">Browse by location</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">
                Pick a county to see the towns and cities we cover, then drill
                into individual studios.
              </p>
            </div>

            {countiesWithLocations.length > 0 ? (
              <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {countiesWithLocations.map(({ county, locations }) => (
                  <div key={county.id} className="card-flat p-7">
                    <h3 className="font-fraunces text-xl font-semibold">
                      <Link
                        href={`/${county.slug}`}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
                      >
                        {county.name}
                        <ArrowUpRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />
                      </Link>
                    </h3>

                    {locations.length > 0 ? (
                      <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                        {locations.map((location) => (
                          <li key={location.id}>
                            <Link href={`/${location.full_path}`} className="link-quiet text-sm">
                              {location.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-5 border-t border-line pt-5 text-sm text-ink-faint">
                        No cities or towns listed yet
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-14 text-ink-muted">
                No locations available at the moment.
              </p>
            )}
          </div>
        </section>

        {/* ============================================================
            Closing CTA
            ============================================================ */}
        <section className="band">
          <div className="shell">
            <div className="relative overflow-hidden rounded-xl bg-brand-deep px-8 py-20 text-center sm:px-16">
              <div
                className="blob left-1/2 top-[-30%] h-[28rem] w-[28rem] -translate-x-1/2 bg-brand/40"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-display-sm text-white">
                  Ready to start your practice?
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-white/70">
                  Browse verified studios, compare classes and find an
                  instructor that fits — wherever you are in the UK.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="#browse-counties"
                    className="pill bg-white text-ink hover:bg-white/90"
                  >
                    Find studios near you
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="#top-rated-studios"
                    className="pill border border-white/25 text-white hover:bg-white/10"
                  >
                    Explore top rated studios
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
