const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createCuisineRecipes() {
  console.log('🌍 Creating cuisine-specific recipes for empty categories...\n');

  const recipes = [
    // Chinese Recipes (3 recipes)
    {
      title: 'Easy Sweet and Sour Chicken',
      description: 'Classic Chinese takeout favorite with crispy chicken in a tangy sweet and sour sauce. Better than restaurant quality at home.',
      ingredients: [
        { name: 'Chicken breast', amount: '1 lb', notes: 'cut into bite-sized pieces' },
        { name: 'Cornstarch', amount: '1/2 cup', notes: null },
        { name: 'Egg', amount: '1 large', notes: 'beaten' },
        { name: 'Vegetable oil', amount: '2 cups', notes: 'for frying' },
        { name: 'Bell peppers', amount: '2', notes: 'mixed colors, chunked' },
        { name: 'Pineapple chunks', amount: '1 cup', notes: 'fresh or canned' },
        { name: 'Rice vinegar', amount: '1/3 cup', notes: null },
        { name: 'Brown sugar', amount: '1/3 cup', notes: null },
        { name: 'Ketchup', amount: '3 tbsp', notes: null },
        { name: 'Soy sauce', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tsp', notes: 'grated' }
      ],
      instructions: [
        { step: 1, instruction: 'Coat chicken pieces in beaten egg, then dredge in cornstarch.' },
        { step: 2, instruction: 'Heat oil to 350°F and fry chicken until golden brown, about 5 minutes.' },
        { step: 3, instruction: 'Remove chicken and drain on paper towels.' },
        { step: 4, instruction: 'Mix vinegar, brown sugar, ketchup, soy sauce, garlic, and ginger for sauce.' },
        { step: 5, instruction: 'In a large skillet, cook bell peppers for 2 minutes.' },
        { step: 6, instruction: 'Add sauce and pineapple, simmer until thickened.' },
        { step: 7, instruction: 'Toss in fried chicken and serve over steamed rice.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Beef and Broccoli Stir Fry',
      description: 'Tender beef with crisp broccoli in a savory sauce. A healthier version of the Chinese restaurant classic.',
      ingredients: [
        { name: 'Beef sirloin', amount: '1 lb', notes: 'sliced thin against grain' },
        { name: 'Broccoli florets', amount: '4 cups', notes: null },
        { name: 'Soy sauce', amount: '1/4 cup', notes: 'divided' },
        { name: 'Cornstarch', amount: '2 tbsp', notes: 'divided' },
        { name: 'Oyster sauce', amount: '2 tbsp', notes: null },
        { name: 'Rice wine', amount: '1 tbsp', notes: 'or dry sherry' },
        { name: 'Sesame oil', amount: '1 tsp', notes: null },
        { name: 'Vegetable oil', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tbsp', notes: 'minced' },
        { name: 'Green onions', amount: '2', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, instruction: 'Marinate beef with 2 tbsp soy sauce and 1 tbsp cornstarch for 15 minutes.' },
        { step: 2, instruction: 'Mix remaining soy sauce, oyster sauce, rice wine, and sesame oil for sauce.' },
        { step: 3, instruction: 'Heat wok or large skillet over high heat with 1 tbsp oil.' },
        { step: 4, instruction: 'Stir-fry beef until just cooked through, about 3 minutes. Remove.' },
        { step: 5, instruction: 'Add remaining oil, stir-fry broccoli for 2 minutes.' },
        { step: 6, instruction: 'Add garlic and ginger, cook 30 seconds until fragrant.' },
        { step: 7, instruction: 'Return beef to wok, add sauce, and toss everything together. Garnish with green onions.' }
      ],
      prep_time: 20,
      cook_time: 10,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 315,
      status: 'published'
    },
    {
      title: 'Chinese Fried Rice',
      description: 'Authentic Chinese fried rice with eggs, vegetables, and aromatic seasonings. Perfect for leftover rice.',
      ingredients: [
        { name: 'Day-old cooked rice', amount: '4 cups', notes: null },
        { name: 'Eggs', amount: '3 large', notes: 'beaten' },
        { name: 'Vegetable oil', amount: '3 tbsp', notes: 'divided' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tsp', notes: 'minced' },
        { name: 'Frozen peas and carrots', amount: '1 cup', notes: null },
        { name: 'Soy sauce', amount: '3 tbsp', notes: null },
        { name: 'Sesame oil', amount: '1 tsp', notes: null },
        { name: 'Green onions', amount: '4', notes: 'sliced' },
        { name: 'White pepper', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat 1 tbsp oil in large wok or skillet over high heat.' },
        { step: 2, instruction: 'Add beaten eggs and scramble. Remove and set aside.' },
        { step: 3, instruction: 'Add remaining oil to wok. Add garlic and ginger, stir for 30 seconds.' },
        { step: 4, instruction: 'Add peas and carrots, stir-fry for 2 minutes.' },
        { step: 5, instruction: 'Add rice, breaking up clumps with spatula.' },
        { step: 6, instruction: 'Stir-fry rice for 3-4 minutes until heated through.' },
        { step: 7, instruction: 'Return eggs to wok, add soy sauce, sesame oil, and white pepper. Garnish with green onions.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },

    // Korean Recipes (3 recipes)
    {
      title: 'Korean Beef Bulgogi Bowl',
      description: 'Marinated Korean beef served over rice with vegetables. Sweet, savory, and incredibly flavorful.',
      ingredients: [
        { name: 'Ribeye or sirloin', amount: '1 lb', notes: 'thinly sliced' },
        { name: 'Soy sauce', amount: '1/3 cup', notes: null },
        { name: 'Brown sugar', amount: '2 tbsp', notes: null },
        { name: 'Sesame oil', amount: '2 tbsp', notes: null },
        { name: 'Asian pear', amount: '1/2', notes: 'grated' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tbsp', notes: 'grated' },
        { name: 'Green onions', amount: '4', notes: 'sliced' },
        { name: 'Steamed rice', amount: '2 cups', notes: 'cooked' },
        { name: 'Cucumber', amount: '1', notes: 'julienned' },
        { name: 'Carrots', amount: '2', notes: 'julienned' },
        { name: 'Sesame seeds', amount: '1 tbsp', notes: 'toasted' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix soy sauce, brown sugar, sesame oil, pear, garlic, and ginger for marinade.' },
        { step: 2, instruction: 'Marinate sliced beef for at least 30 minutes or up to 2 hours.' },
        { step: 3, instruction: 'Heat large skillet or grill pan over high heat.' },
        { step: 4, instruction: 'Cook marinated beef in batches, 2-3 minutes per side.' },
        { step: 5, instruction: 'Serve beef over steamed rice.' },
        { step: 6, instruction: 'Top with cucumber, carrots, and green onions.' },
        { step: 7, instruction: 'Sprinkle with sesame seeds and serve immediately.' }
      ],
      prep_time: 35,
      cook_time: 10,
      total_time: 45,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 425,
      status: 'published'
    },
    {
      title: 'Korean Chicken Bibimbap',
      description: 'Mixed rice bowl with seasoned chicken and vegetables. A colorful and nutritious Korean classic.',
      ingredients: [
        { name: 'Chicken thighs', amount: '1 lb', notes: 'boneless, skinless' },
        { name: 'Steamed rice', amount: '2 cups', notes: 'cooked' },
        { name: 'Spinach', amount: '4 oz', notes: 'fresh' },
        { name: 'Mushrooms', amount: '8 oz', notes: 'sliced' },
        { name: 'Bean sprouts', amount: '2 cups', notes: null },
        { name: 'Carrots', amount: '2', notes: 'julienned' },
        { name: 'Eggs', amount: '4', notes: 'for frying' },
        { name: 'Gochujang', amount: '2 tbsp', notes: 'Korean chili paste' },
        { name: 'Soy sauce', amount: '3 tbsp', notes: null },
        { name: 'Sesame oil', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Vegetable oil', amount: '2 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Marinate chicken with soy sauce, sesame oil, and garlic for 20 minutes.' },
        { step: 2, instruction: 'Cook chicken in skillet until done, about 8 minutes. Slice.' },
        { step: 3, instruction: 'Blanch spinach, bean sprouts, and carrots separately. Season each with sesame oil.' },
        { step: 4, instruction: 'Sauté mushrooms until golden brown.' },
        { step: 5, instruction: 'Fry eggs sunny-side up.' },
        { step: 6, instruction: 'Arrange rice in bowls, top with vegetables, chicken, and fried egg.' },
        { step: 7, instruction: 'Serve with gochujang on the side for mixing.' }
      ],
      prep_time: 25,
      cook_time: 20,
      total_time: 45,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Korean Kimchi Pancake',
      description: 'Savory pancake made with fermented kimchi. Crispy outside, tender inside, and full of umami flavor.',
      ingredients: [
        { name: 'Kimchi', amount: '1 cup', notes: 'chopped, with juice' },
        { name: 'All-purpose flour', amount: '1 cup', notes: null },
        { name: 'Water', amount: '3/4 cup', notes: 'cold' },
        { name: 'Green onions', amount: '3', notes: 'sliced' },
        { name: 'Egg', amount: '1 large', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Vegetable oil', amount: '3 tbsp', notes: null },
        { name: 'Soy sauce', amount: '2 tbsp', notes: 'for dipping' },
        { name: 'Rice vinegar', amount: '1 tbsp', notes: 'for dipping' },
        { name: 'Sesame oil', amount: '1/2 tsp', notes: 'for dipping' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix flour, water, egg, and salt to make smooth batter.' },
        { step: 2, instruction: 'Fold in chopped kimchi with its juice and green onions.' },
        { step: 3, instruction: 'Heat oil in large non-stick skillet over medium-high heat.' },
        { step: 4, instruction: 'Pour batter into skillet, spreading into thin pancake.' },
        { step: 5, instruction: 'Cook 4-5 minutes until bottom is golden and crispy.' },
        { step: 6, instruction: 'Flip and cook another 3-4 minutes until second side is crispy.' },
        { step: 7, instruction: 'Cut into wedges and serve with dipping sauce made from soy sauce, vinegar, and sesame oil.' }
      ],
      prep_time: 10,
      cook_time: 10,
      total_time: 20,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    },

    // Spanish Recipes (3 recipes)
    {
      title: 'Easy Spanish Paella',
      description: 'Traditional Spanish rice dish with saffron, chicken, and seafood. A festive one-pan meal perfect for sharing.',
      ingredients: [
        { name: 'Bomba rice', amount: '2 cups', notes: 'or Arborio rice' },
        { name: 'Chicken thighs', amount: '1 lb', notes: 'cut into pieces' },
        { name: 'Large shrimp', amount: '1/2 lb', notes: 'peeled' },
        { name: 'Mussels', amount: '1/2 lb', notes: 'cleaned' },
        { name: 'Chicken stock', amount: '4 cups', notes: 'warm' },
        { name: 'Saffron threads', amount: '1/2 tsp', notes: null },
        { name: 'Tomato', amount: '1 large', notes: 'grated' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Onion', amount: '1 medium', notes: 'diced' },
        { name: 'Bell pepper', amount: '1', notes: 'diced' },
        { name: 'Olive oil', amount: '1/4 cup', notes: null },
        { name: 'Green beans', amount: '1 cup', notes: 'trimmed' },
        { name: 'Lemon', amount: '1', notes: 'cut into wedges' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat olive oil in large paella pan or skillet over medium-high heat.' },
        { step: 2, instruction: 'Season and brown chicken pieces on all sides, about 8 minutes.' },
        { step: 3, instruction: 'Add onion, bell pepper, and garlic. Cook 3 minutes.' },
        { step: 4, instruction: 'Add grated tomato and cook until darkened, 3 minutes.' },
        { step: 5, instruction: 'Stir in rice, coating with sofrito. Add warm stock with saffron.' },
        { step: 6, instruction: 'Add green beans and simmer 15 minutes without stirring.' },
        { step: 7, instruction: 'Add shrimp and mussels in final 5 minutes. Rest 5 minutes before serving with lemon.' }
      ],
      prep_time: 20,
      cook_time: 35,
      total_time: 55,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 445,
      status: 'published'
    },
    {
      title: 'Spanish Tortilla Española',
      description: 'Classic Spanish potato omelet. Simple ingredients transformed into a beloved comfort food dish.',
      ingredients: [
        { name: 'Potatoes', amount: '2 lbs', notes: 'thinly sliced' },
        { name: 'Large eggs', amount: '6', notes: null },
        { name: 'Yellow onion', amount: '1 large', notes: 'thinly sliced' },
        { name: 'Extra virgin olive oil', amount: '1 cup', notes: null },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat olive oil in large non-stick skillet over medium heat.' },
        { step: 2, instruction: 'Add potatoes and onion, cook gently 15-20 minutes until tender.' },
        { step: 3, instruction: 'Drain potatoes and onions, reserving oil.' },
        { step: 4, instruction: 'Beat eggs with salt and pepper in large bowl.' },
        { step: 5, instruction: 'Fold warm potatoes into beaten eggs. Let stand 5 minutes.' },
        { step: 6, instruction: 'Heat 2 tbsp reserved oil in clean skillet. Add egg mixture.' },
        { step: 7, instruction: 'Cook 5-6 minutes, then flip with plate. Cook 3-4 minutes more until set.' }
      ],
      prep_time: 15,
      cook_time: 35,
      total_time: 50,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Spanish Garlic Shrimp (Gambas al Ajillo)',
      description: 'Sizzling shrimp in garlic and olive oil with chili. A classic Spanish tapas dish that\'s irresistibly good.',
      ingredients: [
        { name: 'Large shrimp', amount: '1.5 lbs', notes: 'peeled and deveined' },
        { name: 'Extra virgin olive oil', amount: '1/2 cup', notes: null },
        { name: 'Garlic', amount: '8 cloves', notes: 'thinly sliced' },
        { name: 'Dried red chilies', amount: '2', notes: 'whole' },
        { name: 'Sherry', amount: '2 tbsp', notes: 'dry' },
        { name: 'Fresh parsley', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Lemon juice', amount: '1 tbsp', notes: 'fresh' },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Crusty bread', amount: '4 slices', notes: 'for serving' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat olive oil in large skillet over medium heat.' },
        { step: 2, instruction: 'Add garlic and chilies, cook 2 minutes until fragrant.' },
        { step: 3, instruction: 'Add shrimp and salt, cook 2-3 minutes per side.' },
        { step: 4, instruction: 'Add sherry and cook 1 minute until alcohol evaporates.' },
        { step: 5, instruction: 'Remove from heat, add lemon juice and parsley.' },
        { step: 6, instruction: 'Serve immediately in clay dishes if available.' },
        { step: 7, instruction: 'Accompany with crusty bread for dipping in the oil.' }
      ],
      prep_time: 10,
      cook_time: 8,
      total_time: 18,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Chinese Recipes
    ['Easy Chinese Recipes', 'Easy Asian Recipes', 'Easy Chicken Recipes', 'Easy Sweet and Sour Recipes', 'Easy Takeout Recipes'],
    ['Easy Chinese Recipes', 'Easy Asian Recipes', 'Easy Beef Recipes', 'Easy Stir Fry Recipes', 'Easy Healthy Recipes'],
    ['Easy Chinese Recipes', 'Easy Asian Recipes', 'Easy Rice Recipes', 'Easy Fried Rice Recipes', 'Easy Leftover Recipes'],

    // Korean Recipes
    ['Easy Korean Recipes', 'Easy Asian Recipes', 'Easy Beef Recipes', 'Easy Bowl Recipes', 'Easy Marinated Recipes'],
    ['Easy Korean Recipes', 'Easy Asian Recipes', 'Easy Chicken Recipes', 'Easy Bowl Recipes', 'Easy Healthy Recipes'],
    ['Easy Korean Recipes', 'Easy Asian Recipes', 'Easy Pancake Recipes', 'Easy Vegetarian Recipes', 'Easy Appetizer Recipes'],

    // Spanish Recipes
    ['Easy Spanish Recipes', 'Easy Mediterranean Recipes', 'Easy Rice Recipes', 'Easy Seafood Recipes', 'Easy One-Pan Recipes'],
    ['Easy Spanish Recipes', 'Easy Mediterranean Recipes', 'Easy Egg Recipes', 'Easy Potato Recipes', 'Easy Comfort Food Recipes'],
    ['Easy Spanish Recipes', 'Easy Mediterranean Recipes', 'Easy Shrimp Recipes', 'Easy Garlic Recipes', 'Easy Tapas Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Cuisine-specific recipes completed!');
}

createCuisineRecipes();