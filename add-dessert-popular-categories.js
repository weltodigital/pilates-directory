const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addDessertPopularCategories() {
  try {
    console.log('🍰 Adding dessert and popular dish categories...');

    // First check for existing categories to avoid duplicates
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('slug');

    const existingSlugs = existingCategories?.map(cat => cat.slug) || [];
    console.log(`📋 Found ${existingSlugs.length} existing categories`);

    // Dessert and popular dish categories
    const newCategories = [
      {
        name: 'Easy Cheesecake Recipes',
        slug: 'easy-cheesecake-recipes',
        description: 'Creamy cheesecake recipes for decadent desserts. Easy no-bake cheesecake, New York cheesecake, strawberry cheesecake, chocolate cheesecake, and rich cream cheese treats.',
        seo_title: 'Easy Cheesecake Recipes - No-Bake Cheesecake & New York Cheesecake | Ed\'s Easy Meals',
        seo_description: 'Easy cheesecake recipes for creamy desserts. No-bake cheesecake, New York cheesecake, strawberry cheesecake, chocolate cheesecake, and rich treats.',
        featured: true
      },
      {
        name: 'Easy Dip Recipes',
        slug: 'easy-dip-recipes',
        description: 'Crowd-pleasing dip recipes for parties and snacking. Easy spinach dip, cheese dip, guacamole, hummus, buffalo dip, and appetizer favorites.',
        seo_title: 'Easy Dip Recipes - Spinach Dip & Cheese Dip | Ed\'s Easy Meals',
        seo_description: 'Easy dip recipes for parties and snacks. Spinach dip, cheese dip, guacamole, hummus, buffalo dip, and crowd-pleasing appetizers.',
        featured: true
      },
      {
        name: 'Easy Burger Recipes',
        slug: 'easy-burger-recipes',
        description: 'Juicy burger recipes for grilling season. Easy beef burgers, turkey burgers, veggie burgers, burger toppings, and backyard BBQ favorites.',
        seo_title: 'Easy Burger Recipes - Beef Burgers & Turkey Burgers | Ed\'s Easy Meals',
        seo_description: 'Easy burger recipes for grilling. Beef burgers, turkey burgers, veggie burgers, burger toppings, and BBQ favorites.',
        featured: true
      }
    ];

    // Filter out duplicates
    const categoriesToAdd = newCategories.filter(cat => !existingSlugs.includes(cat.slug));

    console.log(`🍰 Found ${newCategories.length - categoriesToAdd.length} duplicates, adding ${categoriesToAdd.length} new categories...`);

    if (categoriesToAdd.length === 0) {
      console.log('✅ All categories already exist - no new categories to add!');
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToAdd);

    if (error) {
      console.error('Error inserting dessert/popular categories:', error);
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
      console.log('🍰 NEW CATEGORIES ADDED:');
      categoriesToAdd.forEach(category => {
        console.log(`   - ${category.name} (/${category.slug})`);
      });
    }

    // Show any duplicates skipped
    const duplicates = newCategories.filter(cat => existingSlugs.includes(cat.slug));
    if (duplicates.length > 0) {
      console.log('⚠️  DUPLICATES SKIPPED:');
      duplicates.forEach(category => {
        console.log(`   - ${category.name} (/${category.slug}) - already exists`);
      });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addDessertPopularCategories();