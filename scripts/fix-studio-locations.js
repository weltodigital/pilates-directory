const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixStudioLocations() {
  console.log('🔧 FIXING STUDIO LOCATIONS\n');

  // Define studios that need to be moved to correct locations
  const studiesToMove = [
    // Ampthill studios currently in Bedford
    {
      name: 'HIX Pilates & Wellness Ltd',
      currentPath: 'bedfordshire/bedford/hix-pilates-wellness-ltd',
      newPath: 'bedfordshire/ampthill/hix-pilates-wellness-ltd',
      reason: 'Address is in Ampthill'
    },
    {
      name: 'Steph Hammond - Pilates & Wellness',
      currentPath: 'bedfordshire/bedford/steph-hammond-pilates-wellness',
      newPath: 'bedfordshire/ampthill/steph-hammond-pilates-wellness',
      reason: 'Address is in Ampthill'
    },
    {
      name: 'Studio 281 Ampthill',
      currentPath: 'bedfordshire/bedford/studio-281-ampthill',
      newPath: 'bedfordshire/ampthill/studio-281-ampthill',
      reason: 'Address is in Ampthill'
    },
    {
      name: 'The Pilates Reformer Studio Ampthill',
      currentPath: 'bedfordshire/bedford/the-pilates-reformer-studio-ampthill',
      newPath: 'bedfordshire/ampthill/the-pilates-reformer-studio-ampthill',
      reason: 'Address is in Ampthill'
    },
    {
      name: 'Steph Hammond Pilates & Wellness',
      currentPath: 'bedfordshire/bedford/steph-hammond-pilates-wellness',
      newPath: 'bedfordshire/ampthill/steph-hammond-pilates-wellness-2',
      reason: 'Address is in Ampthill (duplicate entry)'
    },
    // Flitwick studios currently in Bedford
    {
      name: 'Cerisport',
      currentPath: 'bedfordshire/bedford/cerisport',
      newPath: 'bedfordshire/flitwick/cerisport',
      reason: 'Address is in Flitwick'
    },
    {
      name: 'Chloe Fox Yoga & Barre',
      currentPath: 'bedfordshire/bedford/chloe-fox-yoga-barre',
      newPath: 'bedfordshire/flitwick/chloe-fox-yoga-barre',
      reason: 'Address is in Flitwick'
    },
    {
      name: 'Nicola Rayner Fitness',
      currentPath: 'bedfordshire/bedford/nicola-rayner-fitness',
      newPath: 'bedfordshire/flitwick/nicola-rayner-fitness',
      reason: 'Address is in Flitton (near Flitwick)'
    },
    {
      name: 'Personally Pilates with Charlotte',
      currentPath: 'bedfordshire/bedford/personally-pilates-with-charlotte',
      newPath: 'bedfordshire/flitwick/personally-pilates-with-charlotte',
      reason: 'Address is in Flitton (near Flitwick)'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  console.log(`📋 Moving ${studiesToMove.length} studios to correct locations:\n`);

  for (const move of studiesToMove) {
    console.log(`🏢 ${move.name}`);
    console.log(`   From: ${move.currentPath}`);
    console.log(`   To:   ${move.newPath}`);
    console.log(`   Reason: ${move.reason}`);

    // Find the studio by current path
    const { data: studio, error: findError } = await supabase
      .from('pilates_studios')
      .select('id, name, address')
      .eq('full_url_path', move.currentPath)
      .single();

    if (findError || !studio) {
      console.log(`   ❌ Studio not found with path: ${move.currentPath}`);
      errorCount++;
      continue;
    }

    // Update the studio's URL path
    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({ full_url_path: move.newPath })
      .eq('id', studio.id);

    if (updateError) {
      console.log(`   ❌ Failed to update: ${updateError.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Successfully moved`);
      successCount++;
    }
    console.log('');
  }

  console.log(`📈 SUMMARY:`);
  console.log(`✅ Successfully moved: ${successCount} studios`);
  console.log(`❌ Failed to move: ${errorCount} studios`);

  if (successCount > 0) {
    console.log(`\n🎉 Studios have been moved to their correct location pages!`);

    // Show final verification
    console.log(`\n🔍 VERIFICATION - Checking moved studios...`);

    for (const move of studiesToMove) {
      const { data: verifyStudio } = await supabase
        .from('pilates_studios')
        .select('name, full_url_path')
        .eq('full_url_path', move.newPath)
        .single();

      if (verifyStudio) {
        console.log(`✓ ${verifyStudio.name} -> ${verifyStudio.full_url_path}`);
      }
    }
  }

  // Check for remaining issues
  console.log(`\n🔍 FINAL CHECK - Looking for remaining misplaced studios...`);

  const { data: remainingIssues } = await supabase
    .from('pilates_studios')
    .select('name, address, full_url_path')
    .like('full_url_path', 'bedfordshire/bedford/%');

  const stillMisplaced = remainingIssues?.filter(studio => {
    const address = studio.address.toLowerCase();
    return address.includes('ampthill') ||
           address.includes('flitwick') ||
           address.includes('flitton') ||
           (address.includes('kempston') && !address.includes('bedford'));
  });

  if (stillMisplaced && stillMisplaced.length > 0) {
    console.log(`⚠️  ${stillMisplaced.length} studios may still be misplaced:`);
    stillMisplaced.forEach(studio => {
      console.log(`   - ${studio.name}: ${studio.address} -> ${studio.full_url_path}`);
    });
  } else {
    console.log(`✅ No remaining misplaced studios detected!`);
  }
}

// Run the script
fixStudioLocations()
  .then(() => {
    console.log('\n✨ Studio location fixes completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });