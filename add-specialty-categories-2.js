const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSpecialtyCategories2() {
  try {
    console.log('🍽️ Adding more specialty recipe categories...');

    // Additional specialty categories
    const specialtyCategories = [
      {
        name: 'Easy Marrow Recipes',
        slug: 'easy-marrow-recipes',
        description: 'Comforting marrow recipes for hearty vegetables. Easy stuffed marrow, marrow soup, roasted marrow, marrow curry, and traditional British vegetable dishes.',
        seo_title: 'Easy Marrow Recipes - Stuffed Marrow & Marrow Soup | Ed\'s Easy Meals',
        seo_description: 'Easy marrow recipes for hearty vegetables. Stuffed marrow, marrow soup, roasted marrow, marrow curry, and traditional British dishes.',
        featured: true
      },
      {
        name: 'Easy Chickpea Recipes',
        slug: 'easy-chickpea-recipes',
        description: 'Protein-rich chickpea recipes for plant-based nutrition. Easy hummus, chickpea curry, roasted chickpeas, chickpea salad, and fiber-packed legume dishes.',
        seo_title: 'Easy Chickpea Recipes - Hummus & Chickpea Curry | Ed\'s Easy Meals',
        seo_description: 'Easy chickpea recipes for plant protein. Hummus, chickpea curry, roasted chickpeas, chickpea salad, and nutritious legume dishes.',
        featured: true
      },
      {
        name: 'Easy Date Night Recipes',
        slug: 'easy-date-night-recipes',
        description: 'Romantic date night recipes for special occasions. Easy beef tenderloin, lobster dishes, chocolate desserts, wine pairings, and intimate dinner ideas.',
        seo_title: 'Easy Date Night Recipes - Romantic Dinners & Special Occasions | Ed\'s Easy Meals',
        seo_description: 'Easy date night recipes for romance. Beef tenderloin, lobster dishes, chocolate desserts, wine pairings, and intimate dinners.',
        featured: true
      },
      {
        name: 'Easy Stew Recipes',
        slug: 'easy-stew-recipes',
        description: 'Hearty stew recipes for comfort food. Easy beef stew, chicken stew, vegetable stew, lamb stew, and warming one-pot dishes for cold days.',
        seo_title: 'Easy Stew Recipes - Beef Stew & Chicken Stew | Ed\'s Easy Meals',
        seo_description: 'Easy stew recipes for hearty comfort food. Beef stew, chicken stew, vegetable stew, lamb stew, and warming one-pot dishes.',
        featured: true
      },
      {
        name: 'Easy Casserole Recipes',
        slug: 'easy-casserole-recipes',
        description: 'Comforting casserole recipes for family meals. Easy tuna casserole, green bean casserole, sweet potato casserole, and baked one-dish dinners.',
        seo_title: 'Easy Casserole Recipes - Tuna Casserole & Green Bean Casserole | Ed\'s Easy Meals',
        seo_description: 'Easy casserole recipes for family comfort food. Tuna casserole, green bean casserole, sweet potato casserole, and one-dish meals.',
        featured: true
      },
      {
        name: 'Easy Green Smoothie Recipes',
        slug: 'easy-green-smoothie-recipes',
        description: 'Nutritious green smoothie recipes for healthy living. Easy spinach smoothies, kale smoothies, green detox drinks, and vitamin-packed blended beverages.',
        seo_title: 'Easy Green Smoothie Recipes - Spinach Smoothies & Kale Smoothies | Ed\'s Easy Meals',
        seo_description: 'Easy green smoothie recipes for nutrition. Spinach smoothies, kale smoothies, green detox drinks, and vitamin-packed beverages.',
        featured: true
      },
      {
        name: 'Easy Gnocchi Recipes',
        slug: 'easy-gnocchi-recipes',
        description: 'Delicious gnocchi recipes for Italian comfort. Easy potato gnocchi, gnocchi with sage butter, gnocchi soup, pan-fried gnocchi, and pillowy pasta dishes.',
        seo_title: 'Easy Gnocchi Recipes - Potato Gnocchi & Sage Butter Gnocchi | Ed\'s Easy Meals',
        seo_description: 'Easy gnocchi recipes for Italian comfort. Potato gnocchi, gnocchi with sage butter, gnocchi soup, pan-fried gnocchi, and pasta dishes.',
        featured: true
      }
    ];

    console.log(`🍽️ Inserting ${specialtyCategories.length} more specialty categories...`);

    const { data, error } = await supabase
      .from('categories')
      .insert(specialtyCategories);

    if (error) {
      console.error('Error inserting specialty categories:', error);
      return;
    }

    console.log('🎉 Successfully inserted all additional specialty categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show the new categories grouped by type
    console.log('🍽️ NEW SPECIALTY CATEGORIES ADDED:');
    console.log('   VEGETABLES & LEGUMES:');
    console.log('   - Easy Marrow Recipes (/easy-marrow-recipes)');
    console.log('   - Easy Chickpea Recipes (/easy-chickpea-recipes)');

    console.log('   OCCASION-BASED:');
    console.log('   - Easy Date Night Recipes (/easy-date-night-recipes)');

    console.log('   COOKING METHODS & DISHES:');
    console.log('   - Easy Stew Recipes (/easy-stew-recipes)');
    console.log('   - Easy Casserole Recipes (/easy-casserole-recipes)');

    console.log('   BEVERAGES & PASTA:');
    console.log('   - Easy Green Smoothie Recipes (/easy-green-smoothie-recipes)');
    console.log('   - Easy Gnocchi Recipes (/easy-gnocchi-recipes)');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addSpecialtyCategories2();