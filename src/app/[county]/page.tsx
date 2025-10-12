import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import EnhancedContent from '@/components/EnhancedContent';
import SEOLocationContent from '@/components/SEOLocationContent';
import LocationStudiosMap from '@/components/LocationStudiosMap';
import Link from 'next/link';
import { MapPin, Star, Users, Activity, Award, Clock, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  butcher_count: number; // renamed for compatibility but shows studio count
  seo_keywords: string[];
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

  return data as Location;
}

async function getSEOContent(locationSlug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data, error } = await supabase
    .from('location_seo_content')
    .select('*')
    .eq('location_slug', locationSlug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getFeaturedStudios(countySlug: string, limit = 6) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', countySlug)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(limit);

  return data || [];
}

async function getAllCountyStudios(countySlug: string) {
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
    .order('name');

  if (error) {
    console.error('Error fetching county studios:', error);
    return [];
  }

  return data || [];
}

async function getCountyCitiesAndTowns(countySlug: string): Promise<Location[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', countySlug)
    .in('type', ['city', 'town'])
    .order('name');

  if (error) {
    console.error('Error fetching cities and towns:', error);
    return [];
  }

  return data as Location[];
}

export async function generateMetadata({ params }: CountyPageProps): Promise<Metadata> {
  const { county } = await params;
  const location = await getCountyData(county);
  const seoContent = await getSEOContent(county);

  if (!location) {
    return {
      title: 'County Not Found | Pilates Directory - Find Pilates Studios Near You',
      description: 'The requested county could not be found in our pilates studio directory.',
    };
  }

  // Use SEO content if available, otherwise fallback to default
  if (seoContent) {
    return {
      title: seoContent.meta_title,
      description: seoContent.meta_description,
      keywords: seoContent.meta_keywords?.join(', '),
      openGraph: {
        title: seoContent.og_title || seoContent.meta_title,
        description: seoContent.og_description || seoContent.meta_description,
        type: 'website',
        locale: 'en_GB',
        siteName: 'Pilates Directory',
        url: seoContent.canonical_url,
      },
      twitter: {
        card: 'summary_large_image',
        title: seoContent.twitter_title || seoContent.meta_title,
        description: seoContent.twitter_description || seoContent.meta_description,
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
      alternates: {
        canonical: seoContent.canonical_url || `https://pilatesuk.com/${county}`
      }
    };
  }

  // Fallback metadata
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
    title: location.seo_title || `Pilates Studios in ${location.name} | Find Pilates Classes Near You | Pilates Directory`,
    description: location.meta_description || `Find the best pilates studios in ${location.name}. Browse reformer, mat & clinical pilates classes. Read reviews, check schedules & book online. ${location.butcher_count}+ studios listed.`,
    keywords: [...pilatesKeywords, ...(location.seo_keywords || [])].join(', '),
    openGraph: {
      title: `Pilates Studios in ${location.name} | Pilates Directory`,
      description: `Discover ${location.butcher_count}+ pilates studios in ${location.name}. Find reformer, mat & clinical pilates classes near you.`,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Pilates Directory',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Pilates Studios in ${location.name} | Pilates Directory`,
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
    alternates: {
      canonical: `https://pilatesuk.com/${county}`
    }
  };
}

function StructuredData({ county, citiesAndTowns, featuredStudios }: { county: Location; citiesAndTowns: Location[]; featuredStudios: any[] }) {
  const schemas = [
    // WebPage Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Pilates Studios in ${county.name} | Pilates Directory`,
      description: `Find the best pilates studios in ${county.name}. Browse reformer, mat & clinical pilates classes with verified reviews and online booking.`,
      url: `https://pilatesuk.co.uk/${county.slug}`,
      mainEntity: {
        '@type': 'Place',
        name: county.name,
        description: `Pilates studios and fitness centers in ${county.name}`,
        containsPlace: citiesAndTowns.map(place => ({
          '@type': place.type === 'city' ? 'City' : 'Place',
          name: place.name,
          url: `https://pilatesuk.co.uk/${place.full_path}`
        }))
      }
    },
    // FAQ Schema for "Pilates Near Me" queries
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Where can I find pilates studios near me in ${county.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Pilates Directory lists ${county.butcher_count}+ pilates studios across ${county.name}. You can find studios offering reformer pilates, mat classes, clinical pilates, and specialized programs in cities like ${citiesAndTowns.slice(0, 3).map(c => c.name).join(', ')}.`
          }
        },
        {
          '@type': 'Question',
          name: `What types of pilates classes are available in ${county.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Studios in ${county.name} offer various pilates styles including reformer pilates, mat pilates, clinical pilates, prenatal pilates, barre pilates, and private sessions. Many studios also provide beginner-friendly classes and specialized programs.`
          }
        },
        {
          '@type': 'Question',
          name: `How much do pilates classes cost in ${county.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Pilates class prices in ${county.name} typically range from £15-30 per session, with package deals and memberships often available. Private sessions usually cost £50-80. Many studios offer trial classes and introductory packages for new clients.`
          }
        }
      ]
    }
  ];

  // Add business schemas for featured studios
  featuredStudios.forEach(studio => {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ExerciseGym',
      name: studio.name,
      description: studio.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: studio.address,
        addressLocality: studio.city,
        addressRegion: studio.county,
        postalCode: studio.postcode,
        addressCountry: 'GB'
      },
      url: studio.website || `https://pilatesuk.co.uk/${studio.full_url_path}`,
      geo: studio.latitude && studio.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: studio.latitude,
        longitude: studio.longitude
      } : undefined,
      aggregateRating: studio.rating ? {
        '@type': 'AggregateRating',
        ratingValue: studio.rating,
        reviewCount: studio.review_count || 0,
        bestRating: 5
      } : undefined
    });
  });

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}

