const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function comprehensiveIngredientAssignment() {
  try {
    console.log('🥘 Comprehensive ingredient-based category assignment...');

    // Get all recipes with ingredients and current categories
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select(`
        id, slug, title, ingredients,
        recipe_categories(
          categories(id, slug)
        )
      `);

    if (recipeError) {
      console.error('Error fetching recipes:', recipeError);
      return;
    }

    // Get all available categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug, name');

    if (catError) {
      console.error('Error fetching categories:', catError);
      return;
    }

    const categoryLookup = {};
    categories.forEach(cat => {
      categoryLookup[cat.slug] = cat.id;
    });

    // Define comprehensive ingredient mappings
    const ingredientMappings = {
      'apple': ['easy-apple-recipes'],
      'banana': ['easy-banana-recipes'],
      'chicken': ['easy-chicken-recipes'],
      'beef': ['easy-beef-recipes'],
      'ground beef': ['easy-ground-beef-recipes', 'easy-beef-recipes'],
      'pork': ['easy-pork-tenderloin-recipes'],
      'pork chop': ['easy-pork-chop-recipes'],
      'pork belly': ['easy-pork-belly-recipes'],
      'salmon': ['easy-salmon-recipes'],
      'tuna': ['easy-tuna-recipes'],
      'shrimp': ['easy-shrimp-recipes'],
      'pasta': ['easy-pasta-recipes'],
      'spaghetti': ['easy-spaghetti-recipes', 'easy-pasta-recipes'],
      'rice': ['easy-rice-recipes'],
      'potato': ['easy-potato-recipes'],
      'sweet potato': ['easy-sweet-potato-recipes'],
      'broccoli': ['easy-broccoli-recipes'],
      'spinach': ['easy-spinach-recipes'],
      'mushroom': ['easy-mushroom-recipes'],
      'tomato': ['easy-tomato-recipes'],
      'egg': ['easy-egg-recipes'],
      'lemon': ['easy-lemon-recipes'],
      'lime': ['easy-lime-recipes'],
      'orange': ['easy-orange-recipes'],
      'garlic': ['easy-garlic-recipes'],
      'onion': ['easy-onion-recipes'],
      'avocado': ['easy-avocado-recipes'],
      'carrot': ['easy-carrot-recipes'],
      'bell pepper': ['easy-bell-pepper-recipes'],
      'zucchini': ['easy-zucchini-recipes'],
      'acorn squash': ['easy-acorn-squash-recipes'],
      'butternut squash': ['easy-butternut-squash-recipes'],
      'pumpkin': ['easy-pumpkin-recipes'],
      'chickpea': ['easy-chickpea-recipes'],
      'lentil': ['easy-lentil-recipes'],
      'cranberry': ['easy-cranberry-recipes'],
      'blueberry': ['easy-blueberry-recipes'],
      'strawberry': ['easy-strawberry-recipes'],
      'pineapple': ['easy-pineapple-recipes'],
      'coconut': ['easy-coconut-recipes'],
      'eggplant': ['easy-eggplant-recipes']
    };

    const insertions = [];

    // Process each recipe
    for (const recipe of recipes) {
      console.log(`\\n🔍 Processing: ${recipe.title}`);

      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
        console.log('   No ingredients found, skipping...');
        continue;
      }

      // Get current category IDs for this recipe
      const currentCategoryIds = new Set(
        recipe.recipe_categories?.map(rc => rc.categories.id) || []
      );

      const foundCategories = new Set();

      // Check each ingredient
      for (const ingredient of recipe.ingredients) {
        if (!ingredient.name) continue;

        const ingredientName = ingredient.name.toLowerCase();

        // Check against all mappings
        for (const [keyword, categorySlugs] of Object.entries(ingredientMappings)) {
          if (ingredientName.includes(keyword)) {
            for (const categorySlug of categorySlugs) {
              const categoryId = categoryLookup[categorySlug];
              if (categoryId && !currentCategoryIds.has(categoryId) && !foundCategories.has(categoryId)) {
                foundCategories.add(categoryId);
                insertions.push({
                  recipe_id: recipe.id,
                  category_id: categoryId
                });
                const categoryName = categories.find(c => c.id === categoryId)?.name;
                console.log(`   ✅ Found ${keyword} → ${categoryName}`);
              }
            }
          }
        }
      }

      if (foundCategories.size === 0) {
        console.log('   No new ingredient categories found');
      }
    }

    console.log(`\\n📝 Creating ${insertions.length} new recipe-category relationships...`);

    if (insertions.length > 0) {
      const { error } = await supabase
        .from('recipe_categories')
        .insert(insertions);

      if (error) {
        console.error('Error inserting relationships:', error);
      } else {
        console.log('✅ Successfully created all new ingredient-based relationships!');

        // Show summary by recipe
        console.log('\\n📊 ASSIGNMENT SUMMARY:');
        const recipeGroups = {};
        insertions.forEach(insertion => {
          const recipe = recipes.find(r => r.id === insertion.recipe_id);
          const category = categories.find(c => c.id === insertion.category_id);
          if (!recipeGroups[recipe.title]) {
            recipeGroups[recipe.title] = [];
          }
          recipeGroups[recipe.title].push(category.name);
        });

        Object.entries(recipeGroups).forEach(([recipeTitle, categoryNames]) => {
          console.log(`\\n🍽️  ${recipeTitle}:`);
          categoryNames.forEach(name => {
            console.log(`   + ${name}`);
          });
        });
      }
    } else {
      console.log('No new relationships to create - all ingredients already properly categorized!');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

comprehensiveIngredientAssignment();