import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { findNearbyStudios, geocodePostcode } from '@/lib/geo'

export const dynamic = 'force-dynamic'

/**
 * GET /api/near?lat=..&lon=..     — search from coordinates
 * GET /api/near?postcode=SW11 4NJ — search from a postcode
 */
export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Search is unavailable.' }, { status: 503 });
  }

  const params = new URL(request.url).searchParams;
  const limit = Math.min(Number(params.get('limit')) || 24, 50);

  let lat = Number(params.get('lat'));
  let lon = Number(params.get('lon'));
  let label = 'your location';

  const postcode = params.get('postcode');
  if (postcode) {
    const hit = await geocodePostcode(postcode);
    if (!hit) {
      return NextResponse.json(
        { error: `We couldn't find the postcode "${postcode}".` },
        { status: 404 }
      );
    }
    lat = hit.lat; lon = hit.lon; label = hit.label;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: 'Provide a postcode, or lat and lon.' },
      { status: 400 }
    );
  }

  const supabase = createClient(url, key);
  const { studios, radiusKm } = await findNearbyStudios(supabase, lat, lon, { limit });

  return NextResponse.json({ label, lat, lon, radiusKm, count: studios.length, studios });
}
