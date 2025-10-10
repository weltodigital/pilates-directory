-- Sample recipe data to get started
-- This provides examples for each main category

-- Easy Chocolate Chip Cookies
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
  status,
  featured,
  published_at
) VALUES (
  'Easy Chocolate Chip Cookies',
  'easy-chocolate-chip-cookies',
  'The easiest chocolate chip cookies you''ll ever make! With just 6 ingredients and 20 minutes, you''ll have perfectly chewy cookies.',
  '[
    {"ingredient": "all-purpose flour", "amount": "2 1/4 cups"},
    {"ingredient": "baking soda", "amount": "1 tsp"},
    {"ingredient": "salt", "amount": "1 tsp"},
    {"ingredient": "butter, softened", "amount": "1 cup"},
    {"ingredient": "brown sugar", "amount": "3/4 cup"},
    {"ingredient": "white sugar", "amount": "3/4 cup"},
    {"ingredient": "eggs", "amount": "2 large"},
    {"ingredient": "vanilla extract", "amount": "2 tsp"},
    {"ingredient": "chocolate chips", "amount": "2 cups"}
  ]',
  '[
    {"step": 1, "instruction": "Preheat oven to 375°F (190°C)."},
    {"step": 2, "instruction": "Mix flour, baking soda, and salt in a bowl."},
    {"step": 3, "instruction": "In another bowl, cream butter and both sugars until fluffy."},
    {"step": 4, "instruction": "Beat in eggs and vanilla."},
    {"step": 5, "instruction": "Gradually blend in flour mixture."},
    {"step": 6, "instruction": "Stir in chocolate chips."},
    {"step": 7, "instruction": "Drop rounded tablespoons onto ungreased cookie sheets."},
    {"step": 8, "instruction": "Bake 9-11 minutes or until golden brown."},
    {"step": 9, "instruction": "Cool on baking sheet for 2 minutes, then transfer to wire rack."}
  ]',
  15,
  10,
  25,
  48,
  'easy',
  150,
  'Easy Chocolate Chip Cookies Recipe - Ready in 25 Minutes',
  'Make perfect chocolate chip cookies with this easy recipe. Just 6 ingredients and 25 minutes for deliciously chewy cookies.',
  '/images/recipes/chocolate-chip-cookies.jpg',
  'Golden brown chocolate chip cookies on a cooling rack',
  'For extra chewy cookies, slightly underbake them. For crispier cookies, bake an extra 1-2 minutes.',
  'published',
  true,
  now()
);

-- Easy Spaghetti Carbonara
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
  status,
  featured,
  published_at
) VALUES (
  'Easy Spaghetti Carbonara',
  'easy-spaghetti-carbonara',
  'Authentic Italian carbonara made easy! This creamy pasta dish uses just 5 ingredients and takes only 20 minutes.',
  '[
    {"ingredient": "spaghetti", "amount": "400g"},
    {"ingredient": "pancetta or bacon", "amount": "150g, diced"},
    {"ingredient": "eggs", "amount": "3 large"},
    {"ingredient": "Parmesan cheese, grated", "amount": "100g"},
    {"ingredient": "black pepper", "amount": "1 tsp, freshly ground"},
    {"ingredient": "salt", "amount": "to taste"}
  ]',
  '[
    {"step": 1, "instruction": "Bring a large pot of salted water to boil and cook spaghetti according to package directions."},
    {"step": 2, "instruction": "While pasta cooks, fry pancetta in a large pan until crispy."},
    {"step": 3, "instruction": "In a bowl, whisk together eggs, Parmesan, and black pepper."},
    {"step": 4, "instruction": "Reserve 1 cup pasta water before draining."},
    {"step": 5, "instruction": "Add hot pasta to the pan with pancetta."},
    {"step": 6, "instruction": "Remove from heat and quickly stir in egg mixture."},
    {"step": 7, "instruction": "Add pasta water gradually until creamy."},
    {"step": 8, "instruction": "Serve immediately with extra Parmesan and black pepper."}
  ]',
  10,
  15,
  25,
  4,
  'easy',
  520,
  'Easy Spaghetti Carbonara Recipe - Authentic Italian in 20 Minutes',
  'Learn to make authentic spaghetti carbonara with this easy recipe. Creamy, delicious, and ready in just 20 minutes.',
  '/images/recipes/spaghetti-carbonara.jpg',
  'Creamy spaghetti carbonara with crispy pancetta and black pepper',
  'The key is to work quickly and add the egg mixture off the heat to prevent scrambling. The hot pasta will cook the eggs perfectly.',
  'published',
  true,
  now()
);

