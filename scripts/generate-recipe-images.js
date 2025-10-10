const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize OpenAI (you'll need to add OPENAI_API_KEY to your .env.local)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this to your .env.local
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateRecipeImage(recipe) {
  try {
    // Create a detailed prompt for the recipe
    const prompt = `Professional food photography of ${recipe.title.toLowerCase()}, ${recipe.description}.
    The dish should look appetizing and restaurant-quality.
    High-resolution food styling with warm, inviting lighting.
    Clean white or rustic background.
    Shot from a slight overhead angle showing the full dish.
    Professional food magazine quality.`;

    console.log(`Generating image for: ${recipe.title}`);
    console.log(`Prompt: ${prompt}`);

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    const filename = `${recipe.slug}.jpg`;
    const filepath = path.join(__dirname, '../public/images/recipes', filename);

    // Download the generated image
    await downloadImage(imageUrl, filepath);
    console.log(`Image saved: ${filepath}`);

    // Update the recipe in the database with the new image path
    const { error } = await supabase
      .from('recipes')
      .update({
        featured_image_url: `/images/recipes/${filename}`,
        featured_image_alt: `Professional photo of ${recipe.title}`
      })
      .eq('id', recipe.id);

    if (error) {
      console.error('Error updating recipe:', error);
      return false;
    }

    console.log(`✅ Successfully generated and saved image for: ${recipe.title}`);
    return true;

  } catch (error) {
    console.error(`❌ Error generating image for ${recipe.title}:`, error.message);
    return false;
  }
}

async function generateImagesForAllRecipes() {
  try {
    // Get all published recipes without images or with placeholder images
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'published')
      .or('featured_image_url.is.null,featured_image_url.like.*.svg');

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    console.log(`Found ${recipes.length} recipes that need images`);

    for (const recipe of recipes) {
      await generateRecipeImage(recipe);
      // Add a delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🎉 Finished generating images for all recipes!');

  } catch (error) {
    console.error('Error in generateImagesForAllRecipes:', error);
  }
}

// Export functions for use
module.exports = {
  generateRecipeImage,
  generateImagesForAllRecipes
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'all') {
    generateImagesForAllRecipes();
  } else if (command === 'single') {
    const slug = process.argv[3];
    if (!slug) {
      console.error('Please provide a recipe slug: node generate-recipe-images.js single recipe-slug');
      process.exit(1);
    }

    supabase
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data: recipe, error }) => {
        if (error || !recipe) {
          console.error('Recipe not found:', slug);
          return;
        }
        generateRecipeImage(recipe);
      });
  } else {
    console.log('Usage:');
    console.log('  node generate-recipe-images.js all          # Generate images for all recipes');
    console.log('  node generate-recipe-images.js single <slug> # Generate image for specific recipe');
  }
}