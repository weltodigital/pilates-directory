import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Star, Phone, Clock, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import SEOSchemaMarkup from '@/components/SEOSchemaMarkup'

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

async function getCountiesWithLocations(): Promise<CountyWithLocations[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('is_active', true)
    .not('google_rating', 'is', null)
    .gte('google_rating', 4.0)
    .order('google_rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured studios:', error);
    return [];
  }

  return studios || [];
}

export default async function Home() {
  // Get counties with their associated locations and featured studios
  const [countiesWithLocations, featuredStudios] = await Promise.all([
    getCountiesWithLocations(),
    getFeaturedPilatesStudios(6)
  ]);

  // Debug logging to see what we're getting
  console.log('Counties with locations:', countiesWithLocations.length);
  console.log('Featured studios:', featuredStudios.length);
  if (countiesWithLocations.length > 0) {
    console.log('First county:', countiesWithLocations[0].county);
    console.log('First county locations:', countiesWithLocations[0].locations.length);
  }

  return (
    <div>
      <SEOSchemaMarkup page="home" />
      <div className="hero-gradient">
        <div className="container" style={{textAlign: 'center', padding: '2rem'}}>
          <h1 className="hero-title">
            Find the Perfect Pilates Studio Near You
          </h1>
          <p className="hero-subtitle">
            Discover the best pilates studios across the UK with detailed class information, instructor profiles, and live booking
          </p>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="#browse-counties" className="btn">Browse All Locations</Link>
            <Link href="#featured-studios" className="btn" style={{backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)'}}>View Featured Studios</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Featured Studios */}
        <div id="featured-studios" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
            Featured Pilates Studios
          </h2>
          {featuredStudios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio) => (
                <Card key={studio.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{studio.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {studio.city}, {studio.county}
                        </CardDescription>
                      </div>
                      {studio.google_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{studio.google_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Opening Hours */}
                      {studio.opening_hours && Object.keys(studio.opening_hours).length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>{Object.values(studio.opening_hours)[0] || 'Opening hours available'}</span>
                        </div>
                      )}

                      {/* Phone */}
                      {studio.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="h-4 w-4" />
                          <span>{studio.phone}</span>
                        </div>
                      )}

                      {/* Price Range */}
                      {studio.price_range && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Activity className="h-4 w-4" />
                          <span>{studio.price_range}</span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {studio.description || `Professional pilates studio in ${studio.city}, ${studio.county} offering expert instruction and quality equipment.`}
                      </p>

                      {/* Class Types */}
                      {studio.class_types && studio.class_types.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {studio.class_types.slice(0, 3).map((classType, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-xs rounded-full">
                              {classType}
                            </span>
                          ))}
                          {studio.class_types.length > 3 && (
                            <span className="text-xs text-purple-600 px-2 py-1">
                              +{studio.class_types.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        {studio.website ? (
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                            <a href={studio.website} target="_blank" rel="nofollow noopener noreferrer">
                              Visit Website
                            </a>
                          </Button>
                        ) : studio.phone ? (
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                            <a href={`tel:${studio.phone}`}>
                              Call Studio
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                            <Link href={`/${studio.full_url_path}`}>
                              View Details
                            </Link>
                          </Button>
                        )}

                        {studio.full_url_path && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${studio.full_url_path}`}>
                              Details
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No featured studios available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* All Locations by County Section */}
        <div id="browse-counties" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
            Browse All Locations by County
          </h2>
          <div style={{background: '#f8f9fa', padding: '1rem', marginBottom: '2rem', borderRadius: '0.5rem', border: '1px solid #e9ecef'}}>
            <strong>Browse Locations:</strong> {countiesWithLocations.length} counties available
          </div>
          {countiesWithLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countiesWithLocations.map(({ county, locations }) => (
                <div key={county.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <Link
                      href={`/${county.slug}`}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {county.name}
                    </Link>
                  </h3>

                  {locations.length > 0 ? (
                    <div className="space-y-2">
                      {locations.map((location) => (
                        <div key={location.id}>
                          <Link
                            href={`/${location.full_path}`}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors inline-block"
                          >
                            {location.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm italic">
                      No cities or towns listed yet
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No locations available at the moment.
              </p>
            </div>
          )}
        </div>


        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 font-jakarta">Ready to Transform Your Fitness Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who trust Pilates Classes Near to find their perfect pilates studio and instructor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link href="#browse-counties">Find Studios Near You</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white text-gray-900 border-white hover:bg-gray-100 hover:text-gray-900" asChild>
              <Link href="#featured-studios">Explore Featured Studios</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}