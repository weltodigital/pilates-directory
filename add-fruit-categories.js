const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addFruitCategories() {
  try {
    console.log('🍎 Adding comprehensive fruit-based recipe categories...');

    // Fruit-based categories targeting "Easy [Fruit] Recipes" keywords
    const fruitCategories = [
      // CITRUS FRUITS
      {
        name: 'Easy Lemon Recipes',
        slug: 'easy-lemon-recipes',
        description: 'Fresh lemon recipes for bright, zesty flavors. Easy lemon bars, lemon chicken, lemon cake, lemonade, and citrus dishes that add sunshine to any meal.',
        seo_title: 'Easy Lemon Recipes - Lemon Bars & Lemon Chicken | Ed\'s Easy Meals',
        seo_description: 'Easy lemon recipes for fresh citrus flavors. Lemon bars, lemon chicken, lemon cake, lemonade, and bright zesty dishes.',
        featured: true
      },
      {
        name: 'Easy Orange Recipes',
        slug: 'easy-orange-recipes',
        description: 'Sweet orange recipes packed with vitamin C. Easy orange chicken, orange cake, orange juice, orange salad, and vibrant citrus dishes.',
        seo_title: 'Easy Orange Recipes - Orange Chicken & Orange Cake | Ed\'s Easy Meals',
        seo_description: 'Easy orange recipes for sweet citrus meals. Orange chicken, orange cake, orange juice, orange salad, and vitamin C-rich dishes.',
        featured: true
      },
      {
        name: 'Easy Lime Recipes',
        slug: 'easy-lime-recipes',
        description: 'Tangy lime recipes for tropical flavors. Easy key lime pie, lime chicken, lime rice, mojitos, and zesty citrus dishes with Latin flair.',
        seo_title: 'Easy Lime Recipes - Key Lime Pie & Lime Chicken | Ed\'s Easy Meals',
        seo_description: 'Easy lime recipes for tangy tropical flavors. Key lime pie, lime chicken, lime rice, mojitos, and zesty citrus dishes.',
        featured: true
      },
      {
        name: 'Easy Grapefruit Recipes',
        slug: 'easy-grapefruit-recipes',
        description: 'Refreshing grapefruit recipes for healthy eating. Easy grapefruit salad, broiled grapefruit, grapefruit juice, and pink citrus dishes.',
        seo_title: 'Easy Grapefruit Recipes - Grapefruit Salad & Broiled Grapefruit | Ed\'s Easy Meals',
        seo_description: 'Easy grapefruit recipes for refreshing meals. Grapefruit salad, broiled grapefruit, grapefruit juice, and healthy citrus dishes.',
        featured: true
      },

      // STONE FRUITS
      {
        name: 'Easy Peach Recipes',
        slug: 'easy-peach-recipes',
        description: 'Sweet peach recipes for summer abundance. Easy peach cobbler, grilled peaches, peach pie, peach smoothies, and juicy stone fruit dishes.',
        seo_title: 'Easy Peach Recipes - Peach Cobbler & Grilled Peaches | Ed\'s Easy Meals',
        seo_description: 'Easy peach recipes for sweet summer treats. Peach cobbler, grilled peaches, peach pie, peach smoothies, and stone fruit dishes.',
        featured: true
      },
      {
        name: 'Easy Cherry Recipes',
        slug: 'easy-cherry-recipes',
        description: 'Delicious cherry recipes for tart-sweet flavors. Easy cherry pie, cherry crisp, chocolate cherry cake, cherry sauce, and antioxidant-rich dishes.',
        seo_title: 'Easy Cherry Recipes - Cherry Pie & Cherry Crisp | Ed\'s Easy Meals',
        seo_description: 'Easy cherry recipes for tart-sweet treats. Cherry pie, cherry crisp, chocolate cherry cake, cherry sauce, and antioxidant dishes.',
        featured: true
      },
      {
        name: 'Easy Plum Recipes',
        slug: 'easy-plum-recipes',
        description: 'Versatile plum recipes for sweet and savory dishes. Easy plum tart, plum sauce, grilled plums, plum jam, and purple stone fruit creations.',
        seo_title: 'Easy Plum Recipes - Plum Tart & Plum Sauce | Ed\'s Easy Meals',
        seo_description: 'Easy plum recipes for sweet and savory meals. Plum tart, plum sauce, grilled plums, plum jam, and purple stone fruit dishes.',
        featured: true
      },
      {
        name: 'Easy Apricot Recipes',
        slug: 'easy-apricot-recipes',
        description: 'Golden apricot recipes for delicate flavors. Easy apricot tart, apricot chicken, apricot jam, dried apricots, and sunny stone fruit dishes.',
        seo_title: 'Easy Apricot Recipes - Apricot Tart & Apricot Chicken | Ed\'s Easy Meals',
        seo_description: 'Easy apricot recipes for delicate golden flavors. Apricot tart, apricot chicken, apricot jam, dried apricots, and stone fruit dishes.',
        featured: true
      },

      // BERRIES
      {
        name: 'Easy Strawberry Recipes',
        slug: 'easy-strawberry-recipes',
        description: 'Sweet strawberry recipes for classic desserts. Easy strawberry shortcake, strawberry jam, chocolate strawberries, strawberry smoothies, and red berry treats.',
        seo_title: 'Easy Strawberry Recipes - Strawberry Shortcake & Strawberry Jam | Ed\'s Easy Meals',
        seo_description: 'Easy strawberry recipes for sweet treats. Strawberry shortcake, strawberry jam, chocolate strawberries, strawberry smoothies, and berry desserts.',
        featured: true
      },
      {
        name: 'Easy Blueberry Recipes',
        slug: 'easy-blueberry-recipes',
        description: 'Antioxidant blueberry recipes for healthy indulgence. Easy blueberry muffins, blueberry pancakes, blueberry pie, and superfood berry dishes.',
        seo_title: 'Easy Blueberry Recipes - Blueberry Muffins & Blueberry Pancakes | Ed\'s Easy Meals',
        seo_description: 'Easy blueberry recipes for healthy treats. Blueberry muffins, blueberry pancakes, blueberry pie, and antioxidant berry dishes.',
        featured: true
      },
      {
        name: 'Easy Raspberry Recipes',
        slug: 'easy-raspberry-recipes',
        description: 'Tart raspberry recipes for elegant desserts. Easy raspberry tart, raspberry sauce, raspberry cheesecake, and jewel-toned berry creations.',
        seo_title: 'Easy Raspberry Recipes - Raspberry Tart & Raspberry Cheesecake | Ed\'s Easy Meals',
        seo_description: 'Easy raspberry recipes for elegant treats. Raspberry tart, raspberry sauce, raspberry cheesecake, and tart berry desserts.',
        featured: true
      },
      {
        name: 'Easy Blackberry Recipes',
        slug: 'easy-blackberry-recipes',
        description: 'Rich blackberry recipes for bold flavors. Easy blackberry cobbler, blackberry jam, blackberry sauce, and dark berry dishes with deep taste.',
        seo_title: 'Easy Blackberry Recipes - Blackberry Cobbler & Blackberry Jam | Ed\'s Easy Meals',
        seo_description: 'Easy blackberry recipes for rich flavors. Blackberry cobbler, blackberry jam, blackberry sauce, and bold dark berry dishes.',
        featured: true
      },
      {
        name: 'Easy Cranberry Recipes',
        slug: 'easy-cranberry-recipes',
        description: 'Tart cranberry recipes for holiday traditions. Easy cranberry sauce, cranberry bread, cranberry juice, and festive red berry dishes.',
        seo_title: 'Easy Cranberry Recipes - Cranberry Sauce & Cranberry Bread | Ed\'s Easy Meals',
        seo_description: 'Easy cranberry recipes for tart holiday flavors. Cranberry sauce, cranberry bread, cranberry juice, and festive berry dishes.',
        featured: true
      },

      // TROPICAL FRUITS
      {
        name: 'Easy Pineapple Recipes',
        slug: 'easy-pineapple-recipes',
        description: 'Tropical pineapple recipes for exotic flavors. Easy pineapple upside-down cake, grilled pineapple, pineapple chicken, and Hawaiian-inspired dishes.',
        seo_title: 'Easy Pineapple Recipes - Pineapple Upside-Down Cake & Grilled Pineapple | Ed\'s Easy Meals',
        seo_description: 'Easy pineapple recipes for tropical flavors. Pineapple upside-down cake, grilled pineapple, pineapple chicken, and Hawaiian dishes.',
        featured: true
      },
      {
        name: 'Easy Mango Recipes',
        slug: 'easy-mango-recipes',
        description: 'Sweet mango recipes for tropical indulgence. Easy mango smoothies, mango salsa, mango chicken, mango lassi, and exotic fruit dishes.',
        seo_title: 'Easy Mango Recipes - Mango Smoothies & Mango Salsa | Ed\'s Easy Meals',
        seo_description: 'Easy mango recipes for tropical sweetness. Mango smoothies, mango salsa, mango chicken, mango lassi, and exotic fruit dishes.',
        featured: true
      },
      {
        name: 'Easy Coconut Recipes',
        slug: 'easy-coconut-recipes',
        description: 'Creamy coconut recipes for tropical richness. Easy coconut cake, coconut curry, coconut rice, coconut milk dishes, and island-inspired cuisine.',
        seo_title: 'Easy Coconut Recipes - Coconut Cake & Coconut Curry | Ed\'s Easy Meals',
        seo_description: 'Easy coconut recipes for tropical richness. Coconut cake, coconut curry, coconut rice, coconut milk dishes, and island cuisine.',
        featured: true
      },
      {
        name: 'Easy Banana Recipes',
        slug: 'easy-banana-recipes',
        description: 'Versatile banana recipes for natural sweetness. Easy banana bread, banana pancakes, banana smoothies, banana pudding, and potassium-rich treats.',
        seo_title: 'Easy Banana Recipes - Banana Bread & Banana Pancakes | Ed\'s Easy Meals',
        seo_description: 'Easy banana recipes for natural sweetness. Banana bread, banana pancakes, banana smoothies, banana pudding, and healthy treats.',
        featured: true
      },

      // TREE FRUITS
      {
        name: 'Easy Apple Recipes',
        slug: 'easy-apple-recipes',
        description: 'Classic apple recipes for comfort food. Easy apple pie, apple crisp, baked apples, apple sauce, and traditional orchard fruit dishes.',
        seo_title: 'Easy Apple Recipes - Apple Pie & Apple Crisp | Ed\'s Easy Meals',
        seo_description: 'Easy apple recipes for classic comfort food. Apple pie, apple crisp, baked apples, apple sauce, and traditional orchard dishes.',
        featured: true
      },
      {
        name: 'Easy Pear Recipes',
        slug: 'easy-pear-recipes',
        description: 'Elegant pear recipes for sophisticated flavors. Easy poached pears, pear tart, pear salad, pear butter, and refined fruit dishes.',
        seo_title: 'Easy Pear Recipes - Poached Pears & Pear Tart | Ed\'s Easy Meals',
        seo_description: 'Easy pear recipes for elegant flavors. Poached pears, pear tart, pear salad, pear butter, and sophisticated fruit dishes.',
        featured: true
      },

      // MELONS
      {
        name: 'Easy Watermelon Recipes',
        slug: 'easy-watermelon-recipes',
        description: 'Refreshing watermelon recipes for summer cooling. Easy watermelon salad, watermelon juice, grilled watermelon, and hydrating fruit dishes.',
        seo_title: 'Easy Watermelon Recipes - Watermelon Salad & Watermelon Juice | Ed\'s Easy Meals',
        seo_description: 'Easy watermelon recipes for summer refreshment. Watermelon salad, watermelon juice, grilled watermelon, and cooling fruit dishes.',
        featured: true
      },
      {
        name: 'Easy Cantaloupe Recipes',
        slug: 'easy-cantaloupe-recipes',
        description: 'Sweet cantaloupe recipes for melon lovers. Easy cantaloupe salad, cantaloupe smoothies, prosciutto cantaloupe, and orange melon dishes.',
        seo_title: 'Easy Cantaloupe Recipes - Cantaloupe Salad & Prosciutto Cantaloupe | Ed\'s Easy Meals',
        seo_description: 'Easy cantaloupe recipes for sweet melon treats. Cantaloupe salad, cantaloupe smoothies, prosciutto cantaloupe, and orange melon dishes.',
        featured: true
      },

      // GRAPES
      {
        name: 'Easy Grape Recipes',
        slug: 'easy-grape-recipes',
        description: 'Sweet grape recipes for simple pleasures. Easy grape salad, roasted grapes, grape juice, chicken with grapes, and vineyard-inspired dishes.',
        seo_title: 'Easy Grape Recipes - Grape Salad & Roasted Grapes | Ed\'s Easy Meals',
        seo_description: 'Easy grape recipes for sweet simple pleasures. Grape salad, roasted grapes, grape juice, chicken with grapes, and vineyard dishes.',
        featured: true
      },

      // EXOTIC FRUITS
      {
        name: 'Easy Avocado Recipes',
        slug: 'easy-avocado-recipes',
        description: 'Healthy avocado recipes for creamy goodness. Easy guacamole, avocado toast, avocado salad, avocado smoothies, and nutritious green fruit dishes.',
        seo_title: 'Easy Avocado Recipes - Guacamole & Avocado Toast | Ed\'s Easy Meals',
        seo_description: 'Easy avocado recipes for healthy fats. Guacamole, avocado toast, avocado salad, avocado smoothies, and nutritious green fruit dishes.',
        featured: true
      },
      {
        name: 'Easy Kiwi Recipes',
        slug: 'easy-kiwi-recipes',
        description: 'Tart kiwi recipes for vitamin C boost. Easy kiwi smoothies, kiwi salad, kiwi tart, and exotic green fruit dishes with tangy sweetness.',
        seo_title: 'Easy Kiwi Recipes - Kiwi Smoothies & Kiwi Salad | Ed\'s Easy Meals',
        seo_description: 'Easy kiwi recipes for vitamin C treats. Kiwi smoothies, kiwi salad, kiwi tart, and tart exotic green fruit dishes.',
        featured: true
      }
    ];

    console.log(`🍎 Inserting ${fruitCategories.length} fruit-based categories...`);

    // Insert categories in batches
    const batchSize = 12;
    let insertedCount = 0;

    for (let i = 0; i < fruitCategories.length; i += batchSize) {
      const batch = fruitCategories.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('categories')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${fruitCategories.length} fruit categories`);
    }

    console.log('🎉 Successfully inserted all fruit-based categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show fruit categories by type
    const fruitTypes = {
      'Citrus Fruits': ['lemon', 'orange', 'lime', 'grapefruit'],
      'Stone Fruits': ['peach', 'cherry', 'plum', 'apricot'],
      'Berries': ['strawberry', 'blueberry', 'raspberry', 'blackberry', 'cranberry'],
      'Tropical Fruits': ['pineapple', 'mango', 'coconut', 'banana'],
      'Tree Fruits': ['apple', 'pear'],
      'Melons': ['watermelon', 'cantaloupe'],
      'Grapes': ['grape'],
      'Exotic Fruits': ['avocado', 'kiwi']
    };

    for (const [category, fruits] of Object.entries(fruitTypes)) {
      console.log(`🍎 ${category.toUpperCase()}:`);

      for (const fruit of fruits) {
        const { data: fruitCategories, error } = await supabase
          .from('categories')
          .select('name, slug')
          .ilike('slug', `%${fruit}%`)
          .order('name');

        if (!error && fruitCategories.length > 0) {
          fruitCategories.forEach(cat => {
            console.log(`   - ${cat.name} (/${cat.slug})`);
          });
        }
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addFruitCategories();