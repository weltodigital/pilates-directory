import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import EnhancedContent from '@/components/EnhancedContent';
import SEOLocationContent from '@/components/SEOLocationContent';
import LocationStudiosMap from '@/components/LocationStudiosMap';
import Link from 'next/link';
import { MapPin, Star, Users, Activity, Clock, Phone, Heart } from 'lucide-react';
// import { Button } from '@/components/ui/button';
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

  const location = await getCountyData(county);
  const seoContent = await getSEOContent(county);

  if (!location) {
    return (
      <div className="container" style={{padding: '2rem', textAlign: 'center'}}>
        <h1 style={{color: '#9333ea', marginBottom: '1rem'}}>County Not Found</h1>
        <p>Sorry, we couldn't find information for this county.</p>
        <Link href="/" className="btn" style={{marginTop: '1rem', display: 'inline-block'}}>
          Back to Homepage
        </Link>
      </div>
    );
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
                        <button className="btn-primary flex-1">
                          <Link href={`/${studio.full_url_path}`}>
                            View Studio
                          </Link>
                        </button>
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
    <div className="page-container">
      <StructuredData county={location} citiesAndTowns={citiesAndTowns} featuredStudios={featuredStudios} />
        {/* Header Section */}
        <div className="page-header">
          <div className="container">

              {/* Page Header */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {location.h1_title || `Pilates Studios in ${location.name} | Find Pilates Classes Near You`}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Discover the best pilates studios in {location.name}. Browse reformer, mat, and clinical pilates classes with verified reviews and online booking.
              </p>

              {/* County Meta */}
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
                  {location.butcher_count}+ Studios
                </span>
                {featuredStudios.length > 0 && (
                  <span className="meta-badge warning">
                    <Star className="h-3 w-3" />
                    Avg Rating: {(featuredStudios.reduce((acc, s) => acc + (s.rating || 0), 0) / featuredStudios.length).toFixed(1)}
                  </span>
                )}
              </div>


              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button className="btn-primary">
                  <Activity className="h-4 w-4 mr-2" />
                  Find Studios Near Me
                </button>
                <button className="btn-secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  View Class Schedules
                </button>
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
                  <button className="btn-secondary">
                    View All Studios
                  </button>
                </div>

                <div className="studios-grid">
                  {featuredStudios.slice(0, 6).map((studio) => (
                    <div key={studio.id} className="studio-card">
                      <div className="studio-header">
                        <div>
                          <div className="studio-name">{studio.name}</div>
                          <div className="studio-location">
                            <MapPin className="h-3 w-3" />
                            {studio.city}
                          </div>
                        </div>
                        {studio.rating && (
                          <div className="studio-rating">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{studio.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="studio-details">
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
                            <button className="btn-primary flex-1">
                              View Studio
                            </button>
                            <button className="btn-secondary">
                              <Heart className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
            <div className="content-section">
              <h2>
                Pilates Studios by Location in {location.name}
              </h2>

              {citiesAndTowns.length > 0 ? (
                <div className="locations-grid">
                  {citiesAndTowns.map((place) => (
                    <Link
                      key={place.id}
                      href={`/${place.full_path}`}
                      className="location-card"
                    >
                      <div className="studio-header">
                        <div>
                          <div className="studio-name">{place.name}</div>
                          <div className="studio-location">
                            <MapPin className="h-3 w-3" />
                            {place.type}
                          </div>
                        </div>
                        <span className="class-type-badge">
                          {place.butcher_count} Studios
                        </span>
                      </div>

                      <div className="studio-details">
                        <div className="studio-detail-item">
                          <Activity className="h-3 w-3" />
                          Reformer • Mat • Clinical Classes
                        </div>
                        <div className="studio-actions">
                          <span className="btn-primary">
                            Find Studios Near Me →
                          </span>
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
            <div className="content-section">
              <h2>
                Why Choose Pilates in {location.name}?
              </h2>
              <div className="grid">
                <div>
                  <h3>🏋️ Diverse Class Options</h3>
                  <p>
                    From reformer pilates to mat classes, {location.name} offers a comprehensive range of pilates styles. Whether you're seeking clinical pilates for injury rehabilitation, prenatal classes for expecting mothers, or high-energy power pilates, you'll find certified instructors and well-equipped studios throughout the region.
                  </p>
                </div>
                <div>
                  <h3>⭐ Quality & Excellence</h3>
                  <p>
                    The pilates studios in {location.name} maintain high standards with qualified instructors, modern equipment, and welcoming environments. Many studios offer trial classes, flexible membership options, and personalized attention to help you achieve your fitness goals.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <h2>
                Frequently Asked Questions About Pilates in {location.name}
              </h2>
              <div>
                <div className="faq-item">
                  <div className="faq-question">
                    What pilates studios are near me in {location.name}?
                  </div>
                  <div className="faq-answer">
                    Our directory features {location.butcher_count}+ pilates studios across {location.name}, including locations in {citiesAndTowns.slice(0, 4).map(c => c.name).join(', ')}. Use our search filters to find studios by location, class type, or specialty services.
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    How much do pilates classes cost in {location.name}?
                  </div>
                  <div className="faq-answer">
                    Pilates class prices in {location.name} typically range from £15-30 per session, with many studios offering package deals, monthly memberships, and introductory offers. Private sessions usually cost £50-80, while group classes are more affordable.
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    What types of pilates are available near me?
                  </div>
                  <div className="faq-answer">
                    Studios in {location.name} offer reformer pilates, mat pilates, clinical pilates, prenatal and postnatal classes, barre pilates, and specialized programs. Many locations also provide private sessions and small group training.
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid">
              {/* Main Content */}
              <div>
                <div className="content-section">
                  <h2>
                    Complete Guide to Pilates in {location.name}
                  </h2>
                  <EnhancedContent
                    content={location.main_content || `Discover the vibrant pilates community in ${location.name}, where wellness meets expertise. Our comprehensive directory connects you with the best pilates studios, certified instructors, and diverse class offerings across the region. Whether you're a beginner looking to start your pilates journey or an experienced practitioner seeking advanced training, ${location.name} has something for everyone.`}
                    locationName={location.name}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Quick Stats */}
                <div className="sidebar">
                  <h3>Quick Stats</h3>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                      <span>Total Studios</span>
                      <span style={{fontWeight: '600', color: '#9333ea'}}>{location.butcher_count}+</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                      <span>Locations</span>
                      <span style={{fontWeight: '600', color: '#9333ea'}}>{citiesAndTowns.length}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                      <span>Avg. Rating</span>
                      <span style={{fontWeight: '600', color: '#9333ea'}}>4.8★</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>Price Range</span>
                      <span style={{fontWeight: '600', color: '#9333ea'}}>£15-30</span>
                    </div>
                  </div>
                </div>

                {/* Popular Locations */}
                {citiesAndTowns.length > 0 && (
                  <div className="sidebar">
                    <h3>Top Locations</h3>
                    <ul>
                      {citiesAndTowns
                        .sort((a, b) => (b.butcher_count || 0) - (a.butcher_count || 0))
                        .slice(0, 8)
                        .map((place) => (
                          <li key={place.id}>
                            <Link
                              href={`/${place.full_path}`}
                            >
                              <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <MapPin className="h-3 w-3" />
                                {place.name}
                              </span>
                              <span>
                                {place.butcher_count} studios
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Class Types */}
                <div className="sidebar">
                  <h3>Popular Class Types</h3>
                  <div className="class-types">
                    {['Reformer Pilates', 'Mat Pilates', 'Clinical Pilates', 'Prenatal', 'Barre Pilates', 'Power Pilates'].map((type: string) => (
                      <span key={type} className="class-type-badge">
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