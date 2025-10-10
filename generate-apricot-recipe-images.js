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

// Define detailed prompts for each apricot recipe
const recipePrompts = {
  'apricot-galette': 'Home-style food photography of a rustic apricot galette with golden, flaky pastry and beautiful caramelized apricot halves arranged in a free-form tart. Shot on parchment paper on a wooden surface in a cozy home kitchen with warm, natural lighting. Fresh apricots scattered nearby.',

  'apricot-jam': 'Home-style food photography of homemade apricot jam in a clear glass jar with a wooden spoon, golden orange color, sitting on a rustic kitchen counter. Fresh whole apricots and apricot halves around the jar, warm natural lighting in a cozy home kitchen setting.',

  'apricot-chicken': 'Home-style food photography of glazed apricot chicken breasts in a cast iron skillet, golden brown with glossy apricot glaze, garnished with fresh herbs. Cozy home kitchen setting with warm lighting, a few fresh apricots in the background.',

  'apricot-scones': 'Home-style food photography of golden apricot scones on a wire cooling rack, showing visible dried apricot pieces and a rustic, flaky texture. Warm home kitchen lighting, with a few dried apricots scattered around and a vintage kitchen towel.',

  'apricot-smoothie': 'Home-style food photography of a creamy orange-colored apricot smoothie in a tall clear glass, garnished with fresh mint and an apricot slice. Shot in a bright, airy home kitchen with natural morning light, fresh apricots and a blender visible in the background.'
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

async function generateApricotRecipeImages() {
  try {
    console.log('🍑 Generating AI images for Apricot Recipes...');

    // Get all apricot recipes
    const apricotRecipeSlugs = Object.keys(recipePrompts);

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, slug, title')
      .in('slug', apricotRecipeSlugs);

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    console.log(`Found ${recipes.length} apricot recipes to generate images for.`);

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

    console.log('\\n🎉 Apricot recipe image generation completed!');
    console.log('\\n📍 All images saved to: public/images/recipes/');
    console.log('\\n🌐 Visit http://localhost:3002/categories/apricot-recipes to see your new apricot recipes!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

generateApricotRecipeImages();