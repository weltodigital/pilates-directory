const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyRecipes() {
  console.log('🔍 Verifying all recipes are complete...\n');

  // Get all recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50); // Check recent recipes

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  console.log(`Found ${recipes.length} recent recipes to verify:\n`);

  let incompleteRecipes = [];

  recipes.forEach(recipe => {
    const issues = [];

    // Check required fields
    if (!recipe.title) issues.push('Missing title');
    if (!recipe.description) issues.push('Missing description');
    if (!recipe.ingredients || recipe.ingredients.length === 0) issues.push('Missing ingredients');
    if (!recipe.instructions || recipe.instructions.length === 0) issues.push('Missing instructions');
    if (recipe.prep_time === null || recipe.prep_time === undefined) issues.push('Missing prep_time');
    if (recipe.cook_time === null || recipe.cook_time === undefined) issues.push('Missing cook_time');
    if (recipe.total_time === null || recipe.total_time === undefined) issues.push('Missing total_time');
    if (!recipe.servings) issues.push('Missing servings');
    if (!recipe.difficulty) issues.push('Missing difficulty');
    if (!recipe.calories_per_serving) issues.push('Missing calories_per_serving');
    if (!recipe.status) issues.push('Missing status');

    // Check ingredients structure
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach((ing, index) => {
        if (!ing.name) issues.push(`Ingredient ${index + 1}: Missing name`);
        if (!ing.amount) issues.push(`Ingredient ${index + 1}: Missing amount`);
      });
    }

    // Check instructions structure
    if (recipe.instructions && Array.isArray(recipe.instructions)) {
      recipe.instructions.forEach((inst, index) => {
        if (!inst.step) issues.push(`Instruction ${index + 1}: Missing step number`);
        if (!inst.instruction) issues.push(`Instruction ${index + 1}: Missing instruction text`);
      });
    }

    if (issues.length > 0) {
      incompleteRecipes.push({
        id: recipe.id,
        title: recipe.title,
        issues: issues
      });
    }

    const status = issues.length > 0 ? '❌' : '✅';
    console.log(`${status} ${recipe.title} (ID: ${recipe.id})`);
    if (issues.length > 0) {
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`Total recipes checked: ${recipes.length}`);
  console.log(`Complete recipes: ${recipes.length - incompleteRecipes.length}`);
  console.log(`Incomplete recipes: ${incompleteRecipes.length}`);

  if (incompleteRecipes.length > 0) {
    console.log('\n⚠️ Recipes needing attention:');
    incompleteRecipes.forEach(recipe => {
      console.log(`- ${recipe.title} (${recipe.issues.length} issues)`);
    });
  } else {
    console.log('\n🎉 All recent recipes are complete!');
  }

  return incompleteRecipes;
}

verifyRecipes();