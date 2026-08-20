import React from 'react'
import Link from 'next/link'
import { MapPin, Star, Phone, Clock, Activity, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'
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

async function getFeaturedPilatesStudios(limit: number = 6): Promise<PilatesStudio[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('is_active', true)
    .not('google_rating', 'is', null)
    .not('full_url_path', 'is', null)
    .not('county_slug', 'is', null)
    .not('city_slug', 'is', null)
    .gte('google_rating', 4.0)
    .order('google_rating', { ascending: false })
    .limit(limit * 2);

  if (error) {
    console.error('Error fetching featured studios:', error);
    return [];
  }

  // Filter studios to ensure they have complete URL information
  const validStudios = (studios || []).filter(studio => {
    return studio.full_url_path ||
           (studio.county_slug && studio.city_slug && (studio.slug || studio.id));
  }).slice(0, limit);

  return validStudios;
}

function studioHref(studio: PilatesStudio) {
  return `/${studio.full_url_path || `${studio.county_slug}/${studio.city_slug}/${studio.slug || studio.id}`}`;
}

export default async function Home() {
  // Get counties with their associated locations and featured studios
  const [countiesWithLocations, featuredStudios] = await Promise.all([
    getCountiesWithLocations(),
    getFeaturedPilatesStudios(6)
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

          <div className="shell pb-20 pt-20 sm:pb-28 sm:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <span className="chip chip-brand">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                The UK&apos;s pilates directory
              </span>

              <h1 className="mt-7 text-display-sm sm:text-display lg:text-display-lg">
                Find the perfect pilates studio{' '}
                <em className="not-italic text-brand [font-variation-settings:'SOFT'_60,'WONK'_1]">
                  near you
                </em>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
                Reformer, mat and clinical pilates across the UK — with class
                schedules, verified reviews and studio details in one place.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="#browse-counties" className="pill-brand">
                  Browse all locations
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="#featured-studios" className="pill-outline">
                  View featured studios
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-faint">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                  Verified listings
                </span>
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-brand" aria-hidden="true" />
                  Real Google reviews
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  Nationwide coverage
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            Stats
            ============================================================ */}
        <section className="shell">
          <div className="rule-fade" />
          <dl className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
            {[
              { value: countiesWithLocations.length || '—', label: 'Counties covered' },
              { value: totalLocations || '—', label: 'Towns & cities' },
              { value: '4.0+', label: 'Minimum rating' },
              { value: 'Weekly', label: 'Data refresh' },
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
            Featured studios
            ============================================================ */}
        <section id="featured-studios" className="band">
          <div className="shell">
            <div className="max-w-2xl">
              <span className="eyebrow">Handpicked</span>
              <h2 className="mt-4 text-display-sm">Featured pilates studios</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">
                Top-rated studios from across the directory, each with a verified
                Google rating of 4.0 or higher.
              </p>
            </div>

            {featuredStudios.length > 0 ? (
              <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredStudios.map((studio) => (
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
                No featured studios available at the moment.
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
                    href="#featured-studios"
                    className="pill border border-white/25 text-white hover:bg-white/10"
                  >
                    Explore featured studios
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
