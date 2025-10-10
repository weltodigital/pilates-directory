const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addVegetableCategories() {
  try {
    console.log('🥕 Adding comprehensive vegetable-based recipe categories...');

    // Vegetable-based categories targeting "Easy [Vegetable] Recipes" keywords
    const vegetableCategories = [
      // ROOT VEGETABLES
      {
        name: 'Easy Potato Recipes',
        slug: 'easy-potato-recipes',
        description: 'Delicious potato recipes beyond basic boiling. Easy roasted potatoes, mashed potatoes, potato casseroles, baked potatoes, and creative potato dishes for every meal.',
        seo_title: 'Easy Potato Recipes - Roasted Potatoes & Mashed Potato Dishes | Ed\'s Easy Meals',
        seo_description: 'Easy potato recipes for every meal. Roasted potatoes, mashed potatoes, potato casseroles, baked potatoes, and creative potato dishes.',
        featured: true
      },
      {
        name: 'Easy Sweet Potato Recipes',
        slug: 'easy-sweet-potato-recipes',
        description: 'Healthy sweet potato recipes packed with nutrients. Easy roasted sweet potatoes, sweet potato fries, sweet potato casseroles, and nutritious orange veggie dishes.',
        seo_title: 'Easy Sweet Potato Recipes - Roasted Sweet Potatoes & Sweet Potato Fries | Ed\'s Easy Meals',
        seo_description: 'Easy sweet potato recipes for healthy meals. Roasted sweet potatoes, sweet potato fries, casseroles, and nutritious orange veggie dishes.',
        featured: true
      },
      {
        name: 'Easy Carrot Recipes',
        slug: 'easy-carrot-recipes',
        description: 'Sweet and savory carrot recipes for healthy eating. Easy roasted carrots, carrot soup, glazed carrots, carrot cake, and nutritious orange vegetable dishes.',
        seo_title: 'Easy Carrot Recipes - Roasted Carrots & Carrot Soup | Ed\'s Easy Meals',
        seo_description: 'Easy carrot recipes for sweet and savory meals. Roasted carrots, carrot soup, glazed carrots, carrot cake, and healthy orange vegetables.',
        featured: true
      },
      {
        name: 'Easy Beet Recipes',
        slug: 'easy-beet-recipes',
        description: 'Earthy beet recipes with vibrant colors. Easy roasted beets, beet salad, beet hummus, pickled beets, and nutritious root vegetable dishes.',
        seo_title: 'Easy Beet Recipes - Roasted Beets & Beet Salad | Ed\'s Easy Meals',
        seo_description: 'Easy beet recipes with vibrant colors. Roasted beets, beet salad, beet hummus, pickled beets, and nutritious root vegetables.',
        featured: true
      },

      // CRUCIFEROUS VEGETABLES
      {
        name: 'Easy Broccoli Recipes',
        slug: 'easy-broccoli-recipes',
        description: 'Nutritious broccoli recipes kids and adults love. Easy roasted broccoli, broccoli cheese soup, steamed broccoli, and healthy green vegetable dishes.',
        seo_title: 'Easy Broccoli Recipes - Roasted Broccoli & Broccoli Cheese Soup | Ed\'s Easy Meals',
        seo_description: 'Easy broccoli recipes for nutritious meals. Roasted broccoli, broccoli cheese soup, steamed broccoli, and healthy green vegetables.',
        featured: true
      },
      {
        name: 'Easy Cauliflower Recipes',
        slug: 'easy-cauliflower-recipes',
        description: 'Versatile cauliflower recipes for low-carb eating. Easy cauliflower rice, roasted cauliflower, cauliflower pizza crust, and healthy white veggie dishes.',
        seo_title: 'Easy Cauliflower Recipes - Cauliflower Rice & Roasted Cauliflower | Ed\'s Easy Meals',
        seo_description: 'Easy cauliflower recipes for low-carb meals. Cauliflower rice, roasted cauliflower, cauliflower pizza crust, and healthy white vegetables.',
        featured: true
      },
      {
        name: 'Easy Brussels Sprouts Recipes',
        slug: 'easy-brussels-sprouts-recipes',
        description: 'Delicious Brussels sprouts recipes that convert skeptics. Easy roasted Brussels sprouts, shredded Brussels sprouts salad, and crispy sprout dishes.',
        seo_title: 'Easy Brussels Sprouts Recipes - Roasted Brussels Sprouts | Ed\'s Easy Meals',
        seo_description: 'Easy Brussels sprouts recipes that taste amazing. Roasted Brussels sprouts, shredded Brussels sprouts salad, and crispy sprout dishes.',
        featured: true
      },
      {
        name: 'Easy Cabbage Recipes',
        slug: 'easy-cabbage-recipes',
        description: 'Budget-friendly cabbage recipes for healthy eating. Easy cabbage soup, coleslaw, stuffed cabbage, sauerkraut, and nutritious leafy green dishes.',
        seo_title: 'Easy Cabbage Recipes - Cabbage Soup & Stuffed Cabbage | Ed\'s Easy Meals',
        seo_description: 'Easy cabbage recipes for budget-friendly meals. Cabbage soup, coleslaw, stuffed cabbage, sauerkraut, and healthy leafy greens.',
        featured: true
      },

      // LEAFY GREENS
      {
        name: 'Easy Spinach Recipes',
        slug: 'easy-spinach-recipes',
        description: 'Iron-rich spinach recipes for healthy meals. Easy creamed spinach, spinach salad, spinach pasta, wilted spinach, and nutritious leafy green dishes.',
        seo_title: 'Easy Spinach Recipes - Creamed Spinach & Spinach Pasta | Ed\'s Easy Meals',
        seo_description: 'Easy spinach recipes for iron-rich meals. Creamed spinach, spinach salad, spinach pasta, wilted spinach, and healthy leafy greens.',
        featured: true
      },
      {
        name: 'Easy Kale Recipes',
        slug: 'easy-kale-recipes',
        description: 'Superfood kale recipes made delicious. Easy kale chips, massaged kale salad, kale smoothies, sautéed kale, and nutritious dark leafy green dishes.',
        seo_title: 'Easy Kale Recipes - Kale Chips & Massaged Kale Salad | Ed\'s Easy Meals',
        seo_description: 'Easy kale recipes for superfood nutrition. Kale chips, massaged kale salad, kale smoothies, sautéed kale, and dark leafy greens.',
        featured: true
      },
      {
        name: 'Easy Lettuce Recipes',
        slug: 'easy-lettuce-recipes',
        description: 'Fresh lettuce recipes beyond basic salads. Easy lettuce wraps, grilled lettuce, lettuce soup, wilted lettuce, and creative leafy green dishes.',
        seo_title: 'Easy Lettuce Recipes - Lettuce Wraps & Creative Lettuce Dishes | Ed\'s Easy Meals',
        seo_description: 'Easy lettuce recipes beyond salads. Lettuce wraps, grilled lettuce, lettuce soup, wilted lettuce, and creative leafy greens.',
        featured: true
      },

      // NIGHTSHADES
      {
        name: 'Easy Tomato Recipes',
        slug: 'easy-tomato-recipes',
        description: 'Fresh tomato recipes for summer abundance. Easy tomato sauce, stuffed tomatoes, tomato salad, roasted tomatoes, and garden-fresh tomato dishes.',
        seo_title: 'Easy Tomato Recipes - Fresh Tomato Sauce & Stuffed Tomatoes | Ed\'s Easy Meals',
        seo_description: 'Easy tomato recipes for fresh summer flavors. Tomato sauce, stuffed tomatoes, tomato salad, roasted tomatoes, and garden-fresh dishes.',
        featured: true
      },
      {
        name: 'Easy Bell Pepper Recipes',
        slug: 'easy-bell-pepper-recipes',
        description: 'Colorful bell pepper recipes for vitamin C. Easy stuffed peppers, roasted peppers, pepper stir-fry, pepper salad, and vibrant sweet pepper dishes.',
        seo_title: 'Easy Bell Pepper Recipes - Stuffed Peppers & Roasted Peppers | Ed\'s Easy Meals',
        seo_description: 'Easy bell pepper recipes for colorful meals. Stuffed peppers, roasted peppers, pepper stir-fry, pepper salad, and sweet peppers.',
        featured: true
      },
      {
        name: 'Easy Eggplant Recipes',
        slug: 'easy-eggplant-recipes',
        description: 'Mediterranean eggplant recipes made simple. Easy eggplant parmesan, baba ganoush, grilled eggplant, moussaka, and purple veggie dishes.',
        seo_title: 'Easy Eggplant Recipes - Eggplant Parmesan & Baba Ganoush | Ed\'s Easy Meals',
        seo_description: 'Easy eggplant recipes for Mediterranean flavors. Eggplant parmesan, baba ganoush, grilled eggplant, moussaka, and purple vegetables.',
        featured: true
      },

      // SQUASH FAMILY
      {
        name: 'Easy Zucchini Recipes',
        slug: 'easy-zucchini-recipes',
        description: 'Versatile zucchini recipes for summer gardens. Easy zucchini bread, zucchini noodles, stuffed zucchini, grilled zucchini, and green summer squash dishes.',
        seo_title: 'Easy Zucchini Recipes - Zucchini Bread & Zucchini Noodles | Ed\'s Easy Meals',
        seo_description: 'Easy zucchini recipes for summer abundance. Zucchini bread, zucchini noodles, stuffed zucchini, grilled zucchini, and summer squash.',
        featured: true
      },
      {
        name: 'Easy Butternut Squash Recipes',
        slug: 'easy-butternut-squash-recipes',
        description: 'Creamy butternut squash recipes for fall comfort. Easy butternut squash soup, roasted butternut squash, squash risotto, and orange winter squash dishes.',
        seo_title: 'Easy Butternut Squash Recipes - Butternut Squash Soup | Ed\'s Easy Meals',
        seo_description: 'Easy butternut squash recipes for fall comfort. Butternut squash soup, roasted butternut squash, squash risotto, and winter squash.',
        featured: true
      },
      {
        name: 'Easy Acorn Squash Recipes',
        slug: 'easy-acorn-squash-recipes',
        description: 'Sweet acorn squash recipes for autumn meals. Easy stuffed acorn squash, roasted acorn squash, maple glazed squash, and fall comfort food.',
        seo_title: 'Easy Acorn Squash Recipes - Stuffed Acorn Squash & Roasted Squash | Ed\'s Easy Meals',
        seo_description: 'Easy acorn squash recipes for autumn comfort. Stuffed acorn squash, roasted acorn squash, maple glazed squash, and fall vegetables.',
        featured: true
      },

      // ONION FAMILY
      {
        name: 'Easy Onion Recipes',
        slug: 'easy-onion-recipes',
        description: 'Flavorful onion recipes for cooking basics. Easy caramelized onions, French onion soup, onion rings, pickled onions, and aromatic allium dishes.',
        seo_title: 'Easy Onion Recipes - Caramelized Onions & French Onion Soup | Ed\'s Easy Meals',
        seo_description: 'Easy onion recipes for flavor foundations. Caramelized onions, French onion soup, onion rings, pickled onions, and aromatic dishes.',
        featured: true
      },
      {
        name: 'Easy Garlic Recipes',
        slug: 'easy-garlic-recipes',
        description: 'Aromatic garlic recipes for flavor lovers. Easy roasted garlic, garlic bread, garlic pasta, garlic soup, and pungent allium dishes.',
        seo_title: 'Easy Garlic Recipes - Roasted Garlic & Garlic Bread | Ed\'s Easy Meals',
        seo_description: 'Easy garlic recipes for aromatic flavors. Roasted garlic, garlic bread, garlic pasta, garlic soup, and pungent dishes.',
        featured: true
      },

      // MUSHROOMS
      {
        name: 'Easy Mushroom Recipes',
        slug: 'easy-mushroom-recipes',
        description: 'Earthy mushroom recipes for umami flavors. Easy mushroom risotto, stuffed mushrooms, mushroom soup, sautéed mushrooms, and fungi dishes.',
        seo_title: 'Easy Mushroom Recipes - Mushroom Risotto & Stuffed Mushrooms | Ed\'s Easy Meals',
        seo_description: 'Easy mushroom recipes for earthy flavors. Mushroom risotto, stuffed mushrooms, mushroom soup, sautéed mushrooms, and fungi dishes.',
        featured: true
      },

      // CORN & PEAS
      {
        name: 'Easy Corn Recipes',
        slug: 'easy-corn-recipes',
        description: 'Sweet corn recipes for summer enjoyment. Easy corn on the cob, corn salad, corn chowder, Mexican street corn, and yellow vegetable dishes.',
        seo_title: 'Easy Corn Recipes - Corn on the Cob & Mexican Street Corn | Ed\'s Easy Meals',
        seo_description: 'Easy corn recipes for sweet summer flavors. Corn on the cob, corn salad, corn chowder, Mexican street corn, and yellow vegetables.',
        featured: true
      },
      {
        name: 'Easy Pea Recipes',
        slug: 'easy-pea-recipes',
        description: 'Fresh pea recipes for spring vegetables. Easy pea soup, pea salad, snap peas, pea risotto, and bright green legume dishes.',
        seo_title: 'Easy Pea Recipes - Pea Soup & Fresh Pea Salad | Ed\'s Easy Meals',
        seo_description: 'Easy pea recipes for spring vegetables. Pea soup, pea salad, snap peas, pea risotto, and bright green legumes.',
        featured: true
      },

      // ASPARAGUS & ARTICHOKES
      {
        name: 'Easy Asparagus Recipes',
        slug: 'easy-asparagus-recipes',
        description: 'Elegant asparagus recipes for spring dining. Easy roasted asparagus, grilled asparagus, asparagus soup, and sophisticated green vegetable dishes.',
        seo_title: 'Easy Asparagus Recipes - Roasted Asparagus & Grilled Asparagus | Ed\'s Easy Meals',
        seo_description: 'Easy asparagus recipes for elegant spring meals. Roasted asparagus, grilled asparagus, asparagus soup, and green vegetables.',
        featured: true
      },
      {
        name: 'Easy Artichoke Recipes',
        slug: 'easy-artichoke-recipes',
        description: 'Mediterranean artichoke recipes made accessible. Easy stuffed artichokes, artichoke dip, grilled artichokes, and elegant thistle dishes.',
        seo_title: 'Easy Artichoke Recipes - Stuffed Artichokes & Artichoke Dip | Ed\'s Easy Meals',
        seo_description: 'Easy artichoke recipes for Mediterranean flavors. Stuffed artichokes, artichoke dip, grilled artichokes, and elegant dishes.',
        featured: true
      }
    ];

    console.log(`🥕 Inserting ${vegetableCategories.length} vegetable-based categories...`);

    // Insert categories in batches
    const batchSize = 12;
    let insertedCount = 0;

    for (let i = 0; i < vegetableCategories.length; i += batchSize) {
      const batch = vegetableCategories.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('categories')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${vegetableCategories.length} vegetable categories`);
    }

    console.log('🎉 Successfully inserted all vegetable-based categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show vegetable categories by type
    const vegetableTypes = {
      'Root Vegetables': ['potato', 'sweet-potato', 'carrot', 'beet'],
      'Cruciferous': ['broccoli', 'cauliflower', 'brussels-sprouts', 'cabbage'],
      'Leafy Greens': ['spinach', 'kale', 'lettuce'],
      'Nightshades': ['tomato', 'bell-pepper', 'eggplant'],
      'Squash Family': ['zucchini', 'butternut-squash', 'acorn-squash'],
      'Alliums': ['onion', 'garlic'],
      'Other Favorites': ['mushroom', 'corn', 'pea', 'asparagus', 'artichoke']
    };

    for (const [category, vegetables] of Object.entries(vegetableTypes)) {
      console.log(`🥕 ${category.toUpperCase()}:`);

      for (const veggie of vegetables) {
        const { data: veggieCategories, error } = await supabase
          .from('categories')
          .select('name, slug')
          .ilike('slug', `%${veggie}%`)
          .order('name');

        if (!error && veggieCategories.length > 0) {
          veggieCategories.forEach(cat => {
            console.log(`   - ${cat.name} (/${cat.slug})`);
          });
        }
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addVegetableCategories();