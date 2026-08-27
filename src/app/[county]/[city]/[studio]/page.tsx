import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { MapPin, Star, Phone, Mail, Globe, Activity, Award, Navigation, CalendarCheck, Users, ShieldCheck, Accessibility, Car, Clock, Sparkles, Target } from 'lucide-react';
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs';
import EquipmentStrip from '@/components/EquipmentStrip';
import StudioLocationsMap from '@/components/StudioLocationsMap';
import { isOutwardCode } from '@/lib/geo';


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
  business_status?: string;
  outward_code?: string;
  booking_url?: string;
  class_levels?: string[];
  goal_tags?: string[];
  schedule_tags?: string[];
  price_intro_offer?: string;
  booking_platform?: string;
  price_drop_in?: number;
  price_class_pack?: string;
  price_membership?: string;
  class_size_max?: number;
  instructor_qualifications?: string[];
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
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
    alternates: { canonical: `/${county}/${city}/${studio}` },
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
  const BASE = 'https://www.pilatesclassesnear.com';
  const studioUrl = `${BASE}/${studioData.full_url_path}`;

  // Opening hours arrive as { monday: "9:00 AM \u2013 5:00 PM" }. Schema.org wants
  // 24-hour opens/closes, so only ranges we can parse confidently are emitted;
  // a day we cannot read is left out rather than guessed at.
  const DAY_NAMES: Record<string, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  };
  const to24 = (t: string): string | null => {
    const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?[Mm]\.?$/);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = m[2] || '00';
    const pm = m[3].toLowerCase() === 'p';
    if (h === 12) h = pm ? 12 : 0; else if (pm) h += 12;
    return `${String(h).padStart(2, '0')}:${min}`;
  };
  const openingHoursSpec = Object.entries(studioData.opening_hours || {})
    .map(([day, hours]) => {
      const dayName = DAY_NAMES[day.toLowerCase()];
      const parts = String(hours).split(/\u2013|\u2014|-|to/i);
      if (!dayName || parts.length < 2) return null;
      const opens = to24(parts[0]);
      const closes = to24(parts[1]);
      if (!opens || !closes) return null;
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dayName}`,
        opens, closes,
      };
    })
    .filter(Boolean);

  const studioSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: locationData.county.name, item: `${BASE}/${locationData.county.slug}` },
          { '@type': 'ListItem', position: 3, name: locationData.city.name, item: `${BASE}/${locationData.county.slug}/${locationData.city.slug}` },
          { '@type': 'ListItem', position: 4, name: studioData.name, item: studioUrl },
        ],
      },
      {
        '@type': ['LocalBusiness', 'HealthAndBeautyBusiness', 'SportsActivityLocation'],
        '@id': studioUrl,
        name: studioData.name,
        url: studioUrl,
        ...(studioData.description ? { description: studioData.description } : {}),
        ...(studioData.website ? { sameAs: [studioData.website] } : {}),
        ...(studioData.phone ? { telephone: studioData.phone } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: studioData.address,
          addressLocality: studioData.city,
          addressRegion: studioData.county,
          postalCode: studioData.postcode,
          addressCountry: 'GB',
        },
        ...(studioData.latitude && studioData.longitude ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: studioData.latitude,
            longitude: studioData.longitude,
          },
        } : {}),
        // Only emitted with both a score and a count: Google rejects an
        // aggregateRating missing either, and an invalid one can cost the
        // whole rich result.
        ...(studioData.google_rating && studioData.google_review_count ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: studioData.google_rating,
            reviewCount: studioData.google_review_count,
            bestRating: 5,
            worstRating: 1,
          },
        } : {}),
        ...(openingHoursSpec.length ? { openingHoursSpecification: openingHoursSpec } : {}),
        ...(studioData.class_types?.length ? { keywords: studioData.class_types.join(', ') } : {}),
        ...(studioData.price_drop_in ? { priceRange: `\u00a3${studioData.price_drop_in}` } : {}),
        ...(studioData.booking_url ? {
          potentialAction: {
            '@type': 'ReserveAction',
            target: { '@type': 'EntryPoint', urlTemplate: studioData.booking_url },
          },
        } : {}),
      },
    ],
  };
  // Outward code links the studio to its postcode district page.
  const outwardCode = (studioData.postcode || '').trim().split(/\s+/)[0] || null;
  const hasMap = Boolean(studioData.latitude && studioData.longitude);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
      />
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
                {studioData.beginner_friendly && (
                  <span className="chip">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    Beginner friendly
                  </span>
                )}
                {studioData.online_booking_available && !studioData.booking_url && (
                  <span className="chip">
                    <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Book online
                  </span>
                )}
                {studioData.instructor_qualifications?.map((q: string) => (
                  <span key={q} className="chip">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    {q}
                  </span>
                ))}
              </div>

              {(studioData.booking_url || studioData.phone || studioData.website) && (
                <div className="mt-10 flex flex-wrap gap-3">
                  {studioData.booking_url && (
                    <a
                      href={studioData.booking_url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="pill-brand"
                    >
                      <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                      Book a class
                      {studioData.booking_platform ? ` on ${studioData.booking_platform}` : ''}
                    </a>
                  )}
                  {studioData.phone && (
                    <a
                      href={`tel:${studioData.phone}`}
                      className={studioData.booking_url ? 'pill-outline' : 'pill-brand'}
                    >
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
              (studioData.specialties?.length ?? 0) > 0 ||
              (studioData.class_levels?.length ?? 0) > 0 ||
              (studioData.goal_tags?.length ?? 0) > 0) && (
              <section className="card-flat h-full p-7">
                <h2 className="font-fraunces text-xl font-semibold">Classes offered</h2>

                {studioData.class_types && studioData.class_types.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {studioData.class_types.map((type: string, i: number) => (
                      <span key={i} className="chip chip-brand">{type}</span>
                    ))}
                  </div>
                )}

                {studioData.class_levels && studioData.class_levels.length > 0 && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Levels taught
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {studioData.class_levels.map((level: string) => (
                        <span key={level} className="chip">{level}</span>
                      ))}
                    </div>
                  </div>
                )}

                {studioData.goal_tags && studioData.goal_tags.length > 0 && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Good for
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {studioData.goal_tags.map((goal: string) => (
                        <li key={goal} className="flex items-center gap-2.5 text-sm text-ink-muted">
                          <Target className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(studioData.price_drop_in || studioData.price_class_pack ||
                  studioData.price_membership || studioData.class_size_max ||
                  studioData.price_intro_offer) && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Prices
                    </h3>
                    <dl className="mt-3 space-y-2.5 text-sm">
                      {studioData.price_intro_offer && (
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="flex shrink-0 items-center gap-1.5 text-ink-muted">
                            <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                            Intro offer
                          </dt>
                          <dd className="text-right font-semibold text-brand">
                            {studioData.price_intro_offer}
                          </dd>
                        </div>
                      )}
                      {studioData.price_drop_in && (
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-ink-muted">Drop-in</dt>
                          <dd className="font-semibold text-ink">
                            £{Number(studioData.price_drop_in).toFixed(2).replace(/\.00$/, '')}
                          </dd>
                        </div>
                      )}
                      {studioData.price_class_pack && (
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="shrink-0 text-ink-muted">Class pack</dt>
                          <dd className="text-right font-medium text-ink">{studioData.price_class_pack}</dd>
                        </div>
                      )}
                      {studioData.price_membership && (
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="shrink-0 text-ink-muted">Membership</dt>
                          <dd className="text-right font-medium text-ink">{studioData.price_membership}</dd>
                        </div>
                      )}
                      {studioData.class_size_max && (
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-ink-muted">Max class size</dt>
                          <dd className="font-semibold text-ink">{studioData.class_size_max}</dd>
                        </div>
                      )}
                    </dl>
                    <p className="mt-3 text-xs text-ink-faint">
                      Prices from the studio&apos;s own website. Confirm before booking.
                    </p>
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
                      {studioData.city},{' '}
                      {outwardCode ? (
                        <Link
                          href={`/${outwardCode.toLowerCase()}`}
                          className="text-brand underline-offset-4 hover:underline"
                        >
                          {studioData.postcode}
                        </Link>
                      ) : studioData.postcode}
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

              {(studioData.parking_available ||
                (studioData.accessibility_features?.length ?? 0) > 0) && (
                <div className="mt-6 border-t border-line pt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    Getting there
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {studioData.parking_available && (
                      <li className="flex items-center gap-2.5 text-sm text-ink-muted">
                        <Car className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                        Parking available
                      </li>
                    )}
                    {studioData.accessibility_features?.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-ink-muted">
                        <Accessibility className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* --------------------------------------------- Opening hours */}
            {((studioData.opening_hours && Object.keys(studioData.opening_hours).length > 0) ||
              (studioData.schedule_tags?.length ?? 0) > 0) && (
              <section className="card-flat h-full p-7">
                <h2 className="font-fraunces text-xl font-semibold">Opening hours</h2>
                <dl className="mt-6 space-y-2.5">
                  {Object.entries(studioData.opening_hours || {}).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5 text-sm last:border-0 last:pb-0"
                    >
                      <dt className="capitalize text-ink-muted">{day}</dt>
                      <dd className="text-right font-medium text-ink">{String(hours)}</dd>
                    </div>
                  ))}
                </dl>

                {studioData.schedule_tags && studioData.schedule_tags.length > 0 && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Classes run
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {studioData.schedule_tags.map((slot: string) => (
                        <span key={slot} className="chip">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

          </div>

          {/* Ownership: a verified studio shows the badge, everyone else
              gets an invitation to claim. */}
          <section className="rounded-xl border border-line bg-surface-sunken p-7 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-fraunces text-xl font-semibold">
                  {studioData.is_verified
                    ? `${studioData.name} is verified`
                    : `Own ${studioData.name}?`}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                  {studioData.is_verified
                    ? 'The owner has claimed this listing and keeps its details up to date.'
                    : 'Claim this listing to correct anything that is wrong and keep your classes, prices and opening hours current. It is free.'}
                </p>
              </div>
              {!studioData.is_verified && (
                <Link href={`/claim/${studioData.full_url_path}`} className="pill-brand shrink-0">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Claim this listing
                </Link>
              )}
            </div>
          </section>


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
