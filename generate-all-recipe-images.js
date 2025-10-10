const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function generateRecipeImage(recipe) {
  try {
    console.log(`🎨 Generating image for: ${recipe.title}`);

    // Create a detailed prompt for home-style food photography with specific recipe details
    const recipeSpecificPrompts = {
      'easy-creamy-tuscan-chicken': 'Home-style food photography of creamy Tuscan chicken, tender chicken in a rich creamy sauce with sun-dried tomatoes, spinach, and Italian herbs. Cozy home kitchen setting with warm, inviting lighting. Realistic home cooking presentation on everyday dinnerware. Shot from a slight overhead angle showing the full dish. Achievable styling that home cooks can recreate.',
      'easy-spaghetti-carbonara': 'Home-style food photography of spaghetti carbonara, silky pasta with crispy pancetta, creamy egg sauce, and freshly grated parmesan cheese. Cozy home kitchen setting with warm, inviting lighting. Realistic home cooking presentation on everyday dinnerware. Shot from a slight overhead angle showing the twirled pasta. Achievable styling that home cooks can recreate.',
      'easy-chicken-stir-fry': 'Home-style food photography of chicken stir fry, colorful tender chicken with vibrant bell peppers, crisp broccoli, and julienned carrots in a glossy savory sauce. Cozy home kitchen setting with warm, inviting lighting. Realistic home cooking presentation on everyday dinnerware. Shot from a slight overhead angle showing the colorful vegetables. Achievable styling that home cooks can recreate.',
      'easy-chocolate-chip-cookies': 'Home-style food photography of chocolate chip cookies, golden brown soft and chewy cookies with melted chocolate chips scattered throughout. Cozy home kitchen setting with warm, inviting lighting. Realistic home cooking presentation on everyday dinnerware or cooling rack. Shot from a slight overhead angle showing multiple cookies. Achievable styling that home cooks can recreate.',
      'easy-caesar-salad': 'Home-style food photography of Caesar salad, crisp romaine lettuce leaves tossed with creamy Caesar dressing, golden croutons, and freshly grated parmesan cheese. Cozy home kitchen setting with warm, inviting lighting. Realistic home cooking presentation on everyday dinnerware. Shot from a slight overhead angle showing the fresh greens. Achievable styling that home cooks can recreate.',
      'easy-banana-bread': 'Home-style food photography of banana bread, moist golden brown loaf with slices showing the tender crumb and pieces of banana throughout. Cozy home kitchen setting with warm, inviting lighting. Realistic home cooking presentation on everyday dinnerware or cutting board. Shot from a slight overhead angle showing the sliced bread. Achievable styling that home cooks can recreate.'
    };

    const prompt = recipeSpecificPrompts[recipe.slug] || `Home-style food photography of ${recipe.title.replace('Easy ', '')}, in a cozy home kitchen setting. Natural home lighting, realistic home cooking presentation on everyday dinnerware. Achievable styling that home cooks can recreate. Warm, inviting atmosphere with kitchen elements visible in background. Food looks delicious but approachable, not overly styled. Shot from a natural angle as if taken by a home cook sharing their meal.`;

    console.log(`📝 Prompt: ${prompt}`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    console.log(`✅ Generated image URL: ${imageUrl}`);

    // Create the images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'recipes');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Download and save the image
    const imageFilename = `${recipe.slug}.jpg`;
    const imagePath = path.join(imagesDir, imageFilename);

    await downloadImage(imageUrl, imagePath);
    console.log(`💾 Saved image: ${imagePath}`);

    // Update the recipe in the database
    const imageUrlPath = `/images/recipes/${imageFilename}`;
    const { error } = await supabase
      .from('recipes')
      .update({
        featured_image_url: imageUrlPath,
        featured_image_alt: `Delicious ${recipe.title.replace('Easy ', '').toLowerCase()}`
      })
      .eq('id', recipe.id);

    if (error) {
      console.error(`❌ Error updating recipe ${recipe.title}:`, error);
    } else {
      console.log(`✅ Updated recipe ${recipe.title} with image URL: ${imageUrlPath}`);
    }

    // Add a small delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));

    return imageUrlPath;

  } catch (error) {
    console.error(`❌ Error generating image for ${recipe.title}:`, error);
    throw error;
  }
}

async function generateAllRecipeImages() {
  try {
    console.log('🎨 Starting AI image generation for all recipes...');

    // Get all recipes that don't have images or have placeholder images
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, title, slug, featured_image_url')
      .or('featured_image_url.is.null,featured_image_url.like./images/recipes/%.jpg')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    console.log(`📋 Found ${recipes.length} recipes to generate images for:`);
    recipes.forEach(recipe => {
      console.log(`   - ${recipe.title} (${recipe.slug})`);
    });

    console.log('\n🚀 Starting image generation...');

    // Generate images for each recipe
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      console.log(`\n📸 Processing ${i + 1}/${recipes.length}: ${recipe.title}`);

      try {
        await generateRecipeImage(recipe);
        successCount++;
        console.log(`✅ Success! (${successCount}/${recipes.length})`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Failed! (${errorCount} errors so far)`);
        console.error(error.message);
      }
    }

    console.log('\n🎉 Image generation complete!');
    console.log(`✅ Successfully generated: ${successCount} images`);
    console.log(`❌ Failed to generate: ${errorCount} images`);

    // Show final status
    const { data: updatedRecipes } = await supabase
      .from('recipes')
      .select('title, featured_image_url')
      .eq('status', 'published')
      .order('title');

    console.log('\n📊 Final image status:');
    updatedRecipes.forEach(recipe => {
      const hasImage = recipe.featured_image_url && !recipe.featured_image_url.includes('placeholder');
      console.log(`   ${hasImage ? '✅' : '❌'} ${recipe.title}`);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

generateAllRecipeImages();