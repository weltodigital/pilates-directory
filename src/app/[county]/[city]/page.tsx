import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Star, Users, Activity, Clock, Phone, Navigation, Award } from 'lucide-react';
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
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const { location, county } = await getCityData(resolvedParams.county, resolvedParams.city);

  if (!location || !county) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="container">
            <h1>City Not Found</h1>
            <p>The requested city could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const studios = await getCityStudios(resolvedParams.county, resolvedParams.city);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: county.name, href: `/${county.slug}` },
    { label: location.name }
  ];

  return (
    <>
      <HeaderWithBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="page-container">
      <div className="page-header">
        <div className="container">
          <h1>{location.h1_title || `Pilates Studios in ${location.name} | Pilates Near Me`}</h1>
          <p>Find the best pilates studios in {location.name}, {county.name}. Browse reformer, mat, and clinical pilates classes with verified reviews and online booking.</p>

          <div className="meta-badges">
            <span className="meta-badge primary">
              <MapPin className="h-3 w-3" />
              {location.name}, {county.name}
            </span>
            <span className="meta-badge success">
              <Activity className="h-3 w-3" />
              {studios.length} Studios
            </span>
          </div>

          <p>{location.intro_text || `Welcome to your comprehensive guide to pilates studios in ${location.name}. Whether you're looking for reformer pilates, mat classes, clinical rehabilitation, or specialized programs, our directory features ${studios.length} verified studios with certified instructors, modern equipment, and flexible scheduling options.`}</p>
        </div>
      </div>

      {/* Pilates Equipment Images Row */}
      {true && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-left">Shop for Pilates Equipment</h2>
            <style dangerouslySetInnerHTML={{
              __html: `
                .large-pilates-img {
                  width: 160px !important;
                  height: 160px !important;
                  min-width: 160px !important;
                  min-height: 160px !important;
                  max-width: 160px !important;
                  max-height: 160px !important;
                  object-fit: cover !important;
                  flex-shrink: 0 !important;
                  flex-grow: 0 !important;
                  flex-basis: 160px !important;
                  display: block !important;
                }
                .large-pilates-img[style] {
                  width: 160px !important;
                  height: 160px !important;
                }
              `
            }} />
            <div className="flex flex-row gap-4 overflow-x-auto">
              <a href="https://amzn.to/49t6EJH" target="_blank" rel="noopener noreferrer">
                <img
                  src="/5.png?v=4"
                  alt="Pilates Equipment"
                  className="large-pilates-img"
                />
              </a>
              <a href="https://amzn.to/481BQNA" target="_blank" rel="noopener noreferrer">
                <img
                  src="/6.png?v=4"
                  alt="Pilates Equipment"
                  className="large-pilates-img"
                />
              </a>
              <a href="https://amzn.to/3K6X5FM" target="_blank" rel="noopener noreferrer">
                <img
                  src="/7.png?v=4"
                  alt="Pilates Equipment"
                  className="large-pilates-img"
                />
              </a>
              <a href="https://amzn.to/3WWwiyX" target="_blank" rel="noopener noreferrer">
                <img
                  src="/8.png?v=4"
                  alt="Pilates Equipment"
                  className="large-pilates-img"
                />
              </a>
              <a href="https://amzn.to/481w4vC" target="_blank" rel="noopener noreferrer">
                <img
                  src="/9.png?v=4"
                  alt="Pilates Equipment"
                  className="large-pilates-img"
                />
              </a>
              <a href="https://amzn.to/3K6XckG" target="_blank" rel="noopener noreferrer">
                <img
                  src="/10.png?v=4"
                  alt="Pilates Equipment"
                  className="large-pilates-img"
                />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2>Pilates Studios in {location.name} ({studios.length})</h2>
            </div>

            {/* Map Section */}
            {studios.length > 0 && (
              <div className="mb-8">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Studio Locations</h3>
                    <p className="text-sm text-gray-600 mt-1">{studios.length} studios in this area</p>
                  </div>
                  <div className="w-full h-96 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`pilates studios in ${location.name}`)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map showing pilates studios in ${location.name}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {studios.length > 0 ? (
              <div className="studios-grid">
                {studios.map((studio) => (
                  <div key={studio.id} className="studio-card">

                    <div className="studio-header">
                      <div>
                        <div className="studio-name">{studio.name}</div>
                        <div className="studio-location">
                          <MapPin className="h-3 w-3" />
                          {studio.address}
                        </div>
                      </div>
                      {studio.google_rating && (
                        <div className="studio-rating">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{studio.google_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="studio-details">
                      {studio.phone && (
                        <div className="studio-detail-item">
                          <Phone className="h-3 w-3" />
                          <span>{studio.phone}</span>
                        </div>
                      )}
                      {studio.price_range && (
                        <div className="studio-detail-item">
                          <Activity className="h-3 w-3" />
                          <span>{studio.price_range}</span>
                        </div>
                      )}
                      <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.6'}}>
                        {(studio.description || `Professional pilates studio offering comprehensive classes for all fitness levels in ${location.name}.`).split(' ').slice(0, 20).join(' ')}{(studio.description || `Professional pilates studio offering comprehensive classes for all fitness levels in ${location.name}.`).split(' ').length > 20 ? '...' : ''}
                      </p>

                      {studio.class_types && studio.class_types.length > 0 && (
                        <div className="class-types">
                          {studio.class_types.slice(0, 3).map((type: string, index: number) => (
                            <span key={index} className="class-type-badge">
                              {type}
                            </span>
                          ))}
                          {studio.class_types.length > 3 && (
                            <span className="class-type-badge" style={{backgroundColor: '#f1f5f9', color: '#475569'}}>
                              +{studio.class_types.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem'}}>
                        {studio.beginner_friendly && (
                          <span className="studio-detail-item">
                            <Users className="h-3 w-3" />Beginner Friendly
                          </span>
                        )}
                        {studio.online_booking_available && (
                          <span className="studio-detail-item">
                            <Clock className="h-3 w-3" />Online Booking
                          </span>
                        )}
                        {studio.parking_available && (
                          <span className="studio-detail-item">
                            <Navigation className="h-3 w-3" />Parking
                          </span>
                        )}
                      </div>

                      <div className="studio-actions">
                        <Link href={`/${studio.full_url_path}`} className="btn-primary">
                          View Studio
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No pilates studios found in {location.name} yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to discover great pilates studios in this area.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Try searching in nearby areas or contact us to add studios.
                  </p>
                  <button className="btn-secondary">
                    <Link href={`/${county.slug}`}>
                      Browse {county.name} Studios
                    </Link>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="content-section">
            <h2>Why Choose Pilates in {location.name}?</h2>
            <div className="grid">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-700 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Professional Instruction
                </h3>
                <p className="text-gray-600 mb-4">
                  The pilates studios in {location.name} feature certified instructors with extensive training in various pilates methodologies. Whether you're interested in classical pilates, contemporary styles, or clinical applications, you'll find qualified professionals ready to guide your practice.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-700 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community & Support
                </h3>
                <p className="text-gray-600 mb-4">
                  Join a welcoming pilates community in {location.name}. Our featured studios foster supportive environments where beginners feel comfortable and experienced practitioners can challenge themselves. Many offer workshops, events, and continuing education opportunities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-700 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Modern Equipment
                </h3>
                <p className="text-gray-600 mb-4">
                  Studios in {location.name} invest in high-quality pilates equipment including reformers, cadillacs, chairs, and barrels. Many facilities feature state-of-the-art apparatus from leading manufacturers, ensuring safe and effective workouts.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-700 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Flexible Scheduling
                </h3>
                <p className="text-gray-600 mb-4">
                  With {studios.length} studios to choose from in {location.name}, you'll find classes throughout the day to fit your schedule. Many locations offer early morning, lunch-time, and evening sessions, plus weekend options.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2>Complete Guide to Pilates in {location.name}</h2>
                <div dangerouslySetInnerHTML={{
                  __html: location.main_content || `<p>Discover the comprehensive world of pilates in ${location.name}, ${county.name}. Our directory showcases ${studios.length} exceptional pilates studios, each offering unique approaches to this transformative exercise method. From traditional mat work to cutting-edge reformer classes, ${location.name} provides diverse options for every fitness level and preference.</p><p>Whether you're seeking injury rehabilitation through clinical pilates, preparing your body during pregnancy with specialized prenatal classes, or looking to enhance your athletic performance, the studios in ${location.name} deliver expert instruction and personalized attention. Many facilities offer trial classes and introductory packages, making it easy to find the perfect fit for your pilates journey.</p>`
                }} />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-purple-700">At a Glance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Studios</span>
                    <span className="font-semibold text-purple-600">{studios.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-purple-600">{location.name}</span>
                  </div>
                  {studios.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Rating</span>
                      <span className="font-semibold text-purple-600">
                        {(studios.reduce((acc, s) => acc + (s.google_rating || 0), 0) / studios.filter(s => s.google_rating).length || 0).toFixed(1)}★
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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