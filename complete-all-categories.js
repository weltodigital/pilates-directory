const { createRecipeWithCategories } = require('./recipe-creation-template');

async function completeAllCategories() {
  console.log('🎯 Completing ALL remaining ingredient categories...\n');

  const recipes = [
    // Cream Cheese Recipes (need 3 more - currently has 2)
    {
      title: 'Cream Cheese Stuffed Chicken Breast',
      description: 'Juicy chicken breasts stuffed with herbed cream cheese. An elegant main dish that\'s surprisingly easy to make.',
      ingredients: [
        { name: 'Chicken breasts', amount: '4 large', notes: 'boneless, skinless' },
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Fresh spinach', amount: '2 cups', notes: 'chopped' },
        { name: 'Sun-dried tomatoes', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Italian seasoning', amount: '1 tsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
        { step: 2, instruction: 'Mix cream cheese, spinach, sun-dried tomatoes, garlic, and Italian seasoning.' },
        { step: 3, instruction: 'Cut a pocket in each chicken breast.' },
        { step: 4, instruction: 'Stuff each breast with cream cheese mixture.' },
        { step: 5, instruction: 'Secure with toothpicks and season with salt and pepper.' },
        { step: 6, instruction: 'Heat olive oil in oven-safe skillet. Sear chicken 3 minutes per side.' },
        { step: 7, instruction: 'Transfer to oven and bake 20-25 minutes until cooked through.' },
        { step: 8, instruction: 'Let rest 5 minutes before serving.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 425,
      status: 'published'
    },
    {
      title: 'Cream Cheese Mashed Potatoes',
      description: 'Ultra-creamy mashed potatoes with cream cheese for extra richness. The perfect side dish for any meal.',
      ingredients: [
        { name: 'Russet potatoes', amount: '3 lbs', notes: 'peeled and cubed' },
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Butter', amount: '1/2 cup', notes: null },
        { name: 'Heavy cream', amount: '1/2 cup', notes: 'warm' },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'White pepper', amount: '1/4 tsp', notes: null },
        { name: 'Chives', amount: '2 tbsp', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Boil potatoes in salted water until fork-tender, about 15 minutes.' },
        { step: 2, instruction: 'Drain potatoes thoroughly and return to pot.' },
        { step: 3, instruction: 'Mash potatoes until smooth.' },
        { step: 4, instruction: 'Beat in cream cheese and butter until creamy.' },
        { step: 5, instruction: 'Gradually add warm cream until desired consistency.' },
        { step: 6, instruction: 'Season with salt and white pepper.' },
        { step: 7, instruction: 'Garnish with chopped chives.' },
        { step: 8, instruction: 'Serve immediately while hot.' }
      ],
      prep_time: 10,
      cook_time: 20,
      total_time: 30,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 245,
      status: 'published'
    },
    {
      title: 'Cream Cheese Fruit Dip',
      description: 'Sweet cream cheese dip perfect for fresh fruit. Great for parties, picnics, or healthy snacking.',
      ingredients: [
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Marshmallow fluff', amount: '7 oz jar', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Lemon juice', amount: '1 tbsp', notes: 'fresh' },
        { name: 'Powdered sugar', amount: '2 tbsp', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Beat cream cheese until light and fluffy.' },
        { step: 2, instruction: 'Gradually beat in marshmallow fluff.' },
        { step: 3, instruction: 'Add vanilla and lemon juice.' },
        { step: 4, instruction: 'Taste and add powdered sugar if desired.' },
        { step: 5, instruction: 'Chill for 30 minutes before serving.' },
        { step: 6, instruction: 'Serve with fresh fruit.' }
      ],
      prep_time: 10,
      cook_time: 0,
      total_time: 10,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 125,
      status: 'published'
    },

    // Creamed Recipes (need 4 more - currently has 1)
    {
      title: 'Creamed Corn',
      description: 'Rich and creamy corn side dish that\'s better than any restaurant version. Perfect for holidays and family dinners.',
      ingredients: [
        { name: 'Corn kernels', amount: '4 cups', notes: 'fresh or frozen' },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Butter', amount: '3 tbsp', notes: null },
        { name: 'Sugar', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null },
        { name: 'Fresh thyme', amount: '1 tsp', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Melt butter in large skillet over medium heat.' },
        { step: 2, instruction: 'Add corn and cook 5 minutes, stirring occasionally.' },
        { step: 3, instruction: 'Add cream, sugar, salt, and pepper.' },
        { step: 4, instruction: 'Simmer 10-15 minutes until thickened.' },
        { step: 5, instruction: 'Stir in fresh thyme if using.' },
        { step: 6, instruction: 'Serve hot as a side dish.' }
      ],
      prep_time: 5,
      cook_time: 20,
      total_time: 25,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 165,
      status: 'published'
    },
    {
      title: 'Creamed Mushrooms',
      description: 'Savory creamed mushrooms perfect as a side dish or sauce for steaks. Rich and flavorful comfort food.',
      ingredients: [
        { name: 'Mixed mushrooms', amount: '1.5 lbs', notes: 'sliced' },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Butter', amount: '3 tbsp', notes: null },
        { name: 'Onion', amount: '1 small', notes: 'diced' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Fresh thyme', amount: '1 tbsp', notes: null },
        { name: 'White wine', amount: '1/4 cup', notes: 'optional' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Melt butter in large skillet over medium-high heat.' },
        { step: 2, instruction: 'Sauté onion until soft, about 3 minutes.' },
        { step: 3, instruction: 'Add mushrooms and cook until golden, 8-10 minutes.' },
        { step: 4, instruction: 'Add garlic and thyme, cook 1 minute.' },
        { step: 5, instruction: 'Add wine if using, cook until reduced.' },
        { step: 6, instruction: 'Pour in cream and simmer until thickened.' },
        { step: 7, instruction: 'Season with salt and pepper.' },
        { step: 8, instruction: 'Serve hot over steaks or as a side.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    },
    {
      title: 'Creamed Peas',
      description: 'Classic creamed peas with pearl onions. A traditional side dish that\'s creamy, comforting, and delicious.',
      ingredients: [
        { name: 'Frozen peas', amount: '2 cups', notes: null },
        { name: 'Pearl onions', amount: '1 cup', notes: 'frozen' },
        { name: 'Heavy cream', amount: '3/4 cup', notes: null },
        { name: 'Butter', amount: '2 tbsp', notes: null },
        { name: 'Flour', amount: '1 tbsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'White pepper', amount: '1/4 tsp', notes: null },
        { name: 'Fresh mint', amount: '1 tbsp', notes: 'chopped, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook peas and pearl onions according to package directions.' },
        { step: 2, instruction: 'Drain and set aside.' },
        { step: 3, instruction: 'Melt butter in saucepan over medium heat.' },
        { step: 4, instruction: 'Whisk in flour and cook 1 minute.' },
        { step: 5, instruction: 'Gradually whisk in cream until smooth.' },
        { step: 6, instruction: 'Cook until thickened, about 5 minutes.' },
        { step: 7, instruction: 'Stir in peas and onions, season with salt and pepper.' },
        { step: 8, instruction: 'Garnish with fresh mint if desired.' }
      ],
      prep_time: 5,
      cook_time: 15,
      total_time: 20,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 145,
      status: 'published'
    },
    {
      title: 'Creamed Carrots',
      description: 'Sweet and creamy carrots that make vegetables irresistible. Perfect for getting kids to eat their veggies.',
      ingredients: [
        { name: 'Baby carrots', amount: '2 lbs', notes: null },
        { name: 'Heavy cream', amount: '1/2 cup', notes: null },
        { name: 'Butter', amount: '2 tbsp', notes: null },
        { name: 'Brown sugar', amount: '2 tbsp', notes: null },
        { name: 'Fresh dill', amount: '1 tbsp', notes: 'chopped' },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Black pepper', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Steam carrots until tender, about 12 minutes.' },
        { step: 2, instruction: 'Melt butter in large skillet.' },
        { step: 3, instruction: 'Add brown sugar and cook until dissolved.' },
        { step: 4, instruction: 'Add steamed carrots and toss to coat.' },
        { step: 5, instruction: 'Pour in cream and simmer 5 minutes.' },
        { step: 6, instruction: 'Season with salt, pepper, and fresh dill.' },
        { step: 7, instruction: 'Serve immediately while hot.' }
      ],
      prep_time: 5,
      cook_time: 20,
      total_time: 25,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 125,
      status: 'published'
    },

    // Dairy Free Recipes (need 5 - currently has 0)
    {
      title: 'Dairy-Free Coconut Curry',
      description: 'Rich and flavorful curry made with coconut milk instead of dairy. Naturally dairy-free and delicious.',
      ingredients: [
        { name: 'Coconut milk', amount: '2 cans (14 oz each)', notes: null },
        { name: 'Chicken or vegetables', amount: '2 lbs', notes: 'cut into pieces' },
        { name: 'Curry powder', amount: '2 tbsp', notes: null },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, grated' },
        { name: 'Vegetable oil', amount: '2 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat oil in large pot. Sauté onion until soft.' },
        { step: 2, instruction: 'Add garlic, ginger, and curry powder. Cook 1 minute.' },
        { step: 3, instruction: 'Add chicken or vegetables and brown.' },
        { step: 4, instruction: 'Pour in coconut milk and bring to simmer.' },
        { step: 5, instruction: 'Cook 20-25 minutes until tender.' },
        { step: 6, instruction: 'Season with salt and pepper.' },
        { step: 7, instruction: 'Serve over rice.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Dairy-Free Chocolate Avocado Mousse',
      description: 'Creamy chocolate mousse made with avocado. Rich, decadent, and completely dairy-free.',
      ingredients: [
        { name: 'Ripe avocados', amount: '3 large', notes: null },
        { name: 'Cocoa powder', amount: '1/3 cup', notes: 'unsweetened' },
        { name: 'Maple syrup', amount: '1/4 cup', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Almond milk', amount: '2-3 tbsp', notes: null },
        { name: 'Sea salt', amount: 'pinch', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Scoop avocado flesh into food processor.' },
        { step: 2, instruction: 'Add cocoa powder, maple syrup, vanilla, and salt.' },
        { step: 3, instruction: 'Process until smooth and creamy.' },
        { step: 4, instruction: 'Add almond milk 1 tablespoon at a time until desired consistency.' },
        { step: 5, instruction: 'Taste and adjust sweetness if needed.' },
        { step: 6, instruction: 'Chill for 2 hours before serving.' },
        { step: 7, instruction: 'Serve in small portions.' }
      ],
      prep_time: 10,
      cook_time: 0,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 165,
      status: 'published'
    },
    {
      title: 'Dairy-Free Vegetable Stir-Fry',
      description: 'Fresh vegetable stir-fry with a savory sauce. Quick, healthy, and naturally dairy-free.',
      ingredients: [
        { name: 'Mixed vegetables', amount: '6 cups', notes: 'broccoli, bell peppers, snap peas' },
        { name: 'Soy sauce', amount: '3 tbsp', notes: null },
        { name: 'Sesame oil', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, grated' },
        { name: 'Vegetable oil', amount: '2 tbsp', notes: null },
        { name: 'Green onions', amount: '3', notes: 'sliced' },
        { name: 'Sesame seeds', amount: '1 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat vegetable oil in large wok or skillet.' },
        { step: 2, instruction: 'Add garlic and ginger, stir-fry 30 seconds.' },
        { step: 3, instruction: 'Add vegetables and stir-fry 5-7 minutes until crisp-tender.' },
        { step: 4, instruction: 'Drizzle with soy sauce and sesame oil.' },
        { step: 5, instruction: 'Toss to coat evenly.' },
        { step: 6, instruction: 'Garnish with green onions and sesame seeds.' },
        { step: 7, instruction: 'Serve immediately over rice.' }
      ],
      prep_time: 15,
      cook_time: 10,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 125,
      status: 'published'
    },
    {
      title: 'Dairy-Free Banana Nice Cream',
      description: 'Creamy "ice cream" made from frozen bananas. Naturally dairy-free and sweetened only with fruit.',
      ingredients: [
        { name: 'Frozen bananas', amount: '4 large', notes: 'sliced' },
        { name: 'Almond milk', amount: '2-3 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Cocoa powder', amount: '2 tbsp', notes: 'optional' },
        { name: 'Chopped nuts', amount: '1/4 cup', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Place frozen banana slices in food processor.' },
        { step: 2, instruction: 'Process until bananas break down into small pieces.' },
        { step: 3, instruction: 'Add almond milk and vanilla.' },
        { step: 4, instruction: 'Process until smooth and creamy.' },
        { step: 5, instruction: 'Add cocoa powder for chocolate version if desired.' },
        { step: 6, instruction: 'Serve immediately as soft serve or freeze for firmer texture.' },
        { step: 7, instruction: 'Top with chopped nuts if desired.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 95,
      status: 'published'
    },
    {
      title: 'Dairy-Free Oat Milk Smoothie',
      description: 'Creamy smoothie made with oat milk and fresh fruit. Perfect for breakfast or post-workout fuel.',
      ingredients: [
        { name: 'Oat milk', amount: '1.5 cups', notes: null },
        { name: 'Frozen berries', amount: '1 cup', notes: null },
        { name: 'Banana', amount: '1 large', notes: null },
        { name: 'Almond butter', amount: '2 tbsp', notes: null },
        { name: 'Maple syrup', amount: '1 tbsp', notes: 'optional' },
        { name: 'Vanilla extract', amount: '1/2 tsp', notes: null },
        { name: 'Ice cubes', amount: '1/2 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Add all ingredients to blender.' },
        { step: 2, instruction: 'Blend until smooth and creamy.' },
        { step: 3, instruction: 'Taste and adjust sweetness if needed.' },
        { step: 4, instruction: 'Add more oat milk if too thick.' },
        { step: 5, instruction: 'Pour into glasses and serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    },

    // Eggplant Recipes (need 5 - currently has 0)
    {
      title: 'Classic Eggplant Parmesan',
      description: 'Crispy breaded eggplant layered with marinara and cheese. A vegetarian classic that\'s hearty and satisfying.',
      ingredients: [
        { name: 'Large eggplant', amount: '2', notes: 'sliced 1/2 inch thick' },
        { name: 'Marinara sauce', amount: '3 cups', notes: null },
        { name: 'Mozzarella cheese', amount: '2 cups', notes: 'shredded' },
        { name: 'Parmesan cheese', amount: '1 cup', notes: 'grated' },
        { name: 'Breadcrumbs', amount: '2 cups', notes: 'Italian seasoned' },
        { name: 'Eggs', amount: '3 large', notes: 'beaten' },
        { name: 'Flour', amount: '1 cup', notes: null },
        { name: 'Olive oil', amount: '1/2 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Salt eggplant slices and let drain 30 minutes.' },
        { step: 2, instruction: 'Pat dry and dredge in flour, eggs, then breadcrumbs.' },
        { step: 3, instruction: 'Fry in olive oil until golden on both sides.' },
        { step: 4, instruction: 'Layer in baking dish with sauce and cheeses.' },
        { step: 5, instruction: 'Bake at 375°F for 25-30 minutes until bubbly.' },
        { step: 6, instruction: 'Let rest 10 minutes before serving.' }
      ],
      prep_time: 45,
      cook_time: 30,
      total_time: 75,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 485,
      status: 'published'
    },
    {
      title: 'Mediterranean Roasted Eggplant',
      description: 'Simple roasted eggplant with herbs and olive oil. Light, flavorful, and perfect as a side dish.',
      ingredients: [
        { name: 'Eggplant', amount: '2 medium', notes: 'cubed' },
        { name: 'Olive oil', amount: '1/4 cup', notes: null },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Fresh herbs', amount: '2 tbsp', notes: 'oregano and basil' },
        { name: 'Lemon juice', amount: '2 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null },
        { name: 'Feta cheese', amount: '1/2 cup', notes: 'crumbled, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 425°F (220°C).' },
        { step: 2, instruction: 'Toss eggplant with olive oil, garlic, herbs, salt, and pepper.' },
        { step: 3, instruction: 'Spread on baking sheet in single layer.' },
        { step: 4, instruction: 'Roast 25-30 minutes until tender and golden.' },
        { step: 5, instruction: 'Drizzle with lemon juice.' },
        { step: 6, instruction: 'Top with feta cheese if desired.' },
        { step: 7, instruction: 'Serve warm or at room temperature.' }
      ],
      prep_time: 10,
      cook_time: 30,
      total_time: 40,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 145,
      status: 'published'
    },
    {
      title: 'Baba Ganoush',
      description: 'Smoky Middle Eastern eggplant dip with tahini and lemon. Perfect with pita bread or vegetables.',
      ingredients: [
        { name: 'Large eggplants', amount: '2', notes: null },
        { name: 'Tahini', amount: '1/4 cup', notes: null },
        { name: 'Lemon juice', amount: '3 tbsp', notes: 'fresh' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Paprika', amount: '1/2 tsp', notes: null },
        { name: 'Fresh parsley', amount: '2 tbsp', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Prick eggplants and roast over open flame or at 450°F until charred.' },
        { step: 2, instruction: 'Let cool, then peel and remove seeds.' },
        { step: 3, instruction: 'Mash eggplant flesh until smooth.' },
        { step: 4, instruction: 'Stir in tahini, lemon juice, garlic, and salt.' },
        { step: 5, instruction: 'Drizzle with olive oil and sprinkle with paprika.' },
        { step: 6, instruction: 'Garnish with fresh parsley.' },
        { step: 7, instruction: 'Serve with pita bread.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 85,
      status: 'published'
    },
    {
      title: 'Eggplant Caponata',
      description: 'Sicilian sweet and sour eggplant stew with olives and capers. Served as an appetizer or side dish.',
      ingredients: [
        { name: 'Eggplant', amount: '2 large', notes: 'cubed' },
        { name: 'Diced tomatoes', amount: '1 can (14 oz)', notes: null },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Celery', amount: '2 stalks', notes: 'diced' },
        { name: 'Olives', amount: '1/2 cup', notes: 'green, pitted' },
        { name: 'Capers', amount: '2 tbsp', notes: null },
        { name: 'Red wine vinegar', amount: '2 tbsp', notes: null },
        { name: 'Sugar', amount: '1 tbsp', notes: null },
        { name: 'Olive oil', amount: '1/4 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Salt eggplant cubes and drain 30 minutes.' },
        { step: 2, instruction: 'Heat olive oil and fry eggplant until golden.' },
        { step: 3, instruction: 'Remove eggplant and sauté onion and celery.' },
        { step: 4, instruction: 'Add tomatoes, olives, capers, vinegar, and sugar.' },
        { step: 5, instruction: 'Return eggplant to pan and simmer 20 minutes.' },
        { step: 6, instruction: 'Let cool to room temperature.' },
        { step: 7, instruction: 'Serve with crusty bread.' }
      ],
      prep_time: 45,
      cook_time: 30,
      total_time: 75,
      servings: 8,
      difficulty: 'medium',
      calories_per_serving: 125,
      status: 'published'
    },
    {
      title: 'Grilled Eggplant',
      description: 'Simple grilled eggplant with herbs and balsamic glaze. Perfect for summer barbecues.',
      ingredients: [
        { name: 'Eggplant', amount: '2 medium', notes: 'sliced lengthwise' },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Balsamic vinegar', amount: '2 tbsp', notes: null },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Fresh herbs', amount: '2 tbsp', notes: 'basil or oregano' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Salt eggplant slices and let drain 20 minutes.' },
        { step: 2, instruction: 'Pat dry and brush with olive oil.' },
        { step: 3, instruction: 'Season with salt, pepper, and garlic.' },
        { step: 4, instruction: 'Grill 4-5 minutes per side until tender.' },
        { step: 5, instruction: 'Drizzle with balsamic vinegar.' },
        { step: 6, instruction: 'Sprinkle with fresh herbs.' },
        { step: 7, instruction: 'Serve warm or at room temperature.' }
      ],
      prep_time: 25,
      cook_time: 10,
      total_time: 35,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 95,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Cream Cheese Recipes
    ['Easy Cream Cheese Recipes', 'Easy Stuffed Chicken Recipes', 'Easy Elegant Dinners', 'Easy Spinach Recipes', 'Easy Italian Recipes'],
    ['Easy Cream Cheese Recipes', 'Easy Mashed Potato Recipes', 'Easy Side Dish Recipes', 'Easy Comfort Food', 'Easy Holiday Recipes'],
    ['Easy Cream Cheese Recipes', 'Easy Fruit Dip Recipes', 'Easy Party Recipes', 'Easy Sweet Dips', 'Easy Healthy Snacks'],

    // Creamed Recipes
    ['Easy Creamed Recipes', 'Easy Corn Recipes', 'Easy Side Dish Recipes', 'Easy Cream Recipes', 'Easy Comfort Food'],
    ['Easy Creamed Recipes', 'Easy Mushroom Recipes', 'Easy Side Dish Recipes', 'Easy Wine Recipes', 'Easy Elegant Dinners'],
    ['Easy Creamed Recipes', 'Easy Pea Recipes', 'Easy Side Dish Recipes', 'Easy Traditional Recipes', 'Easy Cream Recipes'],
    ['Easy Creamed Recipes', 'Easy Carrot Recipes', 'Easy Side Dish Recipes', 'Easy Sweet Vegetables', 'Easy Family Meals'],

    // Dairy Free Recipes
    ['Easy Dairy Free Recipes', 'Easy Coconut Recipes', 'Easy Curry Recipes', 'Easy Healthy Recipes', 'Easy Asian Recipes'],
    ['Easy Dairy Free Recipes', 'Easy Chocolate Recipes', 'Easy Avocado Recipes', 'Easy Healthy Desserts', 'Easy Vegan Recipes'],
    ['Easy Dairy Free Recipes', 'Easy Stir-Fry Recipes', 'Easy Vegetable Recipes', 'Easy Asian Recipes', 'Easy Quick Meals'],
    ['Easy Dairy Free Recipes', 'Easy Banana Recipes', 'Easy Healthy Desserts', 'Easy Nice Cream Recipes', 'Easy Vegan Recipes'],
    ['Easy Dairy Free Recipes', 'Easy Smoothie Recipes', 'Easy Breakfast Recipes', 'Easy Oat Milk Recipes', 'Easy Healthy Recipes'],

    // Eggplant Recipes
    ['Easy Eggplant Recipes', 'Easy Parmesan Recipes', 'Easy Vegetarian Recipes', 'Easy Italian Recipes', 'Easy Comfort Food'],
    ['Easy Eggplant Recipes', 'Easy Mediterranean Recipes', 'Easy Roasted Vegetables', 'Easy Side Dish Recipes', 'Easy Herb Recipes'],
    ['Easy Eggplant Recipes', 'Easy Middle Eastern Recipes', 'Easy Dip Recipes', 'Easy Tahini Recipes', 'Easy Appetizer Recipes'],
    ['Easy Eggplant Recipes', 'Easy Sicilian Recipes', 'Easy Mediterranean Recipes', 'Easy Appetizer Recipes', 'Easy Olive Recipes'],
    ['Easy Eggplant Recipes', 'Easy Grilled Recipes', 'Easy Summer Recipes', 'Easy Balsamic Recipes', 'Easy BBQ Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 ALL ingredient categories now complete!');
}

completeAllCategories();