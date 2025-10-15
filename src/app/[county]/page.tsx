import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Users, Activity } from 'lucide-react';
import HeaderWithBreadcrumbs from '@/components/HeaderWithBreadcrumbs';

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
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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

export async function generateMetadata({ params }: CountyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
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
  const location = await getCountyData(resolvedParams.county);

  if (!location) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="container">
            <h1>County Not Found</h1>
            <p>The requested county could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const citiesAndTowns = await getCitiesAndTowns(resolvedParams.county, location.id);
  const studios = await getCountyStudios(resolvedParams.county);

  // Calculate total studio count - use actual studios count for accurate total
  const totalStudioCount = studios.length;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: location.name }
  ];

  return (
    <>
      <HeaderWithBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="page-container">
      <div className="page-header">
        <div className="container">
          <h1>{location.h1_title || `Pilates Studios in ${location.name} | Find Pilates Classes Near You`}</h1>
          <p>{location.intro_text || `Discover the best pilates studios in ${location.name}. Browse reformer, mat, and clinical pilates classes with verified reviews and online booking.`}</p>

          <div className="meta-badges">
            <span className="meta-badge primary">
              <MapPin className="h-3 w-3" />
              {location.name}
            </span>
            <span className="meta-badge success">
              <Users className="h-3 w-3" />
              {citiesAndTowns.length} Locations
            </span>
            <span className="meta-badge warning">
              <Activity className="h-3 w-3" />
              {totalStudioCount} Studios
            </span>
          </div>


          <p>{location.intro_text || `Welcome to the comprehensive guide to pilates studios in ${location.name}. Whether you're looking for reformer pilates, mat classes, clinical pilates, or specialized programs, our directory features the best studios across ${location.name} with verified reviews, class schedules, and online booking options.`}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2>Pilates Locations In {location.name}</h2>
              <span className="text-sm text-gray-500">{citiesAndTowns.length} locations</span>
            </div>

            <div className="locations-grid">
              {citiesAndTowns.map((city) => (
                <div key={city.id} className="location-card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{city.name}</h3>
                    <span className="text-sm text-gray-500">
                      {(city.studio_count || 0) > 0 ? `${city.studio_count} studios` : 'No studios yet'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {(city.studio_count || 0) > 0
                      ? `Find pilates classes and studios in ${city.name}. Browse reformer, mat, and clinical pilates options.`
                      : `Explore ${city.name} for pilates opportunities. Be the first to discover studios in this area.`
                    }
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/${resolvedParams.county}/${city.slug}`} className="btn-primary flex-1">
                      {(city.studio_count || 0) > 0 ? 'View Studios' : 'Explore Area'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          {studios.length > 0 && (
            <div className="mb-12">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Studios with Locations in {location.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{studios.filter(s => s.latitude && s.longitude).length} studios shown on map</p>
                </div>
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`pilates studios in ${location.name}`)}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
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

          {/* Studio List Section */}
          {studios.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2>All Pilates Studios in {location.name}</h2>
                <span className="text-sm text-gray-500">{studios.length} studios</span>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {studios.map((studio) => (
                    <div key={studio.id} className="border border-gray-100 rounded-lg p-4 hover:border-purple-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{studio.name}</h3>
                        {studio.google_rating && (
                          <span className="text-xs text-yellow-600 font-medium">
                            ★ {studio.google_rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{studio.address}</p>
                      {studio.phone && (
                        <p className="text-xs text-gray-500 mb-3">{studio.phone}</p>
                      )}
                      <div className="flex gap-2">
                        <Link
                          href={`/${studio.full_url_path || `${studio.county_slug}/${studio.city_slug}/${studio.slug || studio.id}`}`}
                          className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {location.main_content && (
            <div className="content-section">
              <div dangerouslySetInnerHTML={{ __html: location.main_content }} />
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data } = await supabase
    .from('public_locations')
    .select('slug')
    .eq('type', 'county')
    .gt('butcher_count', 0);

  return (data || []).map((county) => ({
    county: county.slug,
  }));
}