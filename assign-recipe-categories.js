const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function assignRecipeCategories() {
  try {
    console.log('🔗 Assigning recipes to categories...');

    // Get all recipes and categories
    const [recipesResult, categoriesResult] = await Promise.all([
      supabase.from('recipes').select('id, slug, title'),
      supabase.from('categories').select('id, slug, name')
    ]);

    const recipes = recipesResult.data || [];
    const categories = categoriesResult.data || [];

    console.log(`Found ${recipes.length} recipes and ${categories.length} categories`);

    // Create category lookup
    const categoryLookup = {};
    categories.forEach(cat => {
      categoryLookup[cat.slug] = cat.id;
    });

    // Define recipe-category mappings
    const recipeCategoryMappings = [
      {
        recipeSlug: 'easy-spaghetti-carbonara',
        categories: [
          'easy-italian-recipes',
          'easy-pasta-recipes',
          'easy-spaghetti-recipes',
          'easy-30-minute-recipes',
          'easy-dinner-recipes',
          'easy-main-course-recipes'
        ]
      },
      {
        recipeSlug: 'easy-chicken-stir-fry',
        categories: [
          'easy-chicken-recipes',
          'easy-asian-recipes',
          'easy-stir-fry-recipes',
          'easy-15-minute-recipes',
          'easy-dinner-recipes',
          'easy-healthy-recipes',
          'easy-weeknight-recipes'
        ]
      },
      {
        recipeSlug: 'easy-chocolate-chip-cookies',
        categories: [
          'easy-dessert-recipes',
          'easy-american-recipes',
          'easy-30-minute-recipes',
          'easy-snack-recipes',
          'easy-family-recipes'
        ]
      },
      {
        recipeSlug: 'easy-caesar-salad',
        categories: [
          'easy-salad-recipes',
          'easy-15-minute-recipes',
          'easy-lunch-recipes',
          'easy-side-dish-recipes',
          'easy-no-cook-recipes',
          'easy-vegetarian-recipes'
        ]
      },
      {
        recipeSlug: 'easy-banana-bread',
        categories: [
          'easy-banana-recipes',
          'easy-breakfast-recipes',
          'easy-american-recipes',
          'easy-snack-recipes',
          'easy-family-recipes'
        ]
      },
      {
        recipeSlug: 'easy-creamy-tuscan-chicken',
        categories: [
          'easy-chicken-recipes',
          'easy-italian-recipes',
          'easy-dinner-recipes',
          'easy-45-minute-recipes',
          'easy-main-course-recipes'
        ]
      }
    ];

    // Create recipe lookup
    const recipeLookup = {};
    recipes.forEach(recipe => {
      recipeLookup[recipe.slug] = recipe.id;
    });

    // Prepare insertions
    const insertions = [];

    recipeCategoryMappings.forEach(mapping => {
      const recipeId = recipeLookup[mapping.recipeSlug];
      if (!recipeId) {
        console.log(`⚠️  Recipe not found: ${mapping.recipeSlug}`);
        return;
      }

      mapping.categories.forEach(categorySlug => {
        const categoryId = categoryLookup[categorySlug];
        if (!categoryId) {
          console.log(`⚠️  Category not found: ${categorySlug}`);
          return;
        }

        insertions.push({
          recipe_id: recipeId,
          category_id: categoryId
        });
      });
    });

    console.log(`📝 Creating ${insertions.length} recipe-category relationships...`);

    // Insert all relationships in batches
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < insertions.length; i += batchSize) {
      const batch = insertions.slice(i, i + batchSize);

      const { error } = await supabase
        .from('recipe_categories')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${insertions.length} relationships`);
    }

    console.log('🎉 Successfully assigned all recipes to categories!');

    // Show summary
    console.log('\n📊 ASSIGNMENT SUMMARY:');
    for (const mapping of recipeCategoryMappings) {
      const recipe = recipes.find(r => r.slug === mapping.recipeSlug);
      if (recipe) {
        console.log(`\n🍽️  ${recipe.title}:`);
        mapping.categories.forEach(catSlug => {
          const category = categories.find(c => c.slug === catSlug);
          if (category) {
            console.log(`   - ${category.name}`);
          }
        });
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

assignRecipeCategories();