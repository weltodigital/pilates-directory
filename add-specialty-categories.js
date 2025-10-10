const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSpecialtyCategories() {
  try {
    console.log('🍽️ Adding specialty recipe categories...');

    // Specialty categories targeting specific ingredients and dish types
    const specialtyCategories = [
      {
        name: 'Easy Tofu Recipes',
        slug: 'easy-tofu-recipes',
        description: 'Protein-rich tofu recipes for plant-based eating. Easy crispy tofu, tofu stir-fry, baked tofu, tofu scramble, and versatile soy protein dishes for vegetarian meals.',
        seo_title: 'Easy Tofu Recipes - Crispy Tofu & Tofu Stir-Fry | Ed\'s Easy Meals',
        seo_description: 'Easy tofu recipes for plant-based protein. Crispy tofu, tofu stir-fry, baked tofu, tofu scramble, and vegetarian dishes.',
        featured: true
      },
      {
        name: 'Easy Spaghetti Recipes',
        slug: 'easy-spaghetti-recipes',
        description: 'Classic spaghetti recipes for Italian comfort. Easy spaghetti carbonara, spaghetti bolognese, aglio e olio, marinara sauce, and traditional pasta dishes.',
        seo_title: 'Easy Spaghetti Recipes - Spaghetti Carbonara & Bolognese | Ed\'s Easy Meals',
        seo_description: 'Easy spaghetti recipes for Italian comfort food. Spaghetti carbonara, bolognese, aglio e olio, marinara, and classic pasta dishes.',
        featured: true
      },
      {
        name: 'Easy Orzo Recipes',
        slug: 'easy-orzo-recipes',
        description: 'Versatile orzo recipes for rice-shaped pasta. Easy orzo salad, orzo risotto, Mediterranean orzo, lemon orzo, and creative small pasta dishes.',
        seo_title: 'Easy Orzo Recipes - Orzo Salad & Mediterranean Orzo | Ed\'s Easy Meals',
        seo_description: 'Easy orzo recipes for versatile pasta dishes. Orzo salad, orzo risotto, Mediterranean orzo, lemon orzo, and small pasta meals.',
        featured: true
      },
      {
        name: 'Easy Tapas Recipes',
        slug: 'easy-tapas-recipes',
        description: 'Spanish tapas recipes for small plates dining. Easy patatas bravas, gambas al ajillo, Spanish tortilla, croquetas, and Mediterranean appetizer dishes.',
        seo_title: 'Easy Tapas Recipes - Patatas Bravas & Spanish Tortilla | Ed\'s Easy Meals',
        seo_description: 'Easy tapas recipes for Spanish small plates. Patatas bravas, gambas al ajillo, Spanish tortilla, croquetas, and appetizers.',
        featured: true
      },
      {
        name: 'Easy Traybake Recipes',
        slug: 'easy-traybake-recipes',
        description: 'One-pan traybake recipes for effortless cooking. Easy chicken traybake, vegetable traybake, fish traybake, roasted dinner traybakes, and sheet pan meals.',
        seo_title: 'Easy Traybake Recipes - Chicken Traybake & Sheet Pan Meals | Ed\'s Easy Meals',
        seo_description: 'Easy traybake recipes for one-pan cooking. Chicken traybake, vegetable traybake, fish traybake, sheet pan meals, and effortless dinners.',
        featured: true
      },
      {
        name: 'Easy Lentil Recipes',
        slug: 'easy-lentil-recipes',
        description: 'Nutritious lentil recipes for plant-based protein. Easy lentil soup, lentil curry, lentil salad, red lentil dal, and fiber-rich legume dishes.',
        seo_title: 'Easy Lentil Recipes - Lentil Soup & Lentil Curry | Ed\'s Easy Meals',
        seo_description: 'Easy lentil recipes for plant protein. Lentil soup, lentil curry, lentil salad, red lentil dal, and nutritious legume dishes.',
        featured: true
      },
      {
        name: 'Easy Puff Pastry Recipes',
        slug: 'easy-puff-pastry-recipes',
        description: 'Flaky puff pastry recipes for elegant baking. Easy sausage rolls, cheese straws, beef wellington, fruit tarts, and buttery pastry dishes.',
        seo_title: 'Easy Puff Pastry Recipes - Sausage Rolls & Cheese Straws | Ed\'s Easy Meals',
        seo_description: 'Easy puff pastry recipes for flaky baking. Sausage rolls, cheese straws, beef wellington, fruit tarts, and buttery pastries.',
        featured: true
      },
      {
        name: 'Easy Rice Recipes',
        slug: 'easy-rice-recipes',
        description: 'Versatile rice recipes for global cuisine. Easy fried rice, rice pilaf, risotto, rice pudding, coconut rice, and grain-based comfort dishes.',
        seo_title: 'Easy Rice Recipes - Fried Rice & Rice Pilaf | Ed\'s Easy Meals',
        seo_description: 'Easy rice recipes for versatile meals. Fried rice, rice pilaf, risotto, rice pudding, coconut rice, and grain dishes.',
        featured: true
      },
      {
        name: 'Easy Chicken Casserole Recipes',
        slug: 'easy-chicken-casserole-recipes',
        description: 'Comforting chicken casserole recipes for family dinners. Easy chicken and rice casserole, chicken broccoli casserole, king ranch chicken, and one-dish meals.',
        seo_title: 'Easy Chicken Casserole Recipes - Chicken Rice Casserole | Ed\'s Easy Meals',
        seo_description: 'Easy chicken casserole recipes for comfort food. Chicken rice casserole, chicken broccoli casserole, king ranch chicken, and family dinners.',
        featured: true
      },
      {
        name: 'Easy Red Cabbage Recipes',
        slug: 'easy-red-cabbage-recipes',
        description: 'Colorful red cabbage recipes for vibrant nutrition. Easy braised red cabbage, red cabbage slaw, pickled red cabbage, and purple vegetable dishes.',
        seo_title: 'Easy Red Cabbage Recipes - Braised Red Cabbage & Red Cabbage Slaw | Ed\'s Easy Meals',
        seo_description: 'Easy red cabbage recipes for colorful nutrition. Braised red cabbage, red cabbage slaw, pickled red cabbage, and purple vegetables.',
        featured: true
      },
      {
        name: 'Easy Chicken Curry Recipes',
        slug: 'easy-chicken-curry-recipes',
        description: 'Aromatic chicken curry recipes for spiced comfort. Easy butter chicken, chicken tikka masala, coconut curry, Thai curry, and Indian-inspired dishes.',
        seo_title: 'Easy Chicken Curry Recipes - Butter Chicken & Tikka Masala | Ed\'s Easy Meals',
        seo_description: 'Easy chicken curry recipes for spiced meals. Butter chicken, chicken tikka masala, coconut curry, Thai curry, and aromatic dishes.',
        featured: true
      },
      {
        name: 'Easy Pork Belly Recipes',
        slug: 'easy-pork-belly-recipes',
        description: 'Rich pork belly recipes for indulgent dining. Easy crispy pork belly, braised pork belly, pork belly ramen, Asian pork belly, and fatty cut dishes.',
        seo_title: 'Easy Pork Belly Recipes - Crispy Pork Belly & Braised Pork Belly | Ed\'s Easy Meals',
        seo_description: 'Easy pork belly recipes for rich flavors. Crispy pork belly, braised pork belly, pork belly ramen, Asian pork belly, and indulgent dishes.',
        featured: true
      },
      {
        name: 'Easy Leek Recipes',
        slug: 'easy-leek-recipes',
        description: 'Mild leek recipes for subtle onion flavor. Easy leek soup, braised leeks, leek and potato gratin, leek quiche, and gentle allium dishes.',
        seo_title: 'Easy Leek Recipes - Leek Soup & Braised Leeks | Ed\'s Easy Meals',
        seo_description: 'Easy leek recipes for mild onion flavors. Leek soup, braised leeks, leek potato gratin, leek quiche, and gentle allium dishes.',
        featured: true
      },
      {
        name: 'Easy Egg Recipes',
        slug: 'easy-egg-recipes',
        description: 'Versatile egg recipes for any meal. Easy scrambled eggs, deviled eggs, egg salad, frittata, quiche, and protein-rich breakfast dishes.',
        seo_title: 'Easy Egg Recipes - Scrambled Eggs & Deviled Eggs | Ed\'s Easy Meals',
        seo_description: 'Easy egg recipes for versatile meals. Scrambled eggs, deviled eggs, egg salad, frittata, quiche, and protein breakfast dishes.',
        featured: true
      }
    ];

    console.log(`🍽️ Inserting ${specialtyCategories.length} specialty categories...`);

    // Insert categories in batches
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < specialtyCategories.length; i += batchSize) {
      const batch = specialtyCategories.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('categories')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${specialtyCategories.length} specialty categories`);
    }

    console.log('🎉 Successfully inserted all specialty categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show the new categories grouped by type
    console.log('🍽️ NEW SPECIALTY CATEGORIES:');
    console.log('   PROTEINS & PLANT-BASED:');
    console.log('   - Easy Tofu Recipes (/easy-tofu-recipes)');
    console.log('   - Easy Lentil Recipes (/easy-lentil-recipes)');
    console.log('   - Easy Egg Recipes (/easy-egg-recipes)');

    console.log('   PASTA & GRAINS:');
    console.log('   - Easy Spaghetti Recipes (/easy-spaghetti-recipes)');
    console.log('   - Easy Orzo Recipes (/easy-orzo-recipes)');
    console.log('   - Easy Rice Recipes (/easy-rice-recipes)');

    console.log('   COOKING METHODS:');
    console.log('   - Easy Traybake Recipes (/easy-traybake-recipes)');
    console.log('   - Easy Puff Pastry Recipes (/easy-puff-pastry-recipes)');

    console.log('   SPECIFIC DISHES:');
    console.log('   - Easy Tapas Recipes (/easy-tapas-recipes)');
    console.log('   - Easy Chicken Casserole Recipes (/easy-chicken-casserole-recipes)');
    console.log('   - Easy Chicken Curry Recipes (/easy-chicken-curry-recipes)');

    console.log('   SPECIFIC INGREDIENTS:');
    console.log('   - Easy Red Cabbage Recipes (/easy-red-cabbage-recipes)');
    console.log('   - Easy Pork Belly Recipes (/easy-pork-belly-recipes)');
    console.log('   - Easy Leek Recipes (/easy-leek-recipes)');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addSpecialtyCategories();