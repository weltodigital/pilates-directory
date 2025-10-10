# AI Image Generation Setup for Recipe Images

This guide explains how to set up automated professional recipe image generation using various AI services.

## Option 1: OpenAI DALL-E Integration (Recommended)

### Setup Steps:

1. **Get OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Add billing information (DALL-E costs ~$0.04 per image)

2. **Add API Key to Environment:**
   ```bash
   # Add this line to your .env.local file:
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Install Dependencies:**
   ```bash
   npm install openai
   ```

4. **Generate Images:**
   ```bash
   # Generate image for specific recipe
   node scripts/generate-recipe-images.js single easy-creamy-tuscan-chicken

   # Generate images for all recipes that don't have them
   node scripts/generate-recipe-images.js all
   ```

### Features:
- ✅ High-quality professional food photography
- ✅ Automatic image download and database updates
- ✅ Respects API rate limits
- ✅ SEO-optimized alt text generation
- ✅ Custom prompts based on recipe details

### Cost: ~$0.04 per image (DALL-E 3 HD quality)

---

## Option 2: Stability AI (Stable Diffusion)

### Setup:
1. Get API key from https://beta.dreamstudio.ai/account
2. Add `STABILITY_API_KEY=your_key` to .env.local
3. Install: `npm install node-fetch`
4. Use the alternative script (see scripts/generate-recipe-images-stability.js)

### Cost: ~$0.02 per image

---

## Option 3: Replicate API (Multiple Models)

### Setup:
1. Get API key from https://replicate.com/account
2. Add `REPLICATE_API_TOKEN=your_token` to .env.local
3. Install: `npm install replicate`

### Cost: Varies by model (~$0.01-0.05 per image)

---

## Option 4: Manual Generation with Batch Processing

If you prefer to generate images manually but want batch processing:

1. Use ChatGPT, Midjourney, or any AI tool to generate images
2. Save images with recipe slug names (e.g., `easy-creamy-tuscan-chicken.jpg`)
3. Place in `/public/images/recipes/` folder
4. Run the batch update script:

```bash
node scripts/update-recipe-images.js
```

---

## Recommended Prompts for Manual Generation:

For each recipe, use this prompt structure:

```
Professional food photography of [RECIPE_TITLE], [RECIPE_DESCRIPTION].
High-resolution food styling with warm, inviting lighting.
Clean white or rustic background.
Shot from a slight overhead angle showing the full dish.
Professional food magazine quality.
Restaurant presentation.
```

### Example for Tuscan Chicken:
```
Professional food photography of creamy Tuscan chicken, tender chicken in a rich creamy sauce with sun-dried tomatoes, spinach, and Italian herbs. High-resolution food styling with warm, inviting lighting. Clean white or rustic background. Shot from a slight overhead angle showing the full dish. Professional food magazine quality. Restaurant presentation.
```

---

## Usage Examples:

```bash
# Generate single recipe image
node scripts/generate-recipe-images.js single easy-creamy-tuscan-chicken

# Generate all missing images
node scripts/generate-recipe-images.js all

# Update database with manually added images
node scripts/update-recipe-images.js
```

---

## Tips for Best Results:

1. **Specific Descriptions:** Include key ingredients, cooking method, and visual elements
2. **Consistent Style:** Use similar prompt structure for brand consistency
3. **High Resolution:** Always request HD/high-resolution outputs
4. **Professional Lighting:** Mention "warm, inviting lighting" or "natural daylight"
5. **Angle Preference:** "Slight overhead angle" works well for most dishes
6. **Background:** "Clean white" or "rustic wooden" backgrounds are food-photography standards

---

## Cost Comparison:

| Service | Cost per Image | Quality | Speed |
|---------|---------------|---------|-------|
| DALL-E 3 | $0.04 | Excellent | Fast |
| Stability AI | $0.02 | Good | Fast |
| Replicate | $0.01-0.05 | Varies | Medium |
| Manual + ChatGPT | Free* | Excellent | Slow |

*Requires ChatGPT Plus subscription

---

## Next Steps:

1. Choose your preferred method
2. Set up API keys in .env.local
3. Install required dependencies
4. Test with a single recipe first
5. Run batch generation for all recipes

The generated images will automatically be optimized for web, include proper alt text, and integrate seamlessly with your recipe pages and SEO markup.