-- Easy Chicken Stir Fry
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
  status,
  featured,
  published_at
) VALUES (
  'Easy Chicken Stir Fry',
  'easy-chicken-stir-fry',
  'Quick and healthy chicken stir fry with colorful vegetables. Perfect weeknight dinner ready in just 15 minutes!',
  '[
    {"ingredient": "chicken breast, sliced thin", "amount": "500g"},
    {"ingredient": "mixed vegetables (bell peppers, broccoli, carrots)", "amount": "400g"},
    {"ingredient": "soy sauce", "amount": "3 tbsp"},
    {"ingredient": "garlic, minced", "amount": "3 cloves"},
    {"ingredient": "ginger, minced", "amount": "1 tbsp"},
    {"ingredient": "vegetable oil", "amount": "2 tbsp"},
    {"ingredient": "cornstarch", "amount": "1 tbsp"},
    {"ingredient": "sesame oil", "amount": "1 tsp"}
  ]',
  '[
    {"step": 1, "instruction": "Heat vegetable oil in a large wok or skillet over high heat."},
    {"step": 2, "instruction": "Add chicken and cook until golden, about 3-4 minutes."},
    {"step": 3, "instruction": "Add garlic and ginger, stir for 30 seconds."},
    {"step": 4, "instruction": "Add vegetables and stir-fry for 3-4 minutes."},
    {"step": 5, "instruction": "Mix soy sauce and cornstarch, add to pan."},
    {"step": 6, "instruction": "Stir until sauce thickens, about 1 minute."},
    {"step": 7, "instruction": "Drizzle with sesame oil and serve over rice."}
  ]',
  10,
  8,
  18,
  4,
  'easy',
  280,
  'Easy Chicken Stir Fry Recipe - Healthy 15-Minute Dinner',
  'Quick and healthy chicken stir fry recipe. Packed with vegetables and ready in just 15 minutes - perfect for busy weeknights.',
  '/images/recipes/chicken-stir-fry.jpg',
  'Colorful chicken stir fry with vegetables in a wok',
  'Keep the heat high for the best stir fry texture. Have all ingredients prepped before you start cooking.',
  'published',
  true,
  now()
);

-- Easy Vanilla Cake
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
  status,
  featured,
  published_at
) VALUES (
  'Easy Vanilla Cake',
  'easy-vanilla-cake',
  'Perfect vanilla cake that''s moist, fluffy, and incredibly easy to make. Great for birthdays or any celebration!',
  '[
    {"ingredient": "all-purpose flour", "amount": "2 1/2 cups"},
    {"ingredient": "baking powder", "amount": "2 1/2 tsp"},
    {"ingredient": "salt", "amount": "1/2 tsp"},
    {"ingredient": "butter, softened", "amount": "1 cup"},
    {"ingredient": "sugar", "amount": "1 3/4 cups"},
    {"ingredient": "eggs", "amount": "4 large"},
    {"ingredient": "vanilla extract", "amount": "2 tsp"},
    {"ingredient": "milk", "amount": "1 1/4 cups"}
  ]',
  '[
    {"step": 1, "instruction": "Preheat oven to 350°F (175°C). Grease two 9-inch round pans."},
    {"step": 2, "instruction": "Mix flour, baking powder, and salt in a bowl."},
    {"step": 3, "instruction": "Cream butter and sugar until light and fluffy, about 4 minutes."},
    {"step": 4, "instruction": "Beat in eggs one at a time, then vanilla."},
    {"step": 5, "instruction": "Alternate adding flour mixture and milk, beginning and ending with flour."},
    {"step": 6, "instruction": "Divide batter between prepared pans."},
    {"step": 7, "instruction": "Bake 25-30 minutes until a toothpick comes out clean."},
    {"step": 8, "instruction": "Cool in pans 10 minutes, then turn out onto wire racks."}
  ]',
  20,
  30,
  50,
  12,
  'easy',
  310,
  'Easy Vanilla Cake Recipe - Perfect for Beginners',
  'Make the perfect vanilla cake with this easy recipe. Moist, fluffy, and delicious - perfect for any celebration.',
  '/images/recipes/vanilla-cake.jpg',
  'Two-layer vanilla cake with smooth frosting',
  'Room temperature ingredients mix more easily. Don''t overmix the batter to keep the cake tender.',
  'published',
  true,
  now()
);

