import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Star, Users, Activity } from 'lucide-react';

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
  seo_title: string;
  seo_description: string;
  h1_title: string;
  intro_text: string;
  butcher_count: number;
}

async function getCityData(countySlug: string, citySlug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data: countyData } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', countySlug)
    .eq('type', 'county')
    .single();

  if (!countyData) return null;

  const { data: locationData } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', citySlug)
    .eq('parent_id', countyData.id)
    .in('type', ['city', 'town'])
    .single();

  return {
    location: locationData,
    county: countyData
  };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getCityData(resolvedParams.county, resolvedParams.city);

  if (!data?.location) {
    return {
      title: 'City Not Found | Pilates Classes Near',
      description: 'The requested city page could not be found.',
    };
  }

  return {
    title: data.location.seo_title || `Pilates Studios in ${data.location.name} | Find Classes Near You`,
    description: data.location.seo_description || `Discover the best pilates studios in ${data.location.name}. Find reformer, mat, and clinical pilates classes with verified reviews and online booking.`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const data = await getCityData(resolvedParams.county, resolvedParams.city);

  if (!data?.location || !data.county) {
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

  const { location, county } = data;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="container">
          <nav className="text-sm text-gray-600 mb-4">
            <ol className="flex space-x-2">
              <li>
                <Link href="/" className="hover:text-purple-600">Home</Link>
              </li>
              <li className="before:content-['/'] before:mx-2">
                <Link href={`/${county.slug}`} className="hover:text-purple-600">{county.name}</Link>
              </li>
              <li className="before:content-['/'] before:mx-2 text-gray-900">{location.name}</li>
            </ol>
          </nav>

          <h1>{location.h1_title || `Pilates Studios in ${location.name} | Pilates Near Me`}</h1>
          <p>Find the best pilates studios in {location.name}, {county.name}. Browse reformer, mat, and clinical pilates classes with verified reviews and online booking.</p>

          <div className="meta-badges">
            <span className="meta-badge primary">
              <MapPin className="h-3 w-3" />
              {location.name}
            </span>
            <span className="meta-badge success">
              <Users className="h-3 w-3" />
              {county.name}
            </span>
            <span className="meta-badge warning">
              <Activity className="h-3 w-3" />
              {location.butcher_count}+ Studios
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button className="btn-primary">
              <Activity className="h-4 w-4 mr-2" />
              Find Studios Near Me
            </button>
            <button className="btn-secondary">
              <Star className="h-4 w-4 mr-2" />
              View Class Schedules
            </button>
          </div>

          <p>{location.intro_text || `Welcome to our guide to pilates studios in ${location.name}. Whether you're looking for reformer pilates, mat classes, clinical pilates, or specialized programs, our directory features the best studios in ${location.name} with verified reviews, class schedules, and online booking options.`}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="content-section">
            <h2>Find Pilates Studios in {location.name}</h2>
            <p>Explore {location.butcher_count}+ pilates studios in {location.name}. From boutique reformer studios to community mat classes, find the perfect pilates experience for your fitness journey.</p>

            <div className="mt-6">
              <button className="btn-secondary">
                View All Studios in {location.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}