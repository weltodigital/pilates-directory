const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function checkRecipeImages() {
  console.log('🖼️ Checking recipe images...\n');

  // Get all recipes, ordered by creation date (newest first)
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, featured_image_url, featured_image_alt, created_at')
    .order('created_at', { ascending: false })
    .limit(50); // Check recent recipes

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  console.log(`Found ${recipes.length} recent recipes to check:\n`);

  let recipesWithoutImages = [];
  let recipesWithImages = [];

  recipes.forEach(recipe => {
    const hasImage = recipe.featured_image_url && recipe.featured_image_url.trim() !== '';
    const hasAltText = recipe.featured_image_alt && recipe.featured_image_alt.trim() !== '';

    if (!hasImage) {
      recipesWithoutImages.push(recipe);
      console.log(`❌ ${recipe.title} - No image`);
    } else if (!hasAltText) {
      console.log(`⚠️ ${recipe.title} - Has image but missing alt text`);
      recipesWithImages.push(recipe);
    } else {
      console.log(`✅ ${recipe.title} - Has image and alt text`);
      recipesWithImages.push(recipe);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`Total recipes checked: ${recipes.length}`);
  console.log(`Recipes with images: ${recipesWithImages.length}`);
  console.log(`Recipes without images: ${recipesWithoutImages.length}`);

  if (recipesWithoutImages.length > 0) {
    console.log('\n🚨 Recipes needing images:');
    recipesWithoutImages.forEach(recipe => {
      console.log(`- ${recipe.title} (ID: ${recipe.id})`);
    });
  }

  return recipesWithoutImages;
}

checkRecipeImages();