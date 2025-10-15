const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

const studioUpdates = [
  {
    name: 'Re-Form Pilates',
    city: 'Wigan',
    updates: {
      phone: '+44 7799 845361',
      email: 'info@yogatown.co.uk',
      address: '234 Almond Brook Road, Standish',
      website: 'https://re-form.co.uk/',
      instagram: '@re_form_pilates_studio',
      facebook: 'facebook.com/people/Re-Form-Pilates/61560142633940/',
      class_types: [
        'Beginners Re-Form',
        'Intermediate Re-Form',
        'Advanced Re-Form',
        'Reformer Pilates'
      ],
      equipment_available: [
        'Reformer machines with adjustable weight resistance springs',
        'Professional Pilates equipment'
      ],
      specialties: [
        'Small class sizes',
        'Expert instruction with individual attention',
        'Hands-on correction',
        'Quality movement focus',
        'Technique and form emphasis',
        'Low-impact workout suitable for all fitness levels'
      ]
    }
  },
  {
    name: 'Ballantyne Studio',
    city: 'Stockport',
    updates: {
      address: '15 Stockport Road, Marple',
      postcode: 'SK6 6BD',
      website: 'https://www.ballantynestudio.com/',
      instagram: '@ballantynestudio',
      facebook: 'facebook.com/ballantynestudio/',
      class_types: [
        'Intro',
        'Tone',
        'Tone & Stretch',
        'Beginners Course',
        'Sculpt',
        'Legs and Booty',
        'Reformer for Men',
        'Reform',
        'Cardio',
        'Classical Reformer Pilates'
      ],
      equipment_available: [
        'Reformer machines with adjustable weight resistance springs',
        'Professional classical Pilates equipment'
      ],
      specialties: [
        'Classical Reformer Pilates',
        'Maximum 8 people per class',
        '45-minute class duration',
        'Daily classes',
        'Safety and body protection focus',
        'Original pilates principles'
      ]
    }
  }
];

async function updateStudioData() {
  console.log('Updating pilates studio data with enhanced information...\n');

  for (const studioUpdate of studioUpdates) {
    try {
      // First, find the studio
      const { data: existingStudios, error: findError } = await supabase
        .from('pilates_studios')
        .select('id, name, city')
        .eq('name', studioUpdate.name)
        .eq('city', studioUpdate.city);

      if (findError) {
        console.error(`Error finding ${studioUpdate.name}:`, findError);
        continue;
      }

      if (existingStudios.length === 0) {
        console.log(`❌ Studio not found: ${studioUpdate.name} in ${studioUpdate.city}`);
        continue;
      }

      const studio = existingStudios[0];

      // Update the studio with enhanced data
      const { data, error } = await supabase
        .from('pilates_studios')
        .update({
          ...studioUpdate.updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', studio.id)
        .select();

      if (error) {
        console.error(`Error updating ${studioUpdate.name}:`, error);
      } else {
        console.log(`✅ Updated: ${studioUpdate.name} in ${studioUpdate.city}`);
        console.log(`   - Added: ${Object.keys(studioUpdate.updates).join(', ')}`);
      }
    } catch (err) {
      console.error(`Unexpected error updating ${studioUpdate.name}:`, err);
    }

    console.log(''); // Empty line for readability
  }

  console.log('Studio data update completed!');
}

updateStudioData().catch(console.error);