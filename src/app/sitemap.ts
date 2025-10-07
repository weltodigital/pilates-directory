import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const baseUrl = 'https://pilatesclassesnear.com';
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    }
  ];

  try {
    // Get all counties
    const { data: counties, error: countiesError } = await supabase
      .from('public_locations')
      .select('slug, updated_at')
      .eq('type', 'county')
      .order('slug');

    // Get all cities and towns
    const { data: locations, error: locationsError } = await supabase
      .from('public_locations')
      .select('full_path, updated_at')
      .in('type', ['city', 'town'])
      .order('full_path');

    // Get all pilates studios
    const { data: studios, error: studiosError } = await supabase
      .from('pilates_studios')
      .select('full_url_path, updated_at')
      .eq('is_active', true)
      .order('full_url_path');

    let dynamicPages: MetadataRoute.Sitemap = [];

    // Add county pages
    if (counties && !countiesError) {
      const countyPages = counties.map(county => ({
        url: `${baseUrl}/${county.slug}`,
        lastModified: new Date(county.updated_at || currentDate),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
      dynamicPages = [...dynamicPages, ...countyPages];
    }

    // Add city/town pages
    if (locations && !locationsError) {
      const locationPages = locations.map(location => ({
        url: `${baseUrl}/${location.full_path}`,
        lastModified: new Date(location.updated_at || currentDate),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      dynamicPages = [...dynamicPages, ...locationPages];
    }

    // Add studio pages
    if (studios && !studiosError) {
      const studioPages = studios.map(studio => ({
        url: `${baseUrl}/${studio.full_url_path}`,
        lastModified: new Date(studio.updated_at || currentDate),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...studioPages];
    }

    // Add specialty/category pages
    const specialtyPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/reformer-pilates`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/mat-pilates`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/clinical-pilates`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/prenatal-pilates`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/barre-pilates`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/beginner-pilates`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    ];

    return [...staticPages, ...dynamicPages, ...specialtyPages];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}