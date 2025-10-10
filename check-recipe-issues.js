const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRecipeIssues() {
  console.log('🔍 Checking for recipe data issues...\n');

  // Get all recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, slug, ingredients, instructions')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  console.log(`Found ${recipes.length} total recipes`);

  // Check for potential issues
  const issues = [];

  recipes.forEach(recipe => {
    // Check for missing ingredients
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      issues.push(`❌ ${recipe.title} (slug: ${recipe.slug}) - Missing or invalid ingredients`);
    }

    // Check for missing instructions
    if (!recipe.instructions || !Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
      issues.push(`❌ ${recipe.title} (slug: ${recipe.slug}) - Missing or invalid instructions`);
    }

    // Check for malformed ingredients
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach((ing, index) => {
        if (!ing.name || !ing.amount) {
          issues.push(`⚠️ ${recipe.title} - Ingredient ${index + 1} missing name or amount`);
        }
      });
    }

    // Check for malformed instructions
    if (recipe.instructions && Array.isArray(recipe.instructions)) {
      recipe.instructions.forEach((inst, index) => {
        if (!inst.instruction || !inst.step) {
          issues.push(`⚠️ ${recipe.title} - Instruction ${index + 1} missing text or step number`);
        }
      });
    }
  });

  if (issues.length > 0) {
    console.log(`\nFound ${issues.length} potential issues:\n`);
    issues.forEach(issue => console.log(issue));
  } else {
    console.log('\n✅ No data issues found in recipes!');
  }
}

checkRecipeIssues();