import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { MapPin, Star, Phone, Mail, Globe, Activity, Users, Award, Calendar, Navigation, Instagram, Facebook } from 'lucide-react';
import StudioImage from '@/components/StudioImage';
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs';

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
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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
      images: studioData.images?.length ? [studioData.images[0]] : undefined,
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
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="container">
            <h1>Studio Not Found</h1>
            <p>The requested pilates studio could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: locationData.county.name, href: `/${locationData.county.slug}` },
    { label: locationData.city.name, href: `/${locationData.county.slug}/${locationData.city.slug}` },
    { label: studioData.name }
  ];

  return (
    <>
      <HeaderWithBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="page-container">
        <div className="page-header">
          <div className="container">

          <h1>{studioData.name}</h1>
          <p className="text-gray-700 leading-relaxed">
            {studioData.description || `${studioData.name} is a professional pilates studio located in ${locationData.city.name}, ${locationData.county.name}. We offer comprehensive pilates instruction with qualified instructors and modern equipment to help you achieve your fitness and wellness goals.`}
          </p>

          <div className="meta-badges">
            <span className="meta-badge primary">
              <MapPin className="h-3 w-3" />
              {locationData.city.name}
            </span>
            {studioData.google_rating && (
              <span className="meta-badge success">
                <Star className="h-3 w-3" />
                {studioData.google_rating} ★
              </span>
            )}
            {studioData.is_verified && (
              <span className="meta-badge warning">
                <Award className="h-3 w-3" />
                Verified Studio
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {studioData.phone && (
              <a href={`tel:${studioData.phone}`} className="btn-primary">
                <Phone className="h-4 w-4 mr-2" />
                Call Studio
              </a>
            )}
            {studioData.website && (
              <a href={studioData.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            )}
          </div>

          {/* Studio Images */}
          {studioData.images && studioData.images.length > 0 && (
            <div className="mb-6">
              {/* Main Image */}
              <div className="mb-4">
                <StudioImage
                  src={studioData.images[0]}
                  alt={`${studioData.name} - Main Studio Image`}
                  studioName={studioData.name}
                  containerClassName="w-full h-64 rounded-lg"
                  className="hover:opacity-95 transition-opacity"
                  size="large"
                />
              </div>

              {/* Thumbnail Images */}
              {studioData.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {studioData.images.slice(1).map((image, index) => (
                    <div key={index + 1} className="aspect-square">
                      <StudioImage
                        src={image}
                        alt={`${studioData.name} - Image ${index + 2}`}
                        studioName={studioData.name}
                        containerClassName="w-full h-full rounded-md"
                        className="hover:opacity-90 transition-opacity"
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                {studioData.class_types && studioData.class_types.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">Classes Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {studioData.class_types.map((type: string, index: number) => (
                        <span key={index} className="class-type-badge">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {studioData.equipment_available && studioData.equipment_available.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">Equipment Available</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {studioData.equipment_available.map((equipment: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600">
                          <Activity className="h-4 w-4 text-purple-500" />
                          <span>{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-purple-700">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 font-medium">Address</p>
                      <p className="text-gray-600 text-sm">{studioData.address}</p>
                      <p className="text-gray-600 text-sm">{studioData.city}, {studioData.postcode}</p>
                    </div>
                  </div>
                  {studioData.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Phone</p>
                        <a href={`tel:${studioData.phone}`} className="text-purple-600 hover:text-purple-700 text-sm">
                          {studioData.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {studioData.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Email</p>
                        <a href={`mailto:${studioData.email}`} className="text-purple-600 hover:text-purple-700 text-sm">
                          {studioData.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {studioData.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Website</p>
                        <a href={studioData.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 text-sm">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {(studioData.instagram || studioData.facebook) && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Social Media</h3>
                  <div className="space-y-3">
                    {studioData.instagram && (
                      <a href={studioData.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-purple-600 hover:text-purple-700">
                        <Instagram className="h-4 w-4" />
                        <span>Follow on Instagram</span>
                      </a>
                    )}
                    {studioData.facebook && (
                      <a href={studioData.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-purple-600 hover:text-purple-700">
                        <Facebook className="h-4 w-4" />
                        <span>Follow on Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* Full-width map section */}
          {(studioData.latitude && studioData.longitude) || studioData.address ? (
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Studio Location</h2>
                <p className="text-gray-600">Find {studioData.name} at {studioData.address}, {studioData.city}</p>
              </div>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 mb-6">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(studioData.address + ', ' + studioData.city + ', ' + studioData.postcode)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing location of ${studioData.name}`}
                />
              </div>
              <div className="text-center">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(studioData.address + ', ' + studioData.city + ', ' + studioData.postcode)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </>
  );
}