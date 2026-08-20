const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function checkZeroRecipeCategories() {
  console.log('📊 Checking ALL categories for zero recipes...\n');

  // Get all categories with their recipe counts
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id, name, slug,
      recipe_categories(
        recipes(id, title, status)
      )
    `)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }

  console.log('🔍 Categories with ZERO recipes:\n');

  const zeroRecipeCategories = [];

  categories.forEach(category => {
    const publishedRecipeCount = category.recipe_categories?.filter(rc =>
      rc.recipes && rc.recipes.status === 'published'
    ).length || 0;

    if (publishedRecipeCount === 0) {
      zeroRecipeCategories.push(category);
      console.log(`❌ ${category.name} (slug: ${category.slug})`);
    }
  });

  console.log(`\n📈 Summary:`);
  console.log(`Total categories: ${categories.length}`);
  console.log(`Categories with ZERO recipes: ${zeroRecipeCategories.length}`);

  if (zeroRecipeCategories.length > 0) {
    console.log('\n🎯 Categories that need recipes:');
    zeroRecipeCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
    });
  }

  return zeroRecipeCategories;
}

checkZeroRecipeCategories();