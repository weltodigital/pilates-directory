const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createZeroRecipeCategories() {
  console.log('🆕 Creating recipes for categories with 0 recipes...\n');

  const recipes = [
    // Butternut Squash Recipes (5 recipes)
    {
      title: 'Roasted Butternut Squash Soup',
      description: 'Creamy, comforting butternut squash soup with a hint of ginger and coconut milk. Perfect for cozy autumn evenings.',
      ingredients: [
        { name: 'Butternut squash', amount: '3 lbs', notes: 'peeled and cubed' },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tbsp', notes: 'grated' },
        { name: 'Coconut milk', amount: '1 can (14 oz)', notes: null },
        { name: 'Vegetable broth', amount: '4 cups', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null },
        { name: 'Nutmeg', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C). Toss cubed squash with 1 tbsp olive oil, salt, and pepper.' },
        { step: 2, instruction: 'Roast squash for 25-30 minutes until tender and lightly caramelized.' },
        { step: 3, instruction: 'Heat remaining oil in a large pot. Sauté onion until softened, about 5 minutes.' },
        { step: 4, instruction: 'Add garlic and ginger, cook for 1 minute until fragrant.' },
        { step: 5, instruction: 'Add roasted squash and vegetable broth. Bring to a boil, then simmer 15 minutes.' },
        { step: 6, instruction: 'Blend soup until smooth using an immersion blender.' },
        { step: 7, instruction: 'Stir in coconut milk and nutmeg. Season with salt and pepper.' },
        { step: 8, instruction: 'Simmer for 5 more minutes. Serve hot with crusty bread.' }
      ],
      prep_time: 15,
      cook_time: 45,
      total_time: 60,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 165,
      status: 'published'
    },
    {
      title: 'Butternut Squash Risotto',
      description: 'Creamy arborio rice risotto with tender butternut squash and parmesan cheese. A luxurious comfort food dish.',
      ingredients: [
        { name: 'Arborio rice', amount: '1.5 cups', notes: null },
        { name: 'Butternut squash', amount: '2 cups', notes: 'diced' },
        { name: 'Chicken broth', amount: '6 cups', notes: 'warm' },
        { name: 'White wine', amount: '1/2 cup', notes: null },
        { name: 'Onion', amount: '1 medium', notes: 'diced' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Butter', amount: '3 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Fresh sage', amount: '2 tbsp', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Roast diced butternut squash at 400°F until tender, about 20 minutes.' },
        { step: 2, instruction: 'Heat olive oil in a large skillet. Sauté onion until translucent.' },
        { step: 3, instruction: 'Add rice and stir for 2 minutes until lightly toasted.' },
        { step: 4, instruction: 'Add wine and stir until absorbed.' },
        { step: 5, instruction: 'Add warm broth one ladle at a time, stirring constantly until absorbed.' },
        { step: 6, instruction: 'Continue adding broth and stirring for 20-25 minutes until rice is creamy.' },
        { step: 7, instruction: 'Fold in roasted squash, butter, and Parmesan cheese.' },
        { step: 8, instruction: 'Garnish with fresh sage and serve immediately.' }
      ],
      prep_time: 15,
      cook_time: 45,
      total_time: 60,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 420,
      status: 'published'
    },
    {
      title: 'Maple Glazed Butternut Squash',
      description: 'Sweet and savory roasted butternut squash with a maple glaze. Perfect as a side dish for fall dinners.',
      ingredients: [
        { name: 'Butternut squash', amount: '2 lbs', notes: 'peeled and sliced' },
        { name: 'Maple syrup', amount: '3 tbsp', notes: null },
        { name: 'Butter', amount: '2 tbsp', notes: 'melted' },
        { name: 'Brown sugar', amount: '1 tbsp', notes: null },
        { name: 'Cinnamon', amount: '1/2 tsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null },
        { name: 'Pecans', amount: '1/4 cup', notes: 'chopped, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 425°F (220°C).' },
        { step: 2, instruction: 'Slice butternut squash into half-moon pieces.' },
        { step: 3, instruction: 'Mix maple syrup, melted butter, brown sugar, cinnamon, salt, and pepper.' },
        { step: 4, instruction: 'Toss squash with maple mixture until well coated.' },
        { step: 5, instruction: 'Arrange on baking sheet in single layer.' },
        { step: 6, instruction: 'Roast for 25-30 minutes until tender and caramelized.' },
        { step: 7, instruction: 'Sprinkle with chopped pecans if using.' },
        { step: 8, instruction: 'Serve warm as a side dish.' }
      ],
      prep_time: 10,
      cook_time: 30,
      total_time: 40,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 95,
      status: 'published'
    },
    {
      title: 'Butternut Squash and Sage Pasta',
      description: 'Tender pasta tossed with roasted butternut squash, crispy sage, and brown butter. A restaurant-quality dish at home.',
      ingredients: [
        { name: 'Penne pasta', amount: '1 lb', notes: null },
        { name: 'Butternut squash', amount: '3 cups', notes: 'cubed' },
        { name: 'Butter', amount: '4 tbsp', notes: null },
        { name: 'Fresh sage leaves', amount: '12', notes: null },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null },
        { name: 'Pine nuts', amount: '1/4 cup', notes: 'toasted' }
      ],
      instructions: [
        { step: 1, instruction: 'Roast butternut squash with olive oil at 400°F until tender, 20 minutes.' },
        { step: 2, instruction: 'Cook pasta according to package directions.' },
        { step: 3, instruction: 'Melt butter in large skillet over medium heat until it turns golden brown.' },
        { step: 4, instruction: 'Add sage leaves and fry until crispy, about 1 minute.' },
        { step: 5, instruction: 'Add garlic and cook for 30 seconds.' },
        { step: 6, instruction: 'Add roasted squash and cooked pasta to the skillet.' },
        { step: 7, instruction: 'Toss with brown butter and sage.' },
        { step: 8, instruction: 'Serve with Parmesan cheese and toasted pine nuts.' }
      ],
      prep_time: 15,
      cook_time: 25,
      total_time: 40,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Stuffed Butternut Squash',
      description: 'Roasted butternut squash halves stuffed with a savory mixture of quinoa, cranberries, and nuts. A perfect vegetarian main dish.',
      ingredients: [
        { name: 'Butternut squash', amount: '2 small', notes: 'halved and seeded' },
        { name: 'Quinoa', amount: '1 cup', notes: 'cooked' },
        { name: 'Dried cranberries', amount: '1/3 cup', notes: null },
        { name: 'Walnuts', amount: '1/3 cup', notes: 'chopped' },
        { name: 'Onion', amount: '1 small', notes: 'diced' },
        { name: 'Celery', amount: '2 stalks', notes: 'diced' },
        { name: 'Vegetable broth', amount: '1/2 cup', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Fresh thyme', amount: '1 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C).' },
        { step: 2, instruction: 'Brush squash halves with olive oil and season with salt and pepper.' },
        { step: 3, instruction: 'Roast cut-side down for 30 minutes until tender.' },
        { step: 4, instruction: 'Sauté onion and celery until soft, about 5 minutes.' },
        { step: 5, instruction: 'Mix cooked quinoa, cranberries, walnuts, vegetables, and thyme.' },
        { step: 6, instruction: 'Add vegetable broth to moisten the mixture.' },
        { step: 7, instruction: 'Fill squash halves with quinoa mixture.' },
        { step: 8, instruction: 'Bake for 15-20 minutes until heated through.' }
      ],
      prep_time: 20,
      cook_time: 50,
      total_time: 70,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 285,
      status: 'published'
    },

    // Cheesecake Recipes (5 recipes)
    {
      title: 'Classic New York Cheesecake',
      description: 'Rich, creamy New York-style cheesecake with a graham cracker crust. This classic dessert is perfect for special occasions.',
      ingredients: [
        { name: 'Cream cheese', amount: '32 oz', notes: 'room temperature' },
        { name: 'Sugar', amount: '1 cup', notes: null },
        { name: 'Eggs', amount: '4 large', notes: null },
        { name: 'Sour cream', amount: '1/2 cup', notes: null },
        { name: 'Vanilla extract', amount: '2 tsp', notes: null },
        { name: 'Graham crackers', amount: '1.5 cups', notes: 'crushed' },
        { name: 'Butter', amount: '1/3 cup', notes: 'melted' },
        { name: 'Sugar for crust', amount: '1/4 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 325°F (165°C). Mix crushed graham crackers, melted butter, and 1/4 cup sugar.' },
        { step: 2, instruction: 'Press mixture into bottom of 9-inch springform pan.' },
        { step: 3, instruction: 'Beat cream cheese until smooth. Gradually add 1 cup sugar.' },
        { step: 4, instruction: 'Add eggs one at a time, then sour cream and vanilla.' },
        { step: 5, instruction: 'Pour filling over crust.' },
        { step: 6, instruction: 'Bake for 50-60 minutes until center is almost set.' },
        { step: 7, instruction: 'Cool completely, then refrigerate for at least 4 hours.' },
        { step: 8, instruction: 'Run knife around edges before removing from pan.' }
      ],
      prep_time: 20,
      cook_time: 60,
      total_time: 80,
      servings: 12,
      difficulty: 'medium',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'No-Bake Strawberry Cheesecake',
      description: 'Light and fluffy no-bake cheesecake topped with fresh strawberries. Perfect for summer when you don\'t want to heat up the kitchen.',
      ingredients: [
        { name: 'Cream cheese', amount: '16 oz', notes: 'softened' },
        { name: 'Powdered sugar', amount: '1 cup', notes: null },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Graham cracker crust', amount: '1', notes: 'store-bought' },
        { name: 'Fresh strawberries', amount: '2 cups', notes: 'sliced' },
        { name: 'Strawberry jam', amount: '2 tbsp', notes: 'warmed' }
      ],
      instructions: [
        { step: 1, instruction: 'Beat cream cheese until smooth and fluffy.' },
        { step: 2, instruction: 'Gradually add powdered sugar and vanilla.' },
        { step: 3, instruction: 'In separate bowl, whip heavy cream to stiff peaks.' },
        { step: 4, instruction: 'Gently fold whipped cream into cream cheese mixture.' },
        { step: 5, instruction: 'Spoon filling into graham cracker crust.' },
        { step: 6, instruction: 'Refrigerate for at least 3 hours until set.' },
        { step: 7, instruction: 'Top with sliced strawberries before serving.' },
        { step: 8, instruction: 'Brush strawberries with warmed jam for glaze.' }
      ],
      prep_time: 15,
      cook_time: 0,
      total_time: 15,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 320,
      status: 'published'
    },
    {
      title: 'Chocolate Cheesecake',
      description: 'Decadent chocolate cheesecake with a chocolate cookie crust. A chocolate lover\'s dream dessert.',
      ingredients: [
        { name: 'Cream cheese', amount: '24 oz', notes: 'room temperature' },
        { name: 'Sugar', amount: '3/4 cup', notes: null },
        { name: 'Eggs', amount: '3 large', notes: null },
        { name: 'Dark chocolate', amount: '8 oz', notes: 'melted and cooled' },
        { name: 'Sour cream', amount: '1/3 cup', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Chocolate cookies', amount: '1.5 cups', notes: 'crushed (Oreos)' },
        { name: 'Butter', amount: '1/4 cup', notes: 'melted' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 325°F (165°C). Mix crushed cookies with melted butter.' },
        { step: 2, instruction: 'Press mixture into bottom of 9-inch springform pan.' },
        { step: 3, instruction: 'Beat cream cheese until smooth. Add sugar gradually.' },
        { step: 4, instruction: 'Beat in eggs one at a time, then melted chocolate.' },
        { step: 5, instruction: 'Add sour cream and vanilla, mix until smooth.' },
        { step: 6, instruction: 'Pour over crust and smooth top.' },
        { step: 7, instruction: 'Bake 45-50 minutes until center is almost set.' },
        { step: 8, instruction: 'Cool completely, then chill for 4 hours before serving.' }
      ],
      prep_time: 20,
      cook_time: 50,
      total_time: 70,
      servings: 10,
      difficulty: 'medium',
      calories_per_serving: 445,
      status: 'published'
    },
    {
      title: 'Mini Cheesecakes',
      description: 'Individual portion cheesecakes perfect for parties and portion control. Top with your favorite fruits or sauces.',
      ingredients: [
        { name: 'Cream cheese', amount: '16 oz', notes: 'softened' },
        { name: 'Sugar', amount: '1/2 cup', notes: null },
        { name: 'Eggs', amount: '2 large', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Graham crackers', amount: '12', notes: 'crushed' },
        { name: 'Butter', amount: '3 tbsp', notes: 'melted' },
        { name: 'Mixed berries', amount: '1 cup', notes: 'for topping' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 325°F (165°C). Line 12-cup muffin tin with paper liners.' },
        { step: 2, instruction: 'Mix crushed graham crackers with melted butter.' },
        { step: 3, instruction: 'Press 1 tablespoon mixture into bottom of each liner.' },
        { step: 4, instruction: 'Beat cream cheese until smooth, add sugar gradually.' },
        { step: 5, instruction: 'Beat in eggs and vanilla until just combined.' },
        { step: 6, instruction: 'Divide filling among muffin cups.' },
        { step: 7, instruction: 'Bake 18-20 minutes until centers are almost set.' },
        { step: 8, instruction: 'Cool completely, then chill 2 hours. Top with berries.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 12,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    },
    {
      title: 'Lemon Cheesecake',
      description: 'Bright and tangy lemon cheesecake with a buttery graham cracker crust. Fresh and creamy with the perfect amount of citrus.',
      ingredients: [
        { name: 'Cream cheese', amount: '24 oz', notes: 'room temperature' },
        { name: 'Sugar', amount: '3/4 cup', notes: null },
        { name: 'Eggs', amount: '3 large', notes: null },
        { name: 'Lemon juice', amount: '1/3 cup', notes: 'fresh' },
        { name: 'Lemon zest', amount: '2 tbsp', notes: null },
        { name: 'Sour cream', amount: '1/3 cup', notes: null },
        { name: 'Graham crackers', amount: '1.5 cups', notes: 'crushed' },
        { name: 'Butter', amount: '1/3 cup', notes: 'melted' },
        { name: 'Sugar for crust', amount: '2 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 325°F (165°C). Mix graham crackers, butter, and 2 tbsp sugar.' },
        { step: 2, instruction: 'Press into bottom of 9-inch springform pan.' },
        { step: 3, instruction: 'Beat cream cheese until smooth. Gradually add 3/4 cup sugar.' },
        { step: 4, instruction: 'Add eggs one at a time, then lemon juice, zest, and sour cream.' },
        { step: 5, instruction: 'Pour filling over crust.' },
        { step: 6, instruction: 'Bake 50-55 minutes until center is almost set.' },
        { step: 7, instruction: 'Cool completely, then refrigerate 4 hours.' },
        { step: 8, instruction: 'Garnish with lemon slices or additional zest.' }
      ],
      prep_time: 20,
      cook_time: 55,
      total_time: 75,
      servings: 10,
      difficulty: 'medium',
      calories_per_serving: 365,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Butternut Squash Recipes
    ['Easy Butternut Squash Recipes', 'Easy Soup Recipes', 'Easy Vegetable Recipes', 'Easy Coconut Recipes', 'Easy Ginger Recipes'],
    ['Easy Butternut Squash Recipes', 'Easy Rice Recipes', 'Easy Cheese Recipes', 'Easy Wine Recipes', 'Easy Herb Recipes'],
    ['Easy Butternut Squash Recipes', 'Easy Maple Recipes', 'Easy Butter Recipes', 'Easy Side Dish Recipes', 'Easy Fall Recipes'],
    ['Easy Butternut Squash Recipes', 'Easy Pasta Recipes', 'Easy Butter Recipes', 'Easy Herb Recipes', 'Easy Cheese Recipes'],
    ['Easy Butternut Squash Recipes', 'Easy Quinoa Recipes', 'Easy Vegetarian Recipes', 'Easy Stuffed Recipes', 'Easy Main Dish Recipes'],

    // Cheesecake Recipes
    ['Easy Cheesecake Recipes', 'Easy Dessert Recipes', 'Easy Baking Recipes', 'Easy Cream Cheese Recipes', 'Easy Special Occasion Recipes'],
    ['Easy Cheesecake Recipes', 'Easy No-Bake Recipes', 'Easy Strawberry Recipes', 'Easy Summer Recipes', 'Easy Light Desserts'],
    ['Easy Cheesecake Recipes', 'Easy Chocolate Recipes', 'Easy Dessert Recipes', 'Easy Baking Recipes', 'Easy Rich Desserts'],
    ['Easy Cheesecake Recipes', 'Easy Mini Desserts', 'Easy Party Recipes', 'Easy Individual Servings', 'Easy Portion Control'],
    ['Easy Cheesecake Recipes', 'Easy Lemon Recipes', 'Easy Citrus Recipes', 'Easy Fresh Desserts', 'Easy Tangy Desserts']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Zero-recipe categories completed!');
}

createZeroRecipeCategories();