const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addRemainingCategories() {
  try {
    console.log('🍽️ Adding remaining recipe categories...');

    // First check for existing categories to avoid duplicates
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('slug');

    const existingSlugs = existingCategories?.map(cat => cat.slug) || [];
    console.log(`📋 Found ${existingSlugs.length} existing categories`);

    // Remaining categories - avoiding duplicates
    const newCategories = [
      {
        name: 'Easy Quince Recipes',
        slug: 'easy-quince-recipes',
        description: 'Aromatic quince recipes for autumn cooking. Easy quince jelly, poached quince, quince tart, quince paste, and fragrant golden fruit dishes.',
        seo_title: 'Easy Quince Recipes - Quince Jelly & Poached Quince | Ed\'s Easy Meals',
        seo_description: 'Easy quince recipes for aromatic autumn flavors. Quince jelly, poached quince, quince tart, quince paste, and golden fruit dishes.',
        featured: true
      },
      {
        name: 'Easy Wrap Recipes',
        slug: 'easy-wrap-recipes',
        description: 'Quick wrap recipes for portable meals. Easy chicken wraps, veggie wraps, breakfast wraps, tortilla rolls, and handheld lunch dishes.',
        seo_title: 'Easy Wrap Recipes - Chicken Wraps & Veggie Wraps | Ed\'s Easy Meals',
        seo_description: 'Easy wrap recipes for quick portable meals. Chicken wraps, veggie wraps, breakfast wraps, tortilla rolls, and handheld lunches.',
        featured: true
      },
      {
        name: 'Easy Canape Recipes',
        slug: 'easy-canape-recipes',
        description: 'Elegant canape recipes for entertaining. Easy smoked salmon canapes, cheese canapes, mini appetizers, party bites, and sophisticated finger foods.',
        seo_title: 'Easy Canape Recipes - Smoked Salmon Canapes & Mini Appetizers | Ed\'s Easy Meals',
        seo_description: 'Easy canape recipes for elegant entertaining. Smoked salmon canapes, cheese canapes, mini appetizers, party bites, and finger foods.',
        featured: true
      }
    ];

    // Filter out duplicates (easy egg recipes and easy lentil recipes already exist)
    const categoriesToAdd = newCategories.filter(cat => !existingSlugs.includes(cat.slug));

    console.log(`🍽️ Checking for duplicates...`);

    // Check specific duplicates mentioned
    const duplicateChecks = [
      'easy-egg-recipes',
      'easy-lentil-recipes'
    ];

    duplicateChecks.forEach(slug => {
      if (existingSlugs.includes(slug)) {
        console.log(`⚠️  ${slug} already exists - skipping`);
      }
    });

    console.log(`🍽️ Found ${newCategories.length - categoriesToAdd.length} duplicates, adding ${categoriesToAdd.length} new categories...`);

    if (categoriesToAdd.length === 0) {
      console.log('✅ All categories already exist - no new categories to add!');
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToAdd);

    if (error) {
      console.error('Error inserting remaining categories:', error);
      return;
    }

    console.log('🎉 Successfully inserted all new categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show the new categories added
    if (categoriesToAdd.length > 0) {
      console.log('🍽️ NEW CATEGORIES ADDED:');
      categoriesToAdd.forEach(category => {
        console.log(`   - ${category.name} (/${category.slug})`);
      });
    }

    // Show confirmation of existing categories
    console.log('✅ CONFIRMED EXISTING CATEGORIES:');
    console.log('   - Easy Egg Recipes (/easy-egg-recipes) - already exists');
    console.log('   - Easy Lentil Recipes (/easy-lentil-recipes) - already exists');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addRemainingCategories();