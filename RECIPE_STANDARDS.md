# Recipe Creation Standards

This document outlines the standards and requirements for creating new recipes in Ed's Easy Meals directory.

## Naming Conventions

### ❌ DON'T Use "Easy" Prefix
- Recipe titles should NOT include "Easy" prefix
- Recipe slugs should NOT start with "easy-"
- Examples:
  - ✅ CORRECT: "Chocolate Chip Cookies" (slug: `chocolate-chip-cookies`)
  - ❌ INCORRECT: "Easy Chocolate Chip Cookies" (slug: `easy-chocolate-chip-cookies`)

### ✅ Clean, Descriptive Names
- Use clear, appetizing recipe names
- Focus on the dish itself, not the difficulty
- Examples:
  - "Creamy Mushroom Risotto"
  - "Classic Beef Stew"
  - "Chocolate Lava Cake"

## Required Fields

Every recipe MUST include these fields:

### Basic Information
- `title` - Recipe name (without "Easy" prefix)
- `slug` - URL-friendly version (auto-generated if not provided)
- `description` - Brief, appetizing description
- `status` - Set to 'published'

### SEO Fields
- `seo_title` - Defaults to title if not provided
- `seo_description` - Defaults to description if not provided

### Recipe Details
- `ingredients` - Array of objects with `name`, `amount`, `notes`
- `instructions` - Array of objects with `step` number and `instruction` text
- `prep_time` - Minutes to prepare
- `cook_time` - Minutes to cook
- `total_time` - Total minutes (usually prep + cook)
- `servings` - Number of servings
- `difficulty` - 'easy', 'medium', or 'hard'

### Optional Fields
- `calories_per_serving` - Nutritional information
- `tips` - Helpful cooking tips
- `variations` - Recipe variations
- `storage_instructions` - How to store leftovers
- `featured_image_url` - Image URL
- `featured_image_alt` - Alt text for image

## Category Linking Requirements

### ✅ CRITICAL: Every Recipe Must Be Linked to Categories

1. **Use the recipe_categories Junction Table**
   - Every recipe MUST be linked through the `recipe_categories` table
   - This creates the relationship: Recipe ↔ recipe_categories ↔ Category

2. **Automatic Category Creation**
   - Categories are automatically created if they don't exist
   - Use descriptive category names like "Dessert Recipes", "Soup Recipes"

3. **Multiple Categories Allowed**
   - Recipes can belong to multiple categories
   - Example: "Chocolate Chip Cookies" → ["Dessert Recipes", "Cookie Recipes", "Baking Recipes"]

## Using the Recipe Creation Template

Use the provided `recipe-creation-template.js` for all new recipes:

```javascript
const { createRecipeWithCategories } = require('./recipe-creation-template');

// Example recipe data
const recipeData = {
  title: 'Chocolate Chip Cookies',  // NO "Easy" prefix
  description: 'Classic homemade chocolate chip cookies...',
  ingredients: [
    { name: 'All-purpose flour', amount: '2 1/4 cups', notes: null },
    // ... more ingredients
  ],
  instructions: [
    { step: 1, instruction: 'Preheat oven to 375°F...' },
    // ... more steps
  ],
  prep_time: 15,
  cook_time: 10,
  total_time: 25,
  servings: 48,
  difficulty: 'easy',
  status: 'published'
};

// Categories this recipe belongs to
const categories = [
  'Dessert Recipes',
  'Cookie Recipes',
  'Baking Recipes'
];

// Create recipe with proper category linking
await createRecipeWithCategories(recipeData, categories);
```

## Frontend Display

### Recipe Pages Show Category Links
- All recipe pages automatically display category tags
- Categories are shown as clickable links below the recipe description
- Links navigate to the appropriate category pages
- Display names remove "Easy " prefix and " Recipes" suffix for cleaner appearance

### Category Page Integration
- Recipe-category links ensure recipes appear on correct category pages
- Category pages automatically list all linked recipes
- Proper SEO and navigation structure

## Database Schema

### Tables Involved
1. `recipes` - Main recipe data
2. `categories` - Category information
3. `recipe_categories` - Junction table linking recipes to categories

### Junction Table Structure
```sql
recipe_categories:
- recipe_id (foreign key to recipes.id)
- category_id (foreign key to categories.id)
```

## Validation Checklist

Before publishing any new recipe, verify:

- [ ] Recipe title does NOT start with "Easy"
- [ ] Recipe slug does NOT start with "easy-"
- [ ] Recipe is linked to at least one category via recipe_categories table
- [ ] All required fields are populated
- [ ] Recipe displays correctly on individual recipe page
- [ ] Recipe appears on appropriate category pages
- [ ] Category links on recipe page work correctly

## Scripts and Tools

### Available Scripts
- `recipe-creation-template.js` - Standard template for creating recipes
- `update-recipe-names.js` - Utility to remove "Easy" prefixes from existing recipes
- `generate-*-recipe-images.js` - Image generation scripts (follow new naming conventions)

### Image Generation
- Image scripts updated to use new naming conventions (no "easy-" prefixes)
- Generate images AFTER creating recipes to ensure slugs match

## Common Mistakes to Avoid

1. **❌ Forgetting Category Links**
   - Always use `createRecipeWithCategories()` function
   - Don't create recipes without category associations

2. **❌ Using "Easy" Prefix**
   - Breaks naming conventions
   - Creates inconsistent URLs
   - Template automatically removes these prefixes

3. **❌ Missing Required Fields**
   - Especially ingredients and instructions arrays
   - Instructions must include step numbers

4. **❌ Incorrect Data Types**
   - Times should be numbers (minutes)
   - Ingredients/instructions should be arrays of objects

## Future Recipe Creation

For any new recipe collections or individual recipes:

1. Use the `recipe-creation-template.js`
2. Follow naming conventions (no "Easy" prefix)
3. Ensure proper category linking
4. Test recipe pages and category pages
5. Generate images using updated scripts

This ensures consistency, proper navigation, and SEO optimization across the entire recipe directory.