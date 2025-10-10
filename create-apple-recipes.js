const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAppleRecipes() {
  try {
    console.log('🍎 Creating Easy Apple Recipes...');

    // Define the apple recipes
    const appleRecipes = [
      {
        title: 'Easy Classic Apple Pie',
        slug: 'easy-classic-apple-pie',
        description: 'A timeless homemade apple pie with tender, spiced apples wrapped in a flaky, golden crust. Perfect for holidays or any cozy evening.',
        seo_title: 'Easy Classic Apple Pie Recipe - Homemade & Delicious',
        seo_description: 'Learn how to make the perfect classic apple pie with this easy recipe. Tender spiced apples in a flaky crust - a family favorite dessert.',
        featured_image_url: '/images/recipes/easy-classic-apple-pie.jpg',
        featured_image_alt: 'Golden brown classic apple pie with lattice crust on a rustic kitchen counter',
        prep_time: 30,
        cook_time: 50,
        total_time: 80,
        servings: 8,
        difficulty: 'medium',
        calories_per_serving: 420,
        status: 'published',
        featured: true,
        ingredients: [
          { name: 'Granny Smith apples', amount: '6 large', notes: 'peeled and sliced' },
          { name: 'granulated sugar', amount: '3/4 cup', notes: '' },
          { name: 'brown sugar', amount: '1/4 cup', notes: 'packed' },
          { name: 'ground cinnamon', amount: '2 teaspoons', notes: '' },
          { name: 'ground nutmeg', amount: '1/4 teaspoon', notes: '' },
          { name: 'all-purpose flour', amount: '3 tablespoons', notes: '' },
          { name: 'lemon juice', amount: '1 tablespoon', notes: 'fresh' },
          { name: 'pie crusts', amount: '2', notes: 'store-bought or homemade' },
          { name: 'butter', amount: '2 tablespoons', notes: 'cut into small pieces' },
          { name: 'egg', amount: '1', notes: 'beaten for egg wash' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 425°F (220°C). Roll out bottom pie crust and place in 9-inch pie dish.' },
          { step: 2, instruction: 'In a large bowl, toss sliced apples with both sugars, cinnamon, nutmeg, flour, and lemon juice until well coated.' },
          { step: 3, instruction: 'Pour apple mixture into prepared pie crust and dot with butter pieces.' },
          { step: 4, instruction: 'Cover with top crust, seal edges, and cut several slits for steam vents. Brush with beaten egg.' },
          { step: 5, instruction: 'Bake for 15 minutes, then reduce heat to 350°F (175°C) and bake 35-40 minutes until crust is golden and filling bubbles.' },
          { step: 6, instruction: 'Cool on wire rack for at least 2 hours before serving to allow filling to set.' }
        ],
        tips: 'Use a mix of apple varieties for complex flavor. Granny Smith provides tartness while Honeycrisp adds sweetness. Cover crust edges with foil if browning too quickly.',
        variations: 'Add 1/2 cup chopped walnuts or pecans to the filling. Try a crumb topping instead of top crust for Dutch apple pie variation.',
        storage_instructions: 'Store covered at room temperature for 2 days or refrigerate for up to 5 days. Reheat individual slices in microwave for 30 seconds.'
      },
      {
        title: 'Easy Apple Crisp',
        slug: 'easy-apple-crisp',
        description: 'Warm, tender apples topped with a golden, buttery oat crumble. This easy apple crisp is the perfect comfort dessert served with vanilla ice cream.',
        seo_title: 'Easy Apple Crisp Recipe - Perfect Fall Dessert',
        seo_description: 'Make this easy apple crisp with tender spiced apples and a crunchy oat topping. Simple ingredients, amazing results. Perfect with ice cream!',
        featured_image_url: '/images/recipes/easy-apple-crisp.jpg',
        featured_image_alt: 'Bubbling apple crisp with golden oat topping in a white baking dish',
        prep_time: 15,
        cook_time: 45,
        total_time: 60,
        servings: 8,
        difficulty: 'easy',
        calories_per_serving: 320,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'Honeycrisp apples', amount: '8 cups', notes: 'peeled and sliced' },
          { name: 'granulated sugar', amount: '1/2 cup', notes: '' },
          { name: 'ground cinnamon', amount: '1 teaspoon', notes: '' },
          { name: 'lemon juice', amount: '1 tablespoon', notes: '' },
          { name: 'old-fashioned oats', amount: '1 cup', notes: '' },
          { name: 'all-purpose flour', amount: '3/4 cup', notes: '' },
          { name: 'brown sugar', amount: '3/4 cup', notes: 'packed' },
          { name: 'cold butter', amount: '1/2 cup', notes: 'cubed' },
          { name: 'salt', amount: '1/2 teaspoon', notes: '' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease a 9x13 inch baking dish.' },
          { step: 2, instruction: 'Toss sliced apples with granulated sugar, cinnamon, and lemon juice. Spread in prepared baking dish.' },
          { step: 3, instruction: 'In a bowl, mix oats, flour, brown sugar, and salt. Cut in cold butter until mixture resembles coarse crumbs.' },
          { step: 4, instruction: 'Sprinkle oat mixture evenly over apples.' },
          { step: 5, instruction: 'Bake 40-45 minutes until topping is golden brown and apples are tender.' },
          { step: 6, instruction: 'Let cool 10 minutes before serving. Serve warm with vanilla ice cream or whipped cream.' }
        ],
        tips: 'Use a mix of tart and sweet apples for best flavor. Don\'t overmix the topping - you want it crumbly, not smooth.',
        variations: 'Add 1/2 cup chopped pecans to topping. Try adding 1/4 cup dried cranberries to apple mixture for color and tartness.',
        storage_instructions: 'Cover and refrigerate for up to 4 days. Reheat in 350°F oven for 10-15 minutes to restore crispness.'
      },
      {
        title: 'Easy Cinnamon Apple Muffins',
        slug: 'easy-cinnamon-apple-muffins',
        description: 'Moist, fluffy muffins bursting with fresh apple chunks and warm cinnamon. Perfect for breakfast, snacks, or brunch gatherings.',
        seo_title: 'Easy Cinnamon Apple Muffins Recipe - Moist & Delicious',
        seo_description: 'These easy cinnamon apple muffins are perfectly moist with chunks of fresh apple. Great for breakfast or snacks. Simple to make!',
        featured_image_url: '/images/recipes/easy-cinnamon-apple-muffins.jpg',
        featured_image_alt: 'Freshly baked cinnamon apple muffins with visible apple pieces cooling on a wire rack',
        prep_time: 15,
        cook_time: 20,
        total_time: 35,
        servings: 12,
        difficulty: 'easy',
        calories_per_serving: 180,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'all-purpose flour', amount: '2 cups', notes: '' },
          { name: 'granulated sugar', amount: '3/4 cup', notes: '' },
          { name: 'baking powder', amount: '2 teaspoons', notes: '' },
          { name: 'ground cinnamon', amount: '1 teaspoon', notes: '' },
          { name: 'salt', amount: '1/2 teaspoon', notes: '' },
          { name: 'milk', amount: '1/2 cup', notes: '' },
          { name: 'vegetable oil', amount: '1/3 cup', notes: '' },
          { name: 'egg', amount: '1 large', notes: '' },
          { name: 'vanilla extract', amount: '1 teaspoon', notes: '' },
          { name: 'Granny Smith apple', amount: '1 large', notes: 'peeled and diced small' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 400°F (200°C). Line a 12-cup muffin tin with paper liners or grease with butter.' },
          { step: 2, instruction: 'In a large bowl, whisk together flour, sugar, baking powder, cinnamon, and salt.' },
          { step: 3, instruction: 'In another bowl, whisk together milk, oil, egg, and vanilla until smooth.' },
          { step: 4, instruction: 'Pour wet ingredients into dry ingredients and gently fold until just combined. Don\'t overmix.' },
          { step: 5, instruction: 'Fold in diced apple pieces gently.' },
          { step: 6, instruction: 'Divide batter evenly among muffin cups. Bake 18-20 minutes until golden and a toothpick comes out clean.' },
          { step: 7, instruction: 'Cool in pan 5 minutes, then transfer to wire rack. Serve warm or at room temperature.' }
        ],
        tips: 'Don\'t overmix the batter - lumps are okay! This keeps muffins tender. Dice apples small so they distribute evenly.',
        variations: 'Add 1/2 cup chopped walnuts or pecans. Try a streusel topping made with butter, flour, and brown sugar.',
        storage_instructions: 'Store in airtight container for 3 days at room temperature or freeze for up to 3 months.'
      },
      {
        title: 'Easy Apple Pancakes',
        slug: 'easy-apple-pancakes',
        description: 'Fluffy pancakes loaded with tender apple pieces and warm spices. A perfect weekend breakfast that tastes like apple pie in pancake form.',
        seo_title: 'Easy Apple Pancakes Recipe - Fluffy Breakfast Perfection',
        seo_description: 'Start your morning with these fluffy apple pancakes packed with fresh apple pieces. Easy to make and absolutely delicious!',
        featured_image_url: '/images/recipes/easy-apple-pancakes.jpg',
        featured_image_alt: 'Stack of golden apple pancakes with butter and syrup on a rustic wooden plate',
        prep_time: 10,
        cook_time: 15,
        total_time: 25,
        servings: 4,
        difficulty: 'easy',
        calories_per_serving: 280,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'all-purpose flour', amount: '1 1/2 cups', notes: '' },
          { name: 'granulated sugar', amount: '2 tablespoons', notes: '' },
          { name: 'baking powder', amount: '2 teaspoons', notes: '' },
          { name: 'ground cinnamon', amount: '1/2 teaspoon', notes: '' },
          { name: 'salt', amount: '1/2 teaspoon', notes: '' },
          { name: 'milk', amount: '1 1/4 cups', notes: '' },
          { name: 'egg', amount: '1 large', notes: '' },
          { name: 'melted butter', amount: '3 tablespoons', notes: 'plus extra for cooking' },
          { name: 'vanilla extract', amount: '1 teaspoon', notes: '' },
          { name: 'Honeycrisp apple', amount: '1 medium', notes: 'peeled and finely diced' }
        ],
        instructions: [
          { step: 1, instruction: 'In a large bowl, whisk together flour, sugar, baking powder, cinnamon, and salt.' },
          { step: 2, instruction: 'In another bowl, whisk together milk, egg, melted butter, and vanilla.' },
          { step: 3, instruction: 'Pour wet ingredients into dry ingredients and stir until just combined. Batter should be slightly lumpy.' },
          { step: 4, instruction: 'Gently fold in diced apple pieces.' },
          { step: 5, instruction: 'Heat a griddle or large skillet over medium heat. Brush with butter.' },
          { step: 6, instruction: 'Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface, then flip and cook until golden brown.' },
          { step: 7, instruction: 'Serve immediately with butter, maple syrup, and a dusting of cinnamon.' }
        ],
        tips: 'Don\'t overmix batter - lumps are good for fluffy pancakes! Keep finished pancakes warm in 200°F oven while cooking remaining batches.',
        variations: 'Add 1/4 cup chopped walnuts to batter. Try serving with caramel sauce or apple butter instead of syrup.',
        storage_instructions: 'Leftover pancakes can be frozen for up to 2 months. Reheat in toaster or microwave.'
      },
      {
        title: 'Easy Apple Cinnamon Bread',
        slug: 'easy-apple-cinnamon-bread',
        description: 'Moist, tender quick bread swirled with cinnamon and packed with fresh apple chunks. Perfect for breakfast, afternoon tea, or dessert.',
        seo_title: 'Easy Apple Cinnamon Bread Recipe - Moist & Flavorful',
        seo_description: 'This easy apple cinnamon bread is incredibly moist with chunks of fresh apple and a beautiful cinnamon swirl. Perfect for any time of day!',
        featured_image_url: '/images/recipes/easy-apple-cinnamon-bread.jpg',
        featured_image_alt: 'Sliced apple cinnamon bread showing cinnamon swirl and apple pieces on a wooden cutting board',
        prep_time: 15,
        cook_time: 60,
        total_time: 75,
        servings: 10,
        difficulty: 'easy',
        calories_per_serving: 240,
        status: 'published',
        featured: false,
        ingredients: [
          { name: 'all-purpose flour', amount: '2 cups', notes: '' },
          { name: 'granulated sugar', amount: '3/4 cup', notes: '' },
          { name: 'baking soda', amount: '1 teaspoon', notes: '' },
          { name: 'salt', amount: '1/2 teaspoon', notes: '' },
          { name: 'ground cinnamon', amount: '1 teaspoon', notes: 'divided' },
          { name: 'vegetable oil', amount: '1/2 cup', notes: '' },
          { name: 'eggs', amount: '2 large', notes: '' },
          { name: 'vanilla extract', amount: '1 teaspoon', notes: '' },
          { name: 'unsweetened applesauce', amount: '1/2 cup', notes: '' },
          { name: 'Granny Smith apples', amount: '2 medium', notes: 'peeled and diced' },
          { name: 'brown sugar', amount: '1/4 cup', notes: 'for swirl' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan and line with parchment paper.' },
          { step: 2, instruction: 'In a large bowl, whisk together flour, granulated sugar, baking soda, salt, and 1/2 teaspoon cinnamon.' },
          { step: 3, instruction: 'In another bowl, whisk together oil, eggs, vanilla, and applesauce until smooth.' },
          { step: 4, instruction: 'Pour wet ingredients into dry ingredients and stir until just combined. Fold in diced apples.' },
          { step: 5, instruction: 'Mix brown sugar with remaining 1/2 teaspoon cinnamon for swirl mixture.' },
          { step: 6, instruction: 'Pour half the batter into prepared pan, sprinkle with half the cinnamon mixture, add remaining batter, then top with remaining cinnamon mixture. Swirl with a knife.' },
          { step: 7, instruction: 'Bake 55-60 minutes until a toothpick inserted in center comes out clean.' },
          { step: 8, instruction: 'Cool in pan 10 minutes, then remove to wire rack to cool completely before slicing.' }
        ],
        tips: 'Don\'t overmix the batter to keep bread tender. Let bread cool completely before slicing for clean cuts.',
        variations: 'Add 1/2 cup chopped walnuts or pecans. Try a simple glaze made with powdered sugar and milk.',
        storage_instructions: 'Wrap tightly and store at room temperature for 3 days or freeze for up to 3 months.'
      }
    ];

    // Insert all recipes
    const { data: insertedRecipes, error: recipeError } = await supabase
      .from('recipes')
      .insert(appleRecipes)
      .select('id, slug, title');

    if (recipeError) {
      console.error('Error inserting recipes:', recipeError);
      return;
    }

    console.log(`✅ Successfully created ${insertedRecipes.length} apple recipes!`);

    // Get the Easy Apple Recipes category ID
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'easy-apple-recipes')
      .single();

    if (categoryError || !category) {
      console.log('⚠️ Easy Apple Recipes category not found. Creating it...');

      const { data: newCategory, error: createCategoryError } = await supabase
        .from('categories')
        .insert({
          name: 'Easy Apple Recipes',
          slug: 'easy-apple-recipes',
          description: 'Delicious and simple apple recipes perfect for any occasion. From classic apple pie to quick apple muffins.',
          seo_title: 'Easy Apple Recipes - Simple & Delicious Apple Dishes',
          seo_description: 'Discover easy apple recipes including pies, crisps, muffins, and more. Simple ingredients, amazing results with fresh apples.',
          featured: true
        })
        .select('id')
        .single();

      if (createCategoryError) {
        console.error('Error creating category:', createCategoryError);
        return;
      }

      console.log('✅ Created Easy Apple Recipes category');

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
        console.log('✅ Assigned all recipes to Easy Apple Recipes category');
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
        console.log('✅ Assigned all recipes to Easy Apple Recipes category');
      }
    }

    // Show summary
    console.log('\n🍎 APPLE RECIPES CREATED:');
    insertedRecipes.forEach(recipe => {
      console.log(`   📝 ${recipe.title} (${recipe.slug})`);
    });

    console.log('\n🎯 Next steps:');
    console.log('   1. Generate AI images for the recipes');
    console.log('   2. The ingredient-based categorization will automatically assign additional categories');
    console.log('   3. Visit /categories/easy-apple-recipes to see all apple recipes');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAppleRecipes();