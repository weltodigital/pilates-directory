const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const recipeCollections = {
  'Easy Artichoke Recipes': [
    {
      title: 'Easy Stuffed Artichokes',
      slug: 'easy-stuffed-artichokes',
      description: 'Classic Italian-style stuffed artichokes filled with seasoned breadcrumbs, garlic, and herbs. A delicious appetizer or side dish.',
      ingredients: [
        { name: 'Large artichokes', amount: '4', notes: 'trimmed and prepared' },
        { name: 'Breadcrumbs', amount: '1 cup', notes: 'Italian seasoned' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Olive oil', amount: '1/4 cup', notes: '' },
        { name: 'Lemon juice', amount: '2 tablespoons', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C). Trim artichokes and remove tough outer leaves.' },
        { step: 2, instruction: 'Mix breadcrumbs, Parmesan, garlic, parsley, salt, and pepper in a bowl.' },
        { step: 3, instruction: 'Drizzle with olive oil and lemon juice, mix well.' },
        { step: 4, instruction: 'Stuff the breadcrumb mixture between artichoke leaves.' },
        { step: 5, instruction: 'Place in baking dish with 1/2 inch of water. Cover with foil.' },
        { step: 6, instruction: 'Bake for 45-60 minutes until leaves pull away easily.' }
      ],
      prep_time: 20,
      cook_time: 60,
      total_time: 80,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 185,
      seo_title: 'Easy Stuffed Artichokes Recipe - Italian Style',
      seo_description: 'Learn how to make delicious stuffed artichokes with seasoned breadcrumbs, garlic, and herbs. Perfect appetizer or side dish.',
      featured_image_url: '/images/recipes/easy-stuffed-artichokes.jpg',
      featured_image_alt: 'Golden stuffed artichokes with breadcrumb filling',
      tips: 'Choose artichokes that feel heavy for their size with tightly closed leaves. Rub cut surfaces with lemon to prevent browning.',
      variations: 'Add chopped anchovies or pine nuts to the stuffing for extra flavor.',
      storage_instructions: 'Store cooked artichokes in refrigerator for up to 3 days. Reheat in oven.'
    },
    {
      title: 'Easy Artichoke Dip',
      slug: 'easy-artichoke-dip',
      description: 'Creamy, cheesy artichoke dip that\'s perfect for parties. Made with marinated artichokes, cream cheese, and parmesan.',
      ingredients: [
        { name: 'Marinated artichoke hearts', amount: '2 jars (6 oz each)', notes: 'drained and chopped' },
        { name: 'Cream cheese', amount: '8 oz', notes: 'softened' },
        { name: 'Mayonnaise', amount: '1/2 cup', notes: '' },
        { name: 'Sour cream', amount: '1/2 cup', notes: '' },
        { name: 'Parmesan cheese', amount: '3/4 cup', notes: 'grated' },
        { name: 'Mozzarella cheese', amount: '1/2 cup', notes: 'shredded' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Red pepper flakes', amount: '1/4 teaspoon', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
        { step: 2, instruction: 'Mix cream cheese, mayonnaise, and sour cream until smooth.' },
        { step: 3, instruction: 'Stir in chopped artichokes, garlic, and red pepper flakes.' },
        { step: 4, instruction: 'Add 1/2 cup Parmesan and all mozzarella, mix well.' },
        { step: 5, instruction: 'Transfer to greased baking dish, top with remaining Parmesan.' },
        { step: 6, instruction: 'Bake 25-30 minutes until golden and bubbly.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 245,
      seo_title: 'Easy Artichoke Dip Recipe - Creamy & Cheesy',
      seo_description: 'Make the perfect party dip with marinated artichokes, cream cheese, and parmesan. Hot, bubbly, and irresistible!',
      featured_image_url: '/images/recipes/easy-artichoke-dip.jpg',
      featured_image_alt: 'Creamy golden artichoke dip in baking dish',
      tips: 'Serve with toasted baguette slices, tortilla chips, or fresh vegetables.',
      variations: 'Add chopped spinach for a spinach-artichoke dip, or sun-dried tomatoes for extra flavor.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat in oven or microwave.'
    },
    {
      title: 'Easy Artichoke Pasta',
      slug: 'easy-artichoke-pasta',
      description: 'Light and fresh pasta dish with marinated artichokes, lemon, and herbs. Perfect for a quick weeknight dinner.',
      ingredients: [
        { name: 'Pasta', amount: '12 oz', notes: 'penne or rigatoni' },
        { name: 'Marinated artichoke hearts', amount: '2 jars (6 oz each)', notes: 'quartered' },
        { name: 'Cherry tomatoes', amount: '1 pint', notes: 'halved' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Fresh basil', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Lemon zest', amount: '1 lemon', notes: '' },
        { name: 'Lemon juice', amount: '3 tablespoons', notes: '' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Olive oil', amount: '3 tablespoons', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook pasta according to package directions until al dente.' },
        { step: 2, instruction: 'Heat olive oil in large pan over medium heat.' },
        { step: 3, instruction: 'Add garlic and cook for 1 minute until fragrant.' },
        { step: 4, instruction: 'Add artichokes and tomatoes, cook 3-4 minutes.' },
        { step: 5, instruction: 'Add drained pasta, lemon zest, juice, and basil.' },
        { step: 6, instruction: 'Toss well, serve with Parmesan cheese.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      seo_title: 'Easy Artichoke Pasta Recipe - Fresh & Light',
      seo_description: 'Quick artichoke pasta with cherry tomatoes, lemon, and fresh herbs. Ready in just 25 minutes!',
      featured_image_url: '/images/recipes/easy-artichoke-pasta.jpg',
      featured_image_alt: 'Colorful pasta with artichokes and cherry tomatoes',
      tips: 'Reserve some pasta water to help bind the sauce if needed.',
      variations: 'Add grilled chicken or shrimp for protein, or use different herbs like oregano or thyme.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Add a splash of water when reheating.'
    },
    {
      title: 'Easy Artichoke Salad',
      slug: 'easy-artichoke-salad',
      description: 'Mediterranean-style artichoke salad with olives, feta cheese, and a lemon vinaigrette. Perfect as a side or light lunch.',
      ingredients: [
        { name: 'Marinated artichoke hearts', amount: '2 jars (6 oz each)', notes: 'quartered' },
        { name: 'Mixed greens', amount: '6 cups', notes: '' },
        { name: 'Cherry tomatoes', amount: '1 cup', notes: 'halved' },
        { name: 'Kalamata olives', amount: '1/2 cup', notes: 'pitted' },
        { name: 'Feta cheese', amount: '4 oz', notes: 'crumbled' },
        { name: 'Red onion', amount: '1/4 cup', notes: 'thinly sliced' },
        { name: 'Lemon juice', amount: '3 tablespoons', notes: '' },
        { name: 'Olive oil', amount: '1/4 cup', notes: 'extra virgin' },
        { name: 'Dried oregano', amount: '1 teaspoon', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Combine lemon juice, olive oil, and oregano in small bowl.' },
        { step: 2, instruction: 'Whisk dressing ingredients together, season with salt and pepper.' },
        { step: 3, instruction: 'Arrange mixed greens on serving platter.' },
        { step: 4, instruction: 'Top with artichokes, tomatoes, olives, and red onion.' },
        { step: 5, instruction: 'Sprinkle crumbled feta cheese over salad.' },
        { step: 6, instruction: 'Drizzle with dressing just before serving.' }
      ],
      prep_time: 15,
      cook_time: 0,
      total_time: 15,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 195,
      seo_title: 'Easy Artichoke Salad Recipe - Mediterranean Style',
      seo_description: 'Fresh artichoke salad with olives, feta, and lemon vinaigrette. Light, healthy, and full of Mediterranean flavors.',
      featured_image_url: '/images/recipes/easy-artichoke-salad.jpg',
      featured_image_alt: 'Colorful Mediterranean artichoke salad with feta',
      tips: 'Let the salad sit for 10 minutes after dressing to allow flavors to meld.',
      variations: 'Add cucumber, bell peppers, or chickpeas for extra texture and nutrition.',
      storage_instructions: 'Store undressed salad components separately for up to 2 days.'
    },
    {
      title: 'Easy Artichoke Gratin',
      slug: 'easy-artichoke-gratin',
      description: 'Rich and creamy artichoke gratin with layers of tender artichokes in a cheesy sauce. Perfect side dish for special occasions.',
      ingredients: [
        { name: 'Frozen artichoke hearts', amount: '2 lbs', notes: 'thawed' },
        { name: 'Heavy cream', amount: '1 cup', notes: '' },
        { name: 'Gruyere cheese', amount: '1 cup', notes: 'grated' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh thyme', amount: '2 tablespoons', notes: 'chopped' },
        { name: 'Butter', amount: '2 tablespoons', notes: '' },
        { name: 'Flour', amount: '2 tablespoons', notes: '' },
        { name: 'Nutmeg', amount: 'Pinch', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C). Grease a baking dish.' },
        { step: 2, instruction: 'Melt butter in saucepan, whisk in flour and cook 1 minute.' },
        { step: 3, instruction: 'Gradually add cream, whisking until smooth and thickened.' },
        { step: 4, instruction: 'Add garlic, thyme, nutmeg, salt, and pepper.' },
        { step: 5, instruction: 'Layer artichokes in dish, pour sauce over, top with cheeses.' },
        { step: 6, instruction: 'Bake 25-30 minutes until golden and bubbly.' }
      ],
      prep_time: 20,
      cook_time: 30,
      total_time: 50,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 285,
      seo_title: 'Easy Artichoke Gratin Recipe - Creamy & Cheesy',
      seo_description: 'Indulgent artichoke gratin with creamy sauce and melted cheese. Perfect elegant side dish for dinner parties.',
      featured_image_url: '/images/recipes/easy-artichoke-gratin.jpg',
      featured_image_alt: 'Golden bubbling artichoke gratin in baking dish',
      tips: 'Pat artichokes dry before layering to prevent watery gratin.',
      variations: 'Add layers of sliced potatoes for a heartier dish, or mix in some spinach.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat in oven until heated through.'
    }
  ],

  'Easy Asparagus Recipes': [
    {
      title: 'Easy Roasted Asparagus',
      slug: 'easy-roasted-asparagus',
      description: 'Simple roasted asparagus with olive oil, salt, and pepper. The perfect side dish that\'s ready in 15 minutes.',
      ingredients: [
        { name: 'Fresh asparagus', amount: '2 lbs', notes: 'trimmed' },
        { name: 'Olive oil', amount: '3 tablespoons', notes: '' },
        { name: 'Salt', amount: '1 teaspoon', notes: '' },
        { name: 'Black pepper', amount: '1/2 teaspoon', notes: 'freshly ground' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Lemon zest', amount: '1 lemon', notes: '' },
        { name: 'Lemon juice', amount: '2 tablespoons', notes: '' },
        { name: 'Parmesan cheese', amount: '1/4 cup', notes: 'grated, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 425°F (220°C).' },
        { step: 2, instruction: 'Trim tough ends from asparagus spears.' },
        { step: 3, instruction: 'Toss asparagus with olive oil, salt, pepper, and garlic.' },
        { step: 4, instruction: 'Arrange in single layer on baking sheet.' },
        { step: 5, instruction: 'Roast 12-15 minutes until tender and lightly browned.' },
        { step: 6, instruction: 'Sprinkle with lemon zest, juice, and Parmesan before serving.' }
      ],
      prep_time: 5,
      cook_time: 15,
      total_time: 20,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 65,
      seo_title: 'Easy Roasted Asparagus Recipe - Perfect Side Dish',
      seo_description: 'Learn how to roast asparagus perfectly every time. Simple, healthy, and delicious in just 15 minutes.',
      featured_image_url: '/images/recipes/easy-roasted-asparagus.jpg',
      featured_image_alt: 'Golden roasted asparagus spears on baking sheet',
      tips: 'Choose asparagus spears of similar thickness for even cooking.',
      variations: 'Try with balsamic vinegar, almonds, or prosciutto for different flavors.',
      storage_instructions: 'Best served immediately. Leftovers can be stored for 2 days and eaten cold in salads.'
    },
    {
      title: 'Easy Asparagus Soup',
      slug: 'easy-asparagus-soup',
      description: 'Creamy asparagus soup made with fresh asparagus, onions, and cream. Light, elegant, and perfect for spring.',
      ingredients: [
        { name: 'Fresh asparagus', amount: '2 lbs', notes: 'trimmed and chopped' },
        { name: 'Yellow onion', amount: '1 large', notes: 'diced' },
        { name: 'Vegetable broth', amount: '4 cups', notes: '' },
        { name: 'Heavy cream', amount: '1/2 cup', notes: '' },
        { name: 'Butter', amount: '2 tablespoons', notes: '' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Fresh thyme', amount: '1 tablespoon', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Melt butter in large pot over medium heat.' },
        { step: 2, instruction: 'Add onion and cook 5 minutes until softened.' },
        { step: 3, instruction: 'Add garlic and thyme, cook 1 minute more.' },
        { step: 4, instruction: 'Add asparagus and broth, bring to boil.' },
        { step: 5, instruction: 'Simmer 15-20 minutes until asparagus is tender.' },
        { step: 6, instruction: 'Blend until smooth, stir in cream, season with salt and pepper.' }
      ],
      prep_time: 15,
      cook_time: 25,
      total_time: 40,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 145,
      seo_title: 'Easy Asparagus Soup Recipe - Creamy & Fresh',
      seo_description: 'Make delicious asparagus soup with fresh asparagus and cream. Perfect spring soup that\'s light and elegant.',
      featured_image_url: '/images/recipes/easy-asparagus-soup.jpg',
      featured_image_alt: 'Creamy green asparagus soup in white bowl',
      tips: 'Reserve some asparagus tips for garnish before blending.',
      variations: 'Add a splash of white wine when cooking the onions, or top with crispy bacon.',
      storage_instructions: 'Store in refrigerator for up to 3 days. Reheat gently, adding more broth if needed.'
    },
    {
      title: 'Easy Asparagus Stir-Fry',
      slug: 'easy-asparagus-stir-fry',
      description: 'Quick asparagus stir-fry with garlic, ginger, and soy sauce. Ready in 10 minutes and full of fresh flavor.',
      ingredients: [
        { name: 'Fresh asparagus', amount: '1.5 lbs', notes: 'cut into 2-inch pieces' },
        { name: 'Vegetable oil', amount: '2 tablespoons', notes: '' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Fresh ginger', amount: '1 tablespoon', notes: 'minced' },
        { name: 'Soy sauce', amount: '3 tablespoons', notes: 'low sodium' },
        { name: 'Rice vinegar', amount: '1 tablespoon', notes: '' },
        { name: 'Sesame oil', amount: '1 teaspoon', notes: '' },
        { name: 'Red pepper flakes', amount: '1/4 teaspoon', notes: 'optional' },
        { name: 'Sesame seeds', amount: '1 tablespoon', notes: 'for garnish' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat vegetable oil in large wok or skillet over high heat.' },
        { step: 2, instruction: 'Add asparagus pieces and stir-fry 3-4 minutes.' },
        { step: 3, instruction: 'Add garlic and ginger, stir-fry 1 minute more.' },
        { step: 4, instruction: 'Mix soy sauce, rice vinegar, and sesame oil in small bowl.' },
        { step: 5, instruction: 'Add sauce to pan and toss for 1-2 minutes.' },
        { step: 6, instruction: 'Sprinkle with red pepper flakes and sesame seeds before serving.' }
      ],
      prep_time: 10,
      cook_time: 8,
      total_time: 18,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 85,
      seo_title: 'Easy Asparagus Stir-Fry Recipe - Quick & Healthy',
      seo_description: 'Fast asparagus stir-fry with Asian flavors. Ready in under 20 minutes and perfect as a side dish.',
      featured_image_url: '/images/recipes/easy-asparagus-stir-fry.jpg',
      featured_image_alt: 'Bright green asparagus stir-fry in wok',
      tips: 'Keep asparagus crisp-tender for the best texture and color.',
      variations: 'Add bell peppers, snap peas, or mushrooms for more vegetables.',
      storage_instructions: 'Best served immediately. Leftovers can be stored for 2 days but may lose crispness.'
    },
    {
      title: 'Easy Asparagus Risotto',
      slug: 'easy-asparagus-risotto',
      description: 'Creamy asparagus risotto with Parmesan cheese and fresh herbs. Elegant comfort food perfect for dinner.',
      ingredients: [
        { name: 'Arborio rice', amount: '1.5 cups', notes: '' },
        { name: 'Fresh asparagus', amount: '1 lb', notes: 'trimmed and cut into 1-inch pieces' },
        { name: 'Vegetable broth', amount: '6 cups', notes: 'warm' },
        { name: 'White wine', amount: '1/2 cup', notes: 'dry' },
        { name: 'Onion', amount: '1 medium', notes: 'finely diced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Parmesan cheese', amount: '3/4 cup', notes: 'grated' },
        { name: 'Butter', amount: '3 tablespoons', notes: '' },
        { name: 'Olive oil', amount: '2 tablespoons', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Heat oil and 1 tbsp butter in large pan over medium heat.' },
        { step: 2, instruction: 'Add onion and cook 5 minutes until softened.' },
        { step: 3, instruction: 'Add garlic and rice, stir 2 minutes until rice is toasted.' },
        { step: 4, instruction: 'Add wine and stir until absorbed.' },
        { step: 5, instruction: 'Add warm broth one ladle at a time, stirring constantly.' },
        { step: 6, instruction: 'In last 5 minutes, add asparagus. Finish with butter and Parmesan.' }
      ],
      prep_time: 15,
      cook_time: 35,
      total_time: 50,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 385,
      seo_title: 'Easy Asparagus Risotto Recipe - Creamy & Elegant',
      seo_description: 'Learn to make perfect asparagus risotto with step-by-step instructions. Creamy, comforting, and restaurant-quality.',
      featured_image_url: '/images/recipes/easy-asparagus-risotto.jpg',
      featured_image_alt: 'Creamy asparagus risotto in white bowl',
      tips: 'Stir constantly and add broth gradually for the creamiest texture.',
      variations: 'Add lemon zest, peas, or mushrooms for different flavors.',
      storage_instructions: 'Best served immediately. Leftovers can be stored for 2 days and reheated with extra broth.'
    },
    {
      title: 'Easy Asparagus Quiche',
      slug: 'easy-asparagus-quiche',
      description: 'Light and fluffy asparagus quiche with Gruyere cheese and fresh herbs. Perfect for brunch or light dinner.',
      ingredients: [
        { name: 'Pie crust', amount: '1', notes: 'store-bought or homemade' },
        { name: 'Fresh asparagus', amount: '1 lb', notes: 'trimmed and cut into 1-inch pieces' },
        { name: 'Eggs', amount: '6 large', notes: '' },
        { name: 'Heavy cream', amount: '1 cup', notes: '' },
        { name: 'Gruyere cheese', amount: '1 cup', notes: 'grated' },
        { name: 'Green onions', amount: '3', notes: 'chopped' },
        { name: 'Fresh dill', amount: '2 tablespoons', notes: 'chopped' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' },
        { name: 'Nutmeg', amount: 'Pinch', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C). Press pie crust into 9-inch pie pan.' },
        { step: 2, instruction: 'Blanch asparagus in boiling water for 2 minutes, then drain.' },
        { step: 3, instruction: 'Whisk eggs, cream, salt, pepper, and nutmeg in large bowl.' },
        { step: 4, instruction: 'Arrange asparagus and green onions in pie crust.' },
        { step: 5, instruction: 'Pour egg mixture over vegetables, top with cheese and dill.' },
        { step: 6, instruction: 'Bake 35-40 minutes until center is set and golden.' }
      ],
      prep_time: 20,
      cook_time: 40,
      total_time: 60,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 345,
      seo_title: 'Easy Asparagus Quiche Recipe - Perfect for Brunch',
      seo_description: 'Make delicious asparagus quiche with Gruyere cheese and fresh herbs. Ideal for brunch or light dinner.',
      featured_image_url: '/images/recipes/easy-asparagus-quiche.jpg',
      featured_image_alt: 'Golden asparagus quiche slice on plate',
      tips: 'Let quiche cool for 10 minutes before slicing for cleanest cuts.',
      variations: 'Add bacon, ham, or smoked salmon for extra protein.',
      storage_instructions: 'Store covered in refrigerator for up to 3 days. Serve cold or reheat gently.'
    }
  ],

  'Easy Avocado Recipes': [
    {
      title: 'Easy Avocado Toast',
      slug: 'easy-avocado-toast',
      description: 'Perfect avocado toast with ripe avocados, lemon, and seasonings on toasted bread. Simple, healthy, and delicious.',
      ingredients: [
        { name: 'Ripe avocados', amount: '2 large', notes: '' },
        { name: 'Bread slices', amount: '4', notes: 'whole grain or sourdough' },
        { name: 'Lemon juice', amount: '2 tablespoons', notes: 'fresh' },
        { name: 'Sea salt', amount: '1/2 teaspoon', notes: '' },
        { name: 'Black pepper', amount: '1/4 teaspoon', notes: 'freshly ground' },
        { name: 'Red pepper flakes', amount: '1/4 teaspoon', notes: 'optional' },
        { name: 'Extra virgin olive oil', amount: '2 tablespoons', notes: '' },
        { name: 'Everything bagel seasoning', amount: '1 tablespoon', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Toast bread slices until golden brown and crispy.' },
        { step: 2, instruction: 'Cut avocados in half, remove pits, and scoop into bowl.' },
        { step: 3, instruction: 'Mash avocados with lemon juice, salt, and pepper.' },
        { step: 4, instruction: 'Spread avocado mixture evenly on toast slices.' },
        { step: 5, instruction: 'Drizzle with olive oil and sprinkle with red pepper flakes.' },
        { step: 6, instruction: 'Top with everything bagel seasoning if desired and serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 3,
      total_time: 13,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      seo_title: 'Easy Avocado Toast Recipe - Perfect Every Time',
      seo_description: 'Learn how to make the perfect avocado toast with ripe avocados, lemon, and seasonings. Healthy breakfast in 15 minutes.',
      featured_image_url: '/images/recipes/easy-avocado-toast.jpg',
      featured_image_alt: 'Golden toast topped with mashed avocado and seasonings',
      tips: 'Choose avocados that yield slightly to pressure but aren\'t mushy.',
      variations: 'Top with sliced tomatoes, poached eggs, or crumbled feta cheese.',
      storage_instructions: 'Best served immediately to prevent bread from getting soggy.'
    },
    {
      title: 'Easy Guacamole',
      slug: 'easy-guacamole',
      description: 'Classic guacamole recipe with ripe avocados, lime, onion, and cilantro. Perfect for parties and snacking.',
      ingredients: [
        { name: 'Ripe avocados', amount: '4 large', notes: '' },
        { name: 'Lime juice', amount: '3 tablespoons', notes: 'fresh' },
        { name: 'Red onion', amount: '1/4 cup', notes: 'finely diced' },
        { name: 'Roma tomato', amount: '1 medium', notes: 'seeded and diced' },
        { name: 'Fresh cilantro', amount: '2 tablespoons', notes: 'chopped' },
        { name: 'Garlic', amount: '1 clove', notes: 'minced' },
        { name: 'Jalapeño', amount: '1', notes: 'seeded and minced' },
        { name: 'Sea salt', amount: '1/2 teaspoon', notes: '' },
        { name: 'Cumin', amount: '1/4 teaspoon', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Cut avocados in half, remove pits, and scoop into large bowl.' },
        { step: 2, instruction: 'Add lime juice immediately and mash to desired consistency.' },
        { step: 3, instruction: 'Mix in diced onion, tomato, cilantro, and garlic.' },
        { step: 4, instruction: 'Add jalapeño, salt, and cumin if using.' },
        { step: 5, instruction: 'Taste and adjust seasoning with more lime juice or salt.' },
        { step: 6, instruction: 'Serve immediately with tortilla chips or cover tightly.' }
      ],
      prep_time: 15,
      cook_time: 0,
      total_time: 15,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 135,
      seo_title: 'Easy Guacamole Recipe - Classic & Fresh',
      seo_description: 'Make perfect guacamole with ripe avocados, lime, and fresh ingredients. Great for parties and game day!',
      featured_image_url: '/images/recipes/easy-guacamole.jpg',
      featured_image_alt: 'Fresh green guacamole in bowl with tortilla chips',
      tips: 'Save one avocado pit and place in guacamole to help prevent browning.',
      variations: 'Add diced mango, pomegranate seeds, or roasted corn for different flavors.',
      storage_instructions: 'Press plastic wrap directly onto surface of guacamole. Store refrigerated for up to 2 days.'
    },
    {
      title: 'Easy Avocado Smoothie',
      slug: 'easy-avocado-smoothie',
      description: 'Creamy avocado smoothie with banana, spinach, and coconut milk. Healthy green smoothie that tastes amazing.',
      ingredients: [
        { name: 'Ripe avocado', amount: '1 large', notes: '' },
        { name: 'Banana', amount: '1 large', notes: 'frozen' },
        { name: 'Fresh spinach', amount: '2 cups', notes: 'packed' },
        { name: 'Coconut milk', amount: '1 cup', notes: 'canned, full-fat' },
        { name: 'Honey', amount: '2 tablespoons', notes: 'or maple syrup' },
        { name: 'Lime juice', amount: '1 tablespoon', notes: 'fresh' },
        { name: 'Vanilla extract', amount: '1/2 teaspoon', notes: '' },
        { name: 'Ice cubes', amount: '1/2 cup', notes: '' },
        { name: 'Chia seeds', amount: '1 tablespoon', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Add avocado, banana, and spinach to blender.' },
        { step: 2, instruction: 'Pour in coconut milk, honey, lime juice, and vanilla.' },
        { step: 3, instruction: 'Add ice cubes and chia seeds if using.' },
        { step: 4, instruction: 'Blend on high speed for 60-90 seconds until completely smooth.' },
        { step: 5, instruction: 'Taste and adjust sweetness with more honey if needed.' },
        { step: 6, instruction: 'Pour into glasses and serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 0,
      total_time: 10,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 295,
      seo_title: 'Easy Avocado Smoothie Recipe - Creamy & Healthy',
      seo_description: 'Make a delicious green avocado smoothie with banana and spinach. Creamy, nutritious, and surprisingly tasty!',
      featured_image_url: '/images/recipes/easy-avocado-smoothie.jpg',
      featured_image_alt: 'Creamy green avocado smoothie in tall glasses',
      tips: 'Use frozen banana for the creamiest texture and to chill the smoothie.',
      variations: 'Add mango, pineapple, or protein powder for different flavors.',
      storage_instructions: 'Best consumed immediately. Can be refrigerated for up to 24 hours but may separate.'
    },
    {
      title: 'Easy Avocado Pasta',
      slug: 'easy-avocado-pasta',
      description: 'Creamy avocado pasta sauce with garlic, lemon, and basil. Light, healthy, and ready in 20 minutes.',
      ingredients: [
        { name: 'Pasta', amount: '12 oz', notes: 'spaghetti or linguine' },
        { name: 'Ripe avocados', amount: '3 large', notes: '' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Lemon juice', amount: '3 tablespoons', notes: 'fresh' },
        { name: 'Fresh basil', amount: '1/2 cup', notes: 'packed' },
        { name: 'Extra virgin olive oil', amount: '1/4 cup', notes: '' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Cherry tomatoes', amount: '1 cup', notes: 'halved' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook pasta according to package directions until al dente.' },
        { step: 2, instruction: 'While pasta cooks, blend avocados, garlic, lemon juice, and basil.' },
        { step: 3, instruction: 'Add olive oil gradually while blending until smooth.' },
        { step: 4, instruction: 'Season avocado sauce with salt and pepper.' },
        { step: 5, instruction: 'Toss hot drained pasta with avocado sauce.' },
        { step: 6, instruction: 'Add cherry tomatoes and Parmesan, serve immediately.' }
      ],
      prep_time: 15,
      cook_time: 12,
      total_time: 27,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 485,
      seo_title: 'Easy Avocado Pasta Recipe - Creamy & Light',
      seo_description: 'Make creamy avocado pasta with fresh basil and lemon. Healthy, delicious, and ready in under 30 minutes.',
      featured_image_url: '/images/recipes/easy-avocado-pasta.jpg',
      featured_image_alt: 'Creamy green avocado pasta with cherry tomatoes',
      tips: 'Serve immediately to prevent avocado from browning.',
      variations: 'Add grilled chicken, shrimp, or pine nuts for extra protein.',
      storage_instructions: 'Best served immediately. Leftovers can be stored for 1 day but may brown slightly.'
    },
    {
      title: 'Easy Avocado Salad',
      slug: 'easy-avocado-salad',
      description: 'Fresh avocado salad with cucumber, tomatoes, and lime vinaigrette. Light, refreshing, and perfect for summer.',
      ingredients: [
        { name: 'Ripe avocados', amount: '3 large', notes: 'cubed' },
        { name: 'Cucumber', amount: '1 large', notes: 'diced' },
        { name: 'Cherry tomatoes', amount: '2 cups', notes: 'halved' },
        { name: 'Red onion', amount: '1/4 cup', notes: 'thinly sliced' },
        { name: 'Fresh cilantro', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Lime juice', amount: '3 tablespoons', notes: 'fresh' },
        { name: 'Olive oil', amount: '2 tablespoons', notes: 'extra virgin' },
        { name: 'Sea salt', amount: '1/2 teaspoon', notes: '' },
        { name: 'Black pepper', amount: '1/4 teaspoon', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Cut avocados into bite-sized cubes.' },
        { step: 2, instruction: 'Combine avocado, cucumber, tomatoes, and red onion in large bowl.' },
        { step: 3, instruction: 'Whisk together lime juice, olive oil, salt, and pepper.' },
        { step: 4, instruction: 'Pour dressing over salad and gently toss.' },
        { step: 5, instruction: 'Sprinkle with fresh cilantro.' },
        { step: 6, instruction: 'Serve immediately for best color and texture.' }
      ],
      prep_time: 15,
      cook_time: 0,
      total_time: 15,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 195,
      seo_title: 'Easy Avocado Salad Recipe - Fresh & Healthy',
      seo_description: 'Make a refreshing avocado salad with cucumber, tomatoes, and lime. Perfect healthy side dish for any meal.',
      featured_image_url: '/images/recipes/easy-avocado-salad.jpg',
      featured_image_alt: 'Colorful avocado salad with cucumber and tomatoes',
      tips: 'Add dressing just before serving to prevent avocados from browning.',
      variations: 'Add corn, black beans, or feta cheese for different flavors.',
      storage_instructions: 'Best served immediately. Can be stored for a few hours in refrigerator.'
    }
  ],

  'Easy Bacon Recipes': [
    {
      title: 'Easy Perfect Bacon',
      slug: 'easy-perfect-bacon',
      description: 'Learn how to cook perfect bacon every time using the oven method. Crispy, evenly cooked, and mess-free.',
      ingredients: [
        { name: 'Bacon strips', amount: '1 lb', notes: 'thick-cut preferred' },
        { name: 'Black pepper', amount: '1/4 teaspoon', notes: 'freshly ground, optional' },
        { name: 'Brown sugar', amount: '2 tablespoons', notes: 'optional for sweet bacon' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C).' },
        { step: 2, instruction: 'Line large baking sheet with parchment paper.' },
        { step: 3, instruction: 'Arrange bacon strips in single layer without overlapping.' },
        { step: 4, instruction: 'Sprinkle with pepper or brown sugar if desired.' },
        { step: 5, instruction: 'Bake 15-20 minutes until desired crispness is reached.' },
        { step: 6, instruction: 'Transfer to paper towel-lined plate to drain.' }
      ],
      prep_time: 5,
      cook_time: 20,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 185,
      seo_title: 'Easy Perfect Bacon Recipe - Oven Method',
      seo_description: 'Learn the best way to cook bacon in the oven. Crispy, evenly cooked bacon every time with minimal cleanup.',
      featured_image_url: '/images/recipes/easy-perfect-bacon.jpg',
      featured_image_alt: 'Crispy golden bacon strips on parchment paper',
      tips: 'Don\'t flip the bacon - the oven cooks it evenly on both sides.',
      variations: 'Try maple bacon with maple syrup or spicy bacon with cayenne pepper.',
      storage_instructions: 'Store cooked bacon in refrigerator for up to 5 days. Reheat in microwave or oven.'
    },
    {
      title: 'Easy Bacon Mac and Cheese',
      slug: 'easy-bacon-mac-and-cheese',
      description: 'Creamy mac and cheese loaded with crispy bacon pieces. The ultimate comfort food that everyone loves.',
      ingredients: [
        { name: 'Elbow macaroni', amount: '1 lb', notes: '' },
        { name: 'Bacon', amount: '8 slices', notes: 'cooked and crumbled' },
        { name: 'Butter', amount: '4 tablespoons', notes: '' },
        { name: 'All-purpose flour', amount: '1/4 cup', notes: '' },
        { name: 'Whole milk', amount: '3 cups', notes: '' },
        { name: 'Sharp cheddar cheese', amount: '3 cups', notes: 'shredded' },
        { name: 'Cream cheese', amount: '4 oz', notes: 'softened' },
        { name: 'Garlic powder', amount: '1 teaspoon', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook macaroni according to package directions, drain.' },
        { step: 2, instruction: 'Cook bacon until crispy, crumble and set aside.' },
        { step: 3, instruction: 'Melt butter in large pot, whisk in flour and cook 1 minute.' },
        { step: 4, instruction: 'Gradually add milk, whisking until smooth and thickened.' },
        { step: 5, instruction: 'Remove from heat, stir in cheeses until melted.' },
        { step: 6, instruction: 'Add pasta and bacon, season with salt and pepper.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 685,
      seo_title: 'Easy Bacon Mac and Cheese Recipe - Ultimate Comfort Food',
      seo_description: 'Make the best bacon mac and cheese with crispy bacon and creamy cheese sauce. Perfect comfort food for the whole family.',
      featured_image_url: '/images/recipes/easy-bacon-mac-and-cheese.jpg',
      featured_image_alt: 'Creamy mac and cheese with bacon pieces',
      tips: 'Save some bacon pieces to sprinkle on top for extra crunch.',
      variations: 'Add jalapeños for heat or breadcrumbs for a baked version.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Add milk when reheating.'
    },
    {
      title: 'Easy Bacon Wrapped Chicken',
      slug: 'easy-bacon-wrapped-chicken',
      description: 'Juicy chicken breasts wrapped in crispy bacon and seasoned with herbs. Simple yet elegant dinner option.',
      ingredients: [
        { name: 'Chicken breasts', amount: '4', notes: 'boneless, skinless' },
        { name: 'Bacon strips', amount: '8', notes: '' },
        { name: 'Olive oil', amount: '2 tablespoons', notes: '' },
        { name: 'Garlic powder', amount: '1 teaspoon', notes: '' },
        { name: 'Paprika', amount: '1 teaspoon', notes: '' },
        { name: 'Dried thyme', amount: '1 teaspoon', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' },
        { name: 'Brown sugar', amount: '2 tablespoons', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
        { step: 2, instruction: 'Season chicken with salt, pepper, garlic powder, paprika, and thyme.' },
        { step: 3, instruction: 'Wrap each chicken breast with 2 bacon strips.' },
        { step: 4, instruction: 'Secure bacon with toothpicks if needed.' },
        { step: 5, instruction: 'Heat oil in oven-safe skillet, sear chicken 3 minutes per side.' },
        { step: 6, instruction: 'Transfer to oven and bake 20-25 minutes until cooked through.' }
      ],
      prep_time: 15,
      cook_time: 30,
      total_time: 45,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 485,
      seo_title: 'Easy Bacon Wrapped Chicken Recipe - Juicy & Crispy',
      seo_description: 'Make delicious bacon wrapped chicken with herbs and spices. Juicy chicken with crispy bacon in 45 minutes.',
      featured_image_url: '/images/recipes/easy-bacon-wrapped-chicken.jpg',
      featured_image_alt: 'Golden bacon wrapped chicken breasts in skillet',
      tips: 'Use a meat thermometer to ensure chicken reaches 165°F internal temperature.',
      variations: 'Stuff chicken with cream cheese and herbs before wrapping.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat in oven to maintain crispness.'
    },
    {
      title: 'Easy Bacon Carbonara',
      slug: 'easy-bacon-carbonara',
      description: 'Classic carbonara pasta with bacon, eggs, and Parmesan cheese. Creamy, rich, and ready in 20 minutes.',
      ingredients: [
        { name: 'Spaghetti', amount: '1 lb', notes: '' },
        { name: 'Bacon', amount: '6 slices', notes: 'diced' },
        { name: 'Large eggs', amount: '4', notes: '' },
        { name: 'Parmesan cheese', amount: '1 cup', notes: 'grated' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Black pepper', amount: '1 teaspoon', notes: 'freshly ground' },
        { name: 'Salt', amount: 'To taste', notes: '' },
        { name: 'Fresh parsley', amount: '2 tablespoons', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook spaghetti according to package directions, reserve 1 cup pasta water.' },
        { step: 2, instruction: 'Cook bacon in large skillet until crispy.' },
        { step: 3, instruction: 'Add garlic to bacon and cook 1 minute.' },
        { step: 4, instruction: 'Whisk eggs, Parmesan, and pepper in large bowl.' },
        { step: 5, instruction: 'Add hot pasta to egg mixture, tossing quickly to coat.' },
        { step: 6, instruction: 'Add bacon mixture and pasta water as needed, garnish with parsley.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 625,
      seo_title: 'Easy Bacon Carbonara Recipe - Classic Italian Pasta',
      seo_description: 'Make authentic bacon carbonara with eggs and Parmesan. Creamy pasta dish ready in just 25 minutes.',
      featured_image_url: '/images/recipes/easy-bacon-carbonara.jpg',
      featured_image_alt: 'Creamy carbonara pasta with bacon and Parmesan',
      tips: 'Work quickly when adding pasta to eggs to create silky sauce without scrambling.',
      variations: 'Use pancetta instead of bacon for more authentic Italian flavor.',
      storage_instructions: 'Best served immediately. Leftovers can be stored for 2 days but sauce may thicken.'
    },
    {
      title: 'Easy Bacon Brussels Sprouts',
      slug: 'easy-bacon-brussels-sprouts',
      description: 'Roasted Brussels sprouts with crispy bacon and balsamic glaze. A delicious side dish that converts Brussels sprouts haters.',
      ingredients: [
        { name: 'Brussels sprouts', amount: '2 lbs', notes: 'trimmed and halved' },
        { name: 'Bacon', amount: '6 slices', notes: 'chopped' },
        { name: 'Olive oil', amount: '2 tablespoons', notes: '' },
        { name: 'Balsamic vinegar', amount: '3 tablespoons', notes: '' },
        { name: 'Honey', amount: '1 tablespoon', notes: '' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' },
        { name: 'Red pepper flakes', amount: '1/4 teaspoon', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 400°F (200°C).' },
        { step: 2, instruction: 'Toss Brussels sprouts with olive oil, salt, and pepper.' },
        { step: 3, instruction: 'Spread on baking sheet and roast 20 minutes.' },
        { step: 4, instruction: 'Cook bacon in skillet until crispy, add garlic.' },
        { step: 5, instruction: 'Mix balsamic vinegar and honey in small bowl.' },
        { step: 6, instruction: 'Toss roasted sprouts with bacon and balsamic mixture.' }
      ],
      prep_time: 15,
      cook_time: 25,
      total_time: 40,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 165,
      seo_title: 'Easy Bacon Brussels Sprouts Recipe - Crispy & Delicious',
      seo_description: 'Make irresistible Brussels sprouts with bacon and balsamic glaze. Perfect side dish that everyone will love.',
      featured_image_url: '/images/recipes/easy-bacon-brussels-sprouts.jpg',
      featured_image_alt: 'Golden roasted Brussels sprouts with crispy bacon',
      tips: 'Don\'t overcrowd the pan - Brussels sprouts need space to caramelize properly.',
      variations: 'Add dried cranberries or chopped pecans for extra flavor and texture.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat in oven for best texture.'
    }
  ],

  'Easy Banana Recipes': [
    {
      title: 'Easy Banana Bread',
      slug: 'easy-banana-bread',
      description: 'Moist and delicious banana bread made with overripe bananas. Perfect for breakfast or an afternoon snack.',
      ingredients: [
        { name: 'Ripe bananas', amount: '3 large', notes: 'mashed' },
        { name: 'All-purpose flour', amount: '1.75 cups', notes: '' },
        { name: 'Sugar', amount: '3/4 cup', notes: '' },
        { name: 'Butter', amount: '1/3 cup', notes: 'melted' },
        { name: 'Egg', amount: '1 large', notes: 'beaten' },
        { name: 'Vanilla extract', amount: '1 teaspoon', notes: '' },
        { name: 'Baking soda', amount: '1 teaspoon', notes: '' },
        { name: 'Salt', amount: '1/2 teaspoon', notes: '' },
        { name: 'Walnuts', amount: '1/2 cup', notes: 'chopped, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease 9x5 inch loaf pan.' },
        { step: 2, instruction: 'Mix flour, baking soda, and salt in large bowl.' },
        { step: 3, instruction: 'In separate bowl, mash bananas until smooth.' },
        { step: 4, instruction: 'Stir melted butter, sugar, egg, and vanilla into bananas.' },
        { step: 5, instruction: 'Add banana mixture to flour mixture, stir until just combined.' },
        { step: 6, instruction: 'Pour into prepared pan, bake 60-65 minutes until toothpick comes out clean.' }
      ],
      prep_time: 15,
      cook_time: 65,
      total_time: 80,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 245,
      seo_title: 'Easy Banana Bread Recipe - Moist & Delicious',
      seo_description: 'Make perfect banana bread with overripe bananas. Moist, sweet, and ready in just over an hour.',
      featured_image_url: '/images/recipes/easy-banana-bread.jpg',
      featured_image_alt: 'Sliced banana bread on cutting board',
      tips: 'The riper the bananas, the sweeter and more flavorful your bread will be.',
      variations: 'Add chocolate chips, blueberries, or cinnamon for different flavors.',
      storage_instructions: 'Store wrapped at room temperature for up to 3 days or freeze for up to 3 months.'
    },
    {
      title: 'Easy Banana Pancakes',
      slug: 'easy-banana-pancakes',
      description: 'Fluffy banana pancakes made with fresh bananas and warm spices. Perfect weekend breakfast for the family.',
      ingredients: [
        { name: 'All-purpose flour', amount: '1.5 cups', notes: '' },
        { name: 'Sugar', amount: '2 tablespoons', notes: '' },
        { name: 'Baking powder', amount: '2 teaspoons', notes: '' },
        { name: 'Salt', amount: '1/2 teaspoon', notes: '' },
        { name: 'Cinnamon', amount: '1/2 teaspoon', notes: '' },
        { name: 'Milk', amount: '1.25 cups', notes: '' },
        { name: 'Ripe banana', amount: '1 large', notes: 'mashed' },
        { name: 'Egg', amount: '1 large', notes: '' },
        { name: 'Butter', amount: '3 tablespoons', notes: 'melted' },
        { name: 'Vanilla extract', amount: '1 teaspoon', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Whisk together flour, sugar, baking powder, salt, and cinnamon.' },
        { step: 2, instruction: 'In separate bowl, combine milk, mashed banana, egg, melted butter, and vanilla.' },
        { step: 3, instruction: 'Add wet ingredients to dry ingredients, stir until just combined.' },
        { step: 4, instruction: 'Heat griddle or large skillet over medium heat.' },
        { step: 5, instruction: 'Pour 1/4 cup batter for each pancake onto hot griddle.' },
        { step: 6, instruction: 'Cook until bubbles form on surface, flip and cook until golden brown.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      seo_title: 'Easy Banana Pancakes Recipe - Fluffy & Delicious',
      seo_description: 'Make fluffy banana pancakes with fresh bananas and cinnamon. Perfect family breakfast ready in 25 minutes.',
      featured_image_url: '/images/recipes/easy-banana-pancakes.jpg',
      featured_image_alt: 'Stack of fluffy banana pancakes with syrup',
      tips: 'Don\'t overmix the batter - lumps are okay and will make fluffier pancakes.',
      variations: 'Add chocolate chips, blueberries, or chopped walnuts to the batter.',
      storage_instructions: 'Store leftover pancakes in refrigerator for up to 3 days. Reheat in toaster or microwave.'
    },
    {
      title: 'Easy Banana Smoothie',
      slug: 'easy-banana-smoothie',
      description: 'Creamy banana smoothie with yogurt and honey. Healthy and refreshing drink perfect for breakfast or snack.',
      ingredients: [
        { name: 'Ripe bananas', amount: '2 large', notes: 'frozen for thicker smoothie' },
        { name: 'Greek yogurt', amount: '1 cup', notes: 'vanilla or plain' },
        { name: 'Milk', amount: '1/2 cup', notes: 'dairy or non-dairy' },
        { name: 'Honey', amount: '2 tablespoons', notes: 'or maple syrup' },
        { name: 'Vanilla extract', amount: '1/2 teaspoon', notes: '' },
        { name: 'Cinnamon', amount: '1/4 teaspoon', notes: '' },
        { name: 'Ice cubes', amount: '1/2 cup', notes: 'if using fresh bananas' },
        { name: 'Peanut butter', amount: '1 tablespoon', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Add bananas, yogurt, milk, and honey to blender.' },
        { step: 2, instruction: 'Add vanilla, cinnamon, and peanut butter if using.' },
        { step: 3, instruction: 'Add ice cubes if using fresh bananas.' },
        { step: 4, instruction: 'Blend on high speed for 60-90 seconds until completely smooth.' },
        { step: 5, instruction: 'Taste and adjust sweetness with more honey if needed.' },
        { step: 6, instruction: 'Pour into glasses and serve immediately.' }
      ],
      prep_time: 5,
      cook_time: 0,
      total_time: 5,
      servings: 2,
      difficulty: 'easy',
      calories_per_serving: 215,
      seo_title: 'Easy Banana Smoothie Recipe - Creamy & Healthy',
      seo_description: 'Make a delicious banana smoothie with yogurt and honey. Healthy breakfast or snack ready in 5 minutes.',
      featured_image_url: '/images/recipes/easy-banana-smoothie.jpg',
      featured_image_alt: 'Creamy banana smoothie in tall glasses',
      tips: 'Freeze ripe bananas ahead of time for the creamiest texture.',
      variations: 'Add berries, spinach, or protein powder for different flavors and nutrition.',
      storage_instructions: 'Best consumed immediately. Can be refrigerated for up to 24 hours but may separate.'
    },
    {
      title: 'Easy Banana Muffins',
      slug: 'easy-banana-muffins',
      description: 'Tender banana muffins with warm spices. Perfect for breakfast, lunch boxes, or afternoon treats.',
      ingredients: [
        { name: 'All-purpose flour', amount: '1.75 cups', notes: '' },
        { name: 'Baking soda', amount: '1 teaspoon', notes: '' },
        { name: 'Salt', amount: '1/2 teaspoon', notes: '' },
        { name: 'Cinnamon', amount: '1/2 teaspoon', notes: '' },
        { name: 'Ripe bananas', amount: '3 large', notes: 'mashed' },
        { name: 'Sugar', amount: '3/4 cup', notes: '' },
        { name: 'Butter', amount: '1/3 cup', notes: 'melted' },
        { name: 'Egg', amount: '1 large', notes: '' },
        { name: 'Vanilla extract', amount: '1 teaspoon', notes: '' },
        { name: 'Chocolate chips', amount: '1/2 cup', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Line muffin tin with paper liners.' },
        { step: 2, instruction: 'Whisk together flour, baking soda, salt, and cinnamon.' },
        { step: 3, instruction: 'In separate bowl, mash bananas until smooth.' },
        { step: 4, instruction: 'Stir sugar, melted butter, egg, and vanilla into bananas.' },
        { step: 5, instruction: 'Add banana mixture to flour mixture, stir until just combined.' },
        { step: 6, instruction: 'Divide batter among muffin cups, bake 18-22 minutes until golden.' }
      ],
      prep_time: 15,
      cook_time: 22,
      total_time: 37,
      servings: 12,
      difficulty: 'easy',
      calories_per_serving: 185,
      seo_title: 'Easy Banana Muffins Recipe - Tender & Moist',
      seo_description: 'Bake delicious banana muffins with warm spices. Perfect for breakfast or snacks, ready in under 40 minutes.',
      featured_image_url: '/images/recipes/easy-banana-muffins.jpg',
      featured_image_alt: 'Golden banana muffins in paper liners',
      tips: 'Fill muffin cups about 2/3 full for perfectly shaped muffins.',
      variations: 'Add nuts, dried fruit, or different spices like nutmeg or cardamom.',
      storage_instructions: 'Store in airtight container for up to 3 days or freeze for up to 3 months.'
    },
    {
      title: 'Easy Banana Foster',
      slug: 'easy-banana-foster',
      description: 'Classic Bananas Foster with caramelized bananas in rum sauce. Elegant dessert that\'s surprisingly easy to make.',
      ingredients: [
        { name: 'Ripe bananas', amount: '4 large', notes: 'sliced diagonally' },
        { name: 'Butter', amount: '4 tablespoons', notes: '' },
        { name: 'Brown sugar', amount: '1/2 cup', notes: 'packed' },
        { name: 'Heavy cream', amount: '1/4 cup', notes: '' },
        { name: 'Dark rum', amount: '1/4 cup', notes: '' },
        { name: 'Vanilla extract', amount: '1 teaspoon', notes: '' },
        { name: 'Cinnamon', amount: '1/2 teaspoon', notes: '' },
        { name: 'Vanilla ice cream', amount: '4 scoops', notes: 'for serving' },
        { name: 'Pinch of salt', amount: '', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Melt butter in large skillet over medium heat.' },
        { step: 2, instruction: 'Add brown sugar and cook 2-3 minutes until melted.' },
        { step: 3, instruction: 'Stir in cream, cinnamon, and salt.' },
        { step: 4, instruction: 'Add banana slices and cook 2-3 minutes.' },
        { step: 5, instruction: 'Remove from heat, add rum and vanilla, return to heat briefly.' },
        { step: 6, instruction: 'Serve immediately over vanilla ice cream.' }
      ],
      prep_time: 10,
      cook_time: 10,
      total_time: 20,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      seo_title: 'Easy Bananas Foster Recipe - Classic Dessert',
      seo_description: 'Make restaurant-quality Bananas Foster at home. Caramelized bananas in rum sauce over ice cream.',
      featured_image_url: '/images/recipes/easy-banana-foster.jpg',
      featured_image_alt: 'Caramelized bananas in skillet with ice cream',
      tips: 'Use bananas that are ripe but still firm so they hold their shape.',
      variations: 'Serve over pound cake, waffles, or French toast instead of ice cream.',
      storage_instructions: 'Best served immediately while warm. Sauce can be made ahead and reheated gently.'
    }
  ],

  'Easy Beef Recipes': [
    {
      title: 'Easy Beef Tacos',
      slug: 'easy-beef-tacos',
      description: 'Quick and flavorful ground beef tacos with homemade seasoning. Perfect weeknight dinner the whole family will love.',
      ingredients: [
        { name: 'Ground beef', amount: '1 lb', notes: '80/20 lean' },
        { name: 'Taco shells', amount: '8', notes: 'hard or soft' },
        { name: 'Onion', amount: '1 medium', notes: 'diced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Chili powder', amount: '2 tablespoons', notes: '' },
        { name: 'Cumin', amount: '1 teaspoon', notes: '' },
        { name: 'Paprika', amount: '1 teaspoon', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' },
        { name: 'Beef broth', amount: '1/2 cup', notes: '' },
        { name: 'Taco toppings', amount: 'As desired', notes: 'cheese, lettuce, tomatoes, sour cream' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook ground beef in large skillet over medium-high heat.' },
        { step: 2, instruction: 'Add onion and garlic, cook until onion is softened.' },
        { step: 3, instruction: 'Add chili powder, cumin, paprika, salt, and pepper.' },
        { step: 4, instruction: 'Stir in beef broth and simmer 5 minutes until thickened.' },
        { step: 5, instruction: 'Warm taco shells according to package directions.' },
        { step: 6, instruction: 'Fill shells with beef mixture and desired toppings.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      seo_title: 'Easy Beef Tacos Recipe - Quick & Flavorful',
      seo_description: 'Make delicious ground beef tacos with homemade seasoning. Quick weeknight dinner ready in 25 minutes.',
      featured_image_url: '/images/recipes/easy-beef-tacos.jpg',
      featured_image_alt: 'Colorful beef tacos with fresh toppings',
      tips: 'Drain excess fat from ground beef for healthier tacos.',
      variations: 'Use ground turkey or chicken for a lighter version.',
      storage_instructions: 'Store leftover beef mixture in refrigerator for up to 3 days. Reheat before serving.'
    },
    {
      title: 'Easy Beef Stir-Fry',
      slug: 'easy-beef-stir-fry',
      description: 'Quick beef stir-fry with colorful vegetables and savory sauce. Healthy dinner ready in 20 minutes.',
      ingredients: [
        { name: 'Beef sirloin', amount: '1 lb', notes: 'sliced thin against grain' },
        { name: 'Vegetable oil', amount: '3 tablespoons', notes: 'divided' },
        { name: 'Bell peppers', amount: '2', notes: 'sliced' },
        { name: 'Broccoli florets', amount: '2 cups', notes: '' },
        { name: 'Carrots', amount: '2', notes: 'sliced diagonally' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tablespoon', notes: 'minced' },
        { name: 'Soy sauce', amount: '1/4 cup', notes: 'low sodium' },
        { name: 'Oyster sauce', amount: '2 tablespoons', notes: '' },
        { name: 'Cornstarch', amount: '1 tablespoon', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Toss beef with cornstarch, salt, and pepper.' },
        { step: 2, instruction: 'Heat 2 tbsp oil in wok or large skillet over high heat.' },
        { step: 3, instruction: 'Stir-fry beef 2-3 minutes until browned, remove.' },
        { step: 4, instruction: 'Add remaining oil, stir-fry vegetables 3-4 minutes.' },
        { step: 5, instruction: 'Add garlic and ginger, cook 30 seconds.' },
        { step: 6, instruction: 'Return beef to pan, add sauces, toss for 1 minute.' }
      ],
      prep_time: 15,
      cook_time: 10,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 295,
      seo_title: 'Easy Beef Stir-Fry Recipe - Quick & Healthy',
      seo_description: 'Make delicious beef stir-fry with colorful vegetables. Healthy dinner ready in just 25 minutes.',
      featured_image_url: '/images/recipes/easy-beef-stir-fry.jpg',
      featured_image_alt: 'Colorful beef stir-fry in wok with vegetables',
      tips: 'Slice beef very thin against the grain for tender results.',
      variations: 'Use any vegetables you have on hand - snap peas, mushrooms, or bok choy work great.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat in skillet or microwave.'
    },
    {
      title: 'Easy Beef Burgers',
      slug: 'easy-beef-burgers',
      description: 'Juicy homemade beef burgers with simple seasonings. Perfect for grilling or cooking on the stovetop.',
      ingredients: [
        { name: 'Ground beef', amount: '1.5 lbs', notes: '80/20 lean' },
        { name: 'Burger buns', amount: '6', notes: '' },
        { name: 'Salt', amount: '1 teaspoon', notes: '' },
        { name: 'Black pepper', amount: '1/2 teaspoon', notes: '' },
        { name: 'Garlic powder', amount: '1/2 teaspoon', notes: '' },
        { name: 'Onion powder', amount: '1/2 teaspoon', notes: '' },
        { name: 'Worcestershire sauce', amount: '1 tablespoon', notes: '' },
        { name: 'Olive oil', amount: '1 tablespoon', notes: 'for cooking' },
        { name: 'Cheese slices', amount: '6', notes: 'optional' },
        { name: 'Burger toppings', amount: 'As desired', notes: 'lettuce, tomato, onion, pickles' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix ground beef with salt, pepper, garlic powder, onion powder, and Worcestershire.' },
        { step: 2, instruction: 'Form mixture into 6 patties, slightly larger than buns.' },
        { step: 3, instruction: 'Make small indent in center of each patty.' },
        { step: 4, instruction: 'Heat oil in large skillet or grill pan over medium-high heat.' },
        { step: 5, instruction: 'Cook burgers 4-5 minutes per side for medium doneness.' },
        { step: 6, instruction: 'Add cheese in last minute if using, serve on buns with toppings.' }
      ],
      prep_time: 15,
      cook_time: 10,
      total_time: 25,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 445,
      seo_title: 'Easy Beef Burgers Recipe - Juicy & Flavorful',
      seo_description: 'Make perfect homemade beef burgers with simple seasonings. Juicy, flavorful, and better than store-bought.',
      featured_image_url: '/images/recipes/easy-beef-burgers.jpg',
      featured_image_alt: 'Juicy beef burgers on grill with melted cheese',
      tips: 'Don\'t press down on burgers while cooking - this squeezes out the juices.',
      variations: 'Add diced onions, cheese, or herbs to the meat mixture for different flavors.',
      storage_instructions: 'Cook burgers fresh for best quality. Raw patties can be refrigerated for 1 day or frozen for 3 months.'
    },
    {
      title: 'Easy Beef and Rice',
      slug: 'easy-beef-and-rice',
      description: 'One-pot beef and rice dinner with vegetables and seasonings. Comfort food that\'s easy and satisfying.',
      ingredients: [
        { name: 'Ground beef', amount: '1 lb', notes: '80/20 lean' },
        { name: 'Long grain rice', amount: '1 cup', notes: 'uncooked' },
        { name: 'Beef broth', amount: '2 cups', notes: '' },
        { name: 'Onion', amount: '1 medium', notes: 'diced' },
        { name: 'Bell pepper', amount: '1', notes: 'diced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Diced tomatoes', amount: '1 can (14.5 oz)', notes: 'drained' },
        { name: 'Worcestershire sauce', amount: '2 tablespoons', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' },
        { name: 'Shredded cheese', amount: '1 cup', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Brown ground beef in large skillet over medium-high heat.' },
        { step: 2, instruction: 'Add onion, bell pepper, and garlic, cook 5 minutes.' },
        { step: 3, instruction: 'Stir in rice, beef broth, tomatoes, and Worcestershire sauce.' },
        { step: 4, instruction: 'Bring to boil, then reduce heat and cover.' },
        { step: 5, instruction: 'Simmer 18-20 minutes until rice is tender.' },
        { step: 6, instruction: 'Let stand 5 minutes, fluff with fork, top with cheese if desired.' }
      ],
      prep_time: 10,
      cook_time: 30,
      total_time: 40,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 325,
      seo_title: 'Easy Beef and Rice Recipe - One-Pot Dinner',
      seo_description: 'Make easy beef and rice in one pot with vegetables and seasonings. Comfort food ready in 40 minutes.',
      featured_image_url: '/images/recipes/easy-beef-and-rice.jpg',
      featured_image_alt: 'Hearty beef and rice dish in skillet',
      tips: 'Don\'t lift the lid while rice is cooking - this releases steam needed for cooking.',
      variations: 'Add frozen corn, peas, or other vegetables for extra nutrition.',
      storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Add a splash of broth when reheating.'
    },
    {
      title: 'Easy Beef Meatballs',
      slug: 'easy-beef-meatballs',
      description: 'Tender beef meatballs in rich tomato sauce. Perfect for spaghetti, subs, or eating on their own.',
      ingredients: [
        { name: 'Ground beef', amount: '1 lb', notes: '80/20 lean' },
        { name: 'Breadcrumbs', amount: '1/2 cup', notes: 'Italian seasoned' },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Egg', amount: '1 large', notes: 'beaten' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Italian seasoning', amount: '1 teaspoon', notes: '' },
        { name: 'Marinara sauce', amount: '3 cups', notes: '' },
        { name: 'Olive oil', amount: '2 tablespoons', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' },
        { name: 'Fresh basil', amount: '2 tablespoons', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, instruction: 'Mix ground beef, breadcrumbs, Parmesan, egg, garlic, and seasonings.' },
        { step: 2, instruction: 'Form mixture into 20 meatballs, about 1.5 inches each.' },
        { step: 3, instruction: 'Heat oil in large skillet over medium-high heat.' },
        { step: 4, instruction: 'Brown meatballs on all sides, about 8 minutes total.' },
        { step: 5, instruction: 'Add marinara sauce, bring to simmer.' },
        { step: 6, instruction: 'Cover and cook 15 minutes until cooked through, garnish with basil.' }
      ],
      prep_time: 20,
      cook_time: 25,
      total_time: 45,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      seo_title: 'Easy Beef Meatballs Recipe - Tender & Flavorful',
      seo_description: 'Make delicious beef meatballs in tomato sauce. Perfect for pasta, subs, or appetizers.',
      featured_image_url: '/images/recipes/easy-beef-meatballs.jpg',
      featured_image_alt: 'Tender beef meatballs in rich tomato sauce',
      tips: 'Don\'t overmix the meat mixture - this can make meatballs tough.',
      variations: 'Use a mix of beef and pork for extra flavor, or add herbs like oregano and basil.',
      storage_instructions: 'Store in refrigerator for up to 3 days or freeze for up to 3 months.'
    }
  ],

  'Easy Beef Stew Recipes': [
    {
      title: 'Easy Classic Beef Stew',
      slug: 'easy-classic-beef-stew',
      description: 'Traditional beef stew with tender beef, potatoes, and vegetables in rich gravy. Perfect comfort food for cold days.',
      ingredients: [
        { name: 'Beef stew meat', amount: '2 lbs', notes: 'cut into 2-inch pieces' },
        { name: 'Potatoes', amount: '3 large', notes: 'cubed' },
        { name: 'Carrots', amount: '4 large', notes: 'sliced' },
        { name: 'Celery stalks', amount: '3', notes: 'chopped' },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Beef broth', amount: '4 cups', notes: '' },
        { name: 'Tomato paste', amount: '2 tablespoons', notes: '' },
        { name: 'Worcestershire sauce', amount: '2 tablespoons', notes: '' },
        { name: 'Fresh thyme', amount: '2 tablespoons', notes: '' },
        { name: 'Bay leaves', amount: '2', notes: '' },
        { name: 'Flour', amount: '1/4 cup', notes: 'for thickening' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Season beef with salt and pepper, brown in large pot.' },
        { step: 2, instruction: 'Remove beef, add onion and garlic to pot.' },
        { step: 3, instruction: 'Add tomato paste, cook 1 minute, then add beef back.' },
        { step: 4, instruction: 'Add broth, Worcestershire, thyme, and bay leaves.' },
        { step: 5, instruction: 'Simmer covered 1.5 hours, add vegetables, cook 45 minutes more.' },
        { step: 6, instruction: 'Mix flour with water, stir in to thicken, cook 10 minutes.' }
      ],
      prep_time: 20,
      cook_time: 150,
      total_time: 170,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 385,
      seo_title: 'Easy Classic Beef Stew Recipe - Hearty & Comforting',
      seo_description: 'Make traditional beef stew with tender beef and vegetables. Perfect comfort food for cold weather.',
      featured_image_url: '/images/recipes/easy-classic-beef-stew.jpg',
      featured_image_alt: 'Hearty beef stew with vegetables in bowl',
      tips: 'Brown the beef well for maximum flavor in the stew.',
      variations: 'Add mushrooms, parsnips, or turnips for different vegetables.',
      storage_instructions: 'Store in refrigerator for up to 3 days or freeze for up to 3 months.'
    },
    {
      title: 'Easy Slow Cooker Beef Stew',
      slug: 'easy-slow-cooker-beef-stew',
      description: 'Set-and-forget beef stew made in the slow cooker. Tender beef and vegetables with minimal effort.',
      ingredients: [
        { name: 'Beef stew meat', amount: '2 lbs', notes: 'cut into chunks' },
        { name: 'Baby potatoes', amount: '1.5 lbs', notes: 'halved' },
        { name: 'Carrots', amount: '1 lb', notes: 'cut into chunks' },
        { name: 'Celery', amount: '3 stalks', notes: 'chopped' },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Beef broth', amount: '3 cups', notes: '' },
        { name: 'Tomato paste', amount: '3 tablespoons', notes: '' },
        { name: 'Red wine', amount: '1/2 cup', notes: 'optional' },
        { name: 'Italian seasoning', amount: '2 teaspoons', notes: '' },
        { name: 'Paprika', amount: '1 teaspoon', notes: '' },
        { name: 'Cornstarch', amount: '3 tablespoons', notes: '' },
        { name: 'Water', amount: '3 tablespoons', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Add beef, potatoes, carrots, celery, and onion to slow cooker.' },
        { step: 2, instruction: 'Mix broth, tomato paste, wine, and seasonings.' },
        { step: 3, instruction: 'Pour liquid mixture over ingredients in slow cooker.' },
        { step: 4, instruction: 'Cook on low 7-8 hours or high 3-4 hours.' },
        { step: 5, instruction: 'Mix cornstarch and water, stir into stew.' },
        { step: 6, instruction: 'Cook 15 minutes more until thickened.' }
      ],
      prep_time: 15,
      cook_time: 480,
      total_time: 495,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 365,
      seo_title: 'Easy Slow Cooker Beef Stew Recipe - Set & Forget',
      seo_description: 'Make perfect beef stew in the slow cooker. Tender, flavorful, and requires minimal effort.',
      featured_image_url: '/images/recipes/easy-slow-cooker-beef-stew.jpg',
      featured_image_alt: 'Tender slow cooker beef stew with vegetables',
      tips: 'Don\'t lift the lid during cooking - this releases heat and extends cooking time.',
      variations: 'Add mushrooms, peas, or different root vegetables.',
      storage_instructions: 'Store in refrigerator for up to 4 days or freeze for up to 6 months.'
    },
    {
      title: 'Easy Irish Beef Stew',
      slug: 'easy-irish-beef-stew',
      description: 'Traditional Irish beef stew with Guinness beer, creating rich flavor and tender meat. Authentic comfort food.',
      ingredients: [
        { name: 'Beef chuck roast', amount: '3 lbs', notes: 'cut into 2-inch pieces' },
        { name: 'Guinness beer', amount: '1 bottle (12 oz)', notes: '' },
        { name: 'Beef stock', amount: '2 cups', notes: '' },
        { name: 'Potatoes', amount: '2 lbs', notes: 'quartered' },
        { name: 'Carrots', amount: '1 lb', notes: 'cut into chunks' },
        { name: 'Onions', amount: '2 large', notes: 'sliced' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Tomato paste', amount: '2 tablespoons', notes: '' },
        { name: 'Fresh thyme', amount: '3 sprigs', notes: '' },
        { name: 'Bay leaves', amount: '2', notes: '' },
        { name: 'Flour', amount: '1/4 cup', notes: 'for coating' },
        { name: 'Butter', amount: '2 tablespoons', notes: '' },
        { name: 'Salt and pepper', amount: 'To taste', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Toss beef with flour, salt, and pepper.' },
        { step: 2, instruction: 'Brown beef in batches in large Dutch oven.' },
        { step: 3, instruction: 'Add onions and garlic, cook until softened.' },
        { step: 4, instruction: 'Add tomato paste, beer, stock, thyme, and bay leaves.' },
        { step: 5, instruction: 'Simmer covered 1.5 hours, add vegetables, cook 45 minutes more.' },
        { step: 6, instruction: 'Remove bay leaves and thyme sprigs, adjust seasoning.' }
      ],
      prep_time: 25,
      cook_time: 165,
      total_time: 190,
      servings: 8,
      difficulty: 'medium',
      calories_per_serving: 425,
      seo_title: 'Easy Irish Beef Stew Recipe - With Guinness Beer',
      seo_description: 'Make authentic Irish beef stew with Guinness beer. Rich, hearty, and full of traditional Irish flavors.',
      featured_image_url: '/images/recipes/easy-irish-beef-stew.jpg',
      featured_image_alt: 'Rich Irish beef stew with Guinness in bowl',
      tips: 'Let the beer cook down to concentrate the flavors and remove some alcohol.',
      variations: 'Add parsnips or turnips for authentic Irish vegetables.',
      storage_instructions: 'Improves with time - store in refrigerator for up to 4 days.'
    },
    {
      title: 'Easy Beef and Mushroom Stew',
      slug: 'easy-beef-and-mushroom-stew',
      description: 'Rich beef stew with mushrooms and herbs. Earthy flavors and tender meat make this a satisfying meal.',
      ingredients: [
        { name: 'Beef stew meat', amount: '2 lbs', notes: 'cut into chunks' },
        { name: 'Mixed mushrooms', amount: '1 lb', notes: 'sliced (cremini, shiitake)' },
        { name: 'Potatoes', amount: '1.5 lbs', notes: 'cubed' },
        { name: 'Carrots', amount: '3 large', notes: 'sliced' },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { name: 'Beef broth', amount: '4 cups', notes: '' },
        { name: 'Red wine', amount: '1 cup', notes: 'dry' },
        { name: 'Tomato paste', amount: '2 tablespoons', notes: '' },
        { name: 'Fresh rosemary', amount: '2 sprigs', notes: '' },
        { name: 'Fresh thyme', amount: '3 sprigs', notes: '' },
        { name: 'Flour', amount: '1/4 cup', notes: '' },
        { name: 'Olive oil', amount: '3 tablespoons', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Toss beef with flour, salt, and pepper.' },
        { step: 2, instruction: 'Brown beef in oil in large pot, remove.' },
        { step: 3, instruction: 'Sauté mushrooms until golden, remove.' },
        { step: 4, instruction: 'Cook onion and garlic, add tomato paste.' },
        { step: 5, instruction: 'Add wine, broth, herbs, beef. Simmer 1.5 hours.' },
        { step: 6, instruction: 'Add vegetables and mushrooms, cook 45 minutes more.' }
      ],
      prep_time: 25,
      cook_time: 150,
      total_time: 175,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 395,
      seo_title: 'Easy Beef and Mushroom Stew Recipe - Rich & Earthy',
      seo_description: 'Make delicious beef and mushroom stew with herbs and wine. Rich, earthy flavors in every bite.',
      featured_image_url: '/images/recipes/easy-beef-and-mushroom-stew.jpg',
      featured_image_alt: 'Rich beef and mushroom stew with herbs',
      tips: 'Sauté mushrooms separately to prevent them from releasing too much water.',
      variations: 'Use different mushroom varieties for more complex flavors.',
      storage_instructions: 'Store in refrigerator for up to 3 days. Flavors improve overnight.'
    },
    {
      title: 'Easy Beef Stew with Dumplings',
      slug: 'easy-beef-stew-with-dumplings',
      description: 'Classic beef stew topped with fluffy homemade dumplings. Complete comfort meal in one pot.',
      ingredients: [
        { name: 'Beef stew meat', amount: '2 lbs', notes: 'cut into pieces' },
        { name: 'Potatoes', amount: '3 medium', notes: 'cubed' },
        { name: 'Carrots', amount: '4', notes: 'sliced' },
        { name: 'Celery', amount: '3 stalks', notes: 'chopped' },
        { name: 'Onion', amount: '1 large', notes: 'diced' },
        { name: 'Beef broth', amount: '4 cups', notes: '' },
        { name: 'All-purpose flour', amount: '2 cups', notes: 'divided' },
        { name: 'Baking powder', amount: '1 tablespoon', notes: '' },
        { name: 'Salt', amount: '1 teaspoon', notes: 'divided' },
        { name: 'Milk', amount: '3/4 cup', notes: '' },
        { name: 'Butter', amount: '3 tablespoons', notes: 'melted' },
        { name: 'Fresh parsley', amount: '2 tablespoons', notes: 'chopped' },
        { name: 'Vegetable oil', amount: '2 tablespoons', notes: '' }
      ],
      instructions: [
        { step: 1, instruction: 'Toss beef with 1/4 cup flour, brown in oil in large pot.' },
        { step: 2, instruction: 'Add onion, cook until softened.' },
        { step: 3, instruction: 'Add broth, bring to boil, cover and simmer 1.5 hours.' },
        { step: 4, instruction: 'Add vegetables, cook 30 minutes more.' },
        { step: 5, instruction: 'Mix remaining flour, baking powder, salt, milk, and butter for dumplings.' },
        { step: 6, instruction: 'Drop dumpling batter on stew, cover and cook 15 minutes.' }
      ],
      prep_time: 20,
      cook_time: 135,
      total_time: 155,
      servings: 6,
      difficulty: 'medium',
      calories_per_serving: 465,
      seo_title: 'Easy Beef Stew with Dumplings Recipe - Complete Comfort Meal',
      seo_description: 'Make hearty beef stew topped with fluffy dumplings. Ultimate comfort food in one pot.',
      featured_image_url: '/images/recipes/easy-beef-stew-with-dumplings.jpg',
      featured_image_alt: 'Beef stew topped with fluffy dumplings',
      tips: 'Don\'t lift the lid while dumplings cook - they need steam to become fluffy.',
      variations: 'Add herbs like thyme or rosemary to the dumpling mixture.',
      storage_instructions: 'Best eaten fresh. Store stew and dumplings separately if needed.'
    }
  ]
};

async function createExtendedRecipes() {
  console.log('🍳 Creating Extended Recipe Collections...');

  for (const [categoryName, recipes] of Object.entries(recipeCollections)) {
    console.log(`\n📂 Creating ${categoryName}...`);

    // Create or get category
    let { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('slug', categoryName.toLowerCase().replace(/\s+/g, '-'))
      .single();

    if (categoryError || !category) {
      const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `Delicious and easy ${categoryName.toLowerCase()} for every meal.`,
          seo_title: `${categoryName} - Quick & Delicious Recipes`,
          seo_description: `Discover amazing ${categoryName.toLowerCase()} with step-by-step instructions. Perfect for beginners and experienced cooks.`
        })
        .select('id')
        .single();

      if (createError) {
        console.error(`Error creating category ${categoryName}:`, createError);
        continue;
      }
      category = newCategory;
    }

    // Insert recipes
    for (const recipe of recipes) {
      console.log(`   📝 Creating recipe: ${recipe.title}`);

      const { data: insertedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          ...recipe,
          status: 'published',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (recipeError) {
        console.error(`Error creating recipe ${recipe.title}:`, recipeError);
        continue;
      }

      // Link recipe to category
      const { error: linkError } = await supabase
        .from('recipe_categories')
        .insert({
          recipe_id: insertedRecipe.id,
          category_id: category.id
        });

      if (linkError) {
        console.error(`Error linking recipe to category:`, linkError);
      }
    }
  }

  console.log('\n🎉 Extended Recipe Collections Created Successfully!');
  console.log('\n📊 Summary:');
  Object.entries(recipeCollections).forEach(([categoryName, recipes]) => {
    console.log(`   ${categoryName}: ${recipes.length} recipes`);
  });
}

createExtendedRecipes().catch(console.error);