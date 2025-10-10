const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createSampleRecipes() {
  try {
    console.log('👨‍🍳 Creating sample recipes...');

    const recipes = [
      {
        title: 'Easy Spaghetti Carbonara',
        slug: 'easy-spaghetti-carbonara',
        description: 'A classic Italian pasta dish with creamy egg sauce, crispy pancetta, and parmesan cheese. Ready in just 20 minutes with simple ingredients.',
        ingredients: [
          { name: 'Spaghetti', amount: '400g', notes: 'or other long pasta' },
          { name: 'Pancetta or bacon', amount: '150g', notes: 'diced' },
          { name: 'Large eggs', amount: '3', notes: 'room temperature' },
          { name: 'Parmesan cheese', amount: '100g', notes: 'freshly grated' },
          { name: 'Black pepper', amount: '1 tsp', notes: 'freshly ground' },
          { name: 'Salt', amount: 'to taste', notes: 'for pasta water' }
        ],
        instructions: [
          { step: 1, instruction: 'Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.' },
          { step: 2, instruction: 'While pasta cooks, fry pancetta in a large pan over medium heat until crispy, about 5 minutes.' },
          { step: 3, instruction: 'In a bowl, whisk together eggs, parmesan, and black pepper.' },
          { step: 4, instruction: 'Reserve 1 cup pasta water before draining. Add hot pasta to the pan with pancetta.' },
          { step: 5, instruction: 'Remove from heat and quickly toss with egg mixture, adding pasta water gradually until creamy.' },
          { step: 6, instruction: 'Serve immediately with extra parmesan and black pepper.' }
        ],
        prep_time: 10,
        cook_time: 15,
        total_time: 25,
        servings: 4,
        difficulty: 'easy',
        calories_per_serving: 520,
        seo_title: 'Easy Spaghetti Carbonara Recipe - Authentic Italian Pasta | Ed\'s Easy Meals',
        seo_description: 'Learn to make authentic Italian spaghetti carbonara in just 20 minutes. Creamy, delicious pasta with pancetta and parmesan cheese.',
        featured_image_url: '/images/recipes/easy-spaghetti-carbonara.jpg',
        featured_image_alt: 'Creamy spaghetti carbonara with crispy pancetta and parmesan cheese',
        tips: 'The key to perfect carbonara is removing the pan from heat before adding the egg mixture to prevent scrambling. Use pasta water to create the perfect creamy texture.',
        status: 'published',
        featured: true
      },
      {
        title: 'Easy Chicken Stir Fry',
        slug: 'easy-chicken-stir-fry',
        description: 'Quick and healthy chicken stir fry with colorful vegetables in a savory sauce. Perfect weeknight dinner ready in 15 minutes.',
        ingredients: [
          { name: 'Chicken breast', amount: '500g', notes: 'sliced thin' },
          { name: 'Vegetable oil', amount: '2 tbsp', notes: 'divided' },
          { name: 'Bell peppers', amount: '2', notes: 'sliced' },
          { name: 'Broccoli florets', amount: '2 cups', notes: 'fresh or frozen' },
          { name: 'Carrot', amount: '1 large', notes: 'julienned' },
          { name: 'Garlic cloves', amount: '3', notes: 'minced' },
          { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, minced' },
          { name: 'Soy sauce', amount: '3 tbsp', notes: 'low sodium' },
          { name: 'Honey', amount: '2 tbsp', notes: '' },
          { name: 'Rice vinegar', amount: '1 tbsp', notes: '' },
          { name: 'Cornstarch', amount: '1 tsp', notes: 'mixed with 2 tbsp water' },
          { name: 'Green onions', amount: '2', notes: 'sliced for garnish' }
        ],
        instructions: [
          { step: 1, instruction: 'Heat 1 tbsp oil in a large wok or skillet over high heat.' },
          { step: 2, instruction: 'Add chicken and stir-fry for 3-4 minutes until golden. Remove and set aside.' },
          { step: 3, instruction: 'Add remaining oil to pan. Stir-fry vegetables for 3-4 minutes until crisp-tender.' },
          { step: 4, instruction: 'Add garlic and ginger, stir-fry for 30 seconds until fragrant.' },
          { step: 5, instruction: 'Mix soy sauce, honey, and rice vinegar. Return chicken to pan.' },
          { step: 6, instruction: 'Add sauce and cornstarch mixture. Toss until everything is coated and sauce thickens.' },
          { step: 7, instruction: 'Garnish with green onions and serve over rice.' }
        ],
        prep_time: 10,
        cook_time: 8,
        total_time: 18,
        servings: 4,
        difficulty: 'easy',
        calories_per_serving: 285,
        seo_title: 'Easy Chicken Stir Fry Recipe - Quick Healthy Dinner | Ed\'s Easy Meals',
        seo_description: 'Make this easy chicken stir fry in just 15 minutes. Healthy, colorful vegetables with tender chicken in a delicious sauce.',
        featured_image_url: '/images/recipes/easy-chicken-stir-fry.jpg',
        featured_image_alt: 'Colorful chicken stir fry with vegetables in a wok',
        tips: 'Cut all ingredients before starting cooking. High heat is essential for proper stir-frying. Don\'t overcrowd the pan - cook in batches if needed.',
        status: 'published',
        featured: true
      },
      {
        title: 'Easy Chocolate Chip Cookies',
        slug: 'easy-chocolate-chip-cookies',
        description: 'Classic soft and chewy chocolate chip cookies that are perfect every time. Simple ingredients and foolproof method for the best homemade cookies.',
        ingredients: [
          { name: 'All-purpose flour', amount: '2¼ cups', notes: '' },
          { name: 'Baking soda', amount: '1 tsp', notes: '' },
          { name: 'Salt', amount: '1 tsp', notes: '' },
          { name: 'Butter', amount: '1 cup', notes: 'softened' },
          { name: 'Granulated sugar', amount: '¾ cup', notes: '' },
          { name: 'Brown sugar', amount: '¾ cup', notes: 'packed' },
          { name: 'Large eggs', amount: '2', notes: 'room temperature' },
          { name: 'Vanilla extract', amount: '2 tsp', notes: '' },
          { name: 'Chocolate chips', amount: '2 cups', notes: 'semi-sweet' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.' },
          { step: 2, instruction: 'In a bowl, whisk together flour, baking soda, and salt. Set aside.' },
          { step: 3, instruction: 'In a large bowl, cream butter with both sugars until light and fluffy, about 3 minutes.' },
          { step: 4, instruction: 'Beat in eggs one at a time, then vanilla extract.' },
          { step: 5, instruction: 'Gradually mix in flour mixture until just combined. Fold in chocolate chips.' },
          { step: 6, instruction: 'Drop rounded tablespoons of dough onto prepared baking sheets, spacing 2 inches apart.' },
          { step: 7, instruction: 'Bake for 9-11 minutes until edges are golden but centers still look soft.' },
          { step: 8, instruction: 'Cool on baking sheet for 5 minutes before transferring to wire rack.' }
        ],
        prep_time: 15,
        cook_time: 10,
        total_time: 25,
        servings: 36,
        difficulty: 'easy',
        calories_per_serving: 140,
        seo_title: 'Easy Chocolate Chip Cookies Recipe - Soft & Chewy | Ed\'s Easy Meals',
        seo_description: 'Make the best chocolate chip cookies with this easy recipe. Soft, chewy, and loaded with chocolate chips - perfect every time!',
        featured_image_url: '/images/recipes/easy-chocolate-chip-cookies.jpg',
        featured_image_alt: 'Stack of soft and chewy chocolate chip cookies',
        tips: 'Don\'t overbake - cookies will continue cooking on the hot baking sheet. For extra soft cookies, slightly underbake them. Store in airtight container for up to 1 week.',
        status: 'published',
        featured: true
      },
      {
        title: 'Easy Caesar Salad',
        slug: 'easy-caesar-salad',
        description: 'Fresh and crispy Caesar salad with homemade dressing, crunchy croutons, and parmesan cheese. Restaurant-quality salad made at home.',
        ingredients: [
          { name: 'Romaine lettuce', amount: '2 large heads', notes: 'chopped' },
          { name: 'Parmesan cheese', amount: '½ cup', notes: 'freshly grated' },
          { name: 'Croutons', amount: '1 cup', notes: 'store-bought or homemade' },
          { name: 'Mayonnaise', amount: '½ cup', notes: 'for dressing' },
          { name: 'Lemon juice', amount: '2 tbsp', notes: 'fresh' },
          { name: 'Worcestershire sauce', amount: '1 tbsp', notes: '' },
          { name: 'Dijon mustard', amount: '1 tsp', notes: '' },
          { name: 'Garlic cloves', amount: '2', notes: 'minced' },
          { name: 'Anchovy paste', amount: '1 tsp', notes: 'optional' },
          { name: 'Black pepper', amount: '½ tsp', notes: 'freshly ground' }
        ],
        instructions: [
          { step: 1, instruction: 'Wash and thoroughly dry romaine lettuce. Chop into bite-sized pieces.' },
          { step: 2, instruction: 'In a small bowl, whisk together mayonnaise, lemon juice, Worcestershire sauce, and Dijon mustard.' },
          { step: 3, instruction: 'Add minced garlic, anchovy paste (if using), and black pepper to dressing. Mix well.' },
          { step: 4, instruction: 'Place lettuce in a large serving bowl.' },
          { step: 5, instruction: 'Drizzle dressing over lettuce and toss to coat evenly.' },
          { step: 6, instruction: 'Add half the parmesan cheese and toss again.' },
          { step: 7, instruction: 'Top with croutons and remaining parmesan. Serve immediately.' }
        ],
        prep_time: 15,
        cook_time: 0,
        total_time: 15,
        servings: 4,
        difficulty: 'easy',
        calories_per_serving: 210,
        seo_title: 'Easy Caesar Salad Recipe - Fresh Homemade Dressing | Ed\'s Easy Meals',
        seo_description: 'Make restaurant-quality Caesar salad at home with this easy recipe. Fresh romaine, homemade dressing, and crispy croutons.',
        featured_image_url: '/images/recipes/easy-caesar-salad.jpg',
        featured_image_alt: 'Fresh Caesar salad with croutons and parmesan cheese',
        tips: 'Dry lettuce thoroughly for best results. Make dressing up to 3 days ahead. Add dressing just before serving to prevent wilting.',
        status: 'published',
        featured: true
      },
      {
        title: 'Easy Banana Bread',
        slug: 'easy-banana-bread',
        description: 'Moist and delicious banana bread made with ripe bananas. Perfect for breakfast or snack time, this recipe never fails to impress.',
        ingredients: [
          { name: 'Ripe bananas', amount: '3 large', notes: 'mashed' },
          { name: 'Melted butter', amount: '⅓ cup', notes: '' },
          { name: 'Sugar', amount: '¾ cup', notes: 'can use ½ cup for less sweet' },
          { name: 'Large egg', amount: '1', notes: 'beaten' },
          { name: 'Vanilla extract', amount: '1 tsp', notes: '' },
          { name: 'Baking soda', amount: '1 tsp', notes: '' },
          { name: 'Salt', amount: '½ tsp', notes: '' },
          { name: 'All-purpose flour', amount: '1½ cups', notes: '' },
          { name: 'Walnuts', amount: '½ cup', notes: 'chopped, optional' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.' },
          { step: 2, instruction: 'In a large bowl, mash bananas with a fork until smooth.' },
          { step: 3, instruction: 'Stir melted butter into mashed bananas.' },
          { step: 4, instruction: 'Mix in sugar, beaten egg, and vanilla extract.' },
          { step: 5, instruction: 'Sprinkle baking soda and salt over mixture and stir in.' },
          { step: 6, instruction: 'Add flour and mix until just combined. Don\'t overmix.' },
          { step: 7, instruction: 'Fold in walnuts if using. Pour batter into prepared loaf pan.' },
          { step: 8, instruction: 'Bake for 55-65 minutes until toothpick inserted in center comes out clean.' },
          { step: 9, instruction: 'Cool in pan for 10 minutes, then turn out onto wire rack.' }
        ],
        prep_time: 10,
        cook_time: 60,
        total_time: 70,
        servings: 8,
        difficulty: 'easy',
        calories_per_serving: 245,
        seo_title: 'Easy Banana Bread Recipe - Moist & Delicious | Ed\'s Easy Meals',
        seo_description: 'Make the best banana bread with this simple recipe. Moist, sweet, and perfect for using up ripe bananas.',
        featured_image_url: '/images/recipes/easy-banana-bread.jpg',
        featured_image_alt: 'Sliced banana bread on a cutting board',
        tips: 'Use very ripe bananas with brown spots for best flavor. Don\'t overmix the batter to keep bread tender. Bread freezes well for up to 3 months.',
        status: 'published',
        featured: true
      }
    ];

    console.log(`👨‍🍳 Inserting ${recipes.length} sample recipes...`);

    const { data, error } = await supabase
      .from('recipes')
      .insert(recipes);

    if (error) {
      console.error('Error inserting recipes:', error);
      return;
    }

    console.log('🎉 Successfully inserted all sample recipes!');

    // Get total count
    const { data: allRecipes, error: countError } = await supabase
      .from('recipes')
      .select('title, slug')
      .order('created_at', { ascending: false });

    if (!countError) {
      console.log(`📊 Total recipes in database: ${allRecipes.length}`);
      console.log('📋 All recipes:');
      allRecipes.forEach(recipe => {
        console.log(`   - ${recipe.title} (/${recipe.slug})`);
      });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createSampleRecipes();