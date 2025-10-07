import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { MapPin, Star, Phone, Clock, Mail, Globe, ArrowLeft, Activity, Users, Award, Heart, Share2, Calendar, Navigation, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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

interface Location {
  name: string;
  slug: string;
}

async function getStudio(countySlug: string, citySlug: string, studioSlug: string): Promise<PilatesStudio | null> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const fullPath = `${countySlug}/${citySlug}/${studioSlug}`;

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('full_url_path', fullPath)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error('Error fetching studio:', error);
    return null;
  }

  return data as PilatesStudio;
}

async function getLocationData(countySlug: string, citySlug: string): Promise<{ county: Location; city: Location } | null> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      title: 'Studio Not Found | PilatesUK - Find Pilates Studios Near You',
      description: 'The requested pilates studio could not be found.',
    };
  }

  const title = `${studioData.name} | Pilates Studio in ${locationData.city.name} | PilatesUK`;
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
      siteName: 'PilatesUK',
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
    alternates: {
      canonical: `https://pilatesuk.co.uk/${county}/${city}/${studio}`
    }
  };
}

function StudioSchema({ studio, county, city }: { studio: PilatesStudio; county: Location; city: Location }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    '@id': `https://pilatesuk.co.uk/${studio.full_url_path}`,
    name: studio.name,
    description: studio.description,
    image: studio.images?.length ? studio.images : [`https://pilatesuk.co.uk/images/studios/${studio.id}-1.jpg`],
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
      reviewCount: studio.review_count,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pilates Classes and Services',
      itemListElement: studio.class_types?.map(classType => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `${classType} Classes`,
          description: `Professional ${classType.toLowerCase()} instruction at ${studio.name}`,
          provider: {
            '@type': 'ExerciseGym',
            name: studio.name
          }
        }
      })) || []
    },
    amenityFeature: [
      ...studio.equipment_available?.map(equipment => ({
        '@type': 'LocationFeatureSpecification',
        name: equipment,
        value: true
      })) || [],
      ...studio.accessibility_features?.map(feature => ({
        '@type': 'LocationFeatureSpecification',
        name: feature,
        value: true
      })) || [],
      ...(studio.parking_available ? [{
        '@type': 'LocationFeatureSpecification',
        name: 'Parking Available',
        value: true
      }] : []),
      ...(studio.online_booking_available ? [{
        '@type': 'LocationFeatureSpecification',
        name: 'Online Booking',
        value: true
      }] : [])
    ],
    openingHoursSpecification: Object.entries(studio.opening_hours || {}).map(([day, hours]) => {
      // Convert numeric day keys to day names for structured data
      const dayNames: Record<string, string> = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday'
      };

      const dayName = dayNames[day] || day;

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayName,
        opens: hours.split('-')[0]?.trim(),
        closes: hours.split('-')[1]?.trim()
      };
    }),
    sameAs: [
      studio.website,
      studio.instagram && `https://instagram.com/${studio.instagram}`,
      studio.facebook && `https://facebook.com/${studio.facebook}`
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

function BreadcrumbSchema({ studio, county, city }: { studio: PilatesStudio; county: Location; city: Location }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: `Pilates Studios in ${county.name}`,
        item: `https://pilatesuk.co.uk/${county.slug}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Pilates Studios in ${city.name}`,
        item: `https://pilatesuk.co.uk/${county.slug}/${city.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: studio.name,
        item: `https://pilatesuk.co.uk/${studio.full_url_path}`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { county, city, studio } = await params;
  const studioData = await getStudio(county, city, studio);
  const locationData = await getLocationData(county, city);

  if (!studioData || !locationData) {
    notFound();
  }

  return (
    <>
      <StudioSchema studio={studioData} county={locationData.county} city={locationData.city} />
      <BreadcrumbSchema studio={studioData} county={locationData.county} city={locationData.city} />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumbs */}
              <nav className="text-sm text-gray-600 mb-4">
                <ol className="flex space-x-2">
                  <li>
                    <Link href={`/${locationData.county.slug}`} className="hover:text-purple-600">
                      {locationData.county.name}
                    </Link>
                  </li>
                  <li className="before:content-['/'] before:mx-2">
                    <Link href={`/${locationData.county.slug}/${locationData.city.slug}`} className="hover:text-purple-600">
                      {locationData.city.name}
                    </Link>
                  </li>
                  <li className="before:content-['/'] before:mx-2 text-gray-900">{studioData.name}</li>
                </ol>
              </nav>

              {/* Back Button */}
              <Link
                href={`/${locationData.county.slug}/${locationData.city.slug}`}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {locationData.city.name} Studios
              </Link>

              {/* Studio Header */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{studioData.name}</h1>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{studioData.address}</span>
                        </div>
                        {studioData.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{studioData.rating.toFixed(1)}</span>
                            <span className="text-gray-500">({studioData.review_count} reviews)</span>
                          </div>
                        )}
                        {studioData.is_verified && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Studio Description */}
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {studioData.description || `Welcome to ${studioData.name}, a premier pilates studio located in ${locationData.city.name}, ${locationData.county.name}. We offer professional pilates instruction in a welcoming and supportive environment.`}
                  </p>

                  {/* Studio Images */}
                  {studioData.images && studioData.images.length > 0 && (
                    <div className="mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studioData.images.slice(0, 6).map((image, index) => (
                          <div key={index} className="relative overflow-hidden rounded-lg bg-gray-200 aspect-[4/3] group">
                            <img
                              src={image}
                              alt={`${studioData.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                      {studioData.images.length > 6 && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          + {studioData.images.length - 6} more images available
                        </p>
                      )}
                    </div>
                  )}


                  {/* Class Types */}
                  {studioData.class_types && studioData.class_types.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Class Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {studioData.class_types.map((type, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equipment Available */}
                  {studioData.equipment_available && studioData.equipment_available.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Equipment Available</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {studioData.equipment_available.map((equipment, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <Activity className="h-3 w-3 text-purple-500" />
                            {equipment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Contact & Booking Card */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                        Book a Class
                      </CardTitle>
                      <CardDescription>
                        {studioData.price_range && `Classes from ${studioData.price_range}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {studioData.website ? (
                        <Button asChild size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                          <a href={studioData.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            Visit Website
                          </a>
                        </Button>
                      ) : studioData.online_booking_available ? (
                        <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Online
                        </Button>
                      ) : (
                        <Button variant="outline" size="lg" className="w-full border-purple-600 text-purple-600">
                          <Phone className="h-4 w-4 mr-2" />
                          Call to Book
                        </Button>
                      )}

                      {/* Opening Hours */}
                      {studioData.opening_hours && Object.keys(studioData.opening_hours).length > 0 && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            Opening Hours
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(studioData.opening_hours).map(([day, hours]) => {
                              // Convert numeric day keys to day names
                              const dayNames: Record<string, string> = {
                                '0': 'Sunday',
                                '1': 'Monday',
                                '2': 'Tuesday',
                                '3': 'Wednesday',
                                '4': 'Thursday',
                                '5': 'Friday',
                                '6': 'Saturday'
                              };

                              const dayName = dayNames[day] || day;

                              return (
                                <div key={day} className="flex justify-between text-sm">
                                  <span className="font-medium text-gray-700">{dayName}</span>
                                  <span className="text-gray-600">{hours}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-3 pt-4 border-t">
                        {studioData.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a href={`tel:${studioData.phone}`} className="text-purple-600 hover:underline">
                              {studioData.phone}
                            </a>
                          </div>
                        )}
                        {studioData.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${studioData.email}`} className="text-purple-600 hover:underline">
                              {studioData.email}
                            </a>
                          </div>
                        )}
                        {studioData.instagram && (
                          <div className="flex items-center gap-3">
                            <Instagram className="h-4 w-4 text-gray-400" />
                            <a href={`https://instagram.com/${studioData.instagram}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                              @{studioData.instagram}
                            </a>
                          </div>
                        )}
                        {studioData.facebook && (
                          <div className="flex items-center gap-3">
                            <Facebook className="h-4 w-4 text-gray-400" />
                            <a href={`https://facebook.com/${studioData.facebook}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                              Facebook
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">

            {/* Instructors */}
            {studioData.instructor_names && studioData.instructor_names.length > 0 && (
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Our Instructors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {studioData.instructor_names.map((instructor, index) => (
                        <div key={index} className="text-center p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">{instructor}</h4>
                          <p className="text-sm text-gray-600">Certified Pilates Instructor</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Location Map Placeholder */}
            {studioData.latitude && studioData.longitude && (
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(studioData.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map showing location of ${studioData.name}`}
                      />
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            {studioData.address}
                          </p>
                          {studioData.postcode && (
                            <p className="text-sm text-gray-500 mt-1">{studioData.postcode}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioData.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <MapPin className="h-3 w-3" />
                              Directions
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  // TODO: Implement static params generation once studio data is available
  // For now return empty array as no studio data exists yet
  return [];
}