export default async function CountyPage({ params }: CountyPageProps) {
  const { county } = await params;
  console.log('County page accessed with param:', county);

  // Temporary debugging return - to test if routing works at all
  if (county === 'debug-test') {
    return (
      <div style={{padding: '2rem', background: '#f0f0f0'}}>
        <h1>DEBUG: County page is working!</h1>
        <p>Parameter: {county}</p>
        <p>This proves the dynamic routing is functioning.</p>
      </div>
    );
  }

  const location = await getCountyData(county);
  const seoContent = await getSEOContent(county);

  console.log('Location found:', !!location);
  if (location) {
    console.log('Location name:', location.name);
  }

  if (!location) {
    console.log('Location not found, calling notFound()');
    notFound();
  }

  const citiesAndTowns = await getCountyCitiesAndTowns(county);
  const featuredStudios = await getFeaturedStudios(county);
  const allStudios = await getAllCountyStudios(county);

  // If we have SEO content, use the dedicated SEO component
  if (seoContent) {
    return (
      <>
        {seoContent.schema_data && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoContent.schema_data, null, 2) }}
          />
        )}
        <SEOLocationContent
          seoContent={seoContent}
          studioCount={location.butcher_count}
          locationType="county"
          locationName={location.name}
          citiesAndTowns={citiesAndTowns}
        />
        {allStudios.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <LocationStudiosMap
              studios={allStudios}
              locationName={location.name}
              locationType="county"
            />
          </div>
        )}
        {featuredStudios.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Pilates Studios in {location.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.slice(0, 6).map((studio) => (
                <Card key={studio.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{studio.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {studio.city}
                        </CardDescription>
                      </div>
                      {studio.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{studio.rating}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {studio.description || `Professional pilates studio offering a range of classes for all levels.`}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                          <Link href={`/${studio.full_url_path}`}>
                            View Studio
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <StructuredData county={location} citiesAndTowns={citiesAndTowns} featuredStudios={featuredStudios} />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">

              {/* Page Header */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {location.h1_title || `Pilates Studios in ${location.name} | Find Pilates Classes Near You`}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Discover the best pilates studios in {location.name}. Browse reformer, mat, and clinical pilates classes with verified reviews and online booking.
              </p>

              {/* County Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location.name}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {citiesAndTowns.length} Locations
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {location.butcher_count}+ Studios
                </span>
                {featuredStudios.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Avg Rating: {(featuredStudios.reduce((acc, s) => acc + (s.rating || 0), 0) / featuredStudios.length).toFixed(1)}
                  </span>
                )}
              </div>


              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Activity className="h-4 w-4 mr-2" />
                  Find Studios Near Me
                </Button>
                <Button variant="outline" size="lg" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Clock className="h-4 w-4 mr-2" />
                  View Class Schedules
                </Button>
              </div>

              {/* Intro Text */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {location.intro_text || `Welcome to the comprehensive guide to pilates studios in ${location.name}. Whether you're looking for reformer pilates, mat classes, clinical pilates, or specialized programs, our directory features the best studios across ${location.name} with verified reviews, class schedules, and online booking options.`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Featured Studios */}
            {featuredStudios.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Featured Pilates Studios in {location.name}
                  </h2>
                  <Button variant="outline" className="border-purple-600 text-purple-600">
                    View All Studios
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {featuredStudios.slice(0, 6).map((studio) => (
                    <Card key={studio.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{studio.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {studio.city}
                            </CardDescription>
                          </div>
                          {studio.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{studio.rating}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {studio.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{studio.phone}</span>
                            </div>
                          )}
                          {studio.price_range && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Activity className="h-3 w-3" />
                              <span>{studio.price_range}</span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {studio.description || `Professional pilates studio offering a range of classes for all levels.`}
                          </p>
                          {studio.class_types && studio.class_types.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {studio.class_types.slice(0, 3).map((type, index) => (
                                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                              View Studio
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Map Section */}
            {allStudios.length > 0 && (
              <div className="mb-12">
                <LocationStudiosMap
                  studios={allStudios}
                  locationName={location.name}
                  locationType="county"
                />
              </div>
            )}

            {/* Cities and Towns Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Pilates Studios by Location in {location.name}
              </h2>

              {citiesAndTowns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {citiesAndTowns.map((place) => (
                    <Link
                      key={place.id}
                      href={`/${place.full_path}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{place.name}</h3>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm capitalize flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {place.type}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Activity className="h-3 w-3 text-purple-500" />
                          {place.butcher_count} Pilates Studios
                        </p>
                        <p className="text-xs text-gray-500">
                          Reformer • Mat • Clinical • Prenatal Classes
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700 transition-colors">
                          Find Studios Near Me →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">
                    No specific locations found in {location.name}.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Browse our main directory or contact us to add pilates studios in this area.
                  </p>
                </div>
              )}
            </div>

            {/* SEO Content Section */}
            <div className="mb-12">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Choose Pilates in {location.name}?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">🏋️ Diverse Class Options</h3>
                    <p className="text-gray-600 mb-4">
                      From reformer pilates to mat classes, {location.name} offers a comprehensive range of pilates styles. Whether you're seeking clinical pilates for injury rehabilitation, prenatal classes for expecting mothers, or high-energy power pilates, you'll find certified instructors and well-equipped studios throughout the region.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">⭐ Quality & Excellence</h3>
                    <p className="text-gray-600 mb-4">
                      The pilates studios in {location.name} maintain high standards with qualified instructors, modern equipment, and welcoming environments. Many studios offer trial classes, flexible membership options, and personalized attention to help you achieve your fitness goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions About Pilates in {location.name}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      What pilates studios are near me in {location.name}?
                    </h3>
                    <p className="text-gray-600">
                      Our directory features {location.butcher_count}+ pilates studios across {location.name}, including locations in {citiesAndTowns.slice(0, 4).map(c => c.name).join(', ')}. Use our search filters to find studios by location, class type, or specialty services.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      How much do pilates classes cost in {location.name}?
                    </h3>
                    <p className="text-gray-600">
                      Pilates class prices in {location.name} typically range from £15-30 per session, with many studios offering package deals, monthly memberships, and introductory offers. Private sessions usually cost £50-80, while group classes are more affordable.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      What types of pilates are available near me?
                    </h3>
                    <p className="text-gray-600">
                      Studios in {location.name} offer reformer pilates, mat pilates, clinical pilates, prenatal and postnatal classes, barre pilates, and specialized programs. Many locations also provide private sessions and small group training.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Complete Guide to Pilates in {location.name}
                  </h2>
                  <EnhancedContent
                    content={location.main_content || `Discover the vibrant pilates community in ${location.name}, where wellness meets expertise. Our comprehensive directory connects you with the best pilates studios, certified instructors, and diverse class offerings across the region. Whether you're a beginner looking to start your pilates journey or an experienced practitioner seeking advanced training, ${location.name} has something for everyone.`}
                    locationName={location.name}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Studios</span>
                      <span className="font-semibold text-purple-600">{location.butcher_count}+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Locations</span>
                      <span className="font-semibold text-purple-600">{citiesAndTowns.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Rating</span>
                      <span className="font-semibold text-purple-600">4.8★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price Range</span>
                      <span className="font-semibold text-purple-600">£15-30</span>
                    </div>
                  </div>
                </div>

                {/* Popular Locations */}
                {citiesAndTowns.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-purple-700">Top Locations</h3>
                    <ul className="space-y-2">
                      {citiesAndTowns
                        .sort((a, b) => (b.butcher_count || 0) - (a.butcher_count || 0))
                        .slice(0, 8)
                        .map((place) => (
                          <li key={place.id}>
                            <Link
                              href={`/${place.full_path}`}
                              className="text-purple-600 hover:text-purple-800 hover:underline flex justify-between items-center group"
                            >
                              <span className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-gray-400 group-hover:text-purple-500" />
                                {place.name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {place.butcher_count} studios
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Class Types */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Popular Class Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Reformer Pilates', 'Mat Pilates', 'Clinical Pilates', 'Prenatal', 'Barre Pilates', 'Power Pilates'].map((type) => (
                      <span key={type} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {type}
                      </span>
                    ))}
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

    const { data: counties } = await supabase
      .from('public_locations')
      .select('slug')
      .eq('type', 'county');

    return counties?.map((county) => ({
      county: county.slug,
    })) || [];
  } catch (error) {
    console.error('Error generating county static params:', error);
    return [];
  }
}