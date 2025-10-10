const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixMissingCookTime() {
  console.log('🔧 Fixing recipes with missing cook_time...\n');

  // List of recipe IDs that need cook_time = 0 (no-cook recipes)
  const recipesToFix = [
    '051c0651-8acc-47b3-98c0-f794b330831b', // Rocket Fuel Energy Bites
    '91e9fab9-e073-4089-864e-d2882a0a5530', // Speed Demon Fruit Salsa
    'f9fe7a43-8d53-47de-be03-c3f6be482ad1', // Flash Cucumber Gazpacho
    '5b40d6b9-41ff-4c75-98cf-595648ddd77c', // Instant Berry Chia Pudding
    'e214ef89-62e3-43fa-8d79-2bffcc04615f', // Lightning Fast Hummus Wrap
    '4ac830c3-d96f-4e82-8abc-6708e51fb902', // Caprese Salad Bites
    '9e9c280b-34ff-49a0-9f7a-49ec581eb069', // Peanut Butter Banana Smoothie
    '2e26753c-5232-474e-bd9a-bb421c1f5f1d'  // Avocado Toast with Everything Seasoning
  ];

  for (const recipeId of recipesToFix) {
    // Get recipe details first
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('title, cook_time')
      .eq('id', recipeId)
      .single();

    if (fetchError) {
      console.error(`❌ Error fetching recipe ${recipeId}:`, fetchError.message);
      continue;
    }

    console.log(`🔧 Fixing: ${recipe.title}`);
    console.log(`   Current cook_time: ${recipe.cook_time}`);

    // Update cook_time to 0 for no-cook recipes
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ cook_time: 0 })
      .eq('id', recipeId);

    if (updateError) {
      console.error(`❌ Error updating recipe ${recipeId}:`, updateError.message);
    } else {
      console.log(`   ✅ Updated cook_time to 0`);
    }
  }

  console.log('\n🎉 All recipes have been fixed!');
}

fixMissingCookTime();