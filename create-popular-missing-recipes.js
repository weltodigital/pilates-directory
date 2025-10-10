const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createPopularMissingRecipes() {
  console.log('🔥 Creating recipes for popular missing categories...\n');

  const recipes = [
    // Air Fryer Recipes (3 recipes)
    {
      title: 'Air Fryer Crispy Chicken Wings',
      description: 'Perfectly crispy chicken wings made in the air fryer. No oil needed for that perfect crunch!',
      ingredients: [
        { name: 'Chicken wings', amount: '2 lbs', notes: 'split and tips removed' },
        { name: 'Baking powder', amount: '1 tbsp', notes: 'aluminum-free' },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/2 tsp', notes: null },
        { name: 'Garlic powder', amount: '1 tsp', notes: null },
        { name: 'Paprika', amount: '1 tsp', notes: null },
        { name: 'Buffalo sauce', amount: '1/4 cup', notes: 'optional' },
        { name: 'Butter', amount: '2 tbsp', notes: 'melted, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Pat wings completely dry with paper towels.' },
        { step: 2, instruction: 'Mix baking powder, salt, pepper, garlic powder, and paprika.' },
        { step: 3, instruction: 'Toss wings with spice mixture until evenly coated.' },
        { step: 4, instruction: 'Preheat air fryer to 380°F (193°C).' },
        { step: 5, instruction: 'Air fry wings for 12 minutes, flip, then 10-12 minutes more.' },
        { step: 6, instruction: 'Toss with buffalo sauce mixed with melted butter if desired.' },
        { step: 7, instruction: 'Serve immediately while crispy.' }
      ],
      prep_time: 10,
      cook_time: 25,
      total_time: 35,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Air Fryer Salmon with Lemon',
      description: 'Flaky, perfectly cooked salmon in the air fryer with a bright lemon finish. Quick and healthy!',
      ingredients: [
        { name: 'Salmon fillets', amount: '4 (6 oz)', notes: 'skin-on' },
        { name: 'Olive oil', amount: '1 tbsp', notes: null },
        { name: 'Lemon', amount: '1', notes: 'zested and juiced' },
        { name: 'Garlic powder', amount: '1 tsp', notes: null },
        { name: 'Dried dill', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null },
        { name: 'Lemon slices', amount: '4', notes: 'for serving' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat air fryer to 400°F (200°C).' },
        { step: 2, instruction: 'Pat salmon dry and brush with olive oil.' },
        { step: 3, instruction: 'Mix lemon zest, garlic powder, dill, salt, and pepper.' },
        { step: 4, instruction: 'Rub spice mixture all over salmon fillets.' },
        { step: 5, instruction: 'Air fry for 7-10 minutes depending on thickness.' },
        { step: 6, instruction: 'Drizzle with fresh lemon juice before serving.' },
        { step: 7, instruction: 'Serve with lemon slices and your favorite sides.' }
      ],
      prep_time: 5,
      cook_time: 10,
      total_time: 15,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 275,
      status: 'published'
    },
    {
      title: 'Air Fryer Roasted Vegetables',
      description: 'Perfectly roasted mixed vegetables in the air fryer. Crispy outside, tender inside, and full of flavor.',
      ingredients: [
        { name: 'Broccoli florets', amount: '2 cups', notes: null },
        { name: 'Bell peppers', amount: '2', notes: 'cut into strips' },
        { name: 'Zucchini', amount: '1 large', notes: 'sliced' },
        { name: 'Red onion', amount: '1', notes: 'cut into wedges' },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Italian seasoning', amount: '1 tsp', notes: null },
        { name: 'Garlic powder', amount: '1/2 tsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat air fryer to 375°F (190°C).' },
        { step: 2, instruction: 'Cut all vegetables into similar-sized pieces.' },
        { step: 3, instruction: 'Toss vegetables with olive oil and seasonings.' },
        { step: 4, instruction: 'Air fry for 12-15 minutes, shaking basket halfway through.' },
        { step: 5, instruction: 'Check for doneness - vegetables should be tender and lightly browned.' },
        { step: 6, instruction: 'Serve immediately as a side dish.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 95,
      status: 'published'
    },

    // BBQ Recipes (3 recipes)
    {
      title: 'Easy BBQ Pulled Pork',
      description: 'Tender, smoky pulled pork made easy. Perfect for sandwiches, tacos, or serving with coleslaw.',
      ingredients: [
        { name: 'Pork shoulder', amount: '3 lbs', notes: 'bone-in' },
        { name: 'Brown sugar', amount: '1/4 cup', notes: null },
        { name: 'Paprika', amount: '2 tbsp', notes: null },
        { name: 'Chili powder', amount: '1 tbsp', notes: null },
        { name: 'Garlic powder', amount: '1 tbsp', notes: null },
        { name: 'Onion powder', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1 tbsp', notes: null },
        { name: 'Black pepper', amount: '1 tsp', notes: null },
        { name: 'BBQ sauce', amount: '1 cup', notes: 'your favorite' },
        { name: 'Hamburger buns', amount: '8', notes: 'for serving' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix brown sugar, paprika, chili powder, garlic powder, onion powder, salt, and pepper for rub.' },
        { step: 2, instruction: 'Rub spice mixture all over pork shoulder.' },
        { step: 3, instruction: 'Preheat oven to 325°F (165°C).' },
        { step: 4, instruction: 'Place pork in roasting pan and cover tightly with foil.' },
        { step: 5, instruction: 'Cook for 3-4 hours until internal temp reaches 195°F.' },
        { step: 6, instruction: 'Rest for 30 minutes, then shred meat with two forks.' },
        { step: 7, instruction: 'Mix with BBQ sauce and serve on buns with coleslaw.' }
      ],
      prep_time: 15,
      cook_time: 240,
      total_time: 255,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'BBQ Grilled Corn on the Cob',
      description: 'Sweet corn grilled to perfection with smoky char marks. A classic BBQ side dish that\'s always a hit.',
      ingredients: [
        { name: 'Corn on the cob', amount: '6 ears', notes: 'husks removed' },
        { name: 'Butter', amount: '4 tbsp', notes: 'softened' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Paprika', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null },
        { name: 'Fresh parsley', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Lime wedges', amount: '6', notes: 'for serving' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat grill to medium-high heat.' },
        { step: 2, instruction: 'Mix softened butter with garlic, paprika, salt, and pepper.' },
        { step: 3, instruction: 'Brush corn with seasoned butter mixture.' },
        { step: 4, instruction: 'Grill corn for 12-15 minutes, turning every 3-4 minutes.' },
        { step: 5, instruction: 'Cook until kernels are tender and lightly charred.' },
        { step: 6, instruction: 'Brush with remaining butter and sprinkle with parsley.' },
        { step: 7, instruction: 'Serve hot with lime wedges for squeezing.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 125,
      status: 'published'
    },
    {
      title: 'BBQ Baby Back Ribs',
      description: 'Fall-off-the-bone tender ribs with a delicious dry rub and tangy BBQ sauce finish.',
      ingredients: [
        { name: 'Baby back ribs', amount: '2 racks', notes: 'about 4 lbs total' },
        { name: 'Brown sugar', amount: '1/3 cup', notes: null },
        { name: 'Paprika', amount: '2 tbsp', notes: null },
        { name: 'Garlic powder', amount: '1 tbsp', notes: null },
        { name: 'Onion powder', amount: '1 tbsp', notes: null },
        { name: 'Chili powder', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1 tbsp', notes: null },
        { name: 'Black pepper', amount: '1 tsp', notes: null },
        { name: 'BBQ sauce', amount: '1 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Remove membrane from back of ribs.' },
        { step: 2, instruction: 'Mix all dry ingredients for rub.' },
        { step: 3, instruction: 'Coat ribs generously with rub, let sit 30 minutes.' },
        { step: 4, instruction: 'Preheat grill to 275°F for indirect cooking.' },
        { step: 5, instruction: 'Grill ribs bone-side down for 2.5-3 hours.' },
        { step: 6, instruction: 'Brush with BBQ sauce in last 30 minutes.' },
        { step: 7, instruction: 'Rest 10 minutes before cutting between bones to serve.' }
      ],
      prep_time: 40,
      cook_time: 180,
      total_time: 220,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 565,
      status: 'published'
    },

    // Burger Recipes (3 recipes)
    {
      title: 'Classic American Cheeseburger',
      description: 'The perfect all-American cheeseburger with a juicy beef patty and all the classic toppings.',
      ingredients: [
        { name: 'Ground beef', amount: '1.5 lbs', notes: '80/20 blend' },
        { name: 'Hamburger buns', amount: '6', notes: 'brioche preferred' },
        { name: 'American cheese', amount: '6 slices', notes: null },
        { name: 'Lettuce', amount: '6 leaves', notes: 'butter lettuce' },
        { name: 'Tomato', amount: '2 large', notes: 'sliced thick' },
        { name: 'Red onion', amount: '1/2 medium', notes: 'sliced thin' },
        { name: 'Pickles', amount: '12 slices', notes: 'dill' },
        { name: 'Ketchup', amount: '3 tbsp', notes: null },
        { name: 'Mustard', amount: '2 tbsp', notes: 'yellow' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Form ground beef into 6 patties, slightly larger than buns.' },
        { step: 2, instruction: 'Season patties generously with salt and pepper.' },
        { step: 3, instruction: 'Heat grill or skillet over medium-high heat.' },
        { step: 4, instruction: 'Cook patties 4-5 minutes per side for medium doneness.' },
        { step: 5, instruction: 'Add cheese in last minute of cooking.' },
        { step: 6, instruction: 'Toast buns lightly on grill or in toaster.' },
        { step: 7, instruction: 'Assemble burgers with condiments and toppings. Serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 12,
      total_time: 22,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Turkey Veggie Burger',
      description: 'Healthy turkey burgers packed with vegetables. Lean, flavorful, and satisfying.',
      ingredients: [
        { name: 'Ground turkey', amount: '1.5 lbs', notes: '93/7 lean' },
        { name: 'Zucchini', amount: '1 small', notes: 'grated and drained' },
        { name: 'Carrot', amount: '1 medium', notes: 'grated' },
        { name: 'Onion', amount: '1/4 cup', notes: 'minced' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Breadcrumbs', amount: '1/3 cup', notes: 'whole wheat' },
        { name: 'Egg', amount: '1 large', notes: 'beaten' },
        { name: 'Fresh herbs', amount: '2 tbsp', notes: 'parsley and basil' },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Black pepper', amount: '1/2 tsp', notes: null },
        { name: 'Whole wheat buns', amount: '6', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Grate zucchini and squeeze out excess moisture with paper towels.' },
        { step: 2, instruction: 'Mix turkey, zucchini, carrot, onion, garlic, breadcrumbs, egg, and seasonings.' },
        { step: 3, instruction: 'Form into 6 patties and chill for 15 minutes.' },
        { step: 4, instruction: 'Heat grill or skillet over medium heat.' },
        { step: 5, instruction: 'Cook patties 6-7 minutes per side until cooked through.' },
        { step: 6, instruction: 'Internal temperature should reach 165°F.' },
        { step: 7, instruction: 'Serve on whole wheat buns with your favorite toppings.' }
      ],
      prep_time: 20,
      cook_time: 15,
      total_time: 35,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Mushroom Swiss Burger',
      description: 'Gourmet burger topped with sautéed mushrooms and melted Swiss cheese. Restaurant quality at home.',
      ingredients: [
        { name: 'Ground beef', amount: '1.5 lbs', notes: '80/20 blend' },
        { name: 'Swiss cheese', amount: '6 slices', notes: null },
        { name: 'Button mushrooms', amount: '8 oz', notes: 'sliced' },
        { name: 'Onion', amount: '1 medium', notes: 'sliced' },
        { name: 'Butter', amount: '2 tbsp', notes: null },
        { name: 'White wine', amount: '2 tbsp', notes: 'optional' },
        { name: 'Hamburger buns', amount: '6', notes: 'brioche' },
        { name: 'Mayonnaise', amount: '3 tbsp', notes: null },
        { name: 'Dijon mustard', amount: '1 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Sauté mushrooms and onions in butter until golden, about 8 minutes.' },
        { step: 2, instruction: 'Add wine if using and cook until evaporated.' },
        { step: 3, instruction: 'Form beef into 6 patties and season with salt and pepper.' },
        { step: 4, instruction: 'Grill or cook patties 4-5 minutes per side.' },
        { step: 5, instruction: 'Top with Swiss cheese in last minute of cooking.' },
        { step: 6, instruction: 'Mix mayonnaise and Dijon mustard for sauce.' },
        { step: 7, instruction: 'Assemble burgers with sauce and mushroom mixture.' }
      ],
      prep_time: 15,
      cook_time: 18,
      total_time: 33,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 525,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Air Fryer Recipes
    ['Easy Air Fryer Recipes', 'Easy Chicken Recipes', 'Easy Wings Recipes', 'Easy Crispy Recipes', 'Easy Party Recipes'],
    ['Easy Air Fryer Recipes', 'Easy Salmon Recipes', 'Easy Seafood Recipes', 'Easy Healthy Recipes', 'Easy 15-Minute Recipes'],
    ['Easy Air Fryer Recipes', 'Easy Vegetable Recipes', 'Easy Healthy Recipes', 'Easy Side Dish Recipes', 'Easy Quick Recipes'],

    // BBQ Recipes
    ['Easy BBQ Recipes', 'Easy Pork Recipes', 'Easy Slow Cooked Recipes', 'Easy Comfort Food Recipes', 'Easy Crowd Pleasing Recipes'],
    ['Easy BBQ Recipes', 'Easy Corn Recipes', 'Easy Grilled Recipes', 'Easy Side Dish Recipes', 'Easy Summer Recipes'],
    ['Easy BBQ Recipes', 'Easy Ribs Recipes', 'Easy Grilled Recipes', 'Easy Weekend Recipes', 'Easy Special Occasion Recipes'],

    // Burger Recipes
    ['Easy Burger Recipes', 'Easy Beef Recipes', 'Easy American Recipes', 'Easy Comfort Food Recipes', 'Easy Grilled Recipes'],
    ['Easy Burger Recipes', 'Easy Turkey Recipes', 'Easy Healthy Recipes', 'Easy Veggie Recipes', 'Easy Lean Recipes'],
    ['Easy Burger Recipes', 'Easy Beef Recipes', 'Easy Mushroom Recipes', 'Easy Cheese Recipes', 'Easy Gourmet Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Popular missing recipes completed!');
}

createPopularMissingRecipes();