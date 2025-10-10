const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addDishTypeCategories() {
  try {
    console.log('🍲 Adding dish-type recipe categories...');

    // Dish-type categories targeting specific cooking styles
    const dishTypeCategories = [
      {
        name: 'Easy Soup Recipes',
        slug: 'easy-soup-recipes',
        description: 'Comforting soup recipes for every season. Easy chicken soup, tomato soup, vegetable soup, beef stew, creamy soups, and warming broth-based dishes perfect for cozy meals.',
        seo_title: 'Easy Soup Recipes - Chicken Soup & Tomato Soup | Ed\'s Easy Meals',
        seo_description: 'Easy soup recipes for comfort food. Chicken soup, tomato soup, vegetable soup, beef stew, creamy soups, and warming dishes.',
        featured: true
      },
      {
        name: 'Easy Salad Recipes',
        slug: 'easy-salad-recipes',
        description: 'Fresh salad recipes for healthy eating. Easy Caesar salad, garden salad, pasta salad, fruit salad, protein salads, and nutritious green dishes packed with vitamins.',
        seo_title: 'Easy Salad Recipes - Caesar Salad & Garden Salad | Ed\'s Easy Meals',
        seo_description: 'Easy salad recipes for fresh healthy meals. Caesar salad, garden salad, pasta salad, fruit salad, and nutritious dishes.',
        featured: true
      },
      {
        name: 'Easy Smoothie Recipes',
        slug: 'easy-smoothie-recipes',
        description: 'Nutritious smoothie recipes for quick nutrition. Easy fruit smoothies, green smoothies, protein smoothies, breakfast smoothies, and blended drinks for healthy living.',
        seo_title: 'Easy Smoothie Recipes - Fruit Smoothies & Green Smoothies | Ed\'s Easy Meals',
        seo_description: 'Easy smoothie recipes for quick nutrition. Fruit smoothies, green smoothies, protein smoothies, breakfast smoothies, and healthy drinks.',
        featured: true
      },
      {
        name: 'Easy Ramen Recipes',
        slug: 'easy-ramen-recipes',
        description: 'Delicious ramen recipes beyond instant noodles. Easy homemade ramen, chicken ramen, vegetable ramen, spicy ramen, and authentic Japanese noodle dishes.',
        seo_title: 'Easy Ramen Recipes - Homemade Ramen & Chicken Ramen | Ed\'s Easy Meals',
        seo_description: 'Easy ramen recipes for authentic noodle dishes. Homemade ramen, chicken ramen, vegetable ramen, spicy ramen, and Japanese cuisine.',
        featured: true
      }
    ];

    console.log(`🍲 Inserting ${dishTypeCategories.length} dish-type categories...`);

    const { data, error } = await supabase
      .from('categories')
      .insert(dishTypeCategories);

    if (error) {
      console.error('Error inserting dish-type categories:', error);
      return;
    }

    console.log('🎉 Successfully inserted all dish-type categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show the new categories
    console.log('🍲 NEW DISH-TYPE CATEGORIES:');
    dishTypeCategories.forEach(category => {
      console.log(`   - ${category.name} (/${category.slug})`);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addDishTypeCategories();