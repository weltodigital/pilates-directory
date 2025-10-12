import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import EnhancedContent from '@/components/EnhancedContent';
import SEOLocationContent from '@/components/SEOLocationContent';
import LocationStudiosMap from '@/components/LocationStudiosMap';
import Link from 'next/link';
import { MapPin, Star, Users, Activity, Award, Clock, Phone, Heart, Navigation, Search } from 'lucide-react';

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
  faq_content: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
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

async function getCityData(countySlug: string, citySlug: string): Promise<{ location: Location | null; county: County | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  // Get the county first
  const { data: countyData } = await supabase
    .from('public_locations')
    .select('id, name, slug')
    .eq('slug', countySlug)
    .eq('type', 'county')
    .single();

  if (!countyData) {
    return { location: null, county: null };
  }

  // Get the city/town
  const { data: locationData, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', citySlug)
    .eq('county_slug', countySlug)
    .in('type', ['city', 'town'])
    .single();

  if (error || !locationData) {
    return { location: null, county: countyData as County };
  }

  return {
    location: locationData as Location,
    county: countyData as County
  };
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

async function getCityStudios(countySlug: string, citySlug: string): Promise<PilatesStudio[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  // First try exact city match
  let { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', countySlug)
    .eq('city_slug', citySlug)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsFirst: false })
    .order('name');

  // If no exact match, try to match by address containing the city name
  if (!data || data.length === 0) {
    const cityName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const { data: addressData, error: addressError } = await supabase
      .from('pilates_studios')
      .select('*')
      .eq('county_slug', countySlug)
      .ilike('address', `%${cityName}%`)
      .eq('is_active', true)
      .order('google_rating', { ascending: false, nullsFirst: false })
      .order('name');

    if (!addressError) {
      data = addressData;
    }
  }

  if (error) {
    console.error('Error fetching pilates studios:', error);
    return [];
  }

  return data || [];
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { county, city } = await params;
  const { location } = await getCityData(county, city);
  const seoContent = await getSEOContent(`${county}/${city}`);

  if (!location) {
    return {
      title: 'Location Not Found | Pilates Directory - Find Pilates Studios Near You',
      description: 'The requested location could not be found in our pilates studio directory.',
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
        canonical: seoContent.canonical_url || `https://pilatesuk.com/${county}/${city}`
      }
    };
  }

  // Fallback metadata
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
    title: location.seo_title || `Pilates Studios in ${location.name} | Pilates Near Me | Pilates Directory`,
    description: location.meta_description || `Find the best pilates studios in ${location.name}. Browse reformer, mat & clinical pilates classes near you. Read reviews, check schedules & book online. ${location.butcher_count}+ local studios.`,
    keywords: [...localKeywords, ...(location.seo_keywords || [])].join(', '),
    openGraph: {
      title: `Pilates Studios in ${location.name} | Pilates Directory`,
      description: `Discover ${location.butcher_count}+ pilates studios in ${location.name}. Find reformer, mat & clinical pilates classes near you with verified reviews.`,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Pilates Directory',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Pilates Near Me in ${location.name} | Pilates Directory`,
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
      canonical: `https://pilatesuk.com/${county}/${city}`
    }
  };
}

