/**
 * Geographic helpers for postcode pages and distance search.
 *
 * Studios are found with a bounding-box query followed by an exact distance
 * pass over the survivors. At this size that beats a spatial extension: the
 * box cuts 4,500+ studios to a few dozen in a single PostgREST call, needing
 * no PostGIS, no SQL function and no schema change.
 */

/** UK outward code, lowercase as it appears in a URL: sw11, ls1, ec1a, b1. */
export const OUTWARD_CODE = /^[a-z]{1,2}\d[a-z\d]?$/;

export function isOutwardCode(slug: string): boolean {
  return OUTWARD_CODE.test(slug);
}

/** Metres between two points. */
export function haversineMetres(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres / 10) * 10} m`;
  return `${(metres / 1000).toFixed(metres < 10000 ? 1 : 0)} km`;
}

/** Degrees of latitude/longitude covering a radius at a given latitude. */
export function boundingBox(lat: number, lon: number, radiusKm: number) {
  const dLat = radiusKm / 111;
  // A degree of longitude shortens as you move away from the equator.
  const dLon = radiusKm / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.01));
  return {
    minLat: lat - dLat, maxLat: lat + dLat,
    minLon: lon - dLon, maxLon: lon + dLon,
  };
}

export interface NearbyStudio {
  id: string;
  name: string;
  city: string | null;
  county: string | null;
  address: string | null;
  postcode: string | null;
  latitude: number;
  longitude: number;
  google_rating: number | null;
  google_review_count: number | null;
  full_url_path: string | null;
  is_verified: boolean | null;
  distanceMetres: number;
}

const SELECT =
  'id,name,city,county,address,postcode,latitude,longitude,google_rating,google_review_count,full_url_path,is_verified';

/**
 * Nearest active studios, closest first.
 *
 * The radius widens until something is found, so a rural postcode returns its
 * nearest studios rather than an empty page.
 */
export async function findNearbyStudios(
  supabase: any,
  lat: number,
  lon: number,
  { limit = 24, radiiKm = [5, 10, 25, 50, 100] }: { limit?: number; radiiKm?: number[] } = {}
): Promise<{ studios: NearbyStudio[]; radiusKm: number }> {
  for (const radiusKm of radiiKm) {
    const box = boundingBox(lat, lon, radiusKm);
    const { data, error } = await supabase
      .from('pilates_studios')
      .select(SELECT)
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .gte('latitude', box.minLat).lte('latitude', box.maxLat)
      .gte('longitude', box.minLon).lte('longitude', box.maxLon)
      .limit(500);

    if (error) {
      console.error('Nearby lookup failed:', error.message);
      return { studios: [], radiusKm };
    }

    // The box is square and the search is circular, so trim the corners.
    const studios = (data || [])
      .map((s: any) => ({
        ...s,
        distanceMetres: haversineMetres(lat, lon, s.latitude, s.longitude),
      }))
      .filter((s: NearbyStudio) => s.distanceMetres <= radiusKm * 1000)
      .sort((a: NearbyStudio, b: NearbyStudio) => a.distanceMetres - b.distanceMetres)
      .slice(0, limit);

    if (studios.length) return { studios, radiusKm };
  }
  return { studios: [], radiusKm: radiiKm[radiiKm.length - 1] };
}

/** Resolve a UK postcode or outward code to a point, via the free postcodes.io. */
export async function geocodePostcode(
  input: string
): Promise<{ lat: number; lon: number; label: string } | null> {
  const q = input.trim().replace(/\s+/g, '').toUpperCase();
  if (!q) return null;

  // A full postcode resolves directly; an outward code needs the /outcodes route.
  const full = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}`);
  if (full.ok) {
    const j = await full.json();
    if (j.result) {
      return { lat: j.result.latitude, lon: j.result.longitude, label: j.result.postcode };
    }
  }

  const out = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(q)}`);
  if (out.ok) {
    const j = await out.json();
    if (j.result) {
      return { lat: j.result.latitude, lon: j.result.longitude, label: j.result.outcode };
    }
  }
  return null;
}
