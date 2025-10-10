-- Clear existing categories and add test categories
DELETE FROM recipe_categories;
DELETE FROM categories;

-- Insert a few test categories to verify structure
INSERT INTO categories (name, slug, description, seo_title, seo_description, featured) VALUES
('Easy Chicken Recipes', 'easy-chicken-recipes', 'Simple chicken dishes for every occasion', 'Easy Chicken Recipes - Quick & Simple Chicken Dinners', 'Discover easy chicken recipes for weeknight dinners. Simple, flavorful chicken dishes that anyone can make.', true),
('Easy Pasta Recipes', 'easy-pasta-recipes', 'Quick pasta dishes for any night', 'Easy Pasta Recipes - Quick Pasta Dinners', 'Easy pasta recipes ready in 30 minutes. From creamy sauces to simple tomato dishes.', true),
('Easy Italian Recipes', 'easy-italian-recipes', 'Classic Italian dishes simplified', 'Easy Italian Recipes - Simple Italian Cooking', 'Easy Italian recipes for authentic flavors. Simple pasta, pizza, and Italian dishes anyone can make.', true),
('Easy Vegetarian Recipes', 'easy-vegetarian-recipes', 'Plant-based meals made simple', 'Easy Vegetarian Recipes - Simple Plant-Based Meals', 'Easy vegetarian recipes packed with flavor. Healthy, simple, and satisfying plant-based dishes.', true),
('Easy Dessert Recipes', 'easy-dessert-recipes', 'Simple sweet treats', 'Easy Dessert Recipes - Simple Sweet Treats', 'Easy dessert recipes for any occasion. Quick puddings, simple cakes, and impressive treats made easy.', true);

-- Verify the insert
SELECT COUNT(*) as total_categories FROM categories;
SELECT name, slug, featured FROM categories ORDER BY name;