import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { MapPin, Star, Phone, Mail, Globe, Activity, Award, Navigation } from 'lucide-react';
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs';
import EquipmentStrip from '@/components/EquipmentStrip';
import ReviewsCta from '@/components/ReviewsCta';
import StudioLocationsMap from '@/components/StudioLocationsMap';


interface StudioPageProps {
  params: Promise<{
    county: string;
    city: string;
    studio: string;
  }>;
}

interface PilatesStudio {
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
  instagram?: string;
  facebook?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  review_count: number;
  specialties: string[];
  opening_hours: Record<string, string>;
  images: (string | { url: string; type?: string; attribution?: string; })[];
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
  county_slug: string;
  city_slug: string;
  full_url_path: string;
}

interface Location {
  name: string;
  slug: string;
}

async function getStudio(countySlug: string, citySlug: string, studioSlug: string): Promise<PilatesStudio | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SECRET_KEY
  );

  const fullPath = `${countySlug}/${citySlug}/${studioSlug}`;

  const { data } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('full_url_path', fullPath)
    .eq('is_active', true)
    .single();

  return data as PilatesStudio || null;
}

async function getLocationData(countySlug: string, citySlug: string): Promise<{ county: Location; city: Location } | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SECRET_KEY
  );

  const [countyResult, cityResult] = await Promise.all([
    supabase
      .from('public_locations')
      .select('name, slug')
      .eq('slug', countySlug)
      .eq('type', 'county')
      .single(),
    supabase
      .from('public_locations')
      .select('name, slug')
      .eq('slug', citySlug)
      .eq('county_slug', countySlug)
      .in('type', ['city', 'town'])
      .single()
  ]);

  if (countyResult.error || cityResult.error) {
    return null;
  }

  return {
    county: countyResult.data as Location,
    city: cityResult.data as Location
  };
}

export async function generateMetadata({ params }: StudioPageProps): Promise<Metadata> {
  const { county, city, studio } = await params;
  const studioData = await getStudio(county, city, studio);
  const locationData = await getLocationData(county, city);

  if (!studioData || !locationData) {
    return {
      title: 'Studio Not Found | Pilates Classes Near',
      description: 'The requested pilates studio could not be found.',
    };
  }

  const title = `${studioData.name} | Pilates Studio in ${locationData.city.name} | Pilates Classes Near`;
  const description = `${studioData.description || `Professional pilates studio in ${locationData.city.name}, ${locationData.county.name}. Offering ${studioData.class_types?.join(', ') || 'reformer, mat and clinical pilates'} classes.`} Book online today!`;

  return {
    title,
    description,
    keywords: [
      studioData.name,
      `pilates ${locationData.city.name}`,
      `pilates studio ${locationData.city.name}`,
      `pilates near me ${locationData.city.name}`,
      `${studioData.name} pilates`,
      ...studioData.class_types || [],
      ...studioData.specialties || []
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Pilates Classes Near',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

export default async function StudioPage({ params }: StudioPageProps) {
  const { county, city, studio } = await params;
  const studioData = await getStudio(county, city, studio);
  const locationData = await getLocationData(county, city);

  if (!studioData || !locationData) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: locationData.county.name, href: `/${locationData.county.slug}` },
    { label: locationData.city.name, href: `/${locationData.county.slug}/${locationData.city.slug}` },
    { label: studioData.name }
  ];

  const fullAddress = `${studioData.address}, ${studioData.city}, ${studioData.postcode}`;
  const hasMap = Boolean(studioData.latitude && studioData.longitude);

  return (
    <>
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
              <span className="eyebrow">
                {locationData.city.name}, {locationData.county.name}
              </span>
              <h1 className="mt-4 text-display-sm sm:text-display">
                {studioData.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
                {studioData.description ||
                  `${studioData.name} is a professional pilates studio in ${locationData.city.name}, ${locationData.county.name}, offering expert instruction and modern equipment for every level.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="chip chip-brand">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {locationData.city.name}
                </span>
                {studioData.google_rating && (
                  <span className="chip">
                    <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                    <span className="font-semibold text-ink">{studioData.google_rating}</span>
                    {studioData.google_review_count ? ` · ${studioData.google_review_count} reviews` : ''}
                  </span>
                )}
                {studioData.is_verified && (
                  <span className="chip">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified studio
                  </span>
                )}
              </div>

              {(studioData.phone || studioData.website) && (
                <div className="mt-10 flex flex-wrap gap-3">
                  {studioData.phone && (
                    <a href={`tel:${studioData.phone}`} className="pill-brand">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Call studio
                    </a>
                  )}
                  {studioData.website && (
                    <a
                      href={studioData.website}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="pill-outline"
                    >
                      <Globe className="h-4 w-4" aria-hidden="true" />
                      Visit website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="shell space-y-20 py-20">
          {/* Classes offered / Contact / Opening hours, side by side. Each
              card stretches to the row height so the tops and bottoms line up. */}
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* ------------------------------------------- Classes offered */}
            {((studioData.class_types?.length ?? 0) > 0 ||
              (studioData.equipment_available?.length ?? 0) > 0 ||
              (studioData.specialties?.length ?? 0) > 0) && (
              <section className="card-flat h-full p-7">
                <h2 className="font-fraunces text-xl font-semibold">Classes offered</h2>

                {studioData.class_types && studioData.class_types.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {studioData.class_types.map((type: string, i: number) => (
                      <span key={i} className="chip chip-brand">{type}</span>
                    ))}
                  </div>
                )}

                {studioData.equipment_available && studioData.equipment_available.length > 0 && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Equipment
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {studioData.equipment_available.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-ink-muted">
                          <Activity className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {studioData.specialties && studioData.specialties.length > 0 && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Specialties
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {studioData.specialties.map((item: string, i: number) => (
                        <span key={i} className="chip">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* --------------------------------------------------- Contact */}
            <section className="card-flat h-full p-7">
              <h2 className="font-fraunces text-xl font-semibold">Contact</h2>
              <dl className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Address
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {studioData.address}
                      <br />
                      {studioData.city}, {studioData.postcode}
                    </dd>
                  </div>
                </div>

                {studioData.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                        Phone
                      </dt>
                      <dd className="mt-1.5 text-sm">
                        <a href={`tel:${studioData.phone}`} className="text-brand underline-offset-4 hover:underline">
                          {studioData.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {studioData.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                        Website
                      </dt>
                      <dd className="mt-1.5 text-sm">
                        <a
                          href={studioData.website}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-brand underline-offset-4 hover:underline"
                        >
                          Visit website
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {studioData.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                        Email
                      </dt>
                      <dd className="mt-1.5 break-all text-sm">
                        <a href={`mailto:${studioData.email}`} className="text-brand underline-offset-4 hover:underline">
                          {studioData.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </section>

            {/* --------------------------------------------- Opening hours */}
            {studioData.opening_hours && Object.keys(studioData.opening_hours).length > 0 && (
              <section className="card-flat h-full p-7">
                <h2 className="font-fraunces text-xl font-semibold">Opening hours</h2>
                <dl className="mt-6 space-y-2.5">
                  {Object.entries(studioData.opening_hours).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5 text-sm last:border-0 last:pb-0"
                    >
                      <dt className="capitalize text-ink-muted">{day}</dt>
                      <dd className="text-right font-medium text-ink">{String(hours)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

          </div>

          <ReviewsCta locationName={studioData.name} />

          {/* ------------------------------------------------------- Map */}
          {hasMap && (
            <section>
              <div className="card-flat overflow-hidden">
                <div className="border-b border-line p-6">
                  <h2 className="font-fraunces text-xl font-semibold">Studio location</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Find {studioData.name} at {fullAddress}
                  </p>
                </div>
                <StudioLocationsMap
                  studios={[studioData]}
                  heightClass="h-[26rem]"
                  singleZoom={16}
                />
                <div className="border-t border-line p-6">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-brand"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Get directions
                  </a>
                </div>
              </div>
            </section>
          )}

          <EquipmentStrip />
        </div>
      </main>
    </>
  );
}
