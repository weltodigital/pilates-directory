const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createChickenRecipes() {
  console.log('🐔 Creating Easy Chicken Recipes...\n');

  const chickenRecipes = [
    {
      title: 'Chicken Parmesan',
      description: 'Crispy breaded chicken breast topped with marinara sauce and melted mozzarella cheese. A classic Italian-American comfort food that\'s ready in just 30 minutes.',
      ingredients: [
        { name: 'Chicken breasts', amount: '4 large', notes: 'boneless, skinless' },
        { name: 'All-purpose flour', amount: '1 cup', notes: null },
        { name: 'Eggs', amount: '2 large', notes: 'beaten' },
        { name: 'Breadcrumbs', amount: '2 cups', notes: 'panko' },
        { name: 'Mozzarella cheese', amount: '1 1/2 cups', notes: 'shredded' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Marinara sauce', amount: '2 cups', notes: null },
        { name: 'Olive oil', amount: '1/4 cup', notes: null },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/2 tsp', notes: null },
        { name: 'Italian seasoning', amount: '1 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 425°F (220°C).' },
        { step: 2, instruction: 'Pound chicken breasts to 1/2 inch thickness. Season with salt and pepper.' },
        { step: 3, instruction: 'Set up three stations: flour in one dish, beaten eggs in another, and breadcrumbs mixed with Italian seasoning in a third.' },
        { step: 4, instruction: 'Dredge each chicken breast in flour, dip in eggs, then coat thoroughly with breadcrumbs.' },
        { step: 5, instruction: 'Heat olive oil in a large oven-safe skillet over medium-high heat.' },
        { step: 6, instruction: 'Cook chicken for 3-4 minutes per side until golden brown.' },
        { step: 7, instruction: 'Top each chicken breast with marinara sauce and both cheeses.' },
        { step: 8, instruction: 'Transfer skillet to oven and bake for 15-20 minutes until chicken is cooked through.' },
        { step: 9, instruction: 'Let rest for 5 minutes before serving. Serve with pasta or salad.' }
      ],
      prep_time: 15,
      cook_time: 25,
      total_time: 40,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 485,
      tips: 'For extra crispy coating, let the breaded chicken rest for 10 minutes before cooking.',
      variations: 'Try with chicken thighs for juicier meat, or add fresh basil for extra flavor.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat in oven to maintain crispiness.',
      status: 'published'
    },
    {
      title: 'Chicken Alfredo',
      description: 'Tender chicken breast in a rich and creamy Alfredo sauce served over pasta. This restaurant-quality dish comes together in under 30 minutes.',
      ingredients: [
        { name: 'Chicken breasts', amount: '4 medium', notes: 'boneless, skinless' },
        { name: 'Fettuccine pasta', amount: '1 lb', notes: null },
        { name: 'Butter', amount: '1/2 cup', notes: null },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Parmesan cheese', amount: '1 cup', notes: 'freshly grated' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/2 tsp', notes: null },
        { name: 'Fresh parsley', amount: '2 tbsp', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook fettuccine according to package directions. Reserve 1/2 cup pasta water before draining.' },
        { step: 2, instruction: 'Season chicken with salt and pepper. Heat olive oil in a large skillet over medium-high heat.' },
        { step: 3, instruction: 'Cook chicken for 6-7 minutes per side until golden and cooked through. Remove and slice.' },
        { step: 4, instruction: 'In the same skillet, melt butter and sauté garlic for 30 seconds.' },
        { step: 5, instruction: 'Add heavy cream and bring to a gentle simmer.' },
        { step: 6, instruction: 'Gradually whisk in Parmesan cheese until smooth and creamy.' },
        { step: 7, instruction: 'Add cooked pasta and sliced chicken to the sauce.' },
        { step: 8, instruction: 'Toss everything together, adding pasta water if needed for consistency.' },
        { step: 9, instruction: 'Garnish with fresh parsley and serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 20,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 520,
      tips: 'Don\'t let the cream boil or it may curdle. Use freshly grated Parmesan for the best flavor.',
      variations: 'Add steamed broccoli or sun-dried tomatoes for extra flavor and nutrition.',
      storage_instructions: 'Best served immediately. Leftovers can be stored for 2 days and reheated gently.',
      status: 'published'
    }
  ];

  for (const recipe of chickenRecipes) {
    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, [
      'Easy Chicken Recipes',
      'Easy Dinner Recipes',
      'Easy 30-Minute Recipes',
      'Easy Italian Recipes',
      'Easy Cheese Recipes',
      'Easy Pasta Recipes'
    ]);
  }

  console.log('\n🎉 Chicken recipes completed!');
}

createChickenRecipes();
