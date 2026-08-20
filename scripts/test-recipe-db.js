const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testRecipeDatabase() {
  console.log('🧪 Testing Recipe Database Connection...');

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );

  try {
    // Test categories
    console.log('📋 Testing categories table...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    if (catError) throw catError;
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`));

    // Test recipes
    console.log('\n🍳 Testing recipes table...');
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .limit(3);

    if (recipeError) throw recipeError;
    console.log(`✅ Found ${recipes.length} recipes`);
    recipes.forEach(recipe => console.log(`   - ${recipe.title} (${recipe.slug})`));

    // Test tags
    console.log('\n🏷️ Testing tags table...');
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .limit(5);

    if (tagError) throw tagError;
    console.log(`✅ Found ${tags.length} tags`);
    tags.forEach(tag => console.log(`   - ${tag.name}`));

    console.log('\n🎉 Database connection successful!');
    console.log('Ready to start building the recipe website!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testRecipeDatabase();