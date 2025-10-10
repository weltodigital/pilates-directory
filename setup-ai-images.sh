#!/bin/bash

echo "🚀 Setting up AI Image Generation for Ed's Easy Meals"
echo ""

# Install OpenAI package
echo "📦 Installing OpenAI package..."
npm install openai

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Add OPENAI_API_KEY=your_key_here to your .env.local file"
echo "3. Test with: node scripts/generate-recipe-images.js single easy-creamy-tuscan-chicken"
echo ""
echo "💡 See AI_IMAGE_SETUP.md for detailed instructions"