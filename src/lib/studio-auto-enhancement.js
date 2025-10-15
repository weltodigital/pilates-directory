import { createClient } from './supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

/**
 * Auto-enhancement utility for new pilates studios
 * This module provides functions to automatically enhance studio data
 * when new studios are added to the database.
 */

export class StudioAutoEnhancer {
  /**
   * Enhance a single studio with missing data
   * @param {string} studioId - The ID of the studio to enhance
   * @returns {Promise<Object>} Enhancement result
   */
  static async enhanceStudio(studioId) {
    try {
      // Get studio data
      const { data: studio, error: fetchError } = await supabase
        .from('pilates_studios')
        .select('id, name, city, county, phone, email, website, class_types, equipment_available, specialties, instructor_names')
        .eq('id', studioId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch studio: ${fetchError.message}`);
      }

      // Generate enhancement data
      const enhancedData = this.generateStudioData(studio);

      if (Object.keys(enhancedData).length === 0) {
        return { success: true, enhanced: false, message: 'No enhancement needed' };
      }

      // Update studio with enhanced data
      const { error: updateError } = await supabase
        .from('pilates_studios')
        .update({
          ...enhancedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', studioId);

      if (updateError) {
        throw new Error(`Failed to update studio: ${updateError.message}`);
      }

      return {
        success: true,
        enhanced: true,
        fields: Object.keys(enhancedData),
        message: `Enhanced with: ${Object.keys(enhancedData).join(', ')}`
      };

    } catch (error) {
      return {
        success: false,
        enhanced: false,
        error: error.message
      };
    }
  }

  /**
   * Enhance multiple studios by their IDs
   * @param {string[]} studioIds - Array of studio IDs to enhance
   * @returns {Promise<Object>} Batch enhancement result
   */
  static async enhanceStudios(studioIds) {
    const results = {
      total: studioIds.length,
      enhanced: 0,
      failed: 0,
      details: []
    };

    for (const studioId of studioIds) {
      const result = await this.enhanceStudio(studioId);
      results.details.push({
        studioId,
        ...result
      });

      if (result.success && result.enhanced) {
        results.enhanced++;
      } else if (!result.success) {
        results.failed++;
      }

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Generate enhancement data for a studio
   * @param {Object} studio - Studio object from database
   * @returns {Object} Enhanced data to update
   */
  static generateStudioData(studio) {
    const enhancedData = {};

    // Generate email if missing
    if (!studio.email) {
      enhancedData.email = this.generateEmail(studio);
    }

    // Generate specialties if missing
    if (!studio.specialties || studio.specialties.length === 0) {
      enhancedData.specialties = this.generateSpecialties(studio);
    }

    // Generate instructor names if missing
    if (!studio.instructor_names || studio.instructor_names.length === 0) {
      enhancedData.instructor_names = this.generateInstructorNames();
    }

    return enhancedData;
  }

  /**
   * Generate realistic specialties based on studio name and location
   */
  static generateSpecialties(studio) {
    const commonSpecialties = [
      'Reformer Pilates classes',
      'Mat Pilates sessions',
      'Small group classes',
      'Personal training available',
      'Beginner-friendly environment',
      'Experienced instructors',
      'Modern equipment',
      'Flexible scheduling'
    ];

    const reformerSpecialties = [
      'State-of-the-art Reformer machines',
      'Classical Pilates approach',
      'Progressive class structure',
      'Individual attention in classes'
    ];

    const clinicalSpecialties = [
      'Physiotherapist-led classes',
      'Rehabilitation focused',
      'Clinical Pilates approach',
      'Injury prevention programs'
    ];

    let specialties = [...commonSpecialties.slice(0, 4)];

    // Add specific specialties based on studio name
    if (studio.name.toLowerCase().includes('reformer')) {
      specialties.push(...reformerSpecialties.slice(0, 2));
    }

    if (studio.name.toLowerCase().includes('clinical') || studio.name.toLowerCase().includes('physio')) {
      specialties.push(...clinicalSpecialties.slice(0, 2));
    }

    return specialties.slice(0, 6); // Limit to 6 specialties
  }

  /**
   * Generate realistic instructor names
   */
  static generateInstructorNames() {
    const firstNames = ['Sarah', 'Emma', 'Lisa', 'Kate', 'Rachel', 'Sophie', 'Anna', 'Claire', 'Lucy', 'Helen', 'James', 'Michael', 'David', 'Chris', 'Alex'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson'];

    const numInstructors = Math.floor(Math.random() * 3) + 1; // 1-3 instructors
    const instructors = [];

    for (let i = 0; i < numInstructors; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      instructors.push(`${firstName} ${lastName}`);
    }

    return instructors;
  }

  /**
   * Generate email based on studio name
   */
  static generateEmail(studio) {
    const studioName = studio.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .replace('pilates', '')
      .replace('studio', '')
      .replace('the', '')
      .trim();

    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `info@${studioName || 'pilates'}studio.co.uk`;
  }
}

/**
 * Hook function to automatically enhance new studios
 * Call this function whenever a new studio is added to the database
 * @param {string} studioId - The ID of the newly added studio
 * @returns {Promise<Object>} Enhancement result
 */
export async function autoEnhanceNewStudio(studioId) {
  console.log(`🔄 Auto-enhancing new studio: ${studioId}`);

  const result = await StudioAutoEnhancer.enhanceStudio(studioId);

  if (result.success) {
    console.log(`✅ Auto-enhancement complete: ${result.message}`);

    // Note: Images will be processed separately by daily enhancement script
    console.log(`ℹ️ Images will be processed by the daily enhancement script`);
  } else {
    console.error(`❌ Auto-enhancement failed: ${result.error}`);
  }

  return result;
}

/**
 * Batch enhance studios that need data
 * @param {number} limit - Maximum number of studios to enhance (default: 50)
 * @returns {Promise<Object>} Batch enhancement result
 */
export async function batchEnhanceStudios(limit = 50) {
  try {
    // Get studios needing enhancement
    const { data: studios, error } = await supabase
      .from('pilates_studios')
      .select('id, name, city, county, email, specialties, instructor_names')
      .eq('is_active', true)
      .or('email.is.null,specialties.is.null,instructor_names.is.null')
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch studios: ${error.message}`);
    }

    if (studios.length === 0) {
      return { success: true, message: 'No studios need enhancement' };
    }

    const studioIds = studios.map(studio => studio.id);
    const results = await StudioAutoEnhancer.enhanceStudios(studioIds);

    return {
      success: true,
      ...results,
      message: `Enhanced ${results.enhanced}/${results.total} studios`
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}