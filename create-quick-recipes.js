const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createQuickRecipes() {
  console.log('⚡ Creating super quick recipes for time-based categories...\n');

  const recipes = [
    // 5-Minute Recipes (5 recipes)
    {
      title: 'Avocado Toast with Everything Seasoning',
      description: 'Creamy mashed avocado on toasted bread with everything bagel seasoning. The perfect quick breakfast or snack.',
      ingredients: [
        { name: 'Bread slices', amount: '4', notes: 'whole grain or sourdough' },
        { name: 'Ripe avocados', amount: '2 large', notes: null },
        { name: 'Lemon juice', amount: '1 tbsp', notes: 'fresh' },
        { name: 'Everything bagel seasoning', amount: '2 tsp', notes: null },
        { name: 'Salt', amount: '1/4 tsp', notes: null },
        { name: 'Red pepper flakes', amount: 'pinch', notes: 'optional' },
        { name: 'Cherry tomatoes', amount: '1/2 cup', notes: 'halved, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Toast bread slices until golden brown.' },
        { step: 2, instruction: 'Mash avocados with lemon juice and salt in a bowl.' },
        { step: 3, instruction: 'Spread mashed avocado evenly on toast.' },
        { step: 4, instruction: 'Sprinkle with everything bagel seasoning.' },
        { step: 5, instruction: 'Add cherry tomatoes and red pepper flakes if using. Serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Microwave Scrambled Eggs',
      description: 'Fluffy scrambled eggs made in the microwave in just minutes. Perfect for busy mornings.',
      ingredients: [
        { name: 'Large eggs', amount: '3', notes: null },
        { name: 'Milk', amount: '2 tbsp', notes: null },
        { name: 'Butter', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: '1/4 tsp', notes: null },
        { name: 'Black pepper', amount: '1/8 tsp', notes: null },
        { name: 'Chives', amount: '1 tbsp', notes: 'chopped, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Crack eggs into microwave-safe bowl.' },
        { step: 2, instruction: 'Add milk, salt, and pepper. Whisk well.' },
        { step: 3, instruction: 'Add butter and microwave for 45 seconds.' },
        { step: 4, instruction: 'Stir and microwave for another 30-45 seconds until set.' },
        { step: 5, instruction: 'Garnish with chives if desired. Serve immediately.' }
      ],
      prep_time: 2,
      cook_time: 3,
      total_time: 5,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 245,
      status: 'published'
    },
    {
      title: 'Peanut Butter Banana Smoothie',
      description: 'Creamy protein-packed smoothie with peanut butter and banana. Great post-workout fuel.',
      ingredients: [
        { name: 'Frozen banana', amount: '1 large', notes: 'sliced' },
        { name: 'Peanut butter', amount: '2 tbsp', notes: 'natural' },
        { name: 'Milk', amount: '1 cup', notes: 'dairy or almond' },
        { name: 'Honey', amount: '1 tsp', notes: 'optional' },
        { name: 'Vanilla extract', amount: '1/2 tsp', notes: null },
        { name: 'Ice cubes', amount: '4-5', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Add all ingredients to blender.' },
        { step: 2, instruction: 'Blend on high for 60-90 seconds until smooth.' },
        { step: 3, instruction: 'Add more milk if too thick, or ice if too thin.' },
        { step: 4, instruction: 'Pour into glass and serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Caprese Salad Bites',
      description: 'Fresh mozzarella, tomato, and basil on toothpicks. An elegant appetizer ready in minutes.',
      ingredients: [
        { name: 'Cherry tomatoes', amount: '1 pint', notes: null },
        { name: 'Fresh mozzarella balls', amount: '8 oz', notes: 'bocconcini' },
        { name: 'Fresh basil leaves', amount: '20', notes: null },
        { name: 'Balsamic glaze', amount: '2 tbsp', notes: null },
        { name: 'Extra virgin olive oil', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1/4 tsp', notes: null },
        { name: 'Toothpicks', amount: '20', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Thread tomato, basil leaf, and mozzarella ball on each toothpick.' },
        { step: 2, instruction: 'Arrange on serving platter.' },
        { step: 3, instruction: 'Drizzle with olive oil and balsamic glaze.' },
        { step: 4, instruction: 'Sprinkle with salt and serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 165,
      status: 'published'
    },
    {
      title: 'Quick Greek Yogurt Parfait',
      description: 'Layered yogurt parfait with berries and granola. A healthy and satisfying quick breakfast.',
      ingredients: [
        { name: 'Greek yogurt', amount: '1 cup', notes: 'plain or vanilla' },
        { name: 'Mixed berries', amount: '1/2 cup', notes: 'fresh or frozen' },
        { name: 'Granola', amount: '1/4 cup', notes: null },
        { name: 'Honey', amount: '1 tbsp', notes: null },
        { name: 'Almonds', amount: '2 tbsp', notes: 'sliced' },
        { name: 'Chia seeds', amount: '1 tsp', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix yogurt with honey in a bowl.' },
        { step: 2, instruction: 'Layer half the yogurt in a glass or jar.' },
        { step: 3, instruction: 'Add half the berries and granola.' },
        { step: 4, instruction: 'Repeat layers with remaining ingredients.' },
        { step: 5, instruction: 'Top with almonds and chia seeds if using. Serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 295,
      status: 'published'
    },

    // 10-Minute Recipes (5 recipes)
    {
      title: 'Garlic Butter Noodles',
      description: 'Simple buttery noodles with garlic and herbs. A comforting side dish or light meal that\'s ready in 10 minutes.',
      ingredients: [
        { name: 'Angel hair pasta', amount: '8 oz', notes: null },
        { name: 'Butter', amount: '4 tbsp', notes: null },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Red pepper flakes', amount: '1/4 tsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Cook angel hair pasta according to package directions.' },
        { step: 2, instruction: 'While pasta cooks, melt butter in large skillet over medium heat.' },
        { step: 3, instruction: 'Add garlic and red pepper flakes, cook 1 minute until fragrant.' },
        { step: 4, instruction: 'Drain pasta and add to skillet with garlic butter.' },
        { step: 5, instruction: 'Toss with parsley and Parmesan. Season with salt and pepper.' },
        { step: 6, instruction: 'Serve immediately while hot.' }
      ],
      prep_time: 2,
      cook_time: 8,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Fried Rice with Egg',
      description: 'Quick fried rice made with leftover rice and scrambled eggs. Perfect for using up ingredients.',
      ingredients: [
        { name: 'Cooked rice', amount: '3 cups', notes: 'day-old preferred' },
        { name: 'Eggs', amount: '2 large', notes: 'beaten' },
        { name: 'Vegetable oil', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Soy sauce', amount: '3 tbsp', notes: null },
        { name: 'Green onions', amount: '3', notes: 'sliced' },
        { name: 'Frozen peas', amount: '1/2 cup', notes: null },
        { name: 'Sesame oil', amount: '1 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat 1 tbsp oil in large skillet or wok over high heat.' },
        { step: 2, instruction: 'Add beaten eggs and scramble. Remove and set aside.' },
        { step: 3, instruction: 'Add remaining oil, then garlic. Cook 30 seconds.' },
        { step: 4, instruction: 'Add rice and peas, stir-fry for 3-4 minutes.' },
        { step: 5, instruction: 'Return eggs to pan, add soy sauce and sesame oil.' },
        { step: 6, instruction: 'Stir everything together and garnish with green onions.' }
      ],
      prep_time: 3,
      cook_time: 7,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 245,
      status: 'published'
    },
    {
      title: 'Tuna Melt Sandwich',
      description: 'Classic tuna salad with melted cheese on toasted bread. A satisfying hot sandwich for lunch.',
      ingredients: [
        { name: 'Canned tuna', amount: '2 cans (5 oz each)', notes: 'drained' },
        { name: 'Mayonnaise', amount: '3 tbsp', notes: null },
        { name: 'Celery', amount: '1 stalk', notes: 'diced' },
        { name: 'Red onion', amount: '2 tbsp', notes: 'diced' },
        { name: 'Bread slices', amount: '4', notes: null },
        { name: 'Cheddar cheese', amount: '4 slices', notes: null },
        { name: 'Butter', amount: '2 tbsp', notes: 'softened' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix tuna, mayonnaise, celery, and onion in a bowl.' },
        { step: 2, instruction: 'Butter one side of each bread slice.' },
        { step: 3, instruction: 'Place bread butter-side down in skillet over medium heat.' },
        { step: 4, instruction: 'Top with tuna mixture and cheese, then remaining bread butter-side up.' },
        { step: 5, instruction: 'Cook 3-4 minutes per side until golden and cheese melts.' },
        { step: 6, instruction: 'Cut in half and serve hot.' }
      ],
      prep_time: 5,
      cook_time: 8,
      total_time: 10,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Margherita Flatbread Pizza',
      description: 'Quick pizza using naan or flatbread with fresh tomatoes, mozzarella, and basil.',
      ingredients: [
        { name: 'Naan or flatbread', amount: '2 pieces', notes: null },
        { name: 'Pizza sauce', amount: '1/4 cup', notes: null },
        { name: 'Fresh mozzarella', amount: '4 oz', notes: 'sliced' },
        { name: 'Cherry tomatoes', amount: '1/2 cup', notes: 'sliced' },
        { name: 'Fresh basil', amount: '8 leaves', notes: null },
        { name: 'Olive oil', amount: '1 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 425°F (220°C).' },
        { step: 2, instruction: 'Spread pizza sauce on flatbreads.' },
        { step: 3, instruction: 'Top with mozzarella slices and tomatoes.' },
        { step: 4, instruction: 'Drizzle with olive oil and season with salt and pepper.' },
        { step: 5, instruction: 'Bake for 8-10 minutes until cheese melts and edges are crispy.' },
        { step: 6, instruction: 'Top with fresh basil and serve immediately.' }
      ],
      prep_time: 3,
      cook_time: 10,
      total_time: 10,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 365,
      status: 'published'
    },
    {
      title: 'Chicken Quesadilla',
      description: 'Crispy quesadilla filled with chicken and cheese. Perfect for using up leftover rotisserie chicken.',
      ingredients: [
        { name: 'Flour tortillas', amount: '2 large', notes: null },
        { name: 'Cooked chicken', amount: '1 cup', notes: 'shredded' },
        { name: 'Shredded cheese', amount: '1 cup', notes: 'cheddar or Mexican blend' },
        { name: 'Bell pepper', amount: '1/2', notes: 'diced' },
        { name: 'Onion', amount: '1/4 cup', notes: 'diced' },
        { name: 'Vegetable oil', amount: '1 tbsp', notes: null },
        { name: 'Salsa', amount: '1/4 cup', notes: 'for serving' },
        { name: 'Sour cream', amount: '2 tbsp', notes: 'for serving' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix chicken, cheese, bell pepper, and onion in a bowl.' },
        { step: 2, instruction: 'Spread filling on one tortilla, top with second tortilla.' },
        { step: 3, instruction: 'Heat oil in large skillet over medium heat.' },
        { step: 4, instruction: 'Cook quesadilla 3-4 minutes per side until golden and cheese melts.' },
        { step: 5, instruction: 'Remove from heat and let cool 1 minute.' },
        { step: 6, instruction: 'Cut into wedges and serve with salsa and sour cream.' }
      ],
      prep_time: 3,
      cook_time: 8,
      total_time: 10,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 425,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // 5-Minute Recipes
    ['Easy 5-Minute Recipes', 'Easy Breakfast Recipes', 'Easy Avocado Recipes', 'Easy No-Cook Recipes', 'Easy Healthy Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Breakfast Recipes', 'Easy Egg Recipes', 'Easy Microwave Recipes', 'Easy Quick Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Smoothie Recipes', 'Easy Healthy Recipes', 'Easy Breakfast Recipes', 'Easy Protein Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Appetizer Recipes', 'Easy Italian Recipes', 'Easy No-Cook Recipes', 'Easy Party Recipes'],
    ['Easy 5-Minute Recipes', 'Easy Breakfast Recipes', 'Easy Healthy Recipes', 'Easy Yogurt Recipes', 'Easy No-Cook Recipes'],

    // 10-Minute Recipes
    ['Easy 10-Minute Recipes', 'Easy Pasta Recipes', 'Easy Side Dish Recipes', 'Easy Garlic Recipes', 'Easy Butter Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Rice Recipes', 'Easy Asian Recipes', 'Easy Leftover Recipes', 'Easy One-Pan Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Sandwich Recipes', 'Easy Lunch Recipes', 'Easy Comfort Food Recipes', 'Easy Tuna Recipes'],
    ['Easy 10-Minute Recipes', 'Easy Pizza Recipes', 'Easy Italian Recipes', 'Easy Flatbread Recipes', 'Easy Quick Dinners'],
    ['Easy 10-Minute Recipes', 'Easy Mexican Recipes', 'Easy Chicken Recipes', 'Easy Cheese Recipes', 'Easy Leftover Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Quick recipes completed!');
}

createQuickRecipes();