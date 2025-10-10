const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * RECIPE CREATION TEMPLATE
 *
 * This template ensures all new recipes are properly:
 * 1. Created with correct naming conventions (NO "Easy" prefix)
 * 2. Linked to appropriate categories via recipe_categories table
 * 3. Include all required fields for SEO and functionality
 */

// Helper function to create a slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim('-');                   // Remove leading/trailing hyphens
}

// Helper function to get or create category
async function getOrCreateCategory(categoryName, categorySlug) {
  // Check if category exists
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();

  if (existingCategory) {
    return existingCategory;
  }

  // Create new category
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      name: categoryName,
      slug: categorySlug,
      description: `Delicious ${categoryName.toLowerCase()} recipes for every occasion.`,
      seo_title: categoryName,
      seo_description: `Discover amazing ${categoryName.toLowerCase()} recipes that are simple to make and absolutely delicious.`
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return newCategory;
}

// Main function to create a recipe with proper category linking
async function createRecipeWithCategories(recipeData, categoryNames) {
  try {
    console.log(`🍳 Creating recipe: ${recipeData.title}`);

    // Ensure no "Easy" prefix in title or slug
    if (recipeData.title.startsWith('Easy ')) {
      recipeData.title = recipeData.title.replace(/^Easy /, '');
    }

    // Create slug if not provided
    if (!recipeData.slug) {
      recipeData.slug = createSlug(recipeData.title);
    }

    // Ensure slug doesn't start with "easy-"
    if (recipeData.slug.startsWith('easy-')) {
      recipeData.slug = recipeData.slug.replace(/^easy-/, '');
    }

    // Set SEO fields if not provided
    if (!recipeData.seo_title) {
      recipeData.seo_title = recipeData.title;
    }
    if (!recipeData.seo_description) {
      recipeData.seo_description = recipeData.description;
    }

    // Create the recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (recipeError) {
      throw new Error(`Failed to create recipe: ${recipeError.message}`);
    }

    console.log(`   ✅ Recipe created with ID: ${recipe.id}`);

    // Link to categories
    for (const categoryName of categoryNames) {
      const categorySlug = createSlug(categoryName);

      // Get or create category
      const category = await getOrCreateCategory(categoryName, categorySlug);

      // Link recipe to category
      const { error: linkError } = await supabase
        .from('recipe_categories')
        .insert({
          recipe_id: recipe.id,
          category_id: category.id
        });

      if (linkError) {
        console.error(`   ⚠️ Failed to link to category ${categoryName}:`, linkError.message);
      } else {
        console.log(`   🏷️ Linked to category: ${categoryName}`);
      }
    }

    return recipe;

  } catch (error) {
    console.error(`❌ Error creating recipe:`, error.message);
    throw error;
  }
}

// Example usage function
async function exampleUsage() {
  // Example recipe data (without "Easy" prefix)
  const sampleRecipe = {
    title: 'Chocolate Chip Cookies',  // NO "Easy" prefix
    // slug will be auto-generated as 'chocolate-chip-cookies'
    description: 'Classic homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.',
    ingredients: [
      { name: 'All-purpose flour', amount: '2 1/4 cups', notes: null },
      { name: 'Baking soda', amount: '1 tsp', notes: null },
      { name: 'Salt', amount: '1 tsp', notes: null },
      { name: 'Butter', amount: '1 cup', notes: 'softened' },
      { name: 'Granulated sugar', amount: '3/4 cup', notes: null },
      { name: 'Brown sugar', amount: '3/4 cup', notes: 'packed' },
      { name: 'Large eggs', amount: '2', notes: null },
      { name: 'Vanilla extract', amount: '2 tsp', notes: null },
      { name: 'Chocolate chips', amount: '2 cups', notes: null }
    ],
    instructions: [
      { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
      { step: 2, instruction: 'In a medium bowl, whisk together flour, baking soda, and salt.' },
      { step: 3, instruction: 'In a large bowl, cream together butter and both sugars until light and fluffy.' },
      { step: 4, instruction: 'Beat in eggs one at a time, then stir in vanilla.' },
      { step: 5, instruction: 'Gradually blend in flour mixture.' },
      { step: 6, instruction: 'Stir in chocolate chips.' },
      { step: 7, instruction: 'Drop rounded tablespoons of dough onto ungreased cookie sheets.' },
      { step: 8, instruction: 'Bake for 9-11 minutes or until golden brown.' },
      { step: 9, instruction: 'Cool on baking sheet for 2 minutes; remove to wire rack to cool completely.' }
    ],
    prep_time: 15,
    cook_time: 10,
    total_time: 25,
    servings: 48,
    difficulty: 'easy',
    calories_per_serving: 140,
    tips: 'For chewier cookies, slightly underbake them. For crispier cookies, bake a minute longer.',
    variations: 'Try adding nuts, different types of chocolate chips, or a pinch of sea salt on top.',
    storage_instructions: 'Store in an airtight container at room temperature for up to 1 week.',
    status: 'published'
  };

  // Categories this recipe belongs to
  const categories = [
    'Dessert Recipes',
    'Cookie Recipes',
    'Baking Recipes'
  ];

  // Create the recipe with proper category linking
  const createdRecipe = await createRecipeWithCategories(sampleRecipe, categories);

  console.log('\n🎉 Recipe creation completed!');
  console.log(`Visit: http://localhost:3002/recipes/${createdRecipe.slug}`);
}

// Export functions for use in other scripts
module.exports = {
  createRecipeWithCategories,
  getOrCreateCategory,
  createSlug
};

// Uncomment to run example
// exampleUsage();