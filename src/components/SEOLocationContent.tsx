'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Users, Heart, Phone, Clock, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LocationStudiosMap from '@/components/LocationStudiosMap';

interface SEOContent {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  h1_title: string;
  hero_description: string;
  intro_paragraph: string;
  about_location: string;
  pilates_benefits: string;
  local_info: string;
  cta_title: string;
  cta_description: string;
  faq_data: Array<{
    question: string;
    answer: string;
  }>;
}

interface SEOLocationContentProps {
  seoContent: SEOContent;
  studioCount: number;
  locationType: 'county' | 'city';
  locationName: string;
  countyName?: string;
  countySlug?: string;
  citySlug?: string;
  citiesAndTowns?: Array<{
    id: string;
    name: string;
    slug: string;
    full_path: string;
    butcher_count: number;
  }>;
  studios?: Array<{
    id: string;
    name: string;
    address: string;
    postcode: string;
    city: string;
    county: string;
    description: string | null;
    phone?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    google_rating?: number;
    google_review_count: number;
    class_types: string[];
    price_range?: string;
    beginner_friendly: boolean;
    online_booking_available: boolean;
    parking_available: boolean;
    images: string[] | null;
    full_url_path: string;
  }>;
}

export default function SEOLocationContent({
  seoContent,
  studioCount,
  locationType,
  locationName,
  countyName,
  countySlug,
  citySlug,
  citiesAndTowns = [],
  studios = []
}: SEOLocationContentProps) {
  const benefits = seoContent.pilates_benefits.split('\n').filter(line => line.trim().startsWith('•')).map(line => line.replace('•', '').trim());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      {locationType === 'city' && countyName && countySlug && (
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li>
              <Link href="/" className="hover:text-purple-600">Home</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link href={`/${countySlug}`} className="hover:text-purple-600">{countyName}</Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-gray-900">{locationName}</li>
          </ol>
        </nav>
      )}

      {locationType === 'county' && (
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li>
              <Link href="/" className="hover:text-purple-600">Home</Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-gray-900">{locationName}</li>
          </ol>
        </nav>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-jakarta">
          {seoContent.h1_title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {seoContent.hero_description}
        </p>

      </div>

      {/* Cities and Towns Links - Only for County pages */}
      {locationType === 'county' && citiesAndTowns.length > 0 && (
        <div id="cities-towns-section" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-jakarta">
            Pilates Studios by Location in {locationName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesAndTowns.map((place) => (
              <Link
                key={place.id}
                href={`/${place.full_path}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {place.name}
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm capitalize flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    City
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Activity className="h-3 w-3 text-purple-500" />
                    {place.butcher_count || 0} Pilates Studios
                  </p>
                  <p className="text-xs text-gray-500">
                    Reformer • Mat • Clinical • Prenatal Classes
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700 transition-colors">
                    Find Studios Near Me →
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.8+ rated</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Studios Section - Only for City pages */}
      {locationType === 'city' && studios.length > 0 && (
        <div id="studios-section" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-jakarta">
            Pilates Studios in {locationName} ({studios.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <Card key={studio.id} className="hover:shadow-lg transition-shadow group overflow-hidden">
                {/* Studio Image */}
                {studio.images && studio.images.length > 0 && (
                  <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                    <img
                      src={studio.images[0]}
                      alt={`${studio.name} - Studio Image`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                        {studio.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {studio.address}
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
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {studio.description || `Professional pilates studio offering comprehensive classes for all fitness levels in ${locationName}.`}
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

      {/* Interactive Map Section - Only for City pages with studios */}
      {locationType === 'city' && studios.length > 0 && (
        <div className="mb-12">
          <LocationStudiosMap
            studios={studios}
            locationName={locationName}
            locationType="city"
          />
        </div>
      )}

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-gray-700 leading-relaxed">
          {seoContent.intro_paragraph}
        </p>
      </div>

      {/* About Location */}
      <div className="mb-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-jakarta">
          <MapPin className="h-6 w-6 text-purple-600 mr-2" />
          About {locationName}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {seoContent.about_location}
        </p>
      </div>

      {/* Pilates Benefits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-jakarta">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          Benefits of Pilates in {locationName}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-700 text-sm">
            Whether you're recovering from injury, improving athletic performance, or maintaining overall wellness, pilates provides a comprehensive approach to physical and mental health.
          </p>
        </div>
      </div>

      {/* Local Information */}
      <div className="mb-12 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-jakarta">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          Local Pilates Community
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {seoContent.local_info}
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-jakarta">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {seoContent.faq_data.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-12 text-white">
        <h2 className="text-3xl font-bold mb-4 font-jakarta">
          {seoContent.cta_title}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {seoContent.cta_description}
        </p>
        <div className="flex justify-center">
          <a
            href={locationType === 'county' ? '#cities-towns-section' : '#studios-section'}
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {locationType === 'county' ? 'Browse Locations' : 'Browse Studios'}
          </a>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Expert Instructors</h3>
          <p className="text-sm text-gray-600">
            Certified professionals with years of experience helping students achieve their goals
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Flexible Schedules</h3>
          <p className="text-sm text-gray-600">
            Morning, evening, and weekend classes to fit your busy lifestyle
          </p>
        </div>
      </div>
    </div>
  );
}