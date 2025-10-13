import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Users, Activity } from 'lucide-react';

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

async function getCitiesAndTowns(countyId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
  );

  const { data, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('parent_id', countyId)
    .in('type', ['city', 'town'])
    .order('name');

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

  const citiesAndTowns = await getCitiesAndTowns(location.id);

  return (
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
              {location.butcher_count}+ Studios
            </span>
          </div>


          <p>{location.intro_text || `Welcome to the comprehensive guide to pilates studios in ${location.name}. Whether you're looking for reformer pilates, mat classes, clinical pilates, or specialized programs, our directory features the best studios across ${location.name} with verified reviews, class schedules, and online booking options.`}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2>Cities and Towns in {location.name} - Updated Oct 13</h2>
              <span className="text-sm text-gray-500">{citiesAndTowns.length} locations</span>
            </div>

            <div className="locations-grid">
              {citiesAndTowns.map((city) => (
                <div key={city.id} className="location-card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{city.name}</h3>
                    <span className="text-sm text-gray-500">
                      {city.butcher_count > 0 ? `${city.butcher_count} studios` : 'No studios yet'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {city.butcher_count > 0
                      ? `Find pilates classes and studios in ${city.name}. Browse reformer, mat, and clinical pilates options.`
                      : `Explore ${city.name} for pilates opportunities. Be the first to discover studios in this area.`
                    }
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/${resolvedParams.county}/${city.slug}`} className="btn-primary flex-1">
                      {city.butcher_count > 0 ? 'View Studios' : 'Explore Area'}
                    </Link>
                    <button className="btn-secondary">
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {location.main_content && (
            <div className="content-section">
              <div dangerouslySetInnerHTML={{ __html: location.main_content }} />
            </div>
          )}
        </div>
      </div>
    </div>
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