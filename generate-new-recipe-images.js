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

    // Create a detailed prompt for home-style food photography
    const prompt = `Home-style food photography of ${recipe.title.replace('Easy ', '')}, in a cozy home kitchen setting. Natural home lighting, realistic home cooking presentation on everyday dinnerware. Achievable styling that home cooks can recreate. Warm, inviting atmosphere with kitchen elements visible in background. Food looks delicious but approachable, not overly styled. Shot from a natural angle as if taken by a home cook sharing their meal.`;

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

    // Ensure the images directory exists
    const imagesDir = path.join(__dirname, 'public', 'images', 'recipes');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Download and save the image
    const filename = `${recipe.slug}.jpg`;
    const filepath = path.join(imagesDir, filename);

    await downloadImage(imageUrl, filepath);
    console.log(`💾 Saved image: ${filepath}`);

    // Update the recipe in the database with the image URL
    const publicImageUrl = `/images/recipes/${filename}`;
    const { error } = await supabase
      .from('recipes')
      .update({
        featured_image_url: publicImageUrl,
        featured_image_alt: `Delicious ${recipe.title} - homemade recipe`
      })
      .eq('id', recipe.id);

    if (error) {
      console.error(`❌ Error updating recipe ${recipe.title}:`, error);
      return false;
    }

    console.log(`✅ Updated recipe ${recipe.title} with image URL: ${publicImageUrl}`);
    return true;

  } catch (error) {
    console.error(`❌ Error generating image for ${recipe.title}:`, error.message);
    return false;
  }
}

async function generateNewRecipeImages() {
  console.log('🎨 Starting AI image generation for new recipes...');

  // Get recipes that don't have images (recent ones first)
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, slug, featured_image_url')
    .is('featured_image_url', null)
    .order('created_at', { ascending: false })
    .limit(50); // Process 50 at a time

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  console.log(`📋 Found ${recipes.length} recipes without images:`);
  recipes.forEach((recipe, index) => {
    console.log(`   - ${recipe.title} (${recipe.slug})`);
  });

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    console.log(`\n📸 Processing ${i + 1}/${recipes.length}: ${recipe.title}`);

    const success = await generateRecipeImage(recipe);
    if (success) {
      successCount++;
      console.log(`✅ Success! (${successCount}/${recipes.length})`);
    } else {
      failureCount++;
      console.log(`❌ Failed! (${failureCount} failures so far)`);
    }

    // Add a small delay to avoid rate limiting
    if (i < recipes.length - 1) {
      console.log('⏳ Waiting 2 seconds before next image...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n🎉 Image generation complete!`);
  console.log(`✅ Successfully generated: ${successCount} images`);
  console.log(`❌ Failed to generate: ${failureCount} images`);
  console.log(`📊 Success rate: ${Math.round((successCount / recipes.length) * 100)}%`);
}

generateNewRecipeImages();