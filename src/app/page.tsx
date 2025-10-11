import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Star, Users, Activity, Award, Clock, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import SEOSchemaMarkup from '@/components/SEOSchemaMarkup'

interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  full_path: string;
  butcher_count: number; // renamed for compatibility but shows studio count
}

interface Studio {
  id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  rating: number;
  review_count: number;
  phone: string;
  website: string;
  images: string[];
  full_url_path: string;
}

async function getFeaturedCounties(): Promise<Location[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: locations, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('type', 'county')
    .gt('butcher_count', 0)
    .order('butcher_count', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching featured counties:', error);
    return [];
  }

  return locations || [];
}

async function getFeaturedStudios(): Promise<Studio[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('is_active', true)
    .not('rating', 'is', null)
    .gte('rating', 4.0)
    .order('rating', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured studios:', error);
    return [];
  }

  return studios || [];
}

export default async function Home() {
  const [featuredCounties, featuredStudios] = await Promise.all([
    getFeaturedCounties(),
    getFeaturedStudios()
  ]);

  return (
    <div>
      <SEOSchemaMarkup page="home" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/pilates-hero-bg.jpg)',
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-white mb-6 font-jakarta drop-shadow-lg">
              Find Pilates Classes Near You
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Discover the best pilates studios across the UK. Find classes, read reviews, and book sessions with top-rated instructors in your area.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg font-semibold" asChild>
                <Link href="#browse-locations">Find Studios Near Me</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" asChild>
                <Link href="#featured-studios">Top Rated Studios</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Featured Studios */}
        <div id="featured-studios" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
            Top Rated Pilates Studios
          </h2>
          {featuredStudios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio) => (
                <Card key={studio.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Studio Image */}
                  {studio.images && studio.images.length > 0 && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={studio.images[0]}
                        alt={studio.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-xl">{studio.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {studio.city}, {studio.county}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Rating */}
                      {studio.rating && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{studio.rating}</span>
                          </div>
                          {studio.review_count && (
                            <span className="text-slate-600 dark:text-slate-400">
                              ({studio.review_count} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Address */}
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {studio.address}
                      </p>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                        {studio.phone && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Call for hours</span>
                          </div>
                        )}
                        {studio.website && (
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            <span>Online booking</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                          <Link href={`/${studio.full_url_path}`}>
                            View Studio Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Featured studios will appear here soon.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Browse by Location */}
        <div id="browse-locations" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
            Find Pilates Studios by Location
          </h2>

          {featuredCounties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredCounties.map((county) => (
                <div key={county.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <Link
                      href={`/${county.slug}`}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {county.name}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-4">
                    <Users className="h-4 w-4" />
                    <span>{county.butcher_count} pilates studios</span>
                  </div>
                  <Link
                    href={`/${county.slug}`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    View Studios
                    <Activity className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Location data is being updated. Please check back soon.
              </p>
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Find Local Studios</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Discover pilates studios in your area with detailed information, photos, and reviews.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Read Reviews</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Check ratings and reviews from real students to find the perfect studio for you.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Quality Studios</h3>
            <p className="text-slate-600 dark:text-slate-400">
              All studios are verified with up-to-date information on classes, pricing, and facilities.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 font-jakarta">Ready to Start Your Pilates Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Find the perfect pilates studio near you and join thousands of people improving their health and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3 bg-white hover:bg-gray-100 text-purple-600 font-semibold" asChild>
              <Link href="#browse-locations">Find Studios Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" asChild>
              <Link href="#featured-studios">Browse Top Rated</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}