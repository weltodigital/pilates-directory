const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define detailed prompts for each recipe
const recipePrompts = {
  // Artichoke Recipes
  'stuffed-artichokes': 'Home-style food photography of golden stuffed artichokes with breadcrumb filling, arranged on a rustic wooden table. The artichokes are perfectly cooked with beautifully browned herbed breadcrumb stuffing visible between the leaves. Warm kitchen lighting with scattered fresh herbs and lemon wedges.',

  'artichoke-dip': 'Home-style food photography of hot, bubbly artichoke dip in a white ceramic baking dish, golden brown on top with melted cheese. Served with toasted baguette slices and tortilla chips around the dish. Cozy kitchen setting with warm lighting.',

  'artichoke-pasta': 'Home-style food photography of colorful pasta with marinated artichokes and cherry tomatoes in a large white bowl. Fresh basil leaves scattered on top, with a fork twirling the pasta. Bright, airy kitchen with natural lighting.',

  'artichoke-salad': 'Home-style food photography of Mediterranean artichoke salad with mixed greens, cherry tomatoes, olives, and crumbled feta cheese on a rustic wooden plate. Drizzled with olive oil and garnished with fresh herbs. Natural lighting.',

  'artichoke-gratin': 'Home-style food photography of golden bubbling artichoke gratin in a ceramic baking dish, with layers visible through the golden cheese top. Steam rising slightly, shot in a cozy home kitchen with warm lighting.',

  // Asparagus Recipes
  'roasted-asparagus': 'Home-style food photography of perfectly roasted asparagus spears on a white ceramic platter, golden brown tips with a drizzle of olive oil and lemon zest. Fresh lemon wedges nearby, shot with natural window lighting.',

  'asparagus-soup': 'Home-style food photography of creamy, vibrant green asparagus soup in a white bowl, garnished with fresh asparagus tips and a swirl of cream. Rustic bread on the side, warm kitchen lighting.',

  'asparagus-stir-fry': 'Home-style food photography of colorful asparagus stir-fry in a black wok, bright green asparagus with garlic and sesame seeds. Steam rising from the hot pan, Asian-inspired kitchen setting.',

  'asparagus-risotto': 'Home-style food photography of creamy asparagus risotto in a white bowl, garnished with fresh asparagus spears and grated Parmesan. Rich, creamy texture visible, elegant home dining setting.',

  'asparagus-quiche': 'Home-style food photography of a slice of golden asparagus quiche on a ceramic plate, showing the custard filling with asparagus spears. Flaky crust visible, natural morning light streaming through kitchen window.',

  // Avocado Recipes
  'avocado-toast': 'Home-style food photography of perfectly mashed avocado toast on rustic sourdough bread, topped with everything bagel seasoning and red pepper flakes. Shot from above on a marble countertop with natural lighting.',

  'guacamole': 'Home-style food photography of fresh, chunky guacamole in a rustic ceramic bowl, garnished with cilantro and lime wedges. Colorful tortilla chips arranged around the bowl, festive Mexican-inspired setting.',

  'avocado-smoothie': 'Home-style food photography of a creamy, pale green avocado smoothie in a tall clear glass, garnished with mint leaves. Fresh avocado halves and spinach leaves visible in the background, bright morning light.',

  'avocado-pasta': 'Home-style food photography of creamy green avocado pasta in a large white bowl, garnished with cherry tomatoes and fresh basil. Fork twirling the pasta, bright kitchen with natural lighting.',

  'avocado-salad': 'Home-style food photography of colorful avocado salad with cucumber, tomatoes, and red onion in a wooden bowl. Dressed with lime vinaigrette and garnished with cilantro, fresh and vibrant presentation.',

  // Bacon Recipes
  'perfect-bacon': 'Home-style food photography of perfectly crispy bacon strips on parchment paper on a baking sheet, golden brown and evenly cooked. Steam rising slightly, shot in a bright kitchen with natural lighting.',

  'bacon-mac-and-cheese': 'Home-style food photography of creamy mac and cheese with visible bacon pieces in a cast iron skillet, golden cheese sauce coating the pasta. Comfort food styling with warm kitchen lighting.',

  'bacon-wrapped-chicken': 'Home-style food photography of golden bacon-wrapped chicken breasts in a cast iron skillet, the bacon crispy and chicken juicy. Herbs scattered around, rustic home kitchen setting.',

  'bacon-carbonara': 'Home-style food photography of creamy carbonara pasta with crispy bacon pieces in a large white bowl, freshly cracked black pepper on top. Steam rising, elegant yet homey presentation.',

  'bacon-brussels-sprouts': 'Home-style food photography of roasted Brussels sprouts with crispy bacon pieces on a white ceramic platter, caramelized and golden. Balsamic glaze drizzled over, rustic kitchen setting.',

  // Banana Recipes
  'banana-pancakes': 'Home-style food photography of a stack of fluffy banana pancakes with visible banana pieces, topped with butter and maple syrup dripping down the sides. Morning breakfast setting with natural light.',

  'banana-smoothie': 'Home-style food photography of a creamy, pale yellow banana smoothie in tall glasses, garnished with banana slices and a sprinkle of cinnamon. Fresh bananas in the background, bright morning light.',

  'banana-muffins': 'Home-style food photography of golden banana muffins with dome tops in paper liners on a wire cooling rack. One muffin broken open showing the moist interior, cozy kitchen setting.',

  'banana-foster': 'Home-style food photography of caramelized banana foster in a cast iron skillet with vanilla ice cream scoops, the bananas glistening in brown sugar sauce. Elegant dessert presentation with warm lighting.',

  // Beef Recipes
  'beef-tacos': 'Home-style food photography of colorful beef tacos in hard and soft shells, loaded with seasoned ground beef, lettuce, tomatoes, cheese, and sour cream. Mexican-inspired table setting with lime wedges.',

  'beef-stir-fry': 'Home-style food photography of sizzling beef stir-fry in a wok with colorful vegetables - bell peppers, broccoli, and carrots. Steam rising from the hot pan, Asian-inspired kitchen setting.',

  'beef-burgers': 'Home-style food photography of juicy beef burgers on brioche buns with melted cheese, lettuce, tomato, and onion. Shot on a wooden cutting board with fries on the side, casual dining atmosphere.',

  'beef-and-rice': 'Home-style food photography of hearty beef and rice in a large skillet, with ground beef, rice, and colorful vegetables all mixed together. Comfort food styling with warm kitchen lighting.',

  'beef-meatballs': 'Home-style food photography of tender beef meatballs in rich tomato sauce in a cast iron skillet, garnished with fresh basil leaves. Steam rising, rustic Italian-inspired presentation.',

  // Beef Stew Recipes
  'classic-beef-stew': 'Home-style food photography of hearty beef stew in a ceramic bowl, showing chunks of tender beef, potatoes, carrots, and celery in rich brown gravy. Crusty bread on the side, cozy winter setting.',

  'slow-cooker-beef-stew': 'Home-style food photography of tender slow cooker beef stew with perfectly cooked vegetables in a white bowl. Rich, thick broth visible, comfort food styling with warm lighting.',

  'irish-beef-stew': 'Home-style food photography of traditional Irish beef stew in a rustic ceramic bowl, dark rich broth with tender beef and vegetables. Shot with a pint of beer nearby, authentic pub atmosphere.',

  'beef-and-mushroom-stew': 'Home-style food photography of rich beef and mushroom stew with various mushroom types visible, in a deep ceramic bowl. Earthy, rustic presentation with fresh herbs scattered around.',

  'beef-stew-with-dumplings': 'Home-style food photography of classic beef stew topped with fluffy white dumplings in a large pot, steam rising from the hot stew. Comfort food styling with warm, cozy lighting.'
};

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function generateExtendedRecipeImages() {
  try {
    console.log('🎨 Generating AI images for Extended Recipe Collections...');

    // Get all recipes that need images
    const recipeSlugs = Object.keys(recipePrompts);

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, slug, title')
      .in('slug', recipeSlugs);

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    console.log(`Found ${recipes.length} recipes to generate images for.`);

    // Ensure the images directory exists
    const imagesDir = path.join(__dirname, 'public', 'images', 'recipes');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    for (const recipe of recipes) {
      console.log(`\\n🎨 Generating image for: ${recipe.title}`);

      const prompt = recipePrompts[recipe.slug];
      if (!prompt) {
        console.log(`   ⚠️ No prompt defined for ${recipe.slug}, skipping...`);
        continue;
      }

      try {
        // Generate image with DALL-E
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        const imageUrl = response.data[0].url;
        const filename = path.join(imagesDir, `${recipe.slug}.jpg`);

        // Download the image
        await downloadImage(imageUrl, filename);
        console.log(`   ✅ Image generated and saved: ${recipe.slug}.jpg`);

        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (imageError) {
        console.error(`   ❌ Error generating image for ${recipe.slug}:`, imageError.message);
        continue;
      }
    }

    console.log('\\n🎉 Extended recipe image generation completed!');
    console.log('\\n📍 All images saved to: public/images/recipes/');
    console.log('\\n🌐 Visit http://localhost:3002 to see your new recipe collections!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

generateExtendedRecipeImages();