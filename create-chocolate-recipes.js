const { createRecipeWithCategories } = require('./recipe-creation-template');

async function createChocolateRecipes() {
  console.log('🍫 Creating Easy Chocolate Recipes...\n');

  const chocolateRecipes = [
    {
      title: 'Chocolate Lava Cake',
      description: 'Individual molten chocolate cakes with a gooey chocolate center. These impressive desserts are surprisingly easy to make and perfect for special occasions.',
      ingredients: [
        { name: 'Dark chocolate', amount: '6 oz', notes: 'chopped' },
        { name: 'Butter', amount: '6 tbsp', notes: null },
        { name: 'Eggs', amount: '2 large', notes: null },
        { name: 'Egg yolks', amount: '2 large', notes: null },
        { name: 'Sugar', amount: '1/4 cup', notes: null },
        { name: 'All-purpose flour', amount: '2 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1/2 tsp', notes: null },
        { name: 'Butter for ramekins', amount: '1 tbsp', notes: null },
        { name: 'Cocoa powder', amount: '1 tbsp', notes: 'for dusting' },
        { name: 'Vanilla ice cream', amount: 'for serving', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 425°F (220°C). Butter four 6-oz ramekins and dust with cocoa powder.' },
        { step: 2, instruction: 'Melt chocolate and butter in a double boiler until smooth.' },
        { step: 3, instruction: 'In a bowl, whisk together eggs, egg yolks, and sugar until thick.' },
        { step: 4, instruction: 'Stir in the melted chocolate mixture and vanilla.' },
        { step: 5, instruction: 'Fold in flour until just combined.' },
        { step: 6, instruction: 'Divide batter among prepared ramekins.' },
        { step: 7, instruction: 'Bake for 12-14 minutes until edges are firm but centers jiggle.' },
        { step: 8, instruction: 'Let cool for 1 minute, then run a knife around edges and invert onto plates.' },
        { step: 9, instruction: 'Serve immediately with vanilla ice cream.' }
      ],
      prep_time: 15,
      cook_time: 14,
      total_time: 29,
      servings: 4,
      difficulty: 'medium',
      calories_per_serving: 385,
      status: 'published'
    },
    {
      title: 'Chocolate Brownies',
      description: 'Fudgy, rich chocolate brownies that are impossibly easy to make. These one-bowl brownies are the perfect treat for chocolate lovers.',
      ingredients: [
        { name: 'Butter', amount: '1/2 cup', notes: 'melted' },
        { name: 'Sugar', amount: '1 cup', notes: null },
        { name: 'Eggs', amount: '2 large', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Cocoa powder', amount: '1/3 cup', notes: 'unsweetened' },
        { name: 'All-purpose flour', amount: '1/2 cup', notes: null },
        { name: 'Salt', amount: '1/4 tsp', notes: null },
        { name: 'Baking powder', amount: '1/4 tsp', notes: null },
        { name: 'Chocolate chips', amount: '1/2 cup', notes: 'optional' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease an 8x8 inch baking pan.' },
        { step: 2, instruction: 'In a large bowl, mix melted butter and sugar until combined.' },
        { step: 3, instruction: 'Beat in eggs one at a time, then add vanilla.' },
        { step: 4, instruction: 'In a separate bowl, whisk together cocoa, flour, salt, and baking powder.' },
        { step: 5, instruction: 'Gradually stir dry ingredients into wet ingredients.' },
        { step: 6, instruction: 'Fold in chocolate chips if using.' },
        { step: 7, instruction: 'Spread batter evenly in prepared pan.' },
        { step: 8, instruction: 'Bake for 25-30 minutes until a toothpick comes out with a few moist crumbs.' },
        { step: 9, instruction: 'Cool completely before cutting into squares.' }
      ],
      prep_time: 10,
      cook_time: 30,
      total_time: 40,
      servings: 16,
      difficulty: 'easy',
      calories_per_serving: 165,
      status: 'published'
    },
    {
      title: 'Hot Chocolate',
      description: 'Rich and creamy homemade hot chocolate that\'s infinitely better than the packet version. Perfect for cold winter days.',
      ingredients: [
        { name: 'Whole milk', amount: '4 cups', notes: null },
        { name: 'Heavy cream', amount: '1/2 cup', notes: null },
        { name: 'Dark chocolate', amount: '4 oz', notes: 'chopped' },
        { name: 'Sugar', amount: '2 tbsp', notes: null },
        { name: 'Vanilla extract', amount: '1 tsp', notes: null },
        { name: 'Salt', amount: 'pinch', notes: null },
        { name: 'Whipped cream', amount: 'for serving', notes: null },
        { name: 'Marshmallows', amount: 'for serving', notes: null }
      ],
      instructions: [
        { step: 1, instruction: 'Heat milk and cream in a saucepan over medium heat until steaming.' },
        { step: 2, instruction: 'Add chopped chocolate and whisk until melted and smooth.' },
        { step: 3, instruction: 'Stir in sugar, vanilla, and salt.' },
        { step: 4, instruction: 'Continue heating while whisking until hot and well combined.' },
        { step: 5, instruction: 'Taste and adjust sweetness if needed.' },
        { step: 6, instruction: 'Pour into mugs and top with whipped cream or marshmallows.' }
      ],
      prep_time: 5,
      cook_time: 10,
      total_time: 15,
      servings: 4,
      difficulty: 'easy',
      calories_per_serving: 285,
      status: 'published'
    }
  ];

  for (const recipe of chocolateRecipes) {
    console.log(`Creating: ${recipe.title}`);
    await createRecipeWithCategories(recipe, [
      'Easy Chocolate Recipes',
      'Easy Dessert Recipes',
      'Easy Baking Recipes',
      'Easy Butter Recipes',
      'Easy Egg Recipes'
    ]);
  }

  console.log('\n🎉 Chocolate recipes completed!');
}

createChocolateRecipes();