function StructuredData({ location, county, studios }: { location: Location; county: County; studios: PilatesStudio[] }) {
  const schemas = [
    // Main WebPage Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Pilates Studios in ${location.name} | Pilates Near Me`,
      description: `Find the best pilates studios in ${location.name}, ${county.name}. Browse reformer, mat & clinical pilates classes with verified reviews and online booking.`,
      url: `https://pilatesuk.co.uk/${location.full_path}`,
      mainEntity: {
        '@type': 'ItemList',
        name: `Pilates Studios in ${location.name}`,
        description: `Complete directory of pilates studios in ${location.name}, ${county.name}. Find reformer, mat, clinical pilates classes and certified instructors.`,
        numberOfItems: studios.length,
        itemListElement: studios.map((studio, index) => ({
          '@type': 'ExerciseGym',
          '@id': `https://pilatesuk.co.uk/${studio.full_url_path}`,
          position: index + 1,
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
          geo: studio.latitude && studio.longitude ? {
            '@type': 'GeoCoordinates',
            latitude: studio.latitude,
            longitude: studio.longitude
          } : undefined,
          telephone: studio.phone,
          email: studio.email,
          url: studio.website || `https://pilatesuk.co.uk/${studio.full_url_path}`,
          priceRange: studio.price_range || '£15-30',
          paymentAccepted: 'Cash, Credit Card, Online Payment',
          currenciesAccepted: 'GBP',
          aggregateRating: studio.rating ? {
            '@type': 'AggregateRating',
            ratingValue: studio.rating,
            reviewCount: studio.review_count || 0,
            bestRating: 5,
            worstRating: 1
          } : undefined,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Pilates Classes',
            itemListElement: studio.class_types?.map(classType => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: `${classType} Classes`,
                description: `Professional ${classType.toLowerCase()} instruction`,
                provider: {
                  '@type': 'ExerciseGym',
                  name: studio.name
                }
              }
            })) || []
          },
          amenityFeature: studio.equipment_available?.map(equipment => ({
            '@type': 'LocationFeatureSpecification',
            name: equipment,
            value: true
          })) || []
        }))
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://pilatesuk.co.uk/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Pilates Studios in ${county.name}`,
            item: `https://pilatesuk.co.uk/${county.slug}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Pilates Studios in ${location.name}`,
            item: `https://pilatesuk.co.uk/${location.full_path}`
          }
        ]
      }
    },
    // Local Business Collection Schema
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Pilates Near Me in ${location.name}`,
      description: `Find pilates studios near you in ${location.name}. Browse ${studios.length}+ verified studios with online booking.`,
      url: `https://pilatesuk.co.uk/${location.full_path}`,
      mainEntity: {
        '@type': 'Place',
        name: location.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: location.name,
          addressRegion: county.name,
          addressCountry: 'GB'
        }
      }
    },
    // FAQ Schema for local pilates searches
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Where can I find pilates studios near me in ${location.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Pilates Directory lists ${studios.length}+ pilates studios in ${location.name}, ${county.name}. Our directory includes reformer pilates, mat classes, clinical pilates, and specialized programs with verified reviews and online booking options.`
          }
        },
        {
          '@type': 'Question',
          name: `What types of pilates classes are available in ${location.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Pilates studios in ${location.name} offer reformer pilates, mat pilates, clinical pilates, prenatal classes, barre pilates, power pilates, and private sessions. Many studios also provide beginner-friendly classes and specialized rehabilitation programs.`
          }
        },
        {
          '@type': 'Question',
          name: `How much do pilates classes cost in ${location.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Pilates class prices in ${location.name} typically range from £15-30 per session. Many studios offer package deals, monthly memberships, and introductory offers. Private sessions usually cost £50-80.`
          }
        },
        {
          '@type': 'Question',
          name: `Do I need to book pilates classes in advance in ${location.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Most pilates studios in ${location.name} recommend booking classes in advance, especially for popular time slots. Many studios offer online booking systems for convenience. Drop-in classes may also be available.`
          }
        }
      ]
    }
  ];

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

function FAQSection({ faqContent, location, county }: { faqContent: Location['faq_content']; location: Location; county: County }) {
  // Default FAQ if none provided
  const defaultFAQs = [
    {
      question: `What are the best pilates studios in ${location.name}?`,
      answer: `The best pilates studios in ${location.name} include highly-rated facilities offering reformer pilates, mat classes, and clinical pilates. Our directory features verified studios with qualified instructors, modern equipment, and excellent customer reviews.`
    },
    {
      question: `How do I find pilates classes near me in ${location.name}?`,
      answer: `Use our directory to find pilates classes near you in ${location.name}. You can filter by class type (reformer, mat, clinical), time of day, instructor, and studio amenities. Many studios offer online booking for convenience.`
    },
    {
      question: `What should I expect from my first pilates class in ${location.name}?`,
      answer: `Your first pilates class in ${location.name} will typically include an introduction to basic movements, breathing techniques, and equipment if using reformers. Most studios offer beginner-friendly sessions and will provide all necessary equipment.`
    },
    {
      question: `Are there beginner pilates classes available in ${location.name}?`,
      answer: `Yes, most pilates studios in ${location.name} offer beginner-friendly classes. These sessions focus on fundamental movements, proper form, and building core strength gradually. Many studios also offer introductory packages for new clients.`
    }
  ];

  const faqs = faqContent?.questions?.length ? faqContent.questions : defaultFAQs;

  return (
    <div className="faq-section">
      <h2>
        Frequently Asked Questions About Pilates in {location.name}
      </h2>
      <div>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question">{faq.question}</div>
            <div className="faq-answer">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CityPage({ params }: CityPageProps) {
  const { county, city } = await params;
  const { location, county: countyData } = await getCityData(county, city);
  const seoContent = await getSEOContent(`${county}/${city}`);

  if (!location || !countyData) {
    notFound();
  }

  const studios = await getCityStudios(county, city);

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
          studioCount={studios.length}
          locationType="city"
          locationName={location.name}
          countyName={countyData.name}
          countySlug={countyData.slug}
          citySlug={location.slug}
          studios={studios}
        />
      </>
    );
  }

  return (
    <div>
      <StructuredData location={location} county={countyData} studios={studios} />

      <div className="page-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="container">
              {/* Breadcrumbs */}
              <nav className="text-sm text-gray-600 mb-4">
                <ol className="flex space-x-2">
                  <li>
                    <Link href="/" className="hover:text-purple-600">Home</Link>
                  </li>
                  <li className="before:content-['/'] before:mx-2">
                    <Link href={`/${countyData.slug}`} className="hover:text-purple-600">{countyData.name}</Link>
                  </li>
                  <li className="before:content-['/'] before:mx-2 text-gray-900">{location.name}</li>
                </ol>
              </nav>

              {/* Page Header */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {location.h1_title || `Pilates Studios in ${location.name} | Pilates Near Me`}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Find the best pilates studios in {location.name}, {countyData.name}. Browse reformer, mat, and clinical pilates classes with verified reviews and online booking.
              </p>

              {/* Location Meta */}
              <div className="meta-badges">
                <span className="meta-badge primary">
                  <MapPin className="h-3 w-3" />
                  {location.name}, {countyData.name}
                </span>
                <span className="meta-badge success">
                  <Activity className="h-3 w-3" />
                  {studios.length} Studios
                </span>
              </div>


              {/* Intro Text */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {location.intro_text || `Welcome to your comprehensive guide to pilates studios in ${location.name}. Whether you're looking for reformer pilates, mat classes, clinical rehabilitation, or specialized programs, our directory features ${studios.length} verified studios with certified instructors, modern equipment, and flexible scheduling options.`}
              </p>
          </div>
        </div>

        {/* Studios Section - Moved right after header */}
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Results Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Pilates Studios in {location.name} ({studios.length})
                </h2>
              </div>

              {studios.length > 0 ? (
                <div className="studios-grid">
                  {studios.map((studio) => (
                    <div key={studio.id} className="studio-card">
                      {/* Studio Image */}
                      {studio.images && studio.images.length > 0 && (
                        <div style={{width: '100%', height: '12rem', backgroundColor: '#f3f4f6', position: 'relative', overflow: 'hidden', marginBottom: '1rem', borderRadius: '0.5rem'}}>
                          <img
                            src={studio.images[0]}
                            alt={`${studio.name} - Studio Image`}
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                          />
                        </div>
                      )}

                      <div className="studio-header">
                        <div>
                          <div className="studio-name">
                            {studio.name}
                          </div>
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
                          {studio.description || `Professional pilates studio offering comprehensive classes for all fitness levels in ${location.name}.`}
                        </p>

                        {/* Class Types */}
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

                        {/* Features */}
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
                          <button className="btn-secondary">
                            <Heart className="h-3 w-3" />
                          </button>
                          <button className="btn-secondary">
                            <Phone className="h-3 w-3" />
                          </button>
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
                    <Button variant="outline" className="border-purple-600 text-purple-600" asChild>
                      <Link href={`/${countyData.slug}`}>
                        Browse {countyData.name} Studios
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">

            {/* Interactive Map Section */}
            {studios.length > 0 && (
              <div className="mb-8">
                <LocationStudiosMap
                  studios={studios}
                  locationName={location.name}
                  locationType="city"
                />
              </div>
            )}

            {/* Local Pilates Benefits Section */}
            <div className="content-section">
              <h2>
                Why Choose Pilates in {location.name}?
              </h2>
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
                    content={location.main_content || `Discover the comprehensive world of pilates in ${location.name}, ${countyData.name}. Our directory showcases ${studios.length} exceptional pilates studios, each offering unique approaches to this transformative exercise method. From traditional mat work to cutting-edge reformer classes, ${location.name} provides diverse options for every fitness level and preference.\n\nWhether you're seeking injury rehabilitation through clinical pilates, preparing your body during pregnancy with specialized prenatal classes, or looking to enhance your athletic performance, the studios in ${location.name} deliver expert instruction and personalized attention. Many facilities offer trial classes and introductory packages, making it easy to find the perfect fit for your pilates journey.`}
                    locationName={location.name}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Stats */}
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
                          {(studios.reduce((acc, s) => acc + (s.rating || 0), 0) / studios.filter(s => s.rating).length || 0).toFixed(1)}★
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price Range</span>
                      <span className="font-semibold text-purple-600">£15-30</span>
                    </div>
                  </div>
                </div>

                {/* Top Studios */}
                {studios.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-purple-700">Top Rated Studios</h3>
                    <ul className="space-y-3">
                      {studios
                        .filter(s => s.rating)
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 5)
                        .map((studio) => (
                          <li key={studio.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <Link
                              href={`/${studio.full_url_path}`}
                              className="block hover:bg-purple-50 p-2 rounded -m-2 group"
                            >
                              <div className="flex justify-between items-start gap-3">
                                {/* Small thumbnail image */}
                                {studio.images && studio.images.length > 0 && (
                                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    <img
                                      src={studio.images[0]}
                                      alt={`${studio.name}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-purple-600 group-hover:text-purple-700">{studio.name}</h4>
                                  <p className="text-sm text-gray-500 truncate">{studio.address}</p>
                                  {studio.class_types && studio.class_types.length > 0 && (
                                    <p className="text-xs text-gray-400">{studio.class_types.slice(0, 2).join(', ')}</p>
                                  )}
                                </div>
                                <div className="flex items-center ml-2">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium ml-1">{studio.rating?.toFixed(1)}</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Class Types */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Popular Classes</h3>
                  <div className="space-y-2">
                    {['Reformer Pilates', 'Mat Pilates', 'Clinical Pilates', 'Prenatal Pilates', 'Barre Pilates', 'Power Pilates'].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Activity className="h-3 w-3 text-purple-500" />
                        <span className="text-sm text-gray-600">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Explore More</h3>
                  <div className="space-y-3">
                    <Link
                      href={`/${countyData.slug}`}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      <MapPin className="h-4 w-4" />
                      All {countyData.name} Studios
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      <Search className="h-4 w-4" />
                      Search All UK Studios
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <FAQSection faqContent={location.faq_content} location={location} county={countyData} />
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