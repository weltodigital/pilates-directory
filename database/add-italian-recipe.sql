-- Add Easy Creamy Tuscan Chicken recipe
INSERT INTO recipes (
  title,
  slug,
  description,
  ingredients,
  instructions,
  prep_time,
  cook_time,
  total_time,
  servings,
  difficulty,
  calories_per_serving,
  seo_title,
  seo_description,
  featured_image_url,
  featured_image_alt,
  tips,
  variations,
  storage_instructions,
  status,
  featured,
  published_at
) VALUES (
  'Easy Creamy Tuscan Chicken',
  'easy-creamy-tuscan-chicken',
  'This Easy Creamy Tuscan Chicken is restaurant-quality comfort food made at home! Tender chicken in a rich, creamy sauce with sun-dried tomatoes, spinach, and Italian herbs. Ready in just 30 minutes and perfect for weeknight dinners.',
  '[{"ingredient": "chicken breasts", "amount": "4 large (about 1.5 lbs)"}, {"ingredient": "olive oil", "amount": "2 tbsp"}, {"ingredient": "garlic", "amount": "4 cloves, minced"}, {"ingredient": "heavy cream", "amount": "1 cup"}, {"ingredient": "chicken broth", "amount": "1/2 cup"}, {"ingredient": "sun-dried tomatoes", "amount": "1/3 cup, chopped"}, {"ingredient": "fresh spinach", "amount": "3 cups"}, {"ingredient": "Parmesan cheese", "amount": "1/2 cup, grated"}, {"ingredient": "Italian seasoning", "amount": "1 tsp"}, {"ingredient": "salt", "amount": "1 tsp"}, {"ingredient": "black pepper", "amount": "1/2 tsp"}, {"ingredient": "paprika", "amount": "1 tsp"}, {"ingredient": "flour", "amount": "1 tbsp (optional, for thickening)"}]',
  '[{"step": 1, "instruction": "Season chicken breasts with salt, pepper, and paprika on both sides."}, {"step": 2, "instruction": "Heat olive oil in a large skillet over medium-high heat."}, {"step": 3, "instruction": "Add chicken breasts and cook for 6-7 minutes per side until golden brown and cooked through (internal temp 165°F). Remove and set aside."}, {"step": 4, "instruction": "In the same skillet, add minced garlic and cook for 30 seconds until fragrant."}, {"step": 5, "instruction": "Pour in chicken broth and scrape up any browned bits from the bottom of the pan."}, {"step": 6, "instruction": "Add heavy cream, sun-dried tomatoes, and Italian seasoning. Bring to a gentle simmer."}, {"step": 7, "instruction": "Add fresh spinach and cook until wilted, about 2 minutes."}, {"step": 8, "instruction": "Stir in Parmesan cheese until melted and sauce is creamy. If sauce is too thin, whisk in flour."}, {"step": 9, "instruction": "Return chicken to the skillet and simmer for 2-3 minutes to heat through."}, {"step": 10, "instruction": "Taste and adjust seasoning. Serve immediately over pasta, rice, or with crusty bread."}]',
  15,
  15,
  30,
  4,
  'easy',
  420,
  'Easy Creamy Tuscan Chicken Recipe - Restaurant Quality in 30 Minutes',
  'Make restaurant-quality Creamy Tuscan Chicken at home in just 30 minutes! Tender chicken in a rich cream sauce with sun-dried tomatoes and spinach.',
  '/images/recipes/easy-creamy-tuscan-chicken.jpg',
  'Creamy Tuscan chicken with sun-dried tomatoes and spinach in a rich cream sauce',
  'For extra flavor, use chicken thighs instead of breasts. Make sure not to boil the cream sauce or it may curdle. If sauce gets too thick, add a splash of chicken broth.',
  'Try with different proteins like shrimp or salmon. Add mushrooms or bell peppers for extra vegetables. For a lighter version, substitute half-and-half for heavy cream.',
  'Store in refrigerator for up to 3 days. Reheat gently on stovetop over low heat, adding a splash of broth if needed. Do not freeze as cream sauce may separate.',
  'published',
  true,
  now()
);

-- Get the recipe ID and category IDs to link them
DO $$
DECLARE
    recipe_id UUID;
    easy_italian_id UUID;
    easy_chicken_id UUID;
    easy_dinner_id UUID;
    easy_recipes_id UUID;
BEGIN
    -- Get the recipe ID
    SELECT id INTO recipe_id FROM recipes WHERE slug = 'easy-creamy-tuscan-chicken';

    -- Get category IDs
    SELECT id INTO easy_italian_id FROM categories WHERE slug = 'easy-italian-recipes';
    SELECT id INTO easy_chicken_id FROM categories WHERE slug = 'easy-chicken-recipes';
    SELECT id INTO easy_dinner_id FROM categories WHERE slug = 'easy-dinner-recipes';
    SELECT id INTO easy_recipes_id FROM categories WHERE slug = 'easy-recipes';

    -- Link recipe to categories
    INSERT INTO recipe_categories (recipe_id, category_id) VALUES
    (recipe_id, easy_italian_id),
    (recipe_id, easy_chicken_id),
    (recipe_id, easy_dinner_id),
    (recipe_id, easy_recipes_id);
END $$;

-- Add nutrition information
INSERT INTO recipe_nutrition (recipe_id, calories, protein, carbs, fat, fiber, sugar, sodium)
SELECT
    r.id,
    420 as calories,
    35.0 as protein,
    8.0 as carbs,
    28.0 as fat,
    2.0 as fiber,
    5.0 as sugar,
    680.0 as sodium
FROM recipes r
WHERE r.slug = 'easy-creamy-tuscan-chicken';

-- Verify the recipe was added
SELECT title, slug, difficulty, total_time, servings FROM recipes WHERE slug = 'easy-creamy-tuscan-chicken';