const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCookTime() {
  console.log('🔍 Checking cook_time values for problematic recipes...\n');

  const recipeIds = [
    '051c0651-8acc-47b3-98c0-f794b330831b', // Rocket Fuel Energy Bites
    '91e9fab9-e073-4089-864e-d2882a0a5530', // Speed Demon Fruit Salsa
    'f9fe7a43-8d53-47de-be03-c3f6be482ad1', // Flash Cucumber Gazpacho
    '5b40d6b9-41ff-4c75-98cf-595648ddd77c', // Instant Berry Chia Pudding
    'e214ef89-62e3-43fa-8d79-2bffcc04615f', // Lightning Fast Hummus Wrap
    '4ac830c3-d96f-4e82-8abc-6708e51fb902', // Caprese Salad Bites
    '9e9c280b-34ff-49a0-9f7a-49ec581eb069', // Peanut Butter Banana Smoothie
    '2e26753c-5232-474e-bd9a-bb421c1f5f1d'  // Avocado Toast with Everything Seasoning
  ];

  for (const recipeId of recipeIds) {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('title, cook_time, prep_time, total_time')
      .eq('id', recipeId)
      .single();

    if (error) {
      console.error(`❌ Error fetching recipe ${recipeId}:`, error.message);
      continue;
    }

    console.log(`📋 ${recipe.title}`);
    console.log(`   cook_time: ${recipe.cook_time} (type: ${typeof recipe.cook_time})`);
    console.log(`   prep_time: ${recipe.prep_time} (type: ${typeof recipe.prep_time})`);
    console.log(`   total_time: ${recipe.total_time} (type: ${typeof recipe.total_time})`);
    console.log(`   cook_time is null: ${recipe.cook_time === null}`);
    console.log(`   cook_time is undefined: ${recipe.cook_time === undefined}`);
    console.log('');
  }
}

checkCookTime();