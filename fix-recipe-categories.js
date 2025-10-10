const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixRecipeCategories() {
  try {
    console.log('🔧 Fixing recipe-category assignments...');

    // Get recipes and key categories
    const [recipesResult, categoriesResult] = await Promise.all([
      supabase.from('recipes').select('id, slug, title'),
      supabase.from('categories').select('id, slug').in('slug', [
        'easy-chicken-recipes',
        'easy-italian-recipes',
        'easy-pasta-recipes',
        'easy-spaghetti-recipes',
        'easy-dessert-recipes',
        'easy-salad-recipes',
        'easy-banana-recipes',
        'easy-breakfast-recipes',
        'easy-dinner-recipes',
        'easy-30-minute-recipes',
        'easy-15-minute-recipes',
        'easy-vegetarian-recipes',
        'easy-family-recipes',
        'easy-asian-recipes'
      ])
    ]);

    const recipes = recipesResult.data || [];
    const categories = categoriesResult.data || [];

    console.log(`Found ${recipes.length} recipes and ${categories.length} key categories`);

    // Create lookup maps
    const recipeLookup = {};
    recipes.forEach(r => recipeLookup[r.slug] = r);

    const categoryLookup = {};
    categories.forEach(c => categoryLookup[c.slug] = c);

    // Define simple mappings
    const assignments = [];

    // Easy Spaghetti Carbonara
    const carbonara = recipeLookup['easy-spaghetti-carbonara'];
    if (carbonara) {
      ['easy-italian-recipes', 'easy-pasta-recipes', 'easy-spaghetti-recipes', 'easy-dinner-recipes', 'easy-30-minute-recipes'].forEach(catSlug => {
        const category = categoryLookup[catSlug];
        if (category) {
          assignments.push({ recipe_id: carbonara.id, category_id: category.id });
        }
      });
    }

    // Easy Chicken Stir Fry
    const stirfry = recipeLookup['easy-chicken-stir-fry'];
    if (stirfry) {
      ['easy-chicken-recipes', 'easy-asian-recipes', 'easy-dinner-recipes', 'easy-15-minute-recipes'].forEach(catSlug => {
        const category = categoryLookup[catSlug];
        if (category) {
          assignments.push({ recipe_id: stirfry.id, category_id: category.id });
        }
      });
    }

    // Easy Chocolate Chip Cookies
    const cookies = recipeLookup['easy-chocolate-chip-cookies'];
    if (cookies) {
      ['easy-dessert-recipes', 'easy-30-minute-recipes', 'easy-family-recipes'].forEach(catSlug => {
        const category = categoryLookup[catSlug];
        if (category) {
          assignments.push({ recipe_id: cookies.id, category_id: category.id });
        }
      });
    }

    // Easy Caesar Salad
    const salad = recipeLookup['easy-caesar-salad'];
    if (salad) {
      ['easy-salad-recipes', 'easy-15-minute-recipes', 'easy-vegetarian-recipes'].forEach(catSlug => {
        const category = categoryLookup[catSlug];
        if (category) {
          assignments.push({ recipe_id: salad.id, category_id: category.id });
        }
      });
    }

    // Easy Banana Bread
    const bread = recipeLookup['easy-banana-bread'];
    if (bread) {
      ['easy-banana-recipes', 'easy-breakfast-recipes', 'easy-family-recipes'].forEach(catSlug => {
        const category = categoryLookup[catSlug];
        if (category) {
          assignments.push({ recipe_id: bread.id, category_id: category.id });
        }
      });
    }

    console.log(`📝 Inserting ${assignments.length} recipe-category relationships...`);

    if (assignments.length > 0) {
      const { error } = await supabase
        .from('recipe_categories')
        .insert(assignments);

      if (error) {
        console.error('Error inserting relationships:', error);
      } else {
        console.log('✅ Successfully assigned recipes to categories!');

        // Show what was assigned
        console.log('\n📊 ASSIGNMENTS:');
        assignments.forEach(assignment => {
          const recipe = recipes.find(r => r.id === assignment.recipe_id);
          const category = categories.find(c => c.id === assignment.category_id);
          if (recipe && category) {
            console.log(`   ${recipe.title} → ${category.slug}`);
          }
        });
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixRecipeCategories();