const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createSeafoodRecipes() {
  console.log('🐟 Creating seafood recipes for empty categories...\n');

  const recipes = [
    // Salmon Recipes (5 recipes)
    {
      title: 'Honey Garlic Baked Salmon',
      description: 'Tender, flaky salmon glazed with a sweet and savory honey garlic sauce. Ready in just 20 minutes for a perfect weeknight dinner.',
      ingredients: [
        { name: 'Salmon fillets', amount: '4 (6 oz)', notes: 'skin-on or skinless' },
        { name: 'Honey', amount: '1/4 cup', notes: null },
        { name: 'Soy sauce', amount: '3 tbsp', notes: 'low sodium' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Lemon juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Fresh ginger', amount: '1 tsp', notes: 'grated' },
        { name: 'Red pepper flakes', amount: '1/4 tsp', notes: 'optional' },
        { name: 'Green onions', amount: '2', notes: 'sliced for garnish' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C). Line a baking sheet with parchment paper.' },
        { step: 2, instruction: 'Whisk together honey, soy sauce, minced garlic, olive oil, lemon juice, ginger, and red pepper flakes.' },
        { step: 3, instruction: 'Place salmon fillets on prepared baking sheet. Brush with half the honey garlic mixture.' },
        { step: 4, instruction: 'Bake for 12-15 minutes until salmon flakes easily with a fork.' },
        { step: 5, instruction: 'Heat remaining sauce in a small saucepan until slightly thickened, about 2 minutes.' },
        { step: 6, instruction: 'Drizzle cooked salmon with thickened sauce and garnish with green onions.' },
        { step: 7, instruction: 'Serve immediately with rice or roasted vegetables.' }
      ],
      prep_time: 5,
      cook_time: 15,
      total_time: 20,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Lemon Herb Grilled Salmon',
      description: 'Fresh and flavorful grilled salmon with herbs and lemon. Perfect for summer barbecues or healthy weeknight dinners.',
      ingredients: [
        { name: 'Salmon fillets', amount: '4 (6 oz)', notes: null },
        { name: 'Lemon', amount: '2', notes: 'juiced and zested' },
        { name: 'Fresh dill', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Fresh parsley', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/2 tsp', notes: null },
        { name: 'Lemon slices', amount: '1 lemon', notes: 'for serving' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat grill to medium-high heat.' },
        { step: 2, instruction: 'Mix lemon juice, zest, dill, parsley, olive oil, garlic, salt, and pepper in a bowl.' },
        { step: 3, instruction: 'Marinate salmon in herb mixture for 15 minutes.' },
        { step: 4, instruction: 'Oil grill grates to prevent sticking.' },
        { step: 5, instruction: 'Grill salmon for 4-5 minutes per side until opaque and flakes easily.' },
        { step: 6, instruction: 'Remove from grill and let rest for 2 minutes.' },
        { step: 7, instruction: 'Serve with fresh lemon slices and additional herbs.' }
      ],
      prep_time: 20,
      cook_time: 10,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 275,
      status: 'published'
    },
    {
      title: 'Teriyaki Salmon Bowl',
      description: 'Asian-inspired salmon bowl with vegetables and rice. A complete, nutritious meal that\'s both satisfying and delicious.',
      ingredients: [
        { name: 'Salmon fillets', amount: '4 (5 oz)', notes: 'cubed' },
        { name: 'Jasmine rice', amount: '2 cups', notes: 'cooked' },
        { name: 'Teriyaki sauce', amount: '1/4 cup', notes: null },
        { name: 'Broccoli', amount: '2 cups', notes: 'steamed' },
        { name: 'Carrots', amount: '1 cup', notes: 'julienned' },
        { name: 'Edamame', amount: '1/2 cup', notes: 'shelled' },
        { name: 'Sesame oil', amount: '1 tbsp', notes: null },
        { name: 'Sesame seeds', amount: '2 tbsp', notes: 'toasted' },
        { name: 'Nori sheets', amount: '2', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat sesame oil in a large skillet over medium-high heat.' },
        { step: 2, instruction: 'Add cubed salmon and cook for 6-8 minutes until just cooked through.' },
        { step: 3, instruction: 'Add teriyaki sauce and toss to coat. Cook 1 more minute.' },
        { step: 4, instruction: 'Divide cooked rice among 4 bowls.' },
        { step: 5, instruction: 'Top with teriyaki salmon, steamed broccoli, carrots, and edamame.' },
        { step: 6, instruction: 'Sprinkle with sesame seeds and sliced nori.' },
        { step: 7, instruction: 'Serve immediately with extra teriyaki sauce if desired.' }
      ],
      prep_time: 15,
      cook_time: 10,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 420,
      status: 'published'
    },
    {
      title: 'Blackened Salmon Tacos',
      description: 'Spicy blackened salmon in soft tortillas with fresh slaw and avocado. A fun twist on taco night with healthy fish.',
      ingredients: [
        { name: 'Salmon fillets', amount: '1.5 lbs', notes: 'cut into strips' },
        { name: 'Corn tortillas', amount: '8', notes: 'warmed' },
        { name: 'Cabbage', amount: '2 cups', notes: 'shredded' },
        { name: 'Avocado', amount: '2', notes: 'sliced' },
        { name: 'Lime', amount: '2', notes: 'juiced' },
        { name: 'Paprika', amount: '2 tsp', notes: null },
        { name: 'Cumin', amount: '1 tsp', notes: null },
        { name: 'Chili powder', amount: '1 tsp', notes: null },
        { name: 'Garlic powder', amount: '1 tsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Cilantro', amount: '1/4 cup', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix paprika, cumin, chili powder, garlic powder, salt, and pepper for blackening spice.' },
        { step: 2, instruction: 'Coat salmon strips with olive oil and blackening spice mixture.' },
        { step: 3, instruction: 'Heat a cast iron skillet over medium-high heat.' },
        { step: 4, instruction: 'Cook salmon for 3-4 minutes per side until blackened and cooked through.' },
        { step: 5, instruction: 'Toss cabbage with lime juice and cilantro for slaw.' },
        { step: 6, instruction: 'Warm tortillas and fill with blackened salmon.' },
        { step: 7, instruction: 'Top with cabbage slaw and avocado slices. Serve with lime wedges.' }
      ],
      prep_time: 15,
      cook_time: 8,
      total_time: 23,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Cedar Plank Salmon',
      description: 'Smoky, restaurant-quality cedar plank salmon that\'s surprisingly easy to make at home. Perfect for entertaining.',
      ingredients: [
        { name: 'Salmon fillet', amount: '2 lbs', notes: 'skin-on, large piece' },
        { name: 'Cedar plank', amount: '1', notes: 'soaked for 2+ hours' },
        { name: 'Brown sugar', amount: '2 tbsp', notes: null },
        { name: 'Dijon mustard', amount: '2 tbsp', notes: null },
        { name: 'Fresh dill', amount: '3 tbsp', notes: 'chopped' },
        { name: 'Lemon zest', amount: '1 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/2 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Soak cedar plank in water for at least 2 hours.' },
        { step: 2, instruction: 'Preheat grill to medium heat (about 350°F).' },
        { step: 3, instruction: 'Mix brown sugar, mustard, dill, lemon zest, olive oil, salt, and pepper.' },
        { step: 4, instruction: 'Place soaked plank on grill for 2-3 minutes until it starts to smoke.' },
        { step: 5, instruction: 'Place salmon on plank and spread with mustard mixture.' },
        { step: 6, instruction: 'Close grill and cook for 15-20 minutes until salmon flakes easily.' },
        { step: 7, instruction: 'Remove plank with salmon and let rest 5 minutes before serving.' }
      ],
      prep_time: 10,
      cook_time: 20,
      total_time: 30,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 245,
      status: 'published'
    },

    // Shrimp Recipes (5 recipes)
    {
      title: 'Garlic Butter Shrimp Scampi',
      description: 'Classic shrimp scampi with lots of garlic, butter, and white wine. Ready in 15 minutes for an elegant dinner.',
      ingredients: [
        { name: 'Large shrimp', amount: '1.5 lbs', notes: 'peeled and deveined' },
        { name: 'Linguine pasta', amount: '1 lb', notes: null },
        { name: 'Butter', amount: '4 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '6 cloves', notes: 'minced' },
        { name: 'White wine', amount: '1/2 cup', notes: 'dry' },
        { name: 'Lemon juice', amount: '3 tbsp', notes: 'fresh' },
        { name: 'Red pepper flakes', amount: '1/4 tsp', notes: null },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook linguine according to package directions. Reserve 1 cup pasta water.' },
        { step: 2, instruction: 'Heat olive oil and 2 tbsp butter in large skillet over medium-high heat.' },
        { step: 3, instruction: 'Add shrimp and cook 2 minutes per side until pink. Remove and set aside.' },
        { step: 4, instruction: 'Add garlic and red pepper flakes, cook 30 seconds until fragrant.' },
        { step: 5, instruction: 'Add wine and lemon juice, simmer 2 minutes.' },
        { step: 6, instruction: 'Return shrimp to pan with remaining butter and drained pasta.' },
        { step: 7, instruction: 'Toss with parsley and Parmesan. Add pasta water if needed. Serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Coconut Curry Shrimp',
      description: 'Creamy coconut curry with tender shrimp and vegetables. A flavorful one-pot meal that\'s ready in 20 minutes.',
      ingredients: [
        { name: 'Large shrimp', amount: '1.5 lbs', notes: 'peeled and deveined' },
        { name: 'Coconut milk', amount: '1 can (14 oz)', notes: 'full-fat' },
        { name: 'Red curry paste', amount: '2 tbsp', notes: null },
        { name: 'Bell peppers', amount: '2', notes: 'sliced' },
        { name: 'Onion', amount: '1 medium', notes: 'sliced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tbsp', notes: 'grated' },
        { name: 'Fish sauce', amount: '1 tbsp', notes: null },
        { name: 'Brown sugar', amount: '1 tsp', notes: null },
        { name: 'Lime juice', amount: '2 tbsp', notes: null },
        { name: 'Cilantro', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Jasmine rice', amount: '2 cups', notes: 'cooked' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat oil in large skillet over medium-high heat.' },
        { step: 2, instruction: 'Sauté onion and bell peppers for 3-4 minutes until softened.' },
        { step: 3, instruction: 'Add garlic, ginger, and curry paste. Cook 1 minute until fragrant.' },
        { step: 4, instruction: 'Stir in coconut milk, fish sauce, and brown sugar.' },
        { step: 5, instruction: 'Bring to a simmer and add shrimp.' },
        { step: 6, instruction: 'Cook 4-5 minutes until shrimp are pink and cooked through.' },
        { step: 7, instruction: 'Stir in lime juice and cilantro. Serve over jasmine rice.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 365,
      status: 'published'
    },
    {
      title: 'Cajun Shrimp and Grits',
      description: 'Southern comfort food with spicy Cajun shrimp served over creamy cheese grits. A hearty, satisfying meal.',
      ingredients: [
        { name: 'Large shrimp', amount: '1.5 lbs', notes: 'peeled and deveined' },
        { name: 'Stone-ground grits', amount: '1 cup', notes: null },
        { name: 'Sharp cheddar cheese', amount: '1 cup', notes: 'grated' },
        { name: 'Butter', amount: '3 tbsp', notes: null },
        { name: 'Heavy cream', amount: '1/4 cup', notes: null },
        { name: 'Cajun seasoning', amount: '2 tbsp', notes: null },
        { name: 'Andouille sausage', amount: '4 oz', notes: 'sliced' },
        { name: 'Bell pepper', amount: '1', notes: 'diced' },
        { name: 'Celery', amount: '2 stalks', notes: 'diced' },
        { name: 'Green onions', amount: '3', notes: 'sliced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook grits according to package directions. Stir in cheese, 1 tbsp butter, and cream.' },
        { step: 2, instruction: 'Season shrimp with Cajun seasoning.' },
        { step: 3, instruction: 'Cook sausage in large skillet until browned. Remove and set aside.' },
        { step: 4, instruction: 'Add remaining butter to skillet. Sauté bell pepper and celery 3 minutes.' },
        { step: 5, instruction: 'Add garlic and cook 30 seconds. Add shrimp and cook 3-4 minutes.' },
        { step: 6, instruction: 'Return sausage to pan and toss everything together.' },
        { step: 7, instruction: 'Serve shrimp mixture over cheese grits. Garnish with green onions.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 525,
      status: 'published'
    },
    {
      title: 'Mediterranean Shrimp Orzo',
      description: 'Light and fresh shrimp orzo with tomatoes, olives, and feta cheese. A perfect one-pot Mediterranean meal.',
      ingredients: [
        { name: 'Medium shrimp', amount: '1 lb', notes: 'peeled and deveined' },
        { name: 'Orzo pasta', amount: '1.5 cups', notes: null },
        { name: 'Cherry tomatoes', amount: '2 cups', notes: 'halved' },
        { name: 'Kalamata olives', amount: '1/2 cup', notes: 'pitted and halved' },
        { name: 'Feta cheese', amount: '4 oz', notes: 'crumbled' },
        { name: 'Red onion', amount: '1/2 medium', notes: 'diced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Lemon juice', amount: '3 tbsp', notes: null },
        { name: 'Fresh oregano', amount: '2 tbsp', notes: null },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook orzo according to package directions. Drain and set aside.' },
        { step: 2, instruction: 'Heat 2 tbsp olive oil in large skillet over medium-high heat.' },
        { step: 3, instruction: 'Add shrimp and cook 2-3 minutes per side until pink. Remove and set aside.' },
        { step: 4, instruction: 'Add onion and garlic to same skillet. Cook 2 minutes.' },
        { step: 5, instruction: 'Add tomatoes and cook 3-4 minutes until softened.' },
        { step: 6, instruction: 'Return shrimp and orzo to pan. Add olives, lemon juice, and oregano.' },
        { step: 7, instruction: 'Toss everything together. Top with feta and parsley before serving.' }
      ],
      prep_time: 15,
      cook_time: 15,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 435,
      status: 'published'
    },
    {
      title: 'Bang Bang Shrimp',
      description: 'Crispy fried shrimp with a creamy, spicy sauce. This restaurant favorite is easy to make at home.',
      ingredients: [
        { name: 'Large shrimp', amount: '1.5 lbs', notes: 'peeled and deveined' },
        { name: 'All-purpose flour', amount: '1/2 cup', notes: null },
        { name: 'Cornstarch', amount: '1/2 cup', notes: null },
        { name: 'Egg', amount: '1 large', notes: 'beaten' },
        { name: 'Panko breadcrumbs', amount: '1 cup', notes: null },
        { name: 'Mayonnaise', amount: '1/2 cup', notes: null },
        { name: 'Sweet chili sauce', amount: '1/4 cup', notes: null },
        { name: 'Sriracha', amount: '1-2 tbsp', notes: 'to taste' },
        { name: 'Honey', amount: '1 tbsp', notes: null },
        { name: 'Vegetable oil', amount: 'for frying', notes: null },
        { name: 'Green onions', amount: '2', notes: 'sliced for garnish' }
      ],
      instructions: [
        { step: 1, instruction: 'Set up breading station: flour/cornstarch mix, beaten egg, panko breadcrumbs.' },
        { step: 2, instruction: 'Dredge shrimp in flour mixture, then egg, then panko.' },
        { step: 3, instruction: 'Heat oil to 350°F in large pot or deep fryer.' },
        { step: 4, instruction: 'Fry shrimp in batches for 2-3 minutes until golden brown.' },
        { step: 5, instruction: 'Mix mayonnaise, sweet chili sauce, sriracha, and honey for bang bang sauce.' },
        { step: 6, instruction: 'Toss hot fried shrimp with bang bang sauce.' },
        { step: 7, instruction: 'Serve immediately garnished with sliced green onions.' }
      ],
      prep_time: 20,
      cook_time: 15,
      total_time: 35,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 445,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Salmon Recipes
    ['Easy Salmon Recipes', 'Easy Seafood Recipes', 'Easy Healthy Recipes', 'Easy Dinner Recipes', 'Easy 20-Minute Recipes'],
    ['Easy Salmon Recipes', 'Easy Grilled Recipes', 'Easy Herb Recipes', 'Easy Lemon Recipes', 'Easy Summer Recipes'],
    ['Easy Salmon Recipes', 'Easy Bowl Recipes', 'Easy Healthy Recipes', 'Easy Asian Recipes', 'Easy Rice Recipes'],
    ['Easy Salmon Recipes', 'Easy Mexican Recipes', 'Easy Spicy Recipes', 'Easy Taco Recipes', 'Easy Fish Recipes'],
    ['Easy Salmon Recipes', 'Easy Grilled Recipes', 'Easy Special Occasion Recipes', 'Easy Entertaining Recipes', 'Easy Smoky Recipes'],

    // Shrimp Recipes
    ['Easy Shrimp Recipes', 'Easy Pasta Recipes', 'Easy Seafood Recipes', 'Easy Italian Recipes', 'Easy 15-Minute Recipes'],
    ['Easy Shrimp Recipes', 'Easy Curry Recipes', 'Easy Coconut Recipes', 'Easy Asian Recipes', 'Easy One-Pot Recipes'],
    ['Easy Shrimp Recipes', 'Easy Southern Recipes', 'Easy Cajun Recipes', 'Easy Comfort Food Recipes', 'Easy Spicy Recipes'],
    ['Easy Shrimp Recipes', 'Easy Mediterranean Recipes', 'Easy Pasta Recipes', 'Easy Fresh Recipes', 'Easy Light Meals'],
    ['Easy Shrimp Recipes', 'Easy Fried Recipes', 'Easy Appetizer Recipes', 'Easy Spicy Recipes', 'Easy Party Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Seafood recipes completed!');
}

createSeafoodRecipes();