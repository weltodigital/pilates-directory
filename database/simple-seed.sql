-- Simple test recipe to verify database works
INSERT INTO recipes (title, slug, description, ingredients, instructions, prep_time, cook_time, total_time, servings, difficulty, calories_per_serving, seo_title, seo_description, status, featured, published_at)
VALUES (
  'Easy Test Recipe',
  'easy-test-recipe',
  'A simple test recipe to verify our database setup works correctly.',
  '{"ingredients": [{"name": "flour", "amount": "2 cups"}, {"name": "sugar", "amount": "1 cup"}]}',
  '{"steps": [{"step": 1, "text": "Mix ingredients"}, {"step": 2, "text": "Bake for 20 minutes"}]}',
  10,
  20,
  30,
  4,
  'easy',
  200,
  'Easy Test Recipe - Database Test',
  'Simple test recipe to verify database functionality.',
  'published',
  true,
  now()
);

-- Verify the insert worked
SELECT title, slug, ingredients, instructions FROM recipes WHERE slug = 'easy-test-recipe';