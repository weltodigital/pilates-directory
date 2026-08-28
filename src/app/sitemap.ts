import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

/**
 * Generated from the database rather than hand-maintained.
 *
 * The previous version was a hardcoded list: it advertised eleven
 * "specialty" URLs that returned 404, carried 150 entries against a site of
 * 1,400+ pages, and contained no studio pages at all.
 */

const BASE_URL = 'https://www.pilatesclassesnear.com';

/** Every row of a table, past PostgREST's 1000-row ceiling. */
async function selectAll(supabase: any, table: string, columns: string, apply: (q: any) => any) {
  const rows: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await apply(supabase.from(table).select(columns)).range(from, from + 999);
    if (error) {
      console.error(`Sitemap: ${table} query failed:`, error.message);
      break;
    }
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  return rows;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/near`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/for-studios`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/add-studio`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error('Sitemap: Supabase env vars missing; returning static entries only.');
    return entries;
  }
  const supabase = createClient(url, key);

  // Counties, countries and towns that actually have studios. A location with
  // none is a thin page and does not belong in a sitemap.
  const locations = await selectAll(
    supabase, 'public_locations', 'slug,type,county_slug,butcher_count',
    (q: any) => q.gt('butcher_count', 0)
  );

  for (const loc of locations) {
    const path = loc.type === 'county' ? loc.slug : `${loc.county_slug}/${loc.slug}`;
    entries.push({
      url: `${BASE_URL}/${path}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: loc.type === 'county' ? 0.9 : 0.8,
    });
  }

  // Every active studio.
  const studios = await selectAll(
    supabase, 'pilates_studios', 'full_url_path,updated_at',
    (q: any) => q.eq('is_active', true).not('full_url_path', 'is', null)
  );

  for (const studio of studios) {
    entries.push({
      url: `${BASE_URL}/${studio.full_url_path}`,
      lastModified: studio.updated_at ? new Date(studio.updated_at) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
