const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createUltraQuickRecipes() {
  console.log('⚡ Creating ultra-quick recipes for time-based categories...\n');

  const recipes = [
    // 5-Minute Recipes (5 recipes)
    {
      title: 'Lightning Fast Hummus Wrap',
      description: 'Quick and healthy wrap with hummus, vegetables, and herbs. Perfect grab-and-go meal.',
      ingredients: [
        { name: 'Large tortilla', amount: '1', notes: 'whole wheat' },
        { name: 'Hummus', amount: '3 tbsp', notes: null },
        { name: 'Cucumber', amount: '1/4 cup', notes: 'diced' },
        { name: 'Cherry tomatoes', amount: '1/4 cup', notes: 'halved' },
        { name: 'Red onion', amount: '1 tbsp', notes: 'thinly sliced' },
        { name: 'Fresh spinach', amount: '1/2 cup', notes: null },
        { name: 'Feta cheese', amount: '2 tbsp', notes: 'crumbled' }
      ],
      instructions: [
        { step: 1, instruction: 'Spread hummus evenly on tortilla.' },
        { step: 2, instruction: 'Layer spinach, cucumber, tomatoes, and onion.' },
        { step: 3, instruction: 'Sprinkle with feta cheese.' },
        { step: 4, instruction: 'Roll tightly and cut in half.' },
        { step: 5, instruction: 'Serve immediately or wrap for later.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Instant Berry Chia Pudding',
      description: 'Quick chia pudding with frozen berries that thaws as you eat. No waiting required!',
      ingredients: [
        { name: 'Chia seeds', amount: '3 tbsp', notes: null },
        { name: 'Coconut milk', amount: '1/2 cup', notes: 'canned' },
        { name: 'Maple syrup', amount: '1 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1/2 tsp', notes: null },
        { name: 'Frozen mixed berries', amount: '1/2 cup', notes: null },
        { name: 'Shredded coconut', amount: '1 tbsp', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix chia seeds, coconut milk, maple syrup, and vanilla in a bowl.' },
        { step: 2, instruction: 'Stir vigorously for 2 minutes until well combined.' },
        { step: 3, instruction: 'Top with frozen berries.' },
        { step: 4, instruction: 'Add shredded coconut if desired.' },
        { step: 5, instruction: 'Eat immediately - berries will thaw as you eat!' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 245,
      status: 'published'
    },
    {
      title: 'Flash Cucumber Gazpacho',
      description: 'Refreshing cold soup blended in minutes. Perfect for hot summer days.',
      ingredients: [
        { name: 'English cucumber', amount: '2 large', notes: 'peeled and chopped' },
        { name: 'Greek yogurt', amount: '1/2 cup', notes: 'plain' },
        { name: 'Fresh mint', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Lemon juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Olive oil', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Ice cubes', amount: '4-5', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Add all ingredients to blender.' },
        { step: 2, instruction: 'Blend on high for 2-3 minutes until smooth.' },
        { step: 3, instruction: 'Taste and adjust seasoning if needed.' },
        { step: 4, instruction: 'Pour into bowls and serve immediately.' },
        { step: 5, instruction: 'Garnish with extra mint if desired.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 85,
      status: 'published'
    },
    {
      title: 'Speed Demon Fruit Salsa',
      description: 'Fresh fruit salsa perfect for chips or grilled meats. Bright and flavorful in minutes.',
      ingredients: [
        { name: 'Strawberries', amount: '1 cup', notes: 'diced' },
        { name: 'Mango', amount: '1/2 cup', notes: 'diced' },
        { name: 'Red onion', amount: '2 tbsp', notes: 'minced' },
        { name: 'Jalapeño', amount: '1 small', notes: 'seeded and minced' },
        { name: 'Lime juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Cilantro', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Salt', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Combine strawberries, mango, onion, and jalapeño in bowl.' },
        { step: 2, instruction: 'Add lime juice, cilantro, and salt.' },
        { step: 3, instruction: 'Toss gently to combine.' },
        { step: 4, instruction: 'Let stand 2 minutes for flavors to meld.' },
        { step: 5, instruction: 'Serve with tortilla chips or as a topping.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 35,
      status: 'published'
    },
    {
      title: 'Rocket Fuel Energy Bites',
      description: 'No-bake energy bites with dates, nuts, and chocolate. Perfect pre-workout snack.',
      ingredients: [
        { name: 'Medjool dates', amount: '8', notes: 'pitted' },
        { name: 'Raw almonds', amount: '1/2 cup', notes: null },
        { name: 'Dark chocolate chips', amount: '2 tbsp', notes: null },
        { name: 'Coconut flakes', amount: '2 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1/2 tsp', notes: null },
        { name: 'Sea salt', amount: 'pinch', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Add dates to food processor and pulse until paste forms.' },
        { step: 2, instruction: 'Add almonds and pulse until roughly chopped.' },
        { step: 3, instruction: 'Add chocolate chips, coconut, vanilla, and salt.' },
        { step: 4, instruction: 'Pulse until mixture holds together when squeezed.' },
        { step: 5, instruction: 'Roll into 8 small balls and serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 95,
      status: 'published'
    },

    // 10-Minute Recipes (5 recipes)
    {
      title: 'Express Capellini Aglio e Olio',
      description: 'Classic Italian pasta with garlic and olive oil. Simple elegance in 10 minutes.',
      ingredients: [
        { name: 'Capellini pasta', amount: '8 oz', notes: null },
        { name: 'Extra virgin olive oil', amount: '1/3 cup', notes: null },
        { name: 'Garlic', amount: '6 cloves', notes: 'thinly sliced' },
        { name: 'Red pepper flakes', amount: '1/2 tsp', notes: null },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Parmigiano-Reggiano', amount: '1/2 cup', notes: 'grated' },
        { name: 'Lemon zest', amount: '1 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Cook capellini according to package directions. Reserve 1 cup pasta water.' },
        { step: 2, instruction: 'Heat olive oil in large skillet over medium heat.' },
        { step: 3, instruction: 'Add garlic and red pepper flakes, cook 2 minutes until fragrant.' },
        { step: 4, instruction: 'Add drained pasta and 1/2 cup pasta water to skillet.' },
        { step: 5, instruction: 'Toss with parsley, cheese, and lemon zest.' },
        { step: 6, instruction: 'Add more pasta water if needed. Serve immediately.' }
      ],
      prep_time: 2,
      cook_time: 8,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 325,
      status: 'published'
    },
    {
      title: 'Turbo Greek Pita Pocket',
      description: 'Mediterranean pita stuffed with chicken, tzatziki, and fresh vegetables.',
      ingredients: [
        { name: 'Pita bread', amount: '2', notes: 'warmed' },
        { name: 'Cooked chicken', amount: '1 cup', notes: 'diced or shredded' },
        { name: 'Tzatziki sauce', amount: '1/4 cup', notes: null },
        { name: 'Cucumber', amount: '1/2 cup', notes: 'diced' },
        { name: 'Red onion', amount: '2 tbsp', notes: 'thinly sliced' },
        { name: 'Tomato', amount: '1 small', notes: 'diced' },
        { name: 'Lettuce', amount: '1 cup', notes: 'shredded' },
        { name: 'Feta cheese', amount: '2 tbsp', notes: 'crumbled' }
      ],
      instructions: [
        { step: 1, instruction: 'Warm pita bread in toaster or microwave for 30 seconds.' },
        { step: 2, instruction: 'Spread tzatziki inside each pita pocket.' },
        { step: 3, instruction: 'Stuff with chicken, cucumber, onion, and tomato.' },
        { step: 4, instruction: 'Add lettuce and feta cheese.' },
        { step: 5, instruction: 'Wrap bottom in foil or parchment if desired.' },
        { step: 6, instruction: 'Serve immediately while warm.' }
      ],
      prep_time: 5,
      cook_time: 1,
      total_time: 10,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 365,
      status: 'published'
    },
    {
      title: 'Rapid Ramen Upgrade Bowl',
      description: 'Transform instant ramen into a gourmet meal with fresh additions and an egg.',
      ingredients: [
        { name: 'Instant ramen', amount: '1 package', notes: 'any flavor' },
        { name: 'Egg', amount: '1 large', notes: null },
        { name: 'Green onions', amount: '2', notes: 'sliced' },
        { name: 'Baby spinach', amount: '1 cup', notes: null },
        { name: 'Mushrooms', amount: '1/2 cup', notes: 'sliced' },
        { name: 'Soy sauce', amount: '1 tbsp', notes: null },
        { name: 'Sesame oil', amount: '1/2 tsp', notes: null },
        { name: 'Sriracha', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Bring 2 cups water to boil in small saucepan.' },
        { step: 2, instruction: 'Add ramen noodles and cook 2 minutes.' },
        { step: 3, instruction: 'Add mushrooms and cook 1 minute more.' },
        { step: 4, instruction: 'Crack egg into pot and stir gently for 1 minute.' },
        { step: 5, instruction: 'Remove from heat, add spinach and seasonings.' },
        { step: 6, instruction: 'Top with green onions and sriracha. Serve immediately.' }
      ],
      prep_time: 3,
      cook_time: 7,
      total_time: 10,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Lightning Lettuce Wraps',
      description: 'Fresh and crunchy lettuce wraps with seasoned ground turkey. Light and satisfying.',
      ingredients: [
        { name: 'Ground turkey', amount: '1/2 lb', notes: null },
        { name: 'Butter lettuce', amount: '8 leaves', notes: 'washed' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Soy sauce', amount: '2 tbsp', notes: null },
        { name: 'Rice vinegar', amount: '1 tbsp', notes: null },
        { name: 'Sesame oil', amount: '1 tsp', notes: null },
        { name: 'Green onions', amount: '2', notes: 'sliced' },
        { name: 'Sesame seeds', amount: '1 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat skillet over medium-high heat.' },
        { step: 2, instruction: 'Cook ground turkey, breaking up with spoon, 5-6 minutes.' },
        { step: 3, instruction: 'Add garlic and cook 30 seconds until fragrant.' },
        { step: 4, instruction: 'Stir in soy sauce, rice vinegar, and sesame oil.' },
        { step: 5, instruction: 'Cook 1 more minute, then remove from heat.' },
        { step: 6, instruction: 'Serve in lettuce cups topped with green onions and sesame seeds.' }
      ],
      prep_time: 3,
      cook_time: 7,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 155,
      status: 'published'
    },
    {
      title: 'Speed Shakshuka Mini',
      description: 'Quick version of the Middle Eastern egg dish using canned tomatoes. Perfectly spiced and ready fast.',
      ingredients: [
        { name: 'Canned diced tomatoes', amount: '1 can (14 oz)', notes: null },
        { name: 'Eggs', amount: '2 large', notes: null },
        { name: 'Onion', amount: '1/4 cup', notes: 'diced' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Paprika', amount: '1 tsp', notes: null },
        { name: 'Cumin', amount: '1/2 tsp', notes: null },
        { name: 'Olive oil', amount: '1 tbsp', notes: null },
        { name: 'Feta cheese', amount: '2 tbsp', notes: 'crumbled' },
        { name: 'Fresh parsley', amount: '1 tbsp', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat olive oil in small skillet over medium heat.' },
        { step: 2, instruction: 'Sauté onion for 2 minutes, add garlic for 30 seconds.' },
        { step: 3, instruction: 'Add tomatoes, paprika, and cumin. Simmer 3 minutes.' },
        { step: 4, instruction: 'Make two wells in sauce and crack eggs into them.' },
        { step: 5, instruction: 'Cover and cook 3-4 minutes until egg whites are set.' },
        { step: 6, instruction: 'Top with feta and parsley. Serve with bread.' }
      ],
      prep_time: 2,
      cook_time: 8,
      total_time: 10,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // 5-Minute Recipes
    ['Easy 5-Minute Recipes', 'Easy Wrap Recipes', 'Easy Healthy Recipes', 'Easy No-Cook Recipes', 'Easy Lunch Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Healthy Recipes', 'Easy No-Cook Recipes', 'Easy Breakfast Recipes', 'Easy Superfood Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Soup Recipes', 'Easy No-Cook Recipes', 'Easy Summer Recipes', 'Easy Refreshing Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Appetizer Recipes', 'Easy Fruit Recipes', 'Easy No-Cook Recipes', 'Easy Party Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Snack Recipes', 'Easy No-Cook Recipes', 'Easy Energy Recipes', 'Easy Healthy Recipes'],

    // 10-Minute Recipes
    ['Easy 10-Minute Recipes', 'Easy Pasta Recipes', 'Easy Italian Recipes', 'Easy Garlic Recipes', 'Easy Dinner Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Mediterranean Recipes', 'Easy Chicken Recipes', 'Easy Lunch Recipes', 'Easy Pita Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Ramen Recipes', 'Easy Asian Recipes', 'Easy Noodle Recipes', 'Easy Egg Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Asian Recipes', 'Easy Turkey Recipes', 'Easy Low-Carb Recipes', 'Easy Lettuce Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Middle Eastern Recipes', 'Easy Egg Recipes', 'Easy Tomato Recipes', 'Easy Breakfast Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Ultra-quick recipes completed!');
}

createUltraQuickRecipes();