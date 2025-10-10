const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addOccasionCategories() {
  try {
    console.log('🎉 Adding occasion-based recipe categories...');

    // Occasion-based categories targeting specific events and times
    const occasionCategories = [
      // HOLIDAYS
      {
        name: 'Easy Christmas Recipes',
        slug: 'easy-christmas-recipes',
        description: 'Festive Christmas recipes for holiday celebrations. Easy Christmas cookies, roast turkey, Christmas pudding, mulled wine, and traditional holiday dishes.',
        seo_title: 'Easy Christmas Recipes - Christmas Cookies & Roast Turkey | Ed\'s Easy Meals',
        seo_description: 'Easy Christmas recipes for holiday celebrations. Christmas cookies, roast turkey, Christmas pudding, mulled wine, and festive dishes.',
        featured: true
      },
      {
        name: 'Easy Thanksgiving Recipes',
        slug: 'easy-thanksgiving-recipes',
        description: 'Traditional Thanksgiving recipes for family gatherings. Easy roast turkey, stuffing, cranberry sauce, pumpkin pie, and autumn harvest dishes.',
        seo_title: 'Easy Thanksgiving Recipes - Roast Turkey & Pumpkin Pie | Ed\'s Easy Meals',
        seo_description: 'Easy Thanksgiving recipes for family feasts. Roast turkey, stuffing, cranberry sauce, pumpkin pie, and harvest dishes.',
        featured: true
      },
      {
        name: 'Easy Easter Recipes',
        slug: 'easy-easter-recipes',
        description: 'Spring Easter recipes for family celebrations. Easy lamb dishes, hot cross buns, Easter cookies, deviled eggs, and springtime holiday treats.',
        seo_title: 'Easy Easter Recipes - Lamb Dishes & Hot Cross Buns | Ed\'s Easy Meals',
        seo_description: 'Easy Easter recipes for spring celebrations. Lamb dishes, hot cross buns, Easter cookies, deviled eggs, and holiday treats.',
        featured: true
      },
      {
        name: 'Easy Halloween Recipes',
        slug: 'easy-halloween-recipes',
        description: 'Spooky Halloween recipes for trick-or-treat fun. Easy pumpkin treats, orange foods, scary snacks, Halloween cookies, and autumn party dishes.',
        seo_title: 'Easy Halloween Recipes - Pumpkin Treats & Halloween Cookies | Ed\'s Easy Meals',
        seo_description: 'Easy Halloween recipes for spooky fun. Pumpkin treats, orange foods, scary snacks, Halloween cookies, and party dishes.',
        featured: true
      },
      {
        name: 'Easy New Year Recipes',
        slug: 'easy-new-year-recipes',
        description: 'Elegant New Year recipes for midnight celebrations. Easy champagne cocktails, caviar appetizers, party snacks, countdown treats, and resolution-friendly dishes.',
        seo_title: 'Easy New Year Recipes - Champagne Cocktails & Party Snacks | Ed\'s Easy Meals',
        seo_description: 'Easy New Year recipes for celebrations. Champagne cocktails, caviar appetizers, party snacks, countdown treats, and elegant dishes.',
        featured: true
      },

      // SPECIAL OCCASIONS
      {
        name: 'Easy Birthday Recipes',
        slug: 'easy-birthday-recipes',
        description: 'Celebratory birthday recipes for special days. Easy birthday cakes, party food, colorful treats, birthday dinner ideas, and festive desserts.',
        seo_title: 'Easy Birthday Recipes - Birthday Cakes & Party Food | Ed\'s Easy Meals',
        seo_description: 'Easy birthday recipes for celebrations. Birthday cakes, party food, colorful treats, birthday dinners, and festive desserts.',
        featured: true
      },
      {
        name: 'Easy Anniversary Recipes',
        slug: 'easy-anniversary-recipes',
        description: 'Romantic anniversary recipes for couples. Easy elegant dinners, chocolate desserts, wine pairings, intimate meals, and love-inspired dishes.',
        seo_title: 'Easy Anniversary Recipes - Romantic Dinners & Chocolate Desserts | Ed\'s Easy Meals',
        seo_description: 'Easy anniversary recipes for romance. Elegant dinners, chocolate desserts, wine pairings, intimate meals, and couples\' dishes.',
        featured: true
      },
      {
        name: 'Easy Wedding Recipes',
        slug: 'easy-wedding-recipes',
        description: 'Elegant wedding recipes for special celebrations. Easy wedding cake, bridal shower snacks, reception food, rehearsal dinner ideas, and matrimonial dishes.',
        seo_title: 'Easy Wedding Recipes - Wedding Cake & Reception Food | Ed\'s Easy Meals',
        seo_description: 'Easy wedding recipes for special days. Wedding cake, bridal shower snacks, reception food, rehearsal dinners, and celebration dishes.',
        featured: true
      },
      {
        name: 'Easy Baby Shower Recipes',
        slug: 'easy-baby-shower-recipes',
        description: 'Sweet baby shower recipes for welcoming celebrations. Easy finger foods, pastel treats, cute snacks, shower cake ideas, and pregnancy-safe dishes.',
        seo_title: 'Easy Baby Shower Recipes - Finger Foods & Pastel Treats | Ed\'s Easy Meals',
        seo_description: 'Easy baby shower recipes for celebrations. Finger foods, pastel treats, cute snacks, shower cakes, and welcoming dishes.',
        featured: true
      },

      // ENTERTAINMENT
      {
        name: 'Easy Party Recipes',
        slug: 'easy-party-recipes',
        description: 'Fun party recipes for entertaining crowds. Easy appetizers, finger foods, party dips, crowd-pleasing snacks, and celebration dishes for any gathering.',
        seo_title: 'Easy Party Recipes - Appetizers & Finger Foods | Ed\'s Easy Meals',
        seo_description: 'Easy party recipes for entertaining. Appetizers, finger foods, party dips, crowd-pleasing snacks, and celebration dishes.',
        featured: true
      },
      {
        name: 'Easy Game Day Recipes',
        slug: 'easy-game-day-recipes',
        description: 'Hearty game day recipes for sports watching. Easy wings, nachos, sliders, dips, tailgate food, and stadium-style snacks for football fans.',
        seo_title: 'Easy Game Day Recipes - Wings & Nachos | Ed\'s Easy Meals',
        seo_description: 'Easy game day recipes for sports fans. Wings, nachos, sliders, dips, tailgate food, and stadium-style snacks.',
        featured: true
      },
      {
        name: 'Easy Picnic Recipes',
        slug: 'easy-picnic-recipes',
        description: 'Portable picnic recipes for outdoor dining. Easy sandwiches, pasta salads, finger foods, no-cook dishes, and travel-friendly outdoor meals.',
        seo_title: 'Easy Picnic Recipes - Sandwiches & Pasta Salads | Ed\'s Easy Meals',
        seo_description: 'Easy picnic recipes for outdoor dining. Sandwiches, pasta salads, finger foods, no-cook dishes, and portable meals.',
        featured: true
      },
      {
        name: 'Easy BBQ Recipes',
        slug: 'easy-bbq-recipes',
        description: 'Smoky BBQ recipes for grilling season. Easy grilled meats, barbecue sauce, coleslaw, corn on the cob, and summer cookout favorites.',
        seo_title: 'Easy BBQ Recipes - Grilled Meats & Barbecue Sauce | Ed\'s Easy Meals',
        seo_description: 'Easy BBQ recipes for grilling season. Grilled meats, barbecue sauce, coleslaw, corn on the cob, and cookout favorites.',
        featured: true
      },

      // TIME-BASED
      {
        name: 'Easy Brunch Recipes',
        slug: 'easy-brunch-recipes',
        description: 'Delicious brunch recipes for weekend mornings. Easy eggs benedict, pancakes, french toast, mimosas, and late morning dining dishes.',
        seo_title: 'Easy Brunch Recipes - Eggs Benedict & Pancakes | Ed\'s Easy Meals',
        seo_description: 'Easy brunch recipes for weekends. Eggs benedict, pancakes, french toast, mimosas, and late morning dishes.',
        featured: true
      },
      {
        name: 'Easy Weeknight Recipes',
        slug: 'easy-weeknight-recipes',
        description: 'Quick weeknight recipes for busy families. Easy 30-minute dinners, one-pot meals, simple ingredients, and stress-free weekday cooking.',
        seo_title: 'Easy Weeknight Recipes - 30-Minute Dinners & One-Pot Meals | Ed\'s Easy Meals',
        seo_description: 'Easy weeknight recipes for busy families. 30-minute dinners, one-pot meals, simple ingredients, and quick weekday cooking.',
        featured: true
      },
      {
        name: 'Easy Weekend Recipes',
        slug: 'easy-weekend-recipes',
        description: 'Relaxed weekend recipes for leisurely cooking. Easy slow-cooked meals, baking projects, family dinners, and weekend cooking adventures.',
        seo_title: 'Easy Weekend Recipes - Slow-Cooked Meals & Baking Projects | Ed\'s Easy Meals',
        seo_description: 'Easy weekend recipes for leisurely cooking. Slow-cooked meals, baking projects, family dinners, and weekend adventures.',
        featured: true
      },

      // SEASONAL
      {
        name: 'Easy Summer Recipes',
        slug: 'easy-summer-recipes',
        description: 'Fresh summer recipes for hot weather cooking. Easy no-cook meals, grilled foods, cold soups, ice cream, and seasonal produce dishes.',
        seo_title: 'Easy Summer Recipes - No-Cook Meals & Grilled Foods | Ed\'s Easy Meals',
        seo_description: 'Easy summer recipes for hot weather. No-cook meals, grilled foods, cold soups, ice cream, and fresh seasonal dishes.',
        featured: true
      },
      {
        name: 'Easy Winter Recipes',
        slug: 'easy-winter-recipes',
        description: 'Warming winter recipes for cold days. Easy stews, soups, comfort food, hot drinks, hearty casseroles, and cozy seasonal dishes.',
        seo_title: 'Easy Winter Recipes - Stews & Comfort Food | Ed\'s Easy Meals',
        seo_description: 'Easy winter recipes for cold days. Stews, soups, comfort food, hot drinks, hearty casseroles, and warming dishes.',
        featured: true
      }
    ];

    console.log(`🎉 Inserting ${occasionCategories.length} occasion-based categories...`);

    // Insert categories in batches
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < occasionCategories.length; i += batchSize) {
      const batch = occasionCategories.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('categories')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${occasionCategories.length} occasion categories`);
    }

    console.log('🎉 Successfully inserted all occasion-based categories!');

    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total categories in database: ${allCategories.length}`);
    }

    // Show the new categories grouped by type
    console.log('🎉 NEW OCCASION-BASED CATEGORIES:');
    console.log('   HOLIDAYS:');
    console.log('   - Easy Christmas Recipes (/easy-christmas-recipes)');
    console.log('   - Easy Thanksgiving Recipes (/easy-thanksgiving-recipes)');
    console.log('   - Easy Easter Recipes (/easy-easter-recipes)');
    console.log('   - Easy Halloween Recipes (/easy-halloween-recipes)');
    console.log('   - Easy New Year Recipes (/easy-new-year-recipes)');

    console.log('   SPECIAL OCCASIONS:');
    console.log('   - Easy Birthday Recipes (/easy-birthday-recipes)');
    console.log('   - Easy Anniversary Recipes (/easy-anniversary-recipes)');
    console.log('   - Easy Wedding Recipes (/easy-wedding-recipes)');
    console.log('   - Easy Baby Shower Recipes (/easy-baby-shower-recipes)');

    console.log('   ENTERTAINMENT:');
    console.log('   - Easy Party Recipes (/easy-party-recipes)');
    console.log('   - Easy Game Day Recipes (/easy-game-day-recipes)');
    console.log('   - Easy Picnic Recipes (/easy-picnic-recipes)');
    console.log('   - Easy BBQ Recipes (/easy-bbq-recipes)');

    console.log('   TIME-BASED:');
    console.log('   - Easy Brunch Recipes (/easy-brunch-recipes)');
    console.log('   - Easy Weeknight Recipes (/easy-weeknight-recipes)');
    console.log('   - Easy Weekend Recipes (/easy-weekend-recipes)');

    console.log('   SEASONAL:');
    console.log('   - Easy Summer Recipes (/easy-summer-recipes)');
    console.log('   - Easy Winter Recipes (/easy-winter-recipes)');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addOccasionCategories();