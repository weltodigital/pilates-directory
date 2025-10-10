const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addNutritionalCategories() {
  try {
    console.log('🥗 Adding nutritional and dietary recipe categories...');

    // First check for existing categories to avoid duplicates
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('slug');

    const existingSlugs = existingCategories?.map(cat => cat.slug) || [];
    console.log(`📋 Found ${existingSlugs.length} existing categories`);

    // Nutritional and dietary categories
    const nutritionalCategories = [
      // MACRONUTRIENT-FOCUSED
      {
        name: 'Easy High Protein Recipes',
        slug: 'easy-high-protein-recipes',
        description: 'High protein recipes for muscle building and satiety. Easy protein-packed meals, lean meats, legumes, Greek yogurt dishes, and fitness-friendly nutrition.',
        seo_title: 'Easy High Protein Recipes - Protein-Packed Meals & Lean Meats | Ed\'s Easy Meals',
        seo_description: 'Easy high protein recipes for fitness nutrition. Protein-packed meals, lean meats, legumes, Greek yogurt dishes, and muscle-building foods.',
        featured: true
      },
      {
        name: 'Easy Low Carb Recipes',
        slug: 'easy-low-carb-recipes',
        description: 'Low carb recipes for ketogenic and weight loss diets. Easy cauliflower substitutes, zucchini noodles, protein-rich meals, and carb-conscious cooking.',
        seo_title: 'Easy Low Carb Recipes - Cauliflower Substitutes & Zucchini Noodles | Ed\'s Easy Meals',
        seo_description: 'Easy low carb recipes for keto diets. Cauliflower substitutes, zucchini noodles, protein-rich meals, and carb-conscious cooking.',
        featured: true
      },
      {
        name: 'Easy High Fiber Recipes',
        slug: 'easy-high-fiber-recipes',
        description: 'High fiber recipes for digestive health. Easy whole grain dishes, bean recipes, vegetable-rich meals, and gut-healthy nutrition.',
        seo_title: 'Easy High Fiber Recipes - Whole Grain Dishes & Bean Recipes | Ed\'s Easy Meals',
        seo_description: 'Easy high fiber recipes for digestive health. Whole grain dishes, bean recipes, vegetable-rich meals, and gut-healthy nutrition.',
        featured: true
      },
      {
        name: 'Easy Healthy Fat Recipes',
        slug: 'easy-healthy-fat-recipes',
        description: 'Healthy fat recipes with omega-3s and good fats. Easy avocado dishes, salmon recipes, nuts and seeds, olive oil cooking, and heart-healthy nutrition.',
        seo_title: 'Easy Healthy Fat Recipes - Avocado Dishes & Salmon Recipes | Ed\'s Easy Meals',
        seo_description: 'Easy healthy fat recipes with omega-3s. Avocado dishes, salmon recipes, nuts and seeds, olive oil cooking, and heart-healthy fats.',
        featured: true
      },

      // CALORIE-FOCUSED
      {
        name: 'Easy Low Calorie Recipes',
        slug: 'easy-low-calorie-recipes',
        description: 'Low calorie recipes for weight management. Easy light meals, vegetable-based dishes, portion-controlled cooking, and diet-friendly nutrition.',
        seo_title: 'Easy Low Calorie Recipes - Light Meals & Vegetable Dishes | Ed\'s Easy Meals',
        seo_description: 'Easy low calorie recipes for weight management. Light meals, vegetable-based dishes, portion-controlled cooking, and diet-friendly meals.',
        featured: true
      },
      {
        name: 'Easy High Calorie Recipes',
        slug: 'easy-high-calorie-recipes',
        description: 'High calorie recipes for weight gain and energy. Easy calorie-dense meals, healthy weight gain foods, energy-rich dishes, and bulking nutrition.',
        seo_title: 'Easy High Calorie Recipes - Calorie-Dense Meals & Weight Gain Foods | Ed\'s Easy Meals',
        seo_description: 'Easy high calorie recipes for weight gain. Calorie-dense meals, healthy weight gain foods, energy-rich dishes, and bulking nutrition.',
        featured: true
      },

      // DIETARY RESTRICTIONS
      {
        name: 'Easy Gluten Free Recipes',
        slug: 'easy-gluten-free-recipes',
        description: 'Gluten free recipes for celiac and sensitivity diets. Easy gluten-free baking, alternative flours, naturally gluten-free meals, and safe cooking.',
        seo_title: 'Easy Gluten Free Recipes - Gluten-Free Baking & Alternative Flours | Ed\'s Easy Meals',
        seo_description: 'Easy gluten free recipes for celiac diets. Gluten-free baking, alternative flours, naturally gluten-free meals, and safe cooking.',
        featured: true
      },
      {
        name: 'Easy Dairy Free Recipes',
        slug: 'easy-dairy-free-recipes',
        description: 'Dairy free recipes for lactose intolerance and vegan diets. Easy plant-based milk alternatives, dairy substitutes, and lactose-free cooking.',
        seo_title: 'Easy Dairy Free Recipes - Plant-Based Milk & Dairy Substitutes | Ed\'s Easy Meals',
        seo_description: 'Easy dairy free recipes for lactose intolerance. Plant-based milk alternatives, dairy substitutes, and lactose-free cooking.',
        featured: true
      },
      {
        name: 'Easy Sugar Free Recipes',
        slug: 'easy-sugar-free-recipes',
        description: 'Sugar free recipes for diabetic and low-sugar diets. Easy natural sweeteners, diabetic-friendly desserts, no added sugar meals, and healthy alternatives.',
        seo_title: 'Easy Sugar Free Recipes - Natural Sweeteners & Diabetic Desserts | Ed\'s Easy Meals',
        seo_description: 'Easy sugar free recipes for diabetic diets. Natural sweeteners, diabetic-friendly desserts, no added sugar meals, and healthy alternatives.',
        featured: true
      },

      // LIFESTYLE DIETS
      {
        name: 'Easy Keto Recipes',
        slug: 'easy-keto-recipes',
        description: 'Ketogenic recipes for fat-burning diets. Easy high-fat low-carb meals, keto-friendly ingredients, fat bombs, and ketosis-supporting nutrition.',
        seo_title: 'Easy Keto Recipes - High-Fat Low-Carb Meals & Fat Bombs | Ed\'s Easy Meals',
        seo_description: 'Easy keto recipes for ketogenic diets. High-fat low-carb meals, keto-friendly ingredients, fat bombs, and ketosis nutrition.',
        featured: true
      },
      {
        name: 'Easy Paleo Recipes',
        slug: 'easy-paleo-recipes',
        description: 'Paleo recipes for ancestral eating. Easy whole foods, grain-free meals, hunter-gatherer diet, natural ingredients, and primal nutrition.',
        seo_title: 'Easy Paleo Recipes - Whole Foods & Grain-Free Meals | Ed\'s Easy Meals',
        seo_description: 'Easy paleo recipes for ancestral eating. Whole foods, grain-free meals, hunter-gatherer diet, natural ingredients, and primal nutrition.',
        featured: true
      },
      {
        name: 'Easy Mediterranean Recipes',
        slug: 'easy-mediterranean-recipes',
        description: 'Mediterranean diet recipes for heart health. Easy olive oil cooking, fresh vegetables, seafood, whole grains, and longevity nutrition.',
        seo_title: 'Easy Mediterranean Recipes - Olive Oil Cooking & Fresh Vegetables | Ed\'s Easy Meals',
        seo_description: 'Easy Mediterranean recipes for heart health. Olive oil cooking, fresh vegetables, seafood, whole grains, and longevity nutrition.',
        featured: true
      },

      // SPECIALIZED NUTRITION
      {
        name: 'Easy Anti Inflammatory Recipes',
        slug: 'easy-anti-inflammatory-recipes',
        description: 'Anti-inflammatory recipes for healing nutrition. Easy turmeric dishes, omega-3 rich foods, antioxidant meals, and inflammation-fighting ingredients.',
        seo_title: 'Easy Anti Inflammatory Recipes - Turmeric Dishes & Omega-3 Foods | Ed\'s Easy Meals',
        seo_description: 'Easy anti-inflammatory recipes for healing. Turmeric dishes, omega-3 rich foods, antioxidant meals, and inflammation-fighting nutrition.',
        featured: true
      },
      {
        name: 'Easy Detox Recipes',
        slug: 'easy-detox-recipes',
        description: 'Detox recipes for cleansing nutrition. Easy green juices, liver-supporting foods, antioxidant-rich meals, and body-cleansing ingredients.',
        seo_title: 'Easy Detox Recipes - Green Juices & Liver-Supporting Foods | Ed\'s Easy Meals',
        seo_description: 'Easy detox recipes for cleansing. Green juices, liver-supporting foods, antioxidant-rich meals, and body-cleansing nutrition.',
        featured: true
      },
      {
        name: 'Easy Energy Boosting Recipes',
        slug: 'easy-energy-boosting-recipes',
        description: 'Energy boosting recipes for sustained vitality. Easy complex carbs, B-vitamin rich foods, iron-rich meals, and fatigue-fighting nutrition.',
        seo_title: 'Easy Energy Boosting Recipes - Complex Carbs & B-Vitamin Foods | Ed\'s Easy Meals',
        seo_description: 'Easy energy boosting recipes for vitality. Complex carbs, B-vitamin rich foods, iron-rich meals, and fatigue-fighting nutrition.',
        featured: true
      }
    ];

    // Filter out duplicates
    const categoriesToAdd = nutritionalCategories.filter(cat => !existingSlugs.includes(cat.slug));

    console.log(`🥗 Found ${nutritionalCategories.length - categoriesToAdd.length} duplicates, adding ${categoriesToAdd.length} new categories...`);

    if (categoriesToAdd.length === 0) {
      console.log('✅ All categories already exist - no new categories to add!');
      return;
    }

    // Insert categories in batches
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < categoriesToAdd.length; i += batchSize) {
      const batch = categoriesToAdd.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('categories')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${categoriesToAdd.length} nutritional categories`);
    }

    console.log('🎉 Successfully inserted all nutritional categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show the new categories grouped by type
    console.log('🥗 NEW NUTRITIONAL CATEGORIES:');
    console.log('   MACRONUTRIENT-FOCUSED:');
    console.log('   - Easy High Protein Recipes (/easy-high-protein-recipes)');
    console.log('   - Easy Low Carb Recipes (/easy-low-carb-recipes)');
    console.log('   - Easy High Fiber Recipes (/easy-high-fiber-recipes)');
    console.log('   - Easy Healthy Fat Recipes (/easy-healthy-fat-recipes)');

    console.log('   CALORIE-FOCUSED:');
    console.log('   - Easy Low Calorie Recipes (/easy-low-calorie-recipes)');
    console.log('   - Easy High Calorie Recipes (/easy-high-calorie-recipes)');

    console.log('   DIETARY RESTRICTIONS:');
    console.log('   - Easy Gluten Free Recipes (/easy-gluten-free-recipes)');
    console.log('   - Easy Dairy Free Recipes (/easy-dairy-free-recipes)');
    console.log('   - Easy Sugar Free Recipes (/easy-sugar-free-recipes)');

    console.log('   LIFESTYLE DIETS:');
    console.log('   - Easy Keto Recipes (/easy-keto-recipes)');
    console.log('   - Easy Paleo Recipes (/easy-paleo-recipes)');
    console.log('   - Easy Mediterranean Recipes (/easy-mediterranean-recipes)');

    console.log('   SPECIALIZED NUTRITION:');
    console.log('   - Easy Anti Inflammatory Recipes (/easy-anti-inflammatory-recipes)');
    console.log('   - Easy Detox Recipes (/easy-detox-recipes)');
    console.log('   - Easy Energy Boosting Recipes (/easy-energy-boosting-recipes)');

    // Show any duplicates skipped
    const duplicates = nutritionalCategories.filter(cat => existingSlugs.includes(cat.slug));
    if (duplicates.length > 0) {
      console.log('⚠️  DUPLICATES SKIPPED:');
      duplicates.forEach(category => {
        console.log(`   - ${category.name} (/${category.slug}) - already exists`);
      });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addNutritionalCategories();