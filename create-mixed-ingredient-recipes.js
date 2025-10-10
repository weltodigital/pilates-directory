const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createMixedIngredientRecipes() {
  console.log('🥗 Creating recipes for multiple ingredient categories...\n');

  const recipes = [
    // Spinach Recipes
    {
      title: 'Spinach Artichoke Dip',
      description: 'Creamy, cheesy spinach artichoke dip that\'s perfect for parties and gatherings. Serve with tortilla chips or crusty bread.',
      ingredients: [
        { name: 'Fresh spinach', amount: '10 oz', notes: 'chopped' },
        { name: 'Artichoke hearts', amount: '1 cup', notes: 'chopped' },
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Mayonnaise', amount: '1/2 cup', notes: null },
        { name: 'Sour cream', amount: '1/2 cup', notes: null },
        { name: 'Mozzarella cheese', amount: '1 cup', notes: 'shredded' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
        { step: 2, instruction: 'Sauté spinach until wilted, then drain excess water.' },
        { step: 3, instruction: 'Mix cream cheese, mayo, sour cream, and garlic until smooth.' },
        { step: 4, instruction: 'Fold in spinach, artichokes, and half the mozzarella.' },
        { step: 5, instruction: 'Transfer to baking dish and top with remaining cheese.' },
        { step: 6, instruction: 'Bake 25-30 minutes until bubbly and golden.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    // Mushroom Recipes
    {
      title: 'Stuffed Mushrooms',
      description: 'Elegant stuffed mushrooms filled with a savory breadcrumb and cheese mixture. Perfect as an appetizer or side dish.',
      ingredients: [
        { name: 'Large mushrooms', amount: '12', notes: 'stems removed' },
        { name: 'Breadcrumbs', amount: '1 cup', notes: null },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Onion', amount: '1/4 cup', notes: 'diced' },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Fresh herbs', amount: '2 tbsp', notes: 'parsley and thyme' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C).' },
        { step: 2, instruction: 'Remove mushroom stems and chop finely.' },
        { step: 3, instruction: 'Sauté onion, garlic, and chopped stems until soft.' },
        { step: 4, instruction: 'Mix with breadcrumbs, cheese, herbs, salt, and pepper.' },
        { step: 5, instruction: 'Fill mushroom caps with mixture.' },
        { step: 6, instruction: 'Bake 15-20 minutes until tender and golden.' }
      ],
      prep_time: 20,
      cook_time: 20,
      total_time: 40,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 120,
      status: 'published'
    },
    // Quinoa Recipes
    {
      title: 'Mediterranean Quinoa Salad',
      description: 'Fresh and healthy quinoa salad loaded with Mediterranean flavors. Perfect as a light lunch or side dish.',
      ingredients: [
        { name: 'Quinoa', amount: '1 cup', notes: 'rinsed' },
        { name: 'Cherry tomatoes', amount: '1 cup', notes: 'halved' },
        { name: 'Cucumber', amount: '1 large', notes: 'diced' },
        { name: 'Red onion', amount: '1/4 cup', notes: 'diced' },
        { name: 'Feta cheese', amount: '1/2 cup', notes: 'crumbled' },
        { name: 'Olives', amount: '1/3 cup', notes: 'kalamata' },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Lemon juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Fresh herbs', amount: '1/4 cup', notes: 'parsley and mint' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook quinoa according to package directions and cool.' },
        { step: 2, instruction: 'Combine quinoa with tomatoes, cucumber, and onion.' },
        { step: 3, instruction: 'Whisk together olive oil, lemon juice, salt, and pepper.' },
        { step: 4, instruction: 'Toss salad with dressing.' },
        { step: 5, instruction: 'Top with feta, olives, and fresh herbs.' },
        { step: 6, instruction: 'Chill for 30 minutes before serving.' }
      ],
      prep_time: 15,
      cook_time: 15,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    // Oats Recipes
    {
      title: 'Overnight Oats',
      description: 'Creamy, no-cook overnight oats that are perfect for busy mornings. Customize with your favorite toppings.',
      ingredients: [
        { name: 'Rolled oats', amount: '1/2 cup', notes: null },
        { name: 'Milk', amount: '1/2 cup', notes: 'dairy or plant-based' },
        { name: 'Greek yogurt', amount: '2 tbsp', notes: null },
        { name: 'Honey', amount: '1 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1/2 tsp', notes: null },
        { name: 'Chia seeds', amount: '1 tbsp', notes: 'optional' },
        { name: 'Fresh berries', amount: '1/4 cup', notes: null },
        { name: 'Nuts', amount: '2 tbsp', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Combine oats, milk, yogurt, honey, and vanilla in a jar.' },
        { step: 2, instruction: 'Add chia seeds if using and stir well.' },
        { step: 3, instruction: 'Cover and refrigerate overnight or at least 4 hours.' },
        { step: 4, instruction: 'In the morning, stir and add more liquid if needed.' },
        { step: 5, instruction: 'Top with berries and nuts before serving.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 1,
      difficulty: 'easy',
      calories_per_serving: 320,
      status: 'published'
    },
    // Maple Recipes
    {
      title: 'Maple Glazed Salmon',
      description: 'Tender salmon fillets with a sweet and savory maple glaze. This healthy dinner comes together in just 20 minutes.',
      ingredients: [
        { name: 'Salmon fillets', amount: '4', notes: '6 oz each' },
        { name: 'Maple syrup', amount: '1/4 cup', notes: 'pure' },
        { name: 'Soy sauce', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tsp', notes: 'fresh, grated' },
        { name: 'Olive oil', amount: '1 tbsp', notes: null },
        { name: 'Lime juice', amount: '1 tbsp', notes: null },
        { name: 'Green onions', amount: '2', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C).' },
        { step: 2, instruction: 'Whisk together maple syrup, soy sauce, garlic, and ginger.' },
        { step: 3, instruction: 'Place salmon on lined baking sheet and brush with oil.' },
        { step: 4, instruction: 'Bake for 12-15 minutes until fish flakes easily.' },
        { step: 5, instruction: 'Brush with maple glaze and broil 2 minutes.' },
        { step: 6, instruction: 'Garnish with lime juice and green onions.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Spinach Artichoke Dip
    ['Easy Spinach Recipes', 'Easy Cheese Recipes', 'Easy Cream Recipes', 'Easy Garlic Recipes', 'Easy Appetizer Recipes'],
    // Stuffed Mushrooms  
    ['Easy Mushroom Recipes', 'Easy Cheese Recipes', 'Easy Garlic Recipes', 'Easy Onion Recipes', 'Easy Herb Recipes'],
    // Mediterranean Quinoa Salad
    ['Easy Quinoa Recipes', 'Easy Tomato Recipes', 'Easy Cucumber Recipes', 'Easy Cheese Recipes', 'Easy Lemon Recipes'],
    // Overnight Oats
    ['Easy Oats Recipes', 'Easy Yogurt Recipes', 'Easy Honey Recipes', 'Easy Breakfast Recipes', 'Easy Dairy Recipes'],
    // Maple Glazed Salmon
    ['Easy Maple Recipes', 'Easy Fish Recipes', 'Easy Garlic Recipes', 'Easy Lime Recipes', 'Easy Dinner Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];
    
    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Mixed ingredient recipes completed!');
}

createMixedIngredientRecipes();
