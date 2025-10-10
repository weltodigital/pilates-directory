const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createPastaAndRiceRecipes() {
  console.log('🍝 Creating Easy Pasta and Rice Recipes...\n');

  const pastaRecipes = [
    {
      title: 'Creamy Mushroom Pasta',
      description: 'Rich and creamy pasta loaded with sautéed mushrooms and fresh herbs. This comforting dish is perfect for a weeknight dinner.',
      ingredients: [
        { name: 'Penne pasta', amount: '1 lb', notes: null },
        { name: 'Mixed mushrooms', amount: '1 lb', notes: 'sliced (button, cremini, shiitake)' },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Onion', amount: '1 medium', notes: 'diced' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'White wine', amount: '1/2 cup', notes: 'optional' },
        { name: 'Butter', amount: '2 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Fresh thyme', amount: '1 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Cook pasta according to package directions. Reserve 1/2 cup pasta water.' },
        { step: 2, instruction: 'Heat butter and olive oil in a large skillet over medium-high heat.' },
        { step: 3, instruction: 'Add onions and cook until softened, about 3 minutes.' },
        { step: 4, instruction: 'Add garlic and mushrooms, cook until mushrooms are golden, 8-10 minutes.' },
        { step: 5, instruction: 'Add white wine (if using) and cook until reduced by half.' },
        { step: 6, instruction: 'Pour in cream and bring to a gentle simmer.' },
        { step: 7, instruction: 'Add cooked pasta and toss with sauce.' },
        { step: 8, instruction: 'Stir in Parmesan cheese and fresh thyme.' },
        { step: 9, instruction: 'Season with salt and pepper. Serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 20,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 445,
      status: 'published'
    },
    {
      title: 'Garlic Shrimp Pasta',
      description: 'Tender shrimp in a fragrant garlic butter sauce tossed with linguine. Ready in just 20 minutes!',
      ingredients: [
        { name: 'Linguine', amount: '1 lb', notes: null },
        { name: 'Large shrimp', amount: '1.5 lbs', notes: 'peeled and deveined' },
        { name: 'Garlic', amount: '6 cloves', notes: 'minced' },
        { name: 'Butter', amount: '4 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'White wine', amount: '1/3 cup', notes: null },
        { name: 'Lemon juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Red pepper flakes', amount: '1/4 tsp', notes: null },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Cook linguine according to package directions.' },
        { step: 2, instruction: 'Season shrimp with salt and pepper.' },
        { step: 3, instruction: 'Heat olive oil in a large skillet over medium-high heat.' },
        { step: 4, instruction: 'Add shrimp and cook for 1-2 minutes per side until pink.' },
        { step: 5, instruction: 'Add garlic and red pepper flakes, cook for 30 seconds.' },
        { step: 6, instruction: 'Add white wine and lemon juice, simmer for 2 minutes.' },
        { step: 7, instruction: 'Add butter and toss until melted.' },
        { step: 8, instruction: 'Add cooked pasta and toss to combine.' },
        { step: 9, instruction: 'Garnish with fresh parsley and serve.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 520,
      status: 'published'
    }
  ];

  const riceRecipes = [
    {
      title: 'Chicken Fried Rice',
      description: 'Better than takeout! This classic fried rice is loaded with tender chicken, scrambled eggs, and fresh vegetables.',
      ingredients: [
        { name: 'Cooked rice', amount: '4 cups', notes: 'day-old, cooled' },
        { name: 'Chicken breast', amount: '1 lb', notes: 'diced' },
        { name: 'Eggs', amount: '3 large', notes: 'beaten' },
        { name: 'Frozen mixed vegetables', amount: '1 cup', notes: 'peas, carrots, corn' },
        { name: 'Green onions', amount: '4', notes: 'sliced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Soy sauce', amount: '3 tbsp', notes: null },
        { name: 'Sesame oil', amount: '1 tbsp', notes: null },
        { name: 'Vegetable oil', amount: '3 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat 1 tbsp oil in a large wok or skillet over high heat.' },
        { step: 2, instruction: 'Add beaten eggs and scramble. Remove and set aside.' },
        { step: 3, instruction: 'Add another tbsp oil and cook diced chicken until done.' },
        { step: 4, instruction: 'Push chicken to one side, add garlic and cook for 30 seconds.' },
        { step: 5, instruction: 'Add remaining oil and the cold rice, breaking up clumps.' },
        { step: 6, instruction: 'Stir-fry rice for 3-4 minutes until heated through.' },
        { step: 7, instruction: 'Add frozen vegetables and cook for 2 minutes.' },
        { step: 8, instruction: 'Return eggs to pan, add soy sauce and sesame oil.' },
        { step: 9, instruction: 'Garnish with green onions and serve hot.' }
      ],
      prep_time: 15,
      cook_time: 10,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 380,
      status: 'published'
    },
    {
      title: 'Coconut Rice',
      description: 'Fragrant jasmine rice cooked in coconut milk with a hint of sweetness. Perfect as a side dish for Asian-inspired meals.',
      ingredients: [
        { name: 'Jasmine rice', amount: '1.5 cups', notes: 'rinsed' },
        { name: 'Coconut milk', amount: '1 can (14 oz)', notes: null },
        { name: 'Water', amount: '1 cup', notes: null },
        { name: 'Sugar', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Toasted coconut flakes', amount: '2 tbsp', notes: 'for garnish' }
      ],
      instructions: [
        { step: 1, instruction: 'Rinse rice until water runs clear.' },
        { step: 2, instruction: 'Combine coconut milk, water, sugar, and salt in a saucepan.' },
        { step: 3, instruction: 'Bring to a boil, then add rice.' },
        { step: 4, instruction: 'Reduce heat to low, cover, and simmer for 18 minutes.' },
        { step: 5, instruction: 'Remove from heat and let stand 5 minutes.' },
        { step: 6, instruction: 'Fluff with a fork and garnish with toasted coconut.' }
      ],
      prep_time: 5,
      cook_time: 25,
      total_time: 30,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 220,
      status: 'published'
    }
  ];

  // Create pasta recipes
  for (const recipe of pastaRecipes) {
    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, [
      'Easy Pasta Recipes',
      'Easy Dinner Recipes',
      'Easy 30-Minute Recipes',
      'Easy Mushroom Recipes',
      'Easy Garlic Recipes',
      'Easy Cream Recipes'
    ]);
  }

  // Create rice recipes
  for (const recipe of riceRecipes) {
    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, [
      'Easy Rice Recipes',
      'Easy Dinner Recipes',
      'Easy 30-Minute Recipes',
      'Easy Asian Recipes',
      'Easy Chicken Recipes',
      'Easy Egg Recipes'
    ]);
  }

  console.log('\n🎉 Pasta and rice recipes completed!');
}

createPastaAndRiceRecipes();
