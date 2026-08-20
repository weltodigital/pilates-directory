const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function removeTrueDuplicates() {
  console.log('🗑️  REMOVING TRUE DUPLICATE STUDIOS\n');

  // Define true duplicates that should be removed
  const trueDuplicates = [
    {
      group: 'Platinum Studios (Same business, different names)',
      keep: {
        name: 'Platinum Wellness',
        reason: 'Has rating (4.9) and seems to be the main brand'
      },
      remove: {
        name: 'Platinum Fitness & Pilates',
        path: 'bedfordshire/luton/platinum-fitness-pilates',
        reason: 'No rating, likely duplicate entry'
      }
    },
    {
      group: 'Steph Hammond Studios (Same business, similar names)',
      keep: {
        name: 'Steph Hammond - Pilates & Wellness',
        path: 'bedfordshire/ampthill/steph-hammond-pilates-wellness',
        reason: 'Has rating (5.0) and cleaner name format'
      },
      remove: {
        name: 'Steph Hammond Pilates & Wellness',
        path: 'bedfordshire/ampthill/steph-hammond-pilates-wellness-2',
        reason: 'Lower rating (4.9), likely duplicate'
      }
    }
  ];

  let totalRemoved = 0;
  let errors = 0;

  for (const duplicate of trueDuplicates) {
    console.log(`📋 Processing: ${duplicate.group}`);
    console.log(`   ✅ KEEPING: ${duplicate.keep.name}`);
    console.log(`      Reason: ${duplicate.keep.reason}`);

    console.log(`   🗑️ REMOVING: ${duplicate.remove.name}`);
    console.log(`      Path: ${duplicate.remove.path}`);
    console.log(`      Reason: ${duplicate.remove.reason}`);

    // Find the studio to remove
    const { data: studioToRemove, error: findError } = await supabase
      .from('pilates_studios')
      .select('id, name, address, full_url_path')
      .eq('full_url_path', duplicate.remove.path)
      .single();

    if (findError || !studioToRemove) {
      console.log(`   ❌ Studio not found: ${duplicate.remove.path}`);
      errors++;
      continue;
    }

    console.log(`   📍 Found studio: ${studioToRemove.name}`);
    console.log(`      Address: ${studioToRemove.address}`);

    // Remove the duplicate
    const { error: deleteError } = await supabase
      .from('pilates_studios')
      .delete()
      .eq('id', studioToRemove.id);

    if (deleteError) {
      console.log(`   ❌ Failed to delete: ${deleteError.message}`);
      errors++;
    } else {
      console.log(`   ✅ Successfully removed duplicate`);
      totalRemoved++;
    }
    console.log('');
  }

  console.log(`📈 SUMMARY:`);
  console.log(`   🗑️ Studios removed: ${totalRemoved}`);
  console.log(`   ❌ Errors: ${errors}`);

  if (totalRemoved > 0) {
    console.log(`\n🎉 Successfully removed ${totalRemoved} duplicate studios!`);

    // Verify the kept studios still exist
    console.log(`\n✅ VERIFICATION - Confirming kept studios exist:`);

    for (const duplicate of trueDuplicates) {
      const keepPath = duplicate.keep.path || duplicate.remove.path.replace(duplicate.remove.name.toLowerCase().replace(/\s+/g, '-'), duplicate.keep.name.toLowerCase().replace(/\s+/g, '-'));

      const { data: keptStudio } = await supabase
        .from('pilates_studios')
        .select('name, full_url_path, google_rating')
        .ilike('name', '%' + duplicate.keep.name.replace(/[^\w\s]/g, '') + '%')
        .single();

      if (keptStudio) {
        console.log(`   ✓ ${keptStudio.name} -> ${keptStudio.full_url_path} (Rating: ${keptStudio.google_rating || 'N/A'})`);
      } else {
        console.log(`   ⚠️ Could not verify: ${duplicate.keep.name}`);
      }
    }
  }

  // Final duplicate check
  console.log(`\n🔍 FINAL CHECK - Looking for remaining duplicates...`);

  const { data: remainingStudios } = await supabase
    .from('pilates_studios')
    .select('name, full_url_path, phone')
    .order('name');

  // Check for remaining phone number duplicates
  const phoneGroups = {};
  remainingStudios?.forEach(studio => {
    if (studio.phone) {
      if (!phoneGroups[studio.phone]) {
        phoneGroups[studio.phone] = [];
      }
      phoneGroups[studio.phone].push(studio);
    }
  });

  const remainingPhoneDuplicates = Object.keys(phoneGroups).filter(phone => phoneGroups[phone].length > 1);

  if (remainingPhoneDuplicates.length > 0) {
    console.log(`⚠️ ${remainingPhoneDuplicates.length} phone numbers still appear multiple times:`);

    remainingPhoneDuplicates.forEach(phone => {
      const studios = phoneGroups[phone];
      if (studios.some(s => !s.name.toLowerCase().includes('restart'))) { // Ignore Restart chain
        console.log(`   📞 ${phone}:`);
        studios.forEach(studio => {
          console.log(`      - ${studio.name} (${studio.full_url_path})`);
        });
      }
    });
  } else {
    console.log(`✅ No suspicious phone number duplicates remaining`);
  }
}

// Run the script
removeTrueDuplicates()
  .then(() => {
    console.log('\n✨ Duplicate removal completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });