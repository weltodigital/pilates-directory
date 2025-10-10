const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createFinalCategories() {
  console.log('🏁 Creating recipes for final 12 categories that need more...\n');

  const recipes = [
    // Chicken Casserole Recipes (5 recipes)
    {
      title: 'King Ranch Chicken Casserole',
      description: 'Texas-style chicken casserole with layers of tortillas, chicken, cheese, and spicy sauce. A family favorite comfort food.',
      ingredients: [
        { name: 'Cooked chicken', amount: '3 cups', notes: 'shredded' },
        { name: 'Corn tortillas', amount: '12', notes: null },
        { name: 'Cheddar cheese', amount: '2 cups', notes: 'shredded' },
        { name: 'Diced tomatoes with green chilies', amount: '1 can (10 oz)', notes: null },
        { name: 'Cream of mushroom soup', amount: '1 can', notes: null },
        { name: 'Cream of chicken soup', amount: '1 can', notes: null },
        { name: 'Onion', amount: '1 medium', notes: 'diced' },
        { name: 'Bell pepper', amount: '1', notes: 'diced' },
        { name: 'Butter', amount: '2 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease a 9x13 inch baking dish.' },
        { step: 2, instruction: 'Sauté onion and bell pepper in butter until soft.' },
        { step: 3, instruction: 'Mix both soups and diced tomatoes with chilies.' },
        { step: 4, instruction: 'Layer half the tortillas in baking dish.' },
        { step: 5, instruction: 'Top with half the chicken, vegetables, and soup mixture.' },
        { step: 6, instruction: 'Sprinkle with half the cheese. Repeat layers.' },
        { step: 7, instruction: 'Bake 30-35 minutes until bubbly and golden.' },
        { step: 8, instruction: 'Let rest 10 minutes before serving.' }
      ],
      prep_time: 20,
      cook_time: 35,
      total_time: 55,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Chicken and Rice Casserole',
      description: 'One-dish comfort meal with chicken, rice, and vegetables. Perfect for busy weeknight dinners.',
      ingredients: [
        { name: 'Chicken breasts', amount: '4', notes: 'boneless, skinless' },
        { name: 'Long grain rice', amount: '1.5 cups', notes: 'uncooked' },
        { name: 'Chicken broth', amount: '3 cups', notes: null },
        { name: 'Mixed vegetables', amount: '2 cups', notes: 'frozen' },
        { name: 'Cream of mushroom soup', amount: '1 can', notes: null },
        { name: 'Onion soup mix', amount: '1 packet', notes: null },
        { name: 'Mozzarella cheese', amount: '1 cup', notes: 'shredded' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
        { step: 2, instruction: 'Mix rice, broth, soup, and onion soup mix in 9x13 dish.' },
        { step: 3, instruction: 'Add frozen vegetables and stir.' },
        { step: 4, instruction: 'Place chicken breasts on top.' },
        { step: 5, instruction: 'Cover tightly with foil and bake 45 minutes.' },
        { step: 6, instruction: 'Remove foil, top with cheese, bake 15 more minutes.' },
        { step: 7, instruction: 'Let rest 5 minutes before serving.' }
      ],
      prep_time: 10,
      cook_time: 60,
      total_time: 70,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 425,
      status: 'published'
    },
    {
      title: 'Chicken Enchilada Casserole',
      description: 'Layered Mexican casserole with chicken, tortillas, and enchilada sauce. All the flavors of enchiladas in an easy casserole.',
      ingredients: [
        { name: 'Cooked chicken', amount: '3 cups', notes: 'shredded' },
        { name: 'Flour tortillas', amount: '8', notes: null },
        { name: 'Enchilada sauce', amount: '2 cans (10 oz each)', notes: null },
        { name: 'Mexican cheese blend', amount: '2 cups', notes: 'shredded' },
        { name: 'Black beans', amount: '1 can', notes: 'drained and rinsed' },
        { name: 'Corn', amount: '1 cup', notes: 'frozen' },
        { name: 'Sour cream', amount: '1 cup', notes: null },
        { name: 'Green onions', amount: '4', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C). Grease 9x13 inch dish.' },
        { step: 2, instruction: 'Mix chicken with 1/2 cup enchilada sauce.' },
        { step: 3, instruction: 'Place 4 tortillas in bottom of dish.' },
        { step: 4, instruction: 'Layer with chicken mixture, beans, corn, and half the cheese.' },
        { step: 5, instruction: 'Top with remaining tortillas and enchilada sauce.' },
        { step: 6, instruction: 'Sprinkle with remaining cheese.' },
        { step: 7, instruction: 'Bake 25-30 minutes until bubbly.' },
        { step: 8, instruction: 'Serve with sour cream and green onions.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 365,
      status: 'published'
    },
    {
      title: 'Chicken Broccoli Casserole',
      description: 'Creamy casserole with chicken, broccoli, and rice topped with cheese. A complete one-dish meal.',
      ingredients: [
        { name: 'Cooked chicken', amount: '2 cups', notes: 'diced' },
        { name: 'Broccoli florets', amount: '4 cups', notes: 'fresh or frozen' },
        { name: 'Cooked rice', amount: '2 cups', notes: null },
        { name: 'Cream of chicken soup', amount: '1 can', notes: null },
        { name: 'Mayonnaise', amount: '1/2 cup', notes: null },
        { name: 'Cheddar cheese', amount: '1.5 cups', notes: 'shredded, divided' },
        { name: 'Breadcrumbs', amount: '1/2 cup', notes: null },
        { name: 'Butter', amount: '2 tbsp', notes: 'melted' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease 9x13 inch dish.' },
        { step: 2, instruction: 'Steam broccoli until crisp-tender.' },
        { step: 3, instruction: 'Mix chicken, broccoli, rice, soup, mayo, and 1 cup cheese.' },
        { step: 4, instruction: 'Spread mixture in prepared dish.' },
        { step: 5, instruction: 'Top with remaining cheese.' },
        { step: 6, instruction: 'Mix breadcrumbs with melted butter and sprinkle on top.' },
        { step: 7, instruction: 'Bake 25-30 minutes until heated through.' },
        { step: 8, instruction: 'Let stand 5 minutes before serving.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Buffalo Chicken Casserole',
      description: 'Spicy buffalo chicken casserole with pasta and cheese. All the flavors of buffalo wings in a comforting casserole.',
      ingredients: [
        { name: 'Cooked chicken', amount: '3 cups', notes: 'shredded' },
        { name: 'Penne pasta', amount: '12 oz', notes: 'cooked' },
        { name: 'Buffalo sauce', amount: '1/2 cup', notes: null },
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Ranch dressing', amount: '1/2 cup', notes: null },
        { name: 'Mozzarella cheese', amount: '2 cups', notes: 'shredded' },
        { name: 'Blue cheese', amount: '1/2 cup', notes: 'crumbled' },
        { name: 'Green onions', amount: '3', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C). Grease 9x13 inch dish.' },
        { step: 2, instruction: 'Mix chicken with buffalo sauce.' },
        { step: 3, instruction: 'Combine cream cheese and ranch dressing until smooth.' },
        { step: 4, instruction: 'Toss pasta with cream cheese mixture.' },
        { step: 5, instruction: 'Layer pasta mixture and buffalo chicken in dish.' },
        { step: 6, instruction: 'Top with mozzarella and blue cheese.' },
        { step: 7, instruction: 'Bake 20-25 minutes until cheese melts.' },
        { step: 8, instruction: 'Garnish with green onions before serving.' }
      ],
      prep_time: 15,
      cook_time: 25,
      total_time: 40,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 445,
      status: 'published'
    },

    // Chicken Curry Recipes (5 recipes)
    {
      title: 'Easy Chicken Curry',
      description: 'Mild and creamy chicken curry perfect for beginners. Fragrant spices and coconut milk create a comforting dish.',
      ingredients: [
        { name: 'Chicken breasts', amount: '2 lbs', notes: 'cut into chunks' },
        { name: 'Coconut milk', amount: '1 can (14 oz)', notes: null },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, grated' },
        { name: 'Curry powder', amount: '2 tbsp', notes: null },
        { name: 'Turmeric', amount: '1 tsp', notes: null },
        { name: 'Diced tomatoes', amount: '1 can (14 oz)', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat oil in large skillet. Sauté onion until soft.' },
        { step: 2, instruction: 'Add garlic and ginger, cook 1 minute.' },
        { step: 3, instruction: 'Stir in curry powder and turmeric.' },
        { step: 4, instruction: 'Add chicken and brown on all sides.' },
        { step: 5, instruction: 'Add tomatoes and coconut milk.' },
        { step: 6, instruction: 'Simmer 20 minutes until chicken is cooked through.' },
        { step: 7, instruction: 'Season with salt and pepper.' },
        { step: 8, instruction: 'Serve over rice with naan bread.' }
      ],
      prep_time: 15,
      cook_time: 25,
      total_time: 40,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Thai Green Chicken Curry',
      description: 'Authentic Thai green curry with chicken, vegetables, and fragrant herbs. Creamy and aromatic with the perfect heat level.',
      ingredients: [
        { name: 'Chicken thighs', amount: '1.5 lbs', notes: 'boneless, cut into pieces' },
        { name: 'Green curry paste', amount: '3 tbsp', notes: null },
        { name: 'Coconut milk', amount: '1 can (14 oz)', notes: null },
        { name: 'Thai eggplant', amount: '1 cup', notes: 'cubed (or regular eggplant)' },
        { name: 'Bell peppers', amount: '2', notes: 'sliced' },
        { name: 'Thai basil', amount: '1/4 cup', notes: 'fresh leaves' },
        { name: 'Fish sauce', amount: '2 tbsp', notes: null },
        { name: 'Brown sugar', amount: '1 tbsp', notes: null },
        { name: 'Lime juice', amount: '1 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat 1/3 cup coconut milk in large pan until thick.' },
        { step: 2, instruction: 'Stir in green curry paste and cook 2 minutes.' },
        { step: 3, instruction: 'Add chicken and cook until no longer pink.' },
        { step: 4, instruction: 'Add remaining coconut milk and bring to boil.' },
        { step: 5, instruction: 'Add eggplant and peppers, simmer 10 minutes.' },
        { step: 6, instruction: 'Stir in fish sauce, brown sugar, and lime juice.' },
        { step: 7, instruction: 'Add Thai basil and cook 1 more minute.' },
        { step: 8, instruction: 'Serve over jasmine rice.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 425,
      status: 'published'
    },
    {
      title: 'Indian Butter Chicken',
      description: 'Rich and creamy Indian butter chicken with tender chicken in a tomato-based sauce. Restaurant-quality at home.',
      ingredients: [
        { name: 'Chicken breasts', amount: '2 lbs', notes: 'cut into chunks' },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Crushed tomatoes', amount: '1 can (28 oz)', notes: null },
        { name: 'Butter', amount: '4 tbsp', notes: null },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '6 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, grated' },
        { name: 'Garam masala', amount: '2 tsp', notes: null },
        { name: 'Paprika', amount: '1 tsp', notes: null },
        { name: 'Cumin', amount: '1 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Melt 2 tbsp butter in large skillet. Cook chicken until browned.' },
        { step: 2, instruction: 'Remove chicken and set aside.' },
        { step: 3, instruction: 'Add remaining butter and sauté onion until soft.' },
        { step: 4, instruction: 'Add garlic, ginger, and spices. Cook 1 minute.' },
        { step: 5, instruction: 'Add crushed tomatoes and simmer 10 minutes.' },
        { step: 6, instruction: 'Stir in cream and return chicken to pan.' },
        { step: 7, instruction: 'Simmer 15 minutes until chicken is cooked through.' },
        { step: 8, instruction: 'Serve with basmati rice and naan.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 445,
      status: 'published'
    },
    {
      title: 'Japanese Chicken Curry',
      description: 'Mild Japanese-style curry with vegetables and tender chicken. Comfort food that\'s perfect for the whole family.',
      ingredients: [
        { name: 'Chicken thighs', amount: '1.5 lbs', notes: 'cut into pieces' },
        { name: 'Japanese curry roux', amount: '1 box', notes: 'or curry powder' },
        { name: 'Potatoes', amount: '3 medium', notes: 'cubed' },
        { name: 'Carrots', amount: '2 large', notes: 'sliced' },
        { name: 'Onion', amount: '1 large', notes: 'sliced' },
        { name: 'Water', amount: '4 cups', notes: null },
        { name: 'Vegetable oil', amount: '2 tbsp', notes: null },
        { name: 'Soy sauce', amount: '1 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat oil in large pot. Brown chicken pieces.' },
        { step: 2, instruction: 'Add onions and cook until soft.' },
        { step: 3, instruction: 'Add water and bring to boil.' },
        { step: 4, instruction: 'Add potatoes and carrots, simmer 15 minutes.' },
        { step: 5, instruction: 'Add curry roux and stir until dissolved.' },
        { step: 6, instruction: 'Simmer 10 more minutes until thickened.' },
        { step: 7, instruction: 'Season with soy sauce.' },
        { step: 8, instruction: 'Serve over steamed rice.' }
      ],
      prep_time: 15,
      cook_time: 35,
      total_time: 50,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 365,
      status: 'published'
    },
    {
      title: 'Coconut Chicken Curry',
      description: 'Tropical coconut chicken curry with pineapple and vegetables. Sweet and savory flavors in a creamy coconut base.',
      ingredients: [
        { name: 'Chicken breasts', amount: '2 lbs', notes: 'cut into strips' },
        { name: 'Coconut milk', amount: '2 cans (14 oz each)', notes: null },
        { name: 'Pineapple chunks', amount: '1 cup', notes: 'fresh or canned' },
        { name: 'Red bell pepper', amount: '1', notes: 'sliced' },
        { name: 'Snow peas', amount: '1 cup', notes: null },
        { name: 'Curry powder', amount: '2 tbsp', notes: null },
        { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, grated' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Lime juice', amount: '2 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat 1/4 cup coconut milk in large skillet.' },
        { step: 2, instruction: 'Add curry powder and cook until fragrant.' },
        { step: 3, instruction: 'Add chicken and cook until no longer pink.' },
        { step: 4, instruction: 'Add remaining coconut milk, ginger, and garlic.' },
        { step: 5, instruction: 'Simmer 10 minutes until chicken is cooked through.' },
        { step: 6, instruction: 'Add bell pepper and snow peas, cook 5 minutes.' },
        { step: 7, instruction: 'Stir in pineapple and lime juice.' },
        { step: 8, instruction: 'Serve over coconut rice.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 465,
      status: 'published'
    },

    // Continue with other categories...
    // Cream Cheese Recipes (4 more needed)
    {
      title: 'Cream Cheese Chicken',
      description: 'Tender chicken breasts in a rich cream cheese sauce with herbs. An elegant dinner that\'s surprisingly easy to make.',
      ingredients: [
        { name: 'Chicken breasts', amount: '4', notes: 'boneless, skinless' },
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Chicken broth', amount: '1/2 cup', notes: null },
        { name: 'White wine', amount: '1/4 cup', notes: 'optional' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh thyme', amount: '1 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Season chicken with salt and pepper.' },
        { step: 2, instruction: 'Heat olive oil in large skillet. Cook chicken until golden.' },
        { step: 3, instruction: 'Remove chicken and set aside.' },
        { step: 4, instruction: 'Add garlic to pan and cook 30 seconds.' },
        { step: 5, instruction: 'Whisk in cream cheese, broth, and wine until smooth.' },
        { step: 6, instruction: 'Return chicken to pan and simmer 15 minutes.' },
        { step: 7, instruction: 'Stir in fresh thyme.' },
        { step: 8, instruction: 'Serve with rice or pasta.' }
      ],
      prep_time: 10,
      cook_time: 25,
      total_time: 35,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Chicken Casserole Recipes
    ['Easy Chicken Casserole Recipes', 'Easy Chicken Recipes', 'Easy Casserole Recipes', 'Easy Comfort Food', 'Easy One-Dish Meals'],
    ['Easy Chicken Casserole Recipes', 'Easy Rice Recipes', 'Easy Chicken Recipes', 'Easy Family Meals', 'Easy Weeknight Dinners'],
    ['Easy Chicken Casserole Recipes', 'Easy Mexican Recipes', 'Easy Chicken Recipes', 'Easy Enchilada Recipes', 'Easy Tex-Mex Recipes'],
    ['Easy Chicken Casserole Recipes', 'Easy Broccoli Recipes', 'Easy Chicken Recipes', 'Easy Healthy Casseroles', 'Easy Complete Meals'],
    ['Easy Chicken Casserole Recipes', 'Easy Buffalo Recipes', 'Easy Chicken Recipes', 'Easy Spicy Recipes', 'Easy Game Day Food'],

    // Chicken Curry Recipes
    ['Easy Chicken Curry Recipes', 'Easy Curry Recipes', 'Easy Indian Recipes', 'Easy Coconut Recipes', 'Easy Chicken Recipes'],
    ['Easy Chicken Curry Recipes', 'Easy Thai Recipes', 'Easy Green Curry Recipes', 'Easy Asian Recipes', 'Easy Spicy Recipes'],
    ['Easy Chicken Curry Recipes', 'Easy Indian Recipes', 'Easy Butter Chicken', 'Easy Tomato Recipes', 'Easy Cream Recipes'],
    ['Easy Chicken Curry Recipes', 'Easy Japanese Recipes', 'Easy Asian Recipes', 'Easy Comfort Food', 'Easy Family Meals'],
    ['Easy Chicken Curry Recipes', 'Easy Coconut Recipes', 'Easy Tropical Recipes', 'Easy Pineapple Recipes', 'Easy Sweet and Savory'],

    // Cream Cheese Recipes
    ['Easy Cream Cheese Recipes', 'Easy Chicken Recipes', 'Easy Elegant Dinners', 'Easy Wine Recipes', 'Easy Herb Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Final categories batch completed!');
}

createFinalCategories();