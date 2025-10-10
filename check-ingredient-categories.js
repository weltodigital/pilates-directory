const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkIngredientCategories() {
  console.log('📊 Checking ingredient-based categories and recipe counts...\n');

  // Get all categories that are ingredient-based (contain specific ingredient names)
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id, name, slug,
      recipe_categories(
        recipes(id, title, status)
      )
    `)
    .ilike('name', '%Easy%Recipes')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }

  // Filter to ingredient categories and count recipes
  const ingredientCategories = categories.filter(cat => {
    const name = cat.name.toLowerCase();
    return name.includes('beef') || name.includes('chicken') || name.includes('potato') ||
           name.includes('cheese') || name.includes('pasta') || name.includes('tomato') ||
           name.includes('onion') || name.includes('garlic') || name.includes('mushroom') ||
           name.includes('spinach') || name.includes('carrot') || name.includes('butter') ||
           name.includes('cream') || name.includes('bacon') || name.includes('egg') ||
           name.includes('rice') || name.includes('lemon') || name.includes('herb') ||
           name.includes('corn') || name.includes('chocolate') || name.includes('honey') ||
           name.includes('maple') || name.includes('yogurt') || name.includes('dairy') ||
           name.includes('quinoa') || name.includes('oats') || name.includes('bread') ||
           name.includes('lettuce') || name.includes('cucumber') || name.includes('lime') ||
           name.includes('baking');
  });

  console.log('🥘 Ingredient-based categories and their recipe counts:\n');

  ingredientCategories.forEach(category => {
    const recipeCount = category.recipe_categories?.filter(rc =>
      rc.recipes && rc.recipes.status === 'published'
    ).length || 0;

    const needsMore = recipeCount < 5 ? ' ⚠️ NEEDS MORE' : ' ✅';
    console.log(`${category.name}: ${recipeCount} recipes${needsMore}`);
  });

  console.log('\n📈 Summary:');
  const categoriesNeedingMore = ingredientCategories.filter(cat => {
    const recipeCount = cat.recipe_categories?.filter(rc =>
      rc.recipes && rc.recipes.status === 'published'
    ).length || 0;
    return recipeCount < 5;
  });

  console.log(`Total ingredient categories: ${ingredientCategories.length}`);
  console.log(`Categories needing more recipes (< 5): ${categoriesNeedingMore.length}`);

  return categoriesNeedingMore;
}

checkIngredientCategories();
