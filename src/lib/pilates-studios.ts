import { createClient } from '@/lib/supabase/client';

export interface PilatesStudio {
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
  latitude?: number;
  longitude?: number;
  google_rating?: number;
  google_review_count?: number;
  class_types: string[];
  instructor_names?: string[];
  specialties?: string[];
  price_range?: string;
  equipment_available?: string[];
  is_active: boolean;
  opening_hours?: Record<string, string>;
  full_url_path?: string;
  county_slug?: string;
  city_slug?: string;
  created_at?: string;
  updated_at?: string;
  last_scraped_at?: string;
  images?: string[];
}

/**
 * Get all pilates studios for a specific county
 */
export async function getPilatesStudiosByCounty(countySlug: string): Promise<PilatesStudio[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', countySlug)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsLast: true })
    .order('name');

  if (error) {
    console.error('Error fetching pilates studios by county:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all pilates studios for a specific city
 */
export async function getPilatesStudiosByCity(countySlug: string, citySlug: string): Promise<PilatesStudio[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', countySlug)
    .eq('city_slug', citySlug)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsLast: true })
    .order('name');

  if (error) {
    console.error('Error fetching pilates studios by city:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a specific pilates studio by its full URL path
 */
export async function getPilatesStudioByPath(fullPath: string): Promise<PilatesStudio | null> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('full_url_path', fullPath)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching pilates studio by path:', error);
    return null;
  }

  return data;
}

/**
 * Search pilates studios by name or location
 */
export async function searchPilatesStudios(query: string): Promise<PilatesStudio[]> {
  if (!query.trim()) return [];

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .or(`name.ilike.%${query}%,city.ilike.%${query}%,address.ilike.%${query}%`)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsLast: true })
    .order('name')
    .limit(20);

  if (error) {
    console.error('Error searching pilates studios:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured pilates studios (highest rated)
 */
export async function getFeaturedPilatesStudios(limit: number = 6): Promise<PilatesStudio[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('is_active', true)
    .not('google_rating', 'is', null)
    .gte('google_rating', 4.5)
    .order('google_rating', { ascending: false })
    .order('google_review_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured pilates studios:', error);
    return [];
  }

  return data || [];
}

/**
 * Get pilates studios count by county
 */
export async function getPilatesStudioCountByCounty(countySlug: string): Promise<number> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { count, error } = await supabase
    .from('pilates_studios')
    .select('*', { count: 'exact', head: true })
    .eq('county_slug', countySlug)
    .eq('is_active', true);

  if (error) {
    console.error('Error counting pilates studios by county:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get pilates studios count by city
 */
export async function getPilatesStudioCountByCity(countySlug: string, citySlug: string): Promise<number> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { count, error } = await supabase
    .from('pilates_studios')
    .select('*', { count: 'exact', head: true })
    .eq('county_slug', countySlug)
    .eq('city_slug', citySlug)
    .eq('is_active', true);

  if (error) {
    console.error('Error counting pilates studios by city:', error);
    return 0;
  }

  return count || 0;
}