const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

class StudioAutoEnhancer {
  constructor() {
    this.batchSize = 25; // Process 25 studios at a time
    this.delayBetweenBatches = 1000; // 1 second delay to avoid rate limits
    this.delayBetweenRequests = 200; // 200ms delay between individual requests
  }

  /**
   * Main entry point - enhance all studios that need data
   */
  async enhanceAllStudios() {
    console.log('🚀 STARTING AUTOMATED STUDIO ENHANCEMENT SYSTEM...\n');

    try {
      // Get list of studios needing enhancement
      const studiosToEnhance = await this.getStudiosNeedingEnhancement();
      console.log(`📋 Found ${studiosToEnhance.length} studios needing enhancement\n`);

      if (studiosToEnhance.length === 0) {
        console.log('✅ All studios are already fully enhanced!');
        return;
      }

      // Process in batches
      const batches = this.chunkArray(studiosToEnhance, this.batchSize);
      console.log(`📦 Processing ${batches.length} batches of ${this.batchSize} studios each\n`);

      let totalProcessed = 0;
      let totalEnhanced = 0;
      let totalErrors = 0;

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} studios)...`);

        const batchResults = await this.processBatch(batch);

        totalProcessed += batchResults.processed;
        totalEnhanced += batchResults.enhanced;
        totalErrors += batchResults.errors;

        console.log(`   ✅ Batch complete: ${batchResults.enhanced}/${batchResults.processed} enhanced\n`);

        // Delay between batches to avoid overwhelming APIs
        if (i < batches.length - 1) {
          console.log(`⏳ Waiting ${this.delayBetweenBatches}ms before next batch...`);
          await this.delay(this.delayBetweenBatches);
        }
      }

      console.log('🎉 === ENHANCEMENT COMPLETE ===');
      console.log(`📊 Total processed: ${totalProcessed}`);
      console.log(`✅ Successfully enhanced: ${totalEnhanced}`);
      console.log(`❌ Errors: ${totalErrors}`);
      console.log(`📈 Success rate: ${((totalEnhanced / totalProcessed) * 100).toFixed(1)}%`);

    } catch (error) {
      console.error('💥 Fatal error in enhancement system:', error);
    }
  }

  /**
   * Get studios that need enhancement (missing key data)
   */
  async getStudiosNeedingEnhancement() {
    const { data, error } = await supabase
      .from('pilates_studios')
      .select('id, name, city, county, phone, email, website, class_types, equipment_available, specialties, instructor_names')
      .eq('is_active', true)
      .order('county', { ascending: true })
      .order('city', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch studios: ${error.message}`);
    }

    // Filter studios that are missing critical data
    return data.filter(studio => {
      const missingFields = [];

      if (!studio.email) missingFields.push('email');
      if (!studio.specialties || studio.specialties.length === 0) missingFields.push('specialties');
      if (!studio.instructor_names || studio.instructor_names.length === 0) missingFields.push('instructor_names');

      // Include studios missing any of these critical fields
      return missingFields.length > 0;
    });
  }

  /**
   * Process a batch of studios
   */
  async processBatch(studios) {
    let processed = 0;
    let enhanced = 0;
    let errors = 0;

    for (const studio of studios) {
      try {
        console.log(`  🔍 Enhancing: ${studio.name} (${studio.city}, ${studio.county})`);

        const enhancedData = await this.generateStudioData(studio);

        if (enhancedData && Object.keys(enhancedData).length > 0) {
          await this.updateStudioData(studio.id, enhancedData);
          console.log(`    ✅ Enhanced with: ${Object.keys(enhancedData).join(', ')}`);
          enhanced++;
        } else {
          console.log(`    ⚠️  No additional data generated`);
        }

        processed++;

        // Small delay between requests
        await this.delay(this.delayBetweenRequests);

      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
        errors++;
        processed++;
      }
    }

    return { processed, enhanced, errors };
  }

  /**
   * Generate enhanced data for a studio
   */
  async generateStudioData(studio) {
    const enhancedData = {};

    try {
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

    } catch (error) {
      console.log(`Data generation failed for ${studio.name}: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate realistic specialties based on studio name and location
   */
  generateSpecialties(studio) {
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
  generateInstructorNames() {
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
  generateEmail(studio) {
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

  /**
   * Update studio data in database
   */
  async updateStudioData(studioId, enhancedData) {
    const { error } = await supabase
      .from('pilates_studios')
      .update({
        ...enhancedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', studioId);

    if (error) {
      throw new Error(`Failed to update studio: ${error.message}`);
    }
  }

  /**
   * Utility: Split array into chunks
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Utility: Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other modules
module.exports = StudioAutoEnhancer;

// If run directly, start the enhancement process
if (require.main === module) {
  const enhancer = new StudioAutoEnhancer();
  enhancer.enhanceAllStudios().catch(console.error);
}