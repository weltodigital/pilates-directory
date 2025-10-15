import { NextResponse } from 'next/server';
import { StudioAutoEnhancer, autoEnhanceNewStudio, batchEnhanceStudios } from '@/lib/studio-auto-enhancement';
import { batchFetchImages, getImageStats } from '@/lib/google-images';

/**
 * API endpoint to enhance studio data
 *
 * POST /api/enhance-studios
 *
 * Body options:
 * - { "studioId": "uuid" } - Enhance a single studio
 * - { "studioIds": ["uuid1", "uuid2"] } - Enhance multiple specific studios
 * - { "batch": true, "limit": 50 } - Enhance up to 50 studios needing data
 * - { "autoEnhance": "uuid" } - Auto-enhance a newly added studio
 * - { "fetchImages": true, "limit": 50 } - Fetch images for studios missing them
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Single studio enhancement
    if (body.studioId) {
      const result = await StudioAutoEnhancer.enhanceStudio(body.studioId);
      return NextResponse.json(result);
    }

    // Multiple studios enhancement
    if (body.studioIds && Array.isArray(body.studioIds)) {
      const result = await StudioAutoEnhancer.enhanceStudios(body.studioIds);
      return NextResponse.json(result);
    }

    // Batch enhancement
    if (body.batch) {
      const limit = body.limit || 50;
      const result = await batchEnhanceStudios(limit);
      return NextResponse.json(result);
    }

    // Auto-enhance new studio
    if (body.autoEnhance) {
      const result = await autoEnhanceNewStudio(body.autoEnhance);
      return NextResponse.json(result);
    }

    // Fetch images for studios
    if (body.fetchImages) {
      const limit = body.limit || 50;
      const result = await batchFetchImages(limit);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request format' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Enhancement API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check enhancement status
 */
export async function GET() {
  try {
    const { createClient } = await import('@/lib/supabase');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get count of studios needing enhancement
    const { data, error } = await supabase
      .from('pilates_studios')
      .select('id, name, city, county, email, specialties, instructor_names')
      .eq('is_active', true)
      .or('email.is.null,specialties.is.null,instructor_names.is.null');

    if (error) {
      throw new Error(`Failed to fetch studios: ${error.message}`);
    }

    const needsEnhancement = data.filter(studio => {
      return !studio.email ||
             !studio.specialties ||
             studio.specialties.length === 0 ||
             !studio.instructor_names ||
             studio.instructor_names.length === 0;
    });

    // Get image statistics
    const imageStats = await getImageStats();

    return NextResponse.json({
      success: true,
      studiosNeedingEnhancement: needsEnhancement.length,
      totalStudios: data.length,
      enhancementPercentage: ((data.length - needsEnhancement.length) / data.length * 100).toFixed(1),
      imageStats
    });

  } catch (error) {
    console.error('Enhancement status error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}