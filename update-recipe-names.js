const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateRecipeNames() {
  try {
    console.log('🔄 Updating recipe names to remove "Easy" prefix...');

    // Get all recipes
    const { data: recipes, error: fetchError } = await supabase
      .from('recipes')
      .select('id, title, slug, seo_title');

    if (fetchError) {
      console.error('Error fetching recipes:', fetchError);
      return;
    }

    console.log(`Found ${recipes.length} recipes to update.`);

    let updatedCount = 0;

    for (const recipe of recipes) {
      let needsUpdate = false;
      const updates = {};

      // Update title if it starts with "Easy "
      if (recipe.title.startsWith('Easy ')) {
        updates.title = recipe.title.replace(/^Easy /, '');
        needsUpdate = true;
      }

      // Update slug if it starts with "easy-"
      if (recipe.slug.startsWith('easy-')) {
        updates.slug = recipe.slug.replace(/^easy-/, '');
        needsUpdate = true;
      }

      // Update SEO title if it starts with "Easy "
      if (recipe.seo_title && recipe.seo_title.startsWith('Easy ')) {
        updates.seo_title = recipe.seo_title.replace(/^Easy /, '');
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Updating: "${recipe.title}" → "${updates.title || recipe.title}"`);

        const { error: updateError } = await supabase
          .from('recipes')
          .update(updates)
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`Error updating recipe ${recipe.id}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} recipe names.`);
    console.log('🌐 Visit http://localhost:3002 to see the updated recipe names!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateRecipeNames();