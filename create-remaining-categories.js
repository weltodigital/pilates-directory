const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createRemainingCategories() {
  console.log('🔄 Creating recipes for remaining categories that need more...\n');

  const recipes = [
    // Bread Recipes (need 2 more - currently has 3)
    {
      title: 'Artisan Sourdough Bread',
      description: 'Tangy sourdough bread with a crispy crust and chewy interior. A classic artisan bread perfect for toast or sandwiches.',
      ingredients: [
        { name: 'Bread flour', amount: '3 cups', notes: null },
        { name: 'Warm water', amount: '1.25 cups', notes: null },
        { name: 'Active dry yeast', amount: '1 packet', notes: null },
        { name: 'Salt', amount: '1 tsp', notes: null },
        { name: 'Sugar', amount: '1 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Dissolve yeast and sugar in warm water. Let stand 5 minutes until foamy.' },
        { step: 2, instruction: 'Mix flour and salt in large bowl. Add yeast mixture and olive oil.' },
        { step: 3, instruction: 'Knead dough on floured surface for 8-10 minutes until smooth.' },
        { step: 4, instruction: 'Place in oiled bowl, cover, and rise 1 hour until doubled.' },
        { step: 5, instruction: 'Punch down, shape into baguette, and place on baking sheet.' },
        { step: 6, instruction: 'Cover and rise 30 minutes. Score top with sharp knife.' },
        { step: 7, instruction: 'Bake at 450°F for 25-30 minutes until golden brown.' },
        { step: 8, instruction: 'Cool on wire rack before slicing.' }
      ],
      prep_time: 20,
      cook_time: 30,
      total_time: 50,
      servings: 8,
      difficulty: 'medium',
      calories_per_serving: 185,
      status: 'published'
    },
    {
      title: 'Classic Banana Bread',
      description: 'Moist and tender banana bread loaded with ripe banana flavor. Perfect for breakfast or as a snack.',
      ingredients: [
        { name: 'Ripe bananas', amount: '3 large', notes: 'mashed' },
        { name: 'All-purpose flour', amount: '1.5 cups', notes: null },
        { name: 'Sugar', amount: '3/4 cup', notes: null },
        { name: 'Butter', amount: '1/3 cup', notes: 'melted' },
        { name: 'Egg', amount: '1 large', notes: 'beaten' },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Baking soda', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Walnuts', amount: '1/2 cup', notes: 'chopped, optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.' },
        { step: 2, instruction: 'Mash bananas in large bowl until smooth.' },
        { step: 3, instruction: 'Mix in melted butter, sugar, egg, and vanilla.' },
        { step: 4, instruction: 'In separate bowl, whisk flour, baking soda, and salt.' },
        { step: 5, instruction: 'Fold dry ingredients into banana mixture until just combined.' },
        { step: 6, instruction: 'Fold in walnuts if using.' },
        { step: 7, instruction: 'Pour into prepared pan and bake 60-65 minutes.' },
        { step: 8, instruction: 'Test with toothpick - should come out clean. Cool before slicing.' }
      ],
      prep_time: 15,
      cook_time: 65,
      total_time: 80,
      servings: 10,
      difficulty: 'easy',
      calories_per_serving: 195,
      status: 'published'
    },

    // Cucumber Recipes (need 3 more - currently has 2)
    {
      title: 'Cucumber Sandwiches',
      description: 'Classic English cucumber sandwiches with herb cream cheese. Perfect for afternoon tea or light lunch.',
      ingredients: [
        { name: 'English cucumber', amount: '1 large', notes: 'thinly sliced' },
        { name: 'White bread', amount: '8 slices', notes: 'crusts removed' },
        { name: 'Cream cheese', amount: '4 oz', notes: 'softened' },
        { name: 'Fresh dill', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Fresh chives', amount: '1 tbsp', notes: 'chopped' },
        { name: 'Lemon juice', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: '1/4 tsp', notes: null },
        { name: 'White pepper', amount: 'pinch', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Slice cucumber very thinly and lay on paper towels. Salt lightly and let drain 15 minutes.' },
        { step: 2, instruction: 'Mix cream cheese, dill, chives, lemon juice, salt, and pepper.' },
        { step: 3, instruction: 'Spread herb cream cheese on all bread slices.' },
        { step: 4, instruction: 'Pat cucumber slices dry and arrange on 4 slices of bread.' },
        { step: 5, instruction: 'Top with remaining bread slices.' },
        { step: 6, instruction: 'Trim crusts with sharp knife.' },
        { step: 7, instruction: 'Cut into triangles or rectangles.' },
        { step: 8, instruction: 'Serve immediately or cover with damp towel and refrigerate.' }
      ],
      prep_time: 20,
      cook_time: 0,
      total_time: 20,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    },
    {
      title: 'Asian Cucumber Salad',
      description: 'Refreshing cucumber salad with rice vinegar, sesame oil, and chili flakes. A perfect side dish for Asian meals.',
      ingredients: [
        { name: 'Cucumbers', amount: '2 large', notes: 'sliced thin' },
        { name: 'Rice vinegar', amount: '3 tbsp', notes: null },
        { name: 'Sesame oil', amount: '1 tbsp', notes: null },
        { name: 'Soy sauce', amount: '1 tbsp', notes: null },
        { name: 'Sugar', amount: '1 tsp', notes: null },
        { name: 'Red pepper flakes', amount: '1/4 tsp', notes: null },
        { name: 'Sesame seeds', amount: '1 tbsp', notes: 'toasted' },
        { name: 'Green onions', amount: '2', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, instruction: 'Slice cucumbers very thin using mandoline or sharp knife.' },
        { step: 2, instruction: 'Salt cucumber slices and let drain in colander for 20 minutes.' },
        { step: 3, instruction: 'Rinse and pat dry with paper towels.' },
        { step: 4, instruction: 'Whisk together rice vinegar, sesame oil, soy sauce, and sugar.' },
        { step: 5, instruction: 'Toss cucumbers with dressing and red pepper flakes.' },
        { step: 6, instruction: 'Let marinate 30 minutes in refrigerator.' },
        { step: 7, instruction: 'Garnish with sesame seeds and green onions.' },
        { step: 8, instruction: 'Serve chilled as a side dish.' }
      ],
      prep_time: 15,
      cook_time: 0,
      total_time: 15,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 45,
      status: 'published'
    },
    {
      title: 'Cucumber Gazpacho',
      description: 'Cool and refreshing cucumber gazpacho perfect for hot summer days. Light, healthy, and incredibly refreshing.',
      ingredients: [
        { name: 'English cucumbers', amount: '3 large', notes: 'peeled and chopped' },
        { name: 'Greek yogurt', amount: '1 cup', notes: null },
        { name: 'Fresh mint', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Lime juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Garlic', amount: '1 clove', notes: 'minced' },
        { name: 'Olive oil', amount: '2 tbsp', notes: 'extra virgin' },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'White pepper', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Roughly chop cucumbers and place in blender.' },
        { step: 2, instruction: 'Add yogurt, mint, lime juice, and garlic.' },
        { step: 3, instruction: 'Blend until smooth and creamy.' },
        { step: 4, instruction: 'With blender running, slowly drizzle in olive oil.' },
        { step: 5, instruction: 'Season with salt and white pepper.' },
        { step: 6, instruction: 'Chill for at least 2 hours before serving.' },
        { step: 7, instruction: 'Taste and adjust seasoning if needed.' },
        { step: 8, instruction: 'Serve in chilled bowls, garnish with mint leaves.' }
      ],
      prep_time: 10,
      cook_time: 0,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 85,
      status: 'published'
    },

    // Lettuce Recipes (need 2 more - currently has 3)
    {
      title: 'Lettuce Wraps',
      description: 'Fresh lettuce cups filled with seasoned ground turkey and vegetables. A healthy, low-carb alternative to traditional wraps.',
      ingredients: [
        { name: 'Butter lettuce', amount: '2 heads', notes: 'leaves separated' },
        { name: 'Ground turkey', amount: '1 lb', notes: null },
        { name: 'Water chestnuts', amount: '1 can', notes: 'diced' },
        { name: 'Mushrooms', amount: '8 oz', notes: 'diced' },
        { name: 'Green onions', amount: '4', notes: 'sliced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Ginger', amount: '1 tbsp', notes: 'fresh, grated' },
        { name: 'Soy sauce', amount: '3 tbsp', notes: null },
        { name: 'Sesame oil', amount: '1 tbsp', notes: null },
        { name: 'Rice vinegar', amount: '1 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Carefully separate lettuce leaves and wash. Pat dry and chill.' },
        { step: 2, instruction: 'Cook ground turkey in large skillet until browned.' },
        { step: 3, instruction: 'Add garlic and ginger, cook 1 minute.' },
        { step: 4, instruction: 'Add mushrooms and water chestnuts, cook 5 minutes.' },
        { step: 5, instruction: 'Stir in soy sauce, sesame oil, and rice vinegar.' },
        { step: 6, instruction: 'Cook 2 more minutes until heated through.' },
        { step: 7, instruction: 'Spoon filling into lettuce cups.' },
        { step: 8, instruction: 'Garnish with green onions and serve immediately.' }
      ],
      prep_time: 15,
      cook_time: 15,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 225,
      status: 'published'
    },
    {
      title: 'Grilled Romaine Salad',
      description: 'Grilled romaine hearts with parmesan and Caesar-style dressing. A unique twist on the classic Caesar salad.',
      ingredients: [
        { name: 'Romaine lettuce hearts', amount: '4', notes: 'halved lengthwise' },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Lemon juice', amount: '2 tbsp', notes: 'fresh' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Dijon mustard', amount: '1 tsp', notes: null },
        { name: 'Worcestershire sauce', amount: '1/2 tsp', notes: null },
        { name: 'Parmesan cheese', amount: '1/2 cup', notes: 'grated' },
        { name: 'Black pepper', amount: '1/4 tsp', notes: 'freshly ground' },
        { name: 'Croutons', amount: '1 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat grill to medium-high heat.' },
        { step: 2, instruction: 'Brush romaine halves with 1 tbsp olive oil.' },
        { step: 3, instruction: 'Grill romaine cut-side down for 2-3 minutes until lightly charred.' },
        { step: 4, instruction: 'Whisk remaining olive oil, lemon juice, garlic, mustard, and Worcestershire.' },
        { step: 5, instruction: 'Arrange grilled romaine on serving platter.' },
        { step: 6, instruction: 'Drizzle with dressing.' },
        { step: 7, instruction: 'Sprinkle with Parmesan cheese and black pepper.' },
        { step: 8, instruction: 'Top with croutons and serve immediately.' }
      ],
      prep_time: 10,
      cook_time: 5,
      total_time: 15,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 125,
      status: 'published'
    },

    // Lime Recipes (need 1 more - currently has 4)
    {
      title: 'Key Lime Pie',
      description: 'Classic Florida Key lime pie with tart lime filling and graham cracker crust. Sweet, tangy, and perfectly refreshing.',
      ingredients: [
        { name: 'Key lime juice', amount: '1/2 cup', notes: 'fresh or bottled' },
        { name: 'Sweetened condensed milk', amount: '1 can (14 oz)', notes: null },
        { name: 'Egg yolks', amount: '3 large', notes: null },
        { name: 'Lime zest', amount: '1 tbsp', notes: null },
        { name: 'Graham cracker crust', amount: '1', notes: '9-inch, store-bought' },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Powdered sugar', amount: '2 tbsp', notes: null },
        { name: 'Lime slices', amount: 'for garnish', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C).' },
        { step: 2, instruction: 'Whisk together lime juice, condensed milk, egg yolks, and lime zest.' },
        { step: 3, instruction: 'Pour filling into graham cracker crust.' },
        { step: 4, instruction: 'Bake for 15 minutes until filling is set.' },
        { step: 5, instruction: 'Cool completely, then refrigerate 3 hours.' },
        { step: 6, instruction: 'Whip heavy cream with powdered sugar to soft peaks.' },
        { step: 7, instruction: 'Spread whipped cream over pie.' },
        { step: 8, instruction: 'Garnish with lime slices and serve chilled.' }
      ],
      prep_time: 15,
      cook_time: 15,
      total_time: 30,
      servings: 8,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },

    // Mushroom Recipes (need 1 more - currently has 4)
    {
      title: 'Mushroom Stroganoff',
      description: 'Creamy mushroom stroganoff with tender egg noodles. A vegetarian version of the classic comfort food dish.',
      ingredients: [
        { name: 'Mixed mushrooms', amount: '1.5 lbs', notes: 'sliced (cremini, shiitake, button)' },
        { name: 'Egg noodles', amount: '12 oz', notes: 'wide' },
        { name: 'Sour cream', amount: '1 cup', notes: null },
        { name: 'Vegetable broth', amount: '1 cup', notes: null },
        { name: 'Onion', amount: '1 large', notes: 'sliced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Flour', amount: '2 tbsp', notes: null },
        { name: 'Butter', amount: '3 tbsp', notes: null },
        { name: 'Fresh thyme', amount: '1 tbsp', notes: null },
        { name: 'White wine', amount: '1/4 cup', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Cook egg noodles according to package directions.' },
        { step: 2, instruction: 'Melt butter in large skillet. Sauté onions until soft.' },
        { step: 3, instruction: 'Add mushrooms and cook until golden, about 8 minutes.' },
        { step: 4, instruction: 'Add garlic and thyme, cook 1 minute.' },
        { step: 5, instruction: 'Sprinkle flour over mushrooms and stir.' },
        { step: 6, instruction: 'Gradually add broth and wine, simmer until thickened.' },
        { step: 7, instruction: 'Remove from heat and stir in sour cream.' },
        { step: 8, instruction: 'Serve over cooked egg noodles.' }
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 385,
      status: 'published'
    },

    // Oats Recipes (need 2 more - currently has 3)
    {
      title: 'Baked Oatmeal',
      description: 'Hearty baked oatmeal with berries and nuts. Perfect for meal prep and busy morning breakfasts.',
      ingredients: [
        { name: 'Old-fashioned oats', amount: '2 cups', notes: null },
        { name: 'Milk', amount: '1.5 cups', notes: null },
        { name: 'Eggs', amount: '2 large', notes: null },
        { name: 'Brown sugar', amount: '1/3 cup', notes: null },
        { name: 'Baking powder', amount: '1 tsp', notes: null },
        { name: 'Cinnamon', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: '1/2 tsp', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Mixed berries', amount: '1 cup', notes: 'fresh or frozen' },
        { name: 'Chopped walnuts', amount: '1/2 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease 8x8 inch baking dish.' },
        { step: 2, instruction: 'Mix oats, brown sugar, baking powder, cinnamon, and salt.' },
        { step: 3, instruction: 'In separate bowl, whisk milk, eggs, and vanilla.' },
        { step: 4, instruction: 'Combine wet and dry ingredients.' },
        { step: 5, instruction: 'Fold in berries and walnuts.' },
        { step: 6, instruction: 'Pour into prepared baking dish.' },
        { step: 7, instruction: 'Bake 35-40 minutes until set and golden.' },
        { step: 8, instruction: 'Serve warm or at room temperature.' }
      ],
      prep_time: 10,
      cook_time: 40,
      total_time: 50,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 245,
      status: 'published'
    },
    {
      title: 'Oatmeal Cookies',
      description: 'Classic chewy oatmeal cookies with raisins. Soft, chewy, and full of wholesome oat flavor.',
      ingredients: [
        { name: 'Old-fashioned oats', amount: '1 cup', notes: null },
        { name: 'All-purpose flour', amount: '1 cup', notes: null },
        { name: 'Brown sugar', amount: '3/4 cup', notes: 'packed' },
        { name: 'Butter', amount: '1/2 cup', notes: 'softened' },
        { name: 'Egg', amount: '1 large', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Baking soda', amount: '1/2 tsp', notes: null },
        { name: 'Cinnamon', amount: '1/2 tsp', notes: null },
        { name: 'Salt', amount: '1/4 tsp', notes: null },
        { name: 'Raisins', amount: '1/2 cup', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C).' },
        { step: 2, instruction: 'Cream butter and brown sugar until light and fluffy.' },
        { step: 3, instruction: 'Beat in egg and vanilla.' },
        { step: 4, instruction: 'Mix flour, baking soda, cinnamon, and salt in separate bowl.' },
        { step: 5, instruction: 'Gradually add dry ingredients to butter mixture.' },
        { step: 6, instruction: 'Stir in oats and raisins.' },
        { step: 7, instruction: 'Drop rounded tablespoons onto ungreased baking sheets.' },
        { step: 8, instruction: 'Bake 10-12 minutes until lightly golden. Cool on wire racks.' }
      ],
      prep_time: 15,
      cook_time: 12,
      total_time: 27,
      servings: 24,
      difficulty: 'easy',
      calories_per_serving: 95,
      status: 'published'
    },

    // Quinoa Recipes (need 3 more - currently has 2)
    {
      title: 'Quinoa Buddha Bowl',
      description: 'Nutritious quinoa bowl loaded with roasted vegetables, avocado, and tahini dressing. A complete, healthy meal.',
      ingredients: [
        { name: 'Quinoa', amount: '1 cup', notes: 'rinsed' },
        { name: 'Sweet potato', amount: '1 large', notes: 'cubed' },
        { name: 'Broccoli', amount: '2 cups', notes: 'florets' },
        { name: 'Chickpeas', amount: '1 can', notes: 'drained and rinsed' },
        { name: 'Avocado', amount: '1 large', notes: 'sliced' },
        { name: 'Tahini', amount: '3 tbsp', notes: null },
        { name: 'Lemon juice', amount: '2 tbsp', notes: null },
        { name: 'Olive oil', amount: '3 tbsp', notes: null },
        { name: 'Garlic', amount: '1 clove', notes: 'minced' },
        { name: 'Pumpkin seeds', amount: '2 tbsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Cook quinoa according to package directions.' },
        { step: 2, instruction: 'Preheat oven to 400°F (200°C).' },
        { step: 3, instruction: 'Toss sweet potato and broccoli with 2 tbsp olive oil.' },
        { step: 4, instruction: 'Roast vegetables 25 minutes until tender.' },
        { step: 5, instruction: 'Roast chickpeas separately for 20 minutes until crispy.' },
        { step: 6, instruction: 'Whisk tahini, lemon juice, remaining oil, and garlic for dressing.' },
        { step: 7, instruction: 'Divide quinoa among bowls. Top with vegetables, chickpeas, and avocado.' },
        { step: 8, instruction: 'Drizzle with dressing and sprinkle with pumpkin seeds.' }
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
      title: 'Quinoa Stuffed Peppers',
      description: 'Colorful bell peppers stuffed with quinoa, vegetables, and cheese. A healthy, complete meal that\'s easy to make.',
      ingredients: [
        { name: 'Bell peppers', amount: '4 large', notes: 'tops cut, seeded' },
        { name: 'Quinoa', amount: '1 cup', notes: 'cooked' },
        { name: 'Black beans', amount: '1 can', notes: 'drained and rinsed' },
        { name: 'Corn kernels', amount: '1 cup', notes: 'fresh or frozen' },
        { name: 'Diced tomatoes', amount: '1 can', notes: 'drained' },
        { name: 'Cheddar cheese', amount: '1 cup', notes: 'shredded' },
        { name: 'Onion', amount: '1 small', notes: 'diced' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Cumin', amount: '1 tsp', notes: null },
        { name: 'Chili powder', amount: '1/2 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
        { step: 2, instruction: 'Sauté onion and garlic until soft, about 5 minutes.' },
        { step: 3, instruction: 'Mix cooked quinoa, black beans, corn, tomatoes, and spices.' },
        { step: 4, instruction: 'Add sautéed onion and half the cheese.' },
        { step: 5, instruction: 'Stuff bell peppers with quinoa mixture.' },
        { step: 6, instruction: 'Place in baking dish with 1/4 inch water in bottom.' },
        { step: 7, instruction: 'Cover and bake 35-40 minutes until peppers are tender.' },
        { step: 8, instruction: 'Top with remaining cheese and bake 5 more minutes.' }
      ],
      prep_time: 20,
      cook_time: 45,
      total_time: 65,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },
    {
      title: 'Lemon Quinoa Pilaf',
      description: 'Light and fluffy quinoa pilaf with fresh herbs and lemon. Perfect as a side dish or light lunch.',
      ingredients: [
        { name: 'Quinoa', amount: '1 cup', notes: 'rinsed' },
        { name: 'Vegetable broth', amount: '2 cups', notes: null },
        { name: 'Lemon juice', amount: '3 tbsp', notes: 'fresh' },
        { name: 'Lemon zest', amount: '1 tbsp', notes: null },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Shallot', amount: '1', notes: 'minced' },
        { name: 'Fresh parsley', amount: '1/4 cup', notes: 'chopped' },
        { name: 'Fresh mint', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Pine nuts', amount: '1/4 cup', notes: 'toasted' },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat olive oil in saucepan. Sauté shallot until soft.' },
        { step: 2, instruction: 'Add quinoa and stir for 2 minutes until lightly toasted.' },
        { step: 3, instruction: 'Add vegetable broth and bring to a boil.' },
        { step: 4, instruction: 'Reduce heat, cover, and simmer 15 minutes.' },
        { step: 5, instruction: 'Remove from heat and let stand 5 minutes.' },
        { step: 6, instruction: 'Fluff with fork and stir in lemon juice and zest.' },
        { step: 7, instruction: 'Fold in fresh herbs and pine nuts.' },
        { step: 8, instruction: 'Season with salt and pepper. Serve warm or at room temperature.' }
      ],
      prep_time: 10,
      cook_time: 20,
      total_time: 30,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 225,
      status: 'published'
    },

    // Spinach Recipes (need 2 more - currently has 3)
    {
      title: 'Creamed Spinach',
      description: 'Rich and creamy steakhouse-style creamed spinach. The perfect side dish for special dinners.',
      ingredients: [
        { name: 'Fresh spinach', amount: '2 lbs', notes: 'chopped' },
        { name: 'Heavy cream', amount: '1 cup', notes: null },
        { name: 'Cream cheese', amount: '4 oz', notes: 'cubed' },
        { name: 'Butter', amount: '2 tbsp', notes: null },
        { name: 'Onion', amount: '1 small', notes: 'diced' },
        { name: 'Garlic', amount: '3 cloves', notes: 'minced' },
        { name: 'Parmesan cheese', amount: '1/4 cup', notes: 'grated' },
        { name: 'Nutmeg', amount: '1/4 tsp', notes: null },
        { name: 'Salt and pepper', amount: 'to taste', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Sauté spinach in batches until wilted. Drain excess water.' },
        { step: 2, instruction: 'Melt butter in large skillet. Sauté onion until soft.' },
        { step: 3, instruction: 'Add garlic and cook 1 minute.' },
        { step: 4, instruction: 'Add heavy cream and bring to gentle simmer.' },
        { step: 5, instruction: 'Stir in cream cheese until melted and smooth.' },
        { step: 6, instruction: 'Add cooked spinach and Parmesan cheese.' },
        { step: 7, instruction: 'Season with nutmeg, salt, and pepper.' },
        { step: 8, instruction: 'Simmer 5 minutes until thickened. Serve hot.' }
      ],
      prep_time: 15,
      cook_time: 15,
      total_time: 30,
      servings: 6,
      difficulty: 'easy',
      calories_per_serving: 165,
      status: 'published'
    },
    {
      title: 'Spinach and Feta Quesadillas',
      description: 'Crispy quesadillas filled with spinach, feta cheese, and herbs. Quick and delicious for lunch or dinner.',
      ingredients: [
        { name: 'Flour tortillas', amount: '4 large', notes: null },
        { name: 'Fresh spinach', amount: '4 cups', notes: 'chopped' },
        { name: 'Feta cheese', amount: '1 cup', notes: 'crumbled' },
        { name: 'Mozzarella cheese', amount: '1 cup', notes: 'shredded' },
        { name: 'Garlic', amount: '2 cloves', notes: 'minced' },
        { name: 'Fresh dill', amount: '2 tbsp', notes: 'chopped' },
        { name: 'Olive oil', amount: '2 tbsp', notes: null },
        { name: 'Red pepper flakes', amount: '1/4 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Sauté spinach with garlic until wilted. Drain excess water.' },
        { step: 2, instruction: 'Mix spinach with feta, mozzarella, dill, and red pepper flakes.' },
        { step: 3, instruction: 'Place filling on half of each tortilla.' },
        { step: 4, instruction: 'Fold tortillas in half to enclose filling.' },
        { step: 5, instruction: 'Heat olive oil in large skillet over medium heat.' },
        { step: 6, instruction: 'Cook quesadillas 3-4 minutes per side until golden.' },
        { step: 7, instruction: 'Cut into wedges with pizza cutter.' },
        { step: 8, instruction: 'Serve immediately while crispy and hot.' }
      ],
      prep_time: 15,
      cook_time: 10,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    },

    // Yogurt Recipes (need 2 more - currently has 3)
    {
      title: 'Greek Yogurt Parfait',
      description: 'Layered parfait with Greek yogurt, fresh berries, and granola. Perfect for breakfast or a healthy snack.',
      ingredients: [
        { name: 'Greek yogurt', amount: '2 cups', notes: 'plain' },
        { name: 'Honey', amount: '3 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Mixed berries', amount: '2 cups', notes: 'fresh' },
        { name: 'Granola', amount: '1 cup', notes: null },
        { name: 'Mint leaves', amount: 'for garnish', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Mix Greek yogurt with honey and vanilla until smooth.' },
        { step: 2, instruction: 'Layer yogurt mixture in serving glasses.' },
        { step: 3, instruction: 'Add a layer of mixed berries.' },
        { step: 4, instruction: 'Sprinkle with granola.' },
        { step: 5, instruction: 'Repeat layers until glasses are full.' },
        { step: 6, instruction: 'Top with final layer of berries and granola.' },
        { step: 7, instruction: 'Garnish with fresh mint leaves.' },
        { step: 8, instruction: 'Serve immediately or chill until ready to eat.' }
      ],
      prep_time: 10,
      cook_time: 0,
      total_time: 10,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 185,
      status: 'published'
    },
    {
      title: 'Yogurt Flatbread',
      description: 'Simple two-ingredient flatbread made with Greek yogurt and flour. Perfect for wraps, pizza base, or as a side.',
      ingredients: [
        { name: 'Greek yogurt', amount: '1 cup', notes: 'plain' },
        { name: 'Self-rising flour', amount: '1 cup', notes: null },
        { name: 'Olive oil', amount: '1 tbsp', notes: 'for cooking' },
        { name: 'Salt', amount: '1/2 tsp', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Mix Greek yogurt and flour in large bowl until dough forms.' },
        { step: 2, instruction: 'Add salt and knead briefly until smooth.' },
        { step: 3, instruction: 'Divide dough into 4 equal portions.' },
        { step: 4, instruction: 'Roll each portion into thin circles.' },
        { step: 5, instruction: 'Heat olive oil in large skillet over medium heat.' },
        { step: 6, instruction: 'Cook flatbread 2-3 minutes per side until golden.' },
        { step: 7, instruction: 'Keep warm under kitchen towel until ready to serve.' },
        { step: 8, instruction: 'Serve warm as a side or use for wraps.' }
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 145,
      status: 'published'
    }
  ];

  const categoryMappings = [
    // Bread Recipes
    ['Easy Bread Recipes', 'Easy Baking Recipes', 'Easy French Recipes', 'Easy Yeast Recipes', 'Easy Homemade Recipes'],
    ['Easy Bread Recipes', 'Easy Banana Recipes', 'Easy Quick Bread Recipes', 'Easy Breakfast Recipes', 'Easy Baking Recipes'],

    // Cucumber Recipes
    ['Easy Cucumber Recipes', 'Easy Sandwich Recipes', 'Easy Tea Recipes', 'Easy English Recipes', 'Easy Light Lunch'],
    ['Easy Cucumber Recipes', 'Easy Asian Recipes', 'Easy Salad Recipes', 'Easy Side Dish Recipes', 'Easy Vinegar Recipes'],
    ['Easy Cucumber Recipes', 'Easy Soup Recipes', 'Easy Cold Soup Recipes', 'Easy Summer Recipes', 'Easy Light Recipes'],

    // Lettuce Recipes
    ['Easy Lettuce Recipes', 'Easy Wrap Recipes', 'Easy Asian Recipes', 'Easy Low-Carb Recipes', 'Easy Healthy Recipes'],
    ['Easy Lettuce Recipes', 'Easy Grilled Recipes', 'Easy Salad Recipes', 'Easy Caesar Recipes', 'Easy Side Dish Recipes'],

    // Lime Recipes
    ['Easy Lime Recipes', 'Easy Pie Recipes', 'Easy Key Lime Recipes', 'Easy Dessert Recipes', 'Easy Florida Recipes'],

    // Mushroom Recipes
    ['Easy Mushroom Recipes', 'Easy Stroganoff Recipes', 'Easy Vegetarian Recipes', 'Easy Comfort Food', 'Easy Pasta Recipes'],

    // Oats Recipes
    ['Easy Oats Recipes', 'Easy Baked Oatmeal Recipes', 'Easy Breakfast Recipes', 'Easy Meal Prep Recipes', 'Easy Healthy Recipes'],
    ['Easy Oats Recipes', 'Easy Cookie Recipes', 'Easy Baking Recipes', 'Easy Classic Recipes', 'Easy Dessert Recipes'],

    // Quinoa Recipes
    ['Easy Quinoa Recipes', 'Easy Buddha Bowl Recipes', 'Easy Healthy Recipes', 'Easy Vegetarian Recipes', 'Easy Complete Meals'],
    ['Easy Quinoa Recipes', 'Easy Stuffed Pepper Recipes', 'Easy Vegetarian Recipes', 'Easy Mexican Recipes', 'Easy Main Dish Recipes'],
    ['Easy Quinoa Recipes', 'Easy Pilaf Recipes', 'Easy Side Dish Recipes', 'Easy Lemon Recipes', 'Easy Herb Recipes'],

    // Spinach Recipes
    ['Easy Spinach Recipes', 'Easy Creamed Recipes', 'Easy Side Dish Recipes', 'Easy Steakhouse Recipes', 'Easy Cream Recipes'],
    ['Easy Spinach Recipes', 'Easy Quesadilla Recipes', 'Easy Mediterranean Recipes', 'Easy Cheese Recipes', 'Easy Quick Meals'],

    // Yogurt Recipes
    ['Easy Yogurt Recipes', 'Easy Parfait Recipes', 'Easy Breakfast Recipes', 'Easy Healthy Recipes', 'Easy Greek Recipes'],
    ['Easy Yogurt Recipes', 'Easy Flatbread Recipes', 'Easy Two-Ingredient Recipes', 'Easy Bread Recipes', 'Easy Quick Recipes']
  ];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categories = categoryMappings[i];

    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, categories);
  }

  console.log('\n🎉 Remaining ingredient categories completed!');
}

createRemainingCategories();