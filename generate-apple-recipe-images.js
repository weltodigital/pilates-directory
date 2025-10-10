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

// Define detailed prompts for each apple recipe
const recipePrompts = {
  'easy-classic-apple-pie': 'Home-style food photography of a classic apple pie with golden brown lattice crust, fresh apple slices visible through the lattice, sitting on a rustic wooden counter in a cozy home kitchen. Warm, inviting lighting with a few whole red apples and cinnamon sticks in the background. The pie crust is perfectly golden and flaky.',

  'easy-apple-crisp': 'Home-style food photography of apple crisp in a white ceramic baking dish, golden oat crumble topping bubbling with caramelized apple filling underneath. Served in a cozy home kitchen with warm natural lighting, a wooden spoon nearby, and fresh apples scattered around.',

  'easy-cinnamon-apple-muffins': 'Home-style food photography of freshly baked cinnamon apple muffins on a cooling rack, golden brown tops with visible apple pieces, steam rising slightly. Cozy home kitchen setting with warm lighting, a few whole apples and cinnamon sticks in the background, rustic wooden countertop.',

  'easy-apple-pancakes': 'Home-style food photography of a stack of fluffy apple pancakes on a rustic wooden plate, golden brown with visible apple pieces, pat of butter melting on top, maple syrup drizzling down the sides. Cozy home kitchen setting with warm morning light, fresh apples and a bottle of syrup in the background.',

  'easy-apple-cinnamon-bread': 'Home-style food photography of sliced apple cinnamon bread on a wooden cutting board, showing the beautiful cinnamon swirl and apple pieces inside. Rustic home kitchen setting with warm natural lighting, whole apples and cinnamon sticks nearby, crumbs scattered naturally.'
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

async function generateAppleRecipeImages() {
  try {
    console.log('🍎 Generating AI images for Apple Recipes...');

    // Get all apple recipes
    const appleRecipeSlugs = Object.keys(recipePrompts);

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, slug, title')
      .in('slug', appleRecipeSlugs);

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    console.log(`Found ${recipes.length} apple recipes to generate images for.`);

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

    console.log('\\n🎉 Apple recipe image generation completed!');
    console.log('\\n📍 All images saved to: public/images/recipes/');
    console.log('\\n🌐 Visit http://localhost:3002/categories/easy-apple-recipes to see your new apple recipes!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

generateAppleRecipeImages();