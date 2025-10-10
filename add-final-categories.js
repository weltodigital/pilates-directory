const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addFinalCategories() {
  try {
    console.log('🍽️ Adding final specialty recipe categories...');

    // First check for existing categories to avoid duplicates
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('slug');

    const existingSlugs = existingCategories?.map(cat => cat.slug) || [];
    console.log(`📋 Found ${existingSlugs.length} existing categories`);

    // Final specialty categories - avoiding duplicates
    const newCategories = [
      {
        name: 'Easy Halloumi Recipes',
        slug: 'easy-halloumi-recipes',
        description: 'Mediterranean halloumi recipes for grilled cheese lovers. Easy grilled halloumi, halloumi salad, halloumi burgers, fried halloumi, and Cypriot cheese dishes.',
        seo_title: 'Easy Halloumi Recipes - Grilled Halloumi & Halloumi Salad | Ed\'s Easy Meals',
        seo_description: 'Easy halloumi recipes for Mediterranean flavors. Grilled halloumi, halloumi salad, halloumi burgers, fried halloumi, and cheese dishes.',
        featured: true
      },
      {
        name: 'Easy Pumpkin Recipes',
        slug: 'easy-pumpkin-recipes',
        description: 'Seasonal pumpkin recipes for autumn cooking. Easy pumpkin pie, pumpkin soup, roasted pumpkin, pumpkin bread, and orange squash dishes.',
        seo_title: 'Easy Pumpkin Recipes - Pumpkin Pie & Pumpkin Soup | Ed\'s Easy Meals',
        seo_description: 'Easy pumpkin recipes for autumn flavors. Pumpkin pie, pumpkin soup, roasted pumpkin, pumpkin bread, and seasonal squash dishes.',
        featured: true
      },
      {
        name: 'Easy Noodle Recipes',
        slug: 'easy-noodle-recipes',
        description: 'Versatile noodle recipes for quick Asian cuisine. Easy pad thai, lo mein, pho, udon noodles, rice noodles, and slurp-worthy noodle dishes.',
        seo_title: 'Easy Noodle Recipes - Pad Thai & Lo Mein | Ed\'s Easy Meals',
        seo_description: 'Easy noodle recipes for Asian cuisine. Pad thai, lo mein, pho, udon noodles, rice noodles, and quick noodle dishes.',
        featured: true
      },
      {
        name: 'Easy Quiche Recipes',
        slug: 'easy-quiche-recipes',
        description: 'Classic quiche recipes for brunch and dinner. Easy quiche lorraine, spinach quiche, cheese quiche, crustless quiche, and French egg tart dishes.',
        seo_title: 'Easy Quiche Recipes - Quiche Lorraine & Spinach Quiche | Ed\'s Easy Meals',
        seo_description: 'Easy quiche recipes for elegant meals. Quiche lorraine, spinach quiche, cheese quiche, crustless quiche, and egg tarts.',
        featured: true
      },
      {
        name: 'Easy Chorizo Recipes',
        slug: 'easy-chorizo-recipes',
        description: 'Spicy chorizo recipes for Spanish flavors. Easy chorizo pasta, chorizo and eggs, paella with chorizo, chorizo soup, and smoky sausage dishes.',
        seo_title: 'Easy Chorizo Recipes - Chorizo Pasta & Chorizo Eggs | Ed\'s Easy Meals',
        seo_description: 'Easy chorizo recipes for Spanish cuisine. Chorizo pasta, chorizo and eggs, paella with chorizo, chorizo soup, and spicy sausage dishes.',
        featured: true
      },
      {
        name: 'Easy Blackcurrant Recipes',
        slug: 'easy-blackcurrant-recipes',
        description: 'Tart blackcurrant recipes for British flavors. Easy blackcurrant jam, blackcurrant crumble, blackcurrant cordial, and dark berry dishes.',
        seo_title: 'Easy Blackcurrant Recipes - Blackcurrant Jam & Blackcurrant Crumble | Ed\'s Easy Meals',
        seo_description: 'Easy blackcurrant recipes for tart berry flavors. Blackcurrant jam, blackcurrant crumble, blackcurrant cordial, and British dishes.',
        featured: true
      },
      {
        name: 'Easy Student Recipes',
        slug: 'easy-student-recipes',
        description: 'Budget-friendly student recipes for dorm cooking. Easy microwave meals, one-pot dishes, cheap ingredients, quick snacks, and college-friendly cooking.',
        seo_title: 'Easy Student Recipes - Budget Meals & Dorm Cooking | Ed\'s Easy Meals',
        seo_description: 'Easy student recipes for budget cooking. Microwave meals, one-pot dishes, cheap ingredients, quick snacks, and college meals.',
        featured: true
      }
    ];

    // Filter out duplicates
    const categoriesToAdd = newCategories.filter(cat => !existingSlugs.includes(cat.slug));

    console.log(`🍽️ Found ${newCategories.length - categoriesToAdd.length} duplicates, adding ${categoriesToAdd.length} new categories...`);

    if (categoriesToAdd.length === 0) {
      console.log('✅ All categories already exist - no new categories to add!');
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToAdd);

    if (error) {
      console.error('Error inserting final categories:', error);
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

addFinalCategories();