-- Easy Slow Cooker Beef Stew
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
  status,
  featured,
  published_at
) VALUES (
  'Easy Slow Cooker Beef Stew',
  'easy-slow-cooker-beef-stew',
  'Set-and-forget beef stew that cooks all day while you''re busy. Tender beef and vegetables in rich, savory gravy.',
  '[
    {"ingredient": "beef stew meat", "amount": "2 lbs, cubed"},
    {"ingredient": "potatoes", "amount": "4 large, cubed"},
    {"ingredient": "carrots", "amount": "4 large, sliced"},
    {"ingredient": "onion", "amount": "1 large, diced"},
    {"ingredient": "beef broth", "amount": "3 cups"},
    {"ingredient": "tomato paste", "amount": "2 tbsp"},
    {"ingredient": "Worcestershire sauce", "amount": "1 tbsp"},
    {"ingredient": "garlic powder", "amount": "1 tsp"},
    {"ingredient": "dried thyme", "amount": "1 tsp"},
    {"ingredient": "salt and pepper", "amount": "to taste"},
    {"ingredient": "cornstarch", "amount": "2 tbsp"},
    {"ingredient": "water", "amount": "2 tbsp"}
  ]',
  '[
    {"step": 1, "instruction": "Add beef, potatoes, carrots, and onion to slow cooker."},
    {"step": 2, "instruction": "Mix broth, tomato paste, Worcestershire, garlic powder, and thyme."},
    {"step": 3, "instruction": "Pour mixture over ingredients in slow cooker."},
    {"step": 4, "instruction": "Season with salt and pepper."},
    {"step": 5, "instruction": "Cover and cook on low 8 hours or high 4 hours."},
    {"step": 6, "instruction": "Mix cornstarch and water to make slurry."},
    {"step": 7, "instruction": "Stir slurry into stew and cook 15 minutes more to thicken."},
    {"step": 8, "instruction": "Taste and adjust seasoning before serving."}
  ]',
  15,
  480,
  495,
  6,
  'easy',
  385,
  'Easy Slow Cooker Beef Stew Recipe - Set and Forget Dinner',
  'Perfect slow cooker beef stew recipe. Just prep in the morning and come home to tender, flavorful dinner.',
  '/images/recipes/slow-cooker-beef-stew.jpg',
  'Rich beef stew with tender vegetables in a slow cooker',
  'For extra flavor, brown the beef in a skillet before adding to the slow cooker. This step is optional but recommended.',
  'published',
  true,
  now()
);

-- Get recipe IDs for category assignments
DO $$
DECLARE
    cookie_recipe_id UUID;
    pasta_recipe_id UUID;
    chicken_recipe_id UUID;
    cake_recipe_id UUID;
    stew_recipe_id UUID;
    easy_category_id UUID;
    cookie_category_id UUID;
    pasta_category_id UUID;
    chicken_category_id UUID;
    cake_category_id UUID;
    slow_cooker_category_id UUID;
    dinner_category_id UUID;
    baking_category_id UUID;
