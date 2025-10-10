const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createApricotRecipes() {
  try {
    console.log('🍑 Creating Easy Apricot Recipes...');

    // Define the apricot recipes
    const apricotRecipes = [
      {
        title: 'Easy Apricot Galette',
        slug: 'easy-apricot-galette',
        description: 'A rustic, free-form apricot galette with buttery pastry and sweet, juicy apricots. This elegant yet simple dessert showcases the natural beauty of fresh apricots.',
        seo_title: 'Easy Apricot Galette Recipe - Rustic French Pastry',
        seo_description: 'Make this stunning apricot galette with fresh apricots and flaky pastry. Simple, elegant, and perfect for showcasing summer stone fruit.',
        featured_image_url: '/images/recipes/easy-apricot-galette.jpg',
        featured_image_alt: 'Rustic apricot galette with golden pastry and caramelized apricot halves on parchment paper',
        prep_time: 20,
        cook_time: 35,
        total_time: 55,
        servings: 8,
        difficulty: 'medium',
        calories_per_serving: 285,
        status: 'published',
        featured: true,
        ingredients: [
          { name: 'fresh apricots', amount: '8 large', notes: 'halved and pitted' },
          { name: 'pie crust', amount: '1', notes: 'store-bought or homemade' },
          { name: 'granulated sugar', amount: '1/3 cup', notes: 'divided' },
          { name: 'cornstarch', amount: '1 tablespoon', notes: '' },
          { name: 'vanilla extract', amount: '1/2 teaspoon', notes: '' },
          { name: 'lemon zest', amount: '1 teaspoon', notes: 'fresh' },
          { name: 'egg', amount: '1', notes: 'beaten for egg wash' },
          { name: 'coarse sugar', amount: '1 tablespoon', notes: 'for sprinkling' },
          { name: 'butter', amount: '2 tablespoons', notes: 'cut into small pieces' },
          { name: 'apricot jam', amount: '2 tablespoons', notes: 'for glazing' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.' },
          { step: 2, instruction: 'Roll out pie crust on the prepared baking sheet into a 12-inch circle. Don\'t worry about making it perfect - rustic is the goal!' },
          { step: 3, instruction: 'In a bowl, toss apricot halves with 1/4 cup sugar, cornstarch, vanilla, and lemon zest.' },
          { step: 4, instruction: 'Arrange apricots cut-side down in center of crust, leaving a 2-inch border. Dot with butter pieces.' },
          { step: 5, instruction: 'Fold edges of crust up and over apricots, pleating as needed. Brush crust with beaten egg and sprinkle with coarse sugar.' },
          { step: 6, instruction: 'Bake 30-35 minutes until crust is golden brown and apricots are tender and caramelized.' },
          { step: 7, instruction: 'Warm apricot jam and brush over hot apricots for a beautiful glaze. Cool 15 minutes before serving.' }
        ],
        tips: 'Choose apricots that are ripe but still firm - they should give slightly to pressure but not be mushy. If apricots are very sweet, reduce sugar to 2-3 tablespoons.',
        variations: 'Add 1/4 cup sliced almonds over apricots before baking. Try mixing apricots with fresh berries like raspberries or blackberries.',
        storage_instructions: 'Best served warm the day it\'s made. Store covered at room temperature for 1 day or refrigerate for up to 3 days.'
      },
      {
        title: 'Easy Apricot Jam',
        slug: 'easy-apricot-jam',
        description: 'Homemade apricot jam bursting with fresh fruit flavor. Made with just three ingredients, this simple jam is perfect for toast, scones, or cheese boards.',
        seo_title: 'Easy Apricot Jam Recipe - 3 Ingredients Only',
        seo_description: 'Make delicious homemade apricot jam with just 3 ingredients! Fresh apricots, sugar, and lemon juice create the perfect spreadable preserve.',
        featured_image_url: '/images/recipes/easy-apricot-jam.jpg',
        featured_image_alt: 'Jar of golden apricot jam with fresh apricots and a spoon on a rustic wooden table',
        prep_time: 10,
        cook_time: 25,
        total_time: 35,
        servings: 16,
        difficulty: 'easy',
        calories_per_serving: 45,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'fresh apricots', amount: '2 pounds', notes: 'pitted and chopped' },
          { name: 'granulated sugar', amount: '2 cups', notes: '' },
          { name: 'lemon juice', amount: '1/4 cup', notes: 'fresh' },
          { name: 'lemon zest', amount: '1 tablespoon', notes: 'optional' }
        ],
        instructions: [
          { step: 1, instruction: 'Combine chopped apricots, sugar, and lemon juice in a large, heavy-bottomed saucepan.' },
          { step: 2, instruction: 'Let mixture sit for 10 minutes to allow apricots to release their juices.' },
          { step: 3, instruction: 'Bring to a rolling boil over medium-high heat, stirring frequently.' },
          { step: 4, instruction: 'Reduce heat to medium and continue cooking, stirring regularly, for 15-20 minutes until jam thickens.' },
          { step: 5, instruction: 'Test doneness by placing a small plate in freezer, then dropping a spoonful of jam on it. If it wrinkles when pushed with your finger, it\'s ready.' },
          { step: 6, instruction: 'Stir in lemon zest if using. Remove from heat and let cool slightly.' },
          { step: 7, instruction: 'Pour into sterilized jars, leaving 1/4 inch headspace. Seal and process in boiling water bath for 10 minutes, or store in refrigerator.' }
        ],
        tips: 'Use a mix of slightly underripe and ripe apricots for the best texture and natural pectin. Stir frequently to prevent burning.',
        variations: 'Add 1/4 teaspoon vanilla extract or 1/2 teaspoon almond extract for different flavor profiles. Try adding fresh ginger or cardamom for a spiced version.',
        storage_instructions: 'Properly canned jam keeps for 1 year in a cool, dark place. Refrigerated jam keeps for 3 weeks. Freeze for up to 6 months.'
      },
      {
        title: 'Easy Apricot Chicken',
        slug: 'easy-apricot-chicken',
        description: 'Tender chicken breasts glazed with a sweet and tangy apricot sauce. This easy one-pan dinner combines the sweetness of apricots with savory herbs for a delicious meal.',
        seo_title: 'Easy Apricot Chicken Recipe - Sweet & Savory Dinner',
        seo_description: 'This easy apricot chicken features tender chicken in a sweet apricot glaze. Quick one-pan dinner that\'s perfect for busy weeknights.',
        featured_image_url: '/images/recipes/easy-apricot-chicken.jpg',
        featured_image_alt: 'Glazed apricot chicken breasts with golden sauce and fresh herbs in a skillet',
        prep_time: 10,
        cook_time: 25,
        total_time: 35,
        servings: 4,
        difficulty: 'easy',
        calories_per_serving: 320,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'boneless chicken breasts', amount: '4', notes: 'about 6 oz each' },
          { name: 'apricot preserves', amount: '1/2 cup', notes: '' },
          { name: 'Dijon mustard', amount: '2 tablespoons', notes: '' },
          { name: 'soy sauce', amount: '2 tablespoons', notes: '' },
          { name: 'garlic', amount: '3 cloves', notes: 'minced' },
          { name: 'olive oil', amount: '2 tablespoons', notes: '' },
          { name: 'dried thyme', amount: '1 teaspoon', notes: '' },
          { name: 'salt', amount: '1/2 teaspoon', notes: '' },
          { name: 'black pepper', amount: '1/4 teaspoon', notes: '' },
          { name: 'fresh parsley', amount: '2 tablespoons', notes: 'chopped for garnish' }
        ],
        instructions: [
          { step: 1, instruction: 'Season chicken breasts with salt, pepper, and thyme on both sides.' },
          { step: 2, instruction: 'Heat olive oil in a large skillet over medium-high heat. Add chicken and cook 6-7 minutes per side until golden brown and cooked through (165°F internal temperature).' },
          { step: 3, instruction: 'Remove chicken to a plate and tent with foil to keep warm.' },
          { step: 4, instruction: 'In the same skillet, add garlic and cook for 30 seconds until fragrant.' },
          { step: 5, instruction: 'Whisk in apricot preserves, Dijon mustard, and soy sauce. Simmer for 2-3 minutes until sauce thickens slightly.' },
          { step: 6, instruction: 'Return chicken to skillet and spoon sauce over top. Cook 1-2 minutes to reheat.' },
          { step: 7, instruction: 'Garnish with fresh parsley and serve immediately with rice or roasted vegetables.' }
        ],
        tips: 'Pound chicken breasts to even thickness for uniform cooking. Don\'t overcook the chicken - use a meat thermometer to ensure perfect doneness.',
        variations: 'Try with chicken thighs for extra flavor. Add red pepper flakes for heat, or substitute honey for part of the preserves for different sweetness.',
        storage_instructions: 'Store leftovers in refrigerator for up to 3 days. Reheat gently in microwave or skillet with a splash of water.'
      },
      {
        title: 'Easy Apricot Scones',
        slug: 'easy-apricot-scones',
        description: 'Buttery, flaky scones studded with dried apricots and a hint of orange zest. Perfect for breakfast, brunch, or afternoon tea with jam and cream.',
        seo_title: 'Easy Apricot Scones Recipe - Perfect for Breakfast',
        seo_description: 'These easy apricot scones are buttery and flaky with sweet dried apricots. Perfect for breakfast or afternoon tea. Simple to make!',
        featured_image_url: '/images/recipes/easy-apricot-scones.jpg',
        featured_image_alt: 'Golden apricot scones with visible dried apricot pieces on a wire cooling rack',
        prep_time: 15,
        cook_time: 18,
        total_time: 33,
        servings: 8,
        difficulty: 'easy',
        calories_per_serving: 220,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'all-purpose flour', amount: '2 cups', notes: '' },
          { name: 'granulated sugar', amount: '1/4 cup', notes: '' },
          { name: 'baking powder', amount: '1 tablespoon', notes: '' },
          { name: 'salt', amount: '1/2 teaspoon', notes: '' },
          { name: 'cold butter', amount: '6 tablespoons', notes: 'cubed' },
          { name: 'dried apricots', amount: '1/2 cup', notes: 'chopped' },
          { name: 'orange zest', amount: '1 tablespoon', notes: 'fresh' },
          { name: 'heavy cream', amount: '1/2 cup', notes: 'plus extra for brushing' },
          { name: 'egg', amount: '1 large', notes: '' },
          { name: 'vanilla extract', amount: '1 teaspoon', notes: '' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.' },
          { step: 2, instruction: 'In a large bowl, whisk together flour, sugar, baking powder, and salt.' },
          { step: 3, instruction: 'Cut in cold butter using a pastry cutter or your fingers until mixture resembles coarse crumbs with some larger butter pieces.' },
          { step: 4, instruction: 'Stir in chopped apricots and orange zest.' },
          { step: 5, instruction: 'In a small bowl, whisk together cream, egg, and vanilla. Pour into flour mixture and gently stir until just combined.' },
          { step: 6, instruction: 'Turn dough onto a floured surface and gently pat into a 3/4-inch thick circle. Cut into 8 wedges.' },
          { step: 7, instruction: 'Place scones on prepared baking sheet, brush tops with cream, and bake 15-18 minutes until golden brown.' },
          { step: 8, instruction: 'Cool on wire rack for 5 minutes before serving. Serve warm with butter, jam, or clotted cream.' }
        ],
        tips: 'Keep butter cold for the flakiest scones. Don\'t overwork the dough - it should be slightly shaggy. If apricots are very dry, soak in warm water for 5 minutes and pat dry.',
        variations: 'Substitute dried cranberries or cherries for apricots. Add 1/4 cup chopped almonds for extra texture. Try lemon zest instead of orange.',
        storage_instructions: 'Best served fresh but can be stored covered for 2 days. Freeze unbaked scones and bake from frozen, adding 2-3 extra minutes.'
      },
      {
        title: 'Easy Apricot Smoothie',
        slug: 'easy-apricot-smoothie',
        description: 'A creamy, refreshing smoothie made with fresh or frozen apricots, Greek yogurt, and honey. Perfect for a healthy breakfast or post-workout snack.',
        seo_title: 'Easy Apricot Smoothie Recipe - Healthy & Delicious',
        seo_description: 'This easy apricot smoothie is creamy, healthy, and delicious! Made with fresh apricots, Greek yogurt, and honey for a perfect breakfast.',
        featured_image_url: '/images/recipes/easy-apricot-smoothie.jpg',
        featured_image_alt: 'Creamy orange apricot smoothie in a tall glass with fresh apricot slices and mint garnish',
        prep_time: 5,
        cook_time: 0,
        total_time: 5,
        servings: 2,
        difficulty: 'easy',
        calories_per_serving: 165,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'fresh apricots', amount: '6 large', notes: 'pitted, or 1 cup frozen' },
          { name: 'Greek yogurt', amount: '1/2 cup', notes: 'plain' },
          { name: 'honey', amount: '2 tablespoons', notes: 'or to taste' },
          { name: 'milk', amount: '1/2 cup', notes: 'dairy or plant-based' },
          { name: 'vanilla extract', amount: '1/2 teaspoon', notes: '' },
          { name: 'ice cubes', amount: '1/2 cup', notes: 'if using fresh apricots' },
          { name: 'ground cinnamon', amount: 'pinch', notes: 'optional' },
          { name: 'fresh mint', amount: '2 sprigs', notes: 'for garnish' }
        ],
        instructions: [
          { step: 1, instruction: 'If using fresh apricots, wash, pit, and roughly chop them. Frozen apricots can be used directly from freezer.' },
          { step: 2, instruction: 'Add apricots, Greek yogurt, honey, milk, and vanilla to a blender.' },
          { step: 3, instruction: 'If using fresh apricots, add ice cubes. If using frozen, skip the ice.' },
          { step: 4, instruction: 'Blend on high speed for 60-90 seconds until completely smooth and creamy.' },
          { step: 5, instruction: 'Taste and adjust sweetness with additional honey if needed.' },
          { step: 6, instruction: 'Pour into glasses and garnish with a sprinkle of cinnamon and fresh mint if desired.' },
          { step: 7, instruction: 'Serve immediately for best texture and flavor.' }
        ],
        tips: 'For the creamiest smoothie, use Greek yogurt with higher fat content. Frozen apricots create a thicker, milkshake-like consistency.',
        variations: 'Add 1 tablespoon almond butter for protein and richness. Try adding 1/2 banana for extra creaminess. Substitute coconut milk for tropical flavor.',
        storage_instructions: 'Best consumed immediately. Can be stored in refrigerator for up to 1 day - stir or re-blend before serving as separation may occur.'
      }
    ];

    // Insert all recipes
    const { data: insertedRecipes, error: recipeError } = await supabase
      .from('recipes')
      .insert(apricotRecipes)
      .select('id, slug, title');

    if (recipeError) {
      console.error('Error inserting recipes:', recipeError);
      return;
    }

    console.log(`✅ Successfully created ${insertedRecipes.length} apricot recipes!`);

    // Get the Easy Apricot Recipes category ID
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'easy-apricot-recipes')
      .single();

    if (categoryError || !category) {
      console.log('⚠️ Easy Apricot Recipes category not found. Creating it...');

      const { data: newCategory, error: createCategoryError } = await supabase
        .from('categories')
        .insert({
          name: 'Easy Apricot Recipes',
          slug: 'easy-apricot-recipes',
          description: 'Sweet and savory apricot recipes from fresh fruit desserts to glazed main dishes. Make the most of apricot season with these easy recipes.',
          seo_title: 'Easy Apricot Recipes - Sweet & Savory Apricot Dishes',
          seo_description: 'Discover easy apricot recipes including galettes, jams, glazed chicken, and more. Fresh and dried apricot recipes for every meal.',
          featured: true
        })
        .select('id')
        .single();

      if (createCategoryError) {
        console.error('Error creating category:', createCategoryError);
        return;
      }

      console.log('✅ Created Easy Apricot Recipes category');

      // Assign all recipes to the new category
      const categoryAssignments = insertedRecipes.map(recipe => ({
        recipe_id: recipe.id,
        category_id: newCategory.id
      }));

      const { error: assignmentError } = await supabase
        .from('recipe_categories')
        .insert(categoryAssignments);

      if (assignmentError) {
        console.error('Error assigning recipes to category:', assignmentError);
      } else {
        console.log('✅ Assigned all recipes to Easy Apricot Recipes category');
      }
    } else {
      // Category exists, assign recipes to it
      const categoryAssignments = insertedRecipes.map(recipe => ({
        recipe_id: recipe.id,
        category_id: category.id
      }));

      const { error: assignmentError } = await supabase
        .from('recipe_categories')
        .insert(categoryAssignments);

      if (assignmentError) {
        console.error('Error assigning recipes to category:', assignmentError);
      } else {
        console.log('✅ Assigned all recipes to Easy Apricot Recipes category');
      }
    }

    // Show summary
    console.log('\n🍑 APRICOT RECIPES CREATED:');
    insertedRecipes.forEach(recipe => {
      console.log(`   📝 ${recipe.title} (${recipe.slug})`);
    });

    console.log('\n🎯 Next steps:');
    console.log('   1. Generate AI images for the recipes');
    console.log('   2. The ingredient-based categorization will automatically assign additional categories');
    console.log('   3. Visit /categories/easy-apricot-recipes to see all apricot recipes');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createApricotRecipes();