BEGIN
    -- Get recipe IDs
    SELECT id INTO cookie_recipe_id FROM recipes WHERE slug = 'easy-chocolate-chip-cookies';
    SELECT id INTO pasta_recipe_id FROM recipes WHERE slug = 'easy-spaghetti-carbonara';
    SELECT id INTO chicken_recipe_id FROM recipes WHERE slug = 'easy-chicken-stir-fry';
    SELECT id INTO cake_recipe_id FROM recipes WHERE slug = 'easy-vanilla-cake';
    SELECT id INTO stew_recipe_id FROM recipes WHERE slug = 'easy-slow-cooker-beef-stew';

    -- Get category IDs
    SELECT id INTO easy_category_id FROM categories WHERE slug = 'easy-recipes';
    SELECT id INTO cookie_category_id FROM categories WHERE slug = 'easy-cookie-recipes';
    SELECT id INTO pasta_category_id FROM categories WHERE slug = 'easy-pasta-recipes';
    SELECT id INTO chicken_category_id FROM categories WHERE slug = 'easy-chicken-recipes';
    SELECT id INTO cake_category_id FROM categories WHERE slug = 'easy-cake-recipes';
    SELECT id INTO slow_cooker_category_id FROM categories WHERE slug = 'easy-slow-cooker-recipes';
    SELECT id INTO dinner_category_id FROM categories WHERE slug = 'easy-dinner-recipes';
    SELECT id INTO baking_category_id FROM categories WHERE slug = 'easy-baking-recipes';

    -- Assign categories to recipes
    INSERT INTO recipe_categories (recipe_id, category_id) VALUES
    (cookie_recipe_id, easy_category_id),
    (cookie_recipe_id, cookie_category_id),
    (cookie_recipe_id, baking_category_id),

    (pasta_recipe_id, easy_category_id),
    (pasta_recipe_id, pasta_category_id),
    (pasta_recipe_id, dinner_category_id),

    (chicken_recipe_id, easy_category_id),
    (chicken_recipe_id, chicken_category_id),
    (chicken_recipe_id, dinner_category_id),

    (cake_recipe_id, easy_category_id),
    (cake_recipe_id, cake_category_id),
    (cake_recipe_id, baking_category_id),

    (stew_recipe_id, easy_category_id),
    (stew_recipe_id, slow_cooker_category_id),
    (stew_recipe_id, dinner_category_id);
END $$;

-- Add nutrition data for sample recipes
INSERT INTO recipe_nutrition (recipe_id, calories, protein, carbs, fat, fiber, sugar, sodium)
SELECT
    r.id,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 150
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 520
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 280
        WHEN r.slug = 'easy-vanilla-cake' THEN 310
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 385
    END as calories,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 2.1
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 22.0
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 35.0
        WHEN r.slug = 'easy-vanilla-cake' THEN 4.5
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 28.0
    END as protein,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 22.0
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 65.0
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 12.0
        WHEN r.slug = 'easy-vanilla-cake' THEN 55.0
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 25.0
    END as carbs,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 7.0
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 18.0
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 8.0
        WHEN r.slug = 'easy-vanilla-cake' THEN 12.0
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 18.0
    END as fat,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 1.0
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 3.0
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 4.0
        WHEN r.slug = 'easy-vanilla-cake' THEN 1.5
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 5.0
    END as fiber,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 15.0
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 4.0
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 8.0
        WHEN r.slug = 'easy-vanilla-cake' THEN 45.0
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 8.0
    END as sugar,
    CASE
        WHEN r.slug = 'easy-chocolate-chip-cookies' THEN 105.0
        WHEN r.slug = 'easy-spaghetti-carbonara' THEN 850.0
        WHEN r.slug = 'easy-chicken-stir-fry' THEN 780.0
        WHEN r.slug = 'easy-vanilla-cake' THEN 280.0
        WHEN r.slug = 'easy-slow-cooker-beef-stew' THEN 920.0
    END as sodium
FROM recipes r
WHERE r.slug IN ('easy-chocolate-chip-cookies', 'easy-spaghetti-carbonara', 'easy-chicken-stir-fry', 'easy-vanilla-cake', 'easy-slow-cooker-beef-stew');