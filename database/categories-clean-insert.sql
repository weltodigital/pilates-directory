-- Clear existing categories and start fresh
-- Remove all recipe-category relationships first
DELETE FROM recipe_categories;

-- Remove all existing categories
DELETE FROM categories;

-- Reset the sequence (optional, for clean IDs)
-- This is PostgreSQL specific
-- ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Insert comprehensive Easy Recipe Categories
INSERT INTO categories (name, slug, description, seo_title, seo_description, featured) VALUES

-- FOOD TYPE CATEGORIES - Proteins
('Easy Chicken Recipes', 'easy-chicken-recipes', 'Simple chicken dishes for every occasion', 'Easy Chicken Recipes - Quick & Simple Chicken Dinners', 'Discover easy chicken recipes for weeknight dinners. Simple, flavorful chicken dishes that anyone can make.', true),
('Easy Beef Recipes', 'easy-beef-recipes', 'Tender beef dishes made simple', 'Easy Beef Recipes - Simple Beef Dinners & Meals', 'Easy beef recipes for hearty meals. From ground beef to steaks, simple beef dishes for any occasion.', true),
('Easy Fish Recipes', 'easy-fish-recipes', 'Quick and healthy fish dishes', 'Easy Fish Recipes - Quick Healthy Fish Dinners', 'Easy fish recipes for healthy weeknight dinners. Simple, delicious fish dishes ready in minutes.', true),
('Easy Salmon Recipes', 'easy-salmon-recipes', 'Delicious salmon dishes simplified', 'Easy Salmon Recipes - Quick Salmon Dinners', 'Easy salmon recipes for healthy meals. Simple, flavorful salmon dishes perfect for dinner.', true),
('Easy Pork Recipes', 'easy-pork-recipes', 'Simple pork dishes for dinner', 'Easy Pork Recipes - Quick Pork Dinners & Meals', 'Easy pork recipes for delicious dinners. Simple pork chops, tenderloin, and ground pork dishes.', false),
('Easy Turkey Recipes', 'easy-turkey-recipes', 'Beyond Thanksgiving turkey dishes', 'Easy Turkey Recipes - Quick Turkey Dinners', 'Easy turkey recipes for any time of year. Simple ground turkey and turkey breast dishes.', false),
('Easy Shrimp Recipes', 'easy-shrimp-recipes', 'Quick seafood favorites', 'Easy Shrimp Recipes - Quick Shrimp Dinners', 'Easy shrimp recipes ready in 15 minutes. Simple, delicious shrimp dishes for weeknight dinners.', true),

-- FOOD TYPE CATEGORIES - Starches & Grains
('Easy Pasta Recipes', 'easy-pasta-recipes', 'Quick pasta dishes for any night', 'Easy Pasta Recipes - Quick Pasta Dinners', 'Easy pasta recipes ready in 30 minutes. From creamy sauces to simple tomato dishes.', true),
('Easy Rice Recipes', 'easy-rice-recipes', 'Simple rice dishes and sides', 'Easy Rice Recipes - Quick Rice Dishes & Sides', 'Easy rice recipes for dinner and sides. Simple fried rice, rice bowls, and rice dishes.', true),
('Easy Potato Recipes', 'easy-potato-recipes', 'Versatile potato dishes', 'Easy Potato Recipes - Simple Potato Dishes', 'Easy potato recipes for sides and mains. Baked, mashed, roasted, and fried potato dishes.', true),
('Easy Bread Recipes', 'easy-bread-recipes', 'Simple homemade breads', 'Easy Bread Recipes - Simple Homemade Breads', 'Easy bread recipes for beginners. No-knead breads, quick breads, and simple yeast breads.', false),
('Easy Vegetable Recipes', 'easy-vegetable-recipes', 'Simple ways to cook vegetables', 'Easy Vegetable Recipes - Simple Veggie Dishes', 'Easy vegetable recipes that make veggies delicious. Simple roasted, steamed, and sautéed vegetables.', false),

-- CUISINE CATEGORIES
('Easy Italian Recipes', 'easy-italian-recipes', 'Classic Italian dishes simplified', 'Easy Italian Recipes - Simple Italian Cooking', 'Easy Italian recipes for authentic flavors. Simple pasta, pizza, and Italian dishes anyone can make.', true),
('Easy Mexican Recipes', 'easy-mexican-recipes', 'Flavorful Mexican dishes at home', 'Easy Mexican Recipes - Simple Mexican Cooking', 'Easy Mexican recipes for authentic flavors. Simple tacos, burritos, and Mexican dishes.', true),
('Easy Chinese Recipes', 'easy-chinese-recipes', 'Takeout favorites made at home', 'Easy Chinese Recipes - Simple Chinese Cooking', 'Easy Chinese recipes better than takeout. Simple stir-fries, fried rice, and Chinese dishes.', true),
('Easy Indian Recipes', 'easy-indian-recipes', 'Aromatic Indian dishes simplified', 'Easy Indian Recipes - Simple Indian Cooking', 'Easy Indian recipes with authentic spices. Simple curries, rice dishes, and Indian favorites.', true),
('Easy Thai Recipes', 'easy-thai-recipes', 'Fresh Thai flavors at home', 'Easy Thai Recipes - Simple Thai Cooking', 'Easy Thai recipes for fresh flavors. Simple pad thai, curries, and Thai dishes.', false),
('Easy Mediterranean Recipes', 'easy-mediterranean-recipes', 'Healthy Mediterranean dishes', 'Easy Mediterranean Recipes - Simple Mediterranean Cooking', 'Easy Mediterranean recipes for healthy eating. Simple Greek, Italian, and Middle Eastern dishes.', true),
('Easy Greek Recipes', 'easy-greek-recipes', 'Fresh Greek flavors simplified', 'Easy Greek Recipes - Simple Greek Cooking', 'Easy Greek recipes for fresh Mediterranean flavors. Simple Greek salads, souvlaki, and dishes.', false),
('Easy Spanish Recipes', 'easy-spanish-recipes', 'Spanish classics made simple', 'Easy Spanish Recipes - Simple Spanish Cooking', 'Easy Spanish recipes for authentic flavors. Simple paella, tapas, and Spanish dishes.', false),
('Easy Japanese Recipes', 'easy-japanese-recipes', 'Simple Japanese home cooking', 'Easy Japanese Recipes - Simple Japanese Cooking', 'Easy Japanese recipes for home cooking. Simple sushi, ramen, and Japanese dishes.', false),
('Easy Korean Recipes', 'easy-korean-recipes', 'Korean flavors made accessible', 'Easy Korean Recipes - Simple Korean Cooking', 'Easy Korean recipes for bold flavors. Simple kimchi, bulgogi, and Korean dishes.', false),

-- DIET & LIFESTYLE CATEGORIES
('Easy Vegetarian Recipes', 'easy-vegetarian-recipes', 'Plant-based meals made simple', 'Easy Vegetarian Recipes - Simple Plant-Based Meals', 'Easy vegetarian recipes packed with flavor. Healthy, simple, and satisfying plant-based dishes.', true),
('Easy Vegan Recipes', 'easy-vegan-recipes', 'Delicious plant-based cooking', 'Easy Vegan Recipes - Simple Plant-Based Cooking', 'Easy vegan recipes that are delicious and satisfying. Simple plant-based meals for everyone.', true),
('Easy Keto Recipes', 'easy-keto-recipes', 'Low-carb ketogenic dishes', 'Easy Keto Recipes - Simple Low-Carb Meals', 'Easy keto recipes for low-carb living. Simple ketogenic meals and snacks under 20g carbs.', true),
('Easy Low Carb Recipes', 'easy-low-carb-recipes', 'Reduced carb meal options', 'Easy Low Carb Recipes - Simple Low-Carb Meals', 'Easy low carb recipes for healthy eating. Simple meals with reduced carbohydrates.', true),
('Easy Gluten Free Recipes', 'easy-gluten-free-recipes', 'Gluten-free cooking simplified', 'Easy Gluten Free Recipes - Simple Gluten-Free Meals', 'Easy gluten free recipes for celiac and gluten sensitivity. Simple wheat-free meals and desserts.', true),
('Easy Dairy Free Recipes', 'easy-dairy-free-recipes', 'Dairy-free dishes for all', 'Easy Dairy Free Recipes - Simple Dairy-Free Meals', 'Easy dairy free recipes for lactose intolerance. Simple meals without milk, cheese, or butter.', false),
('Easy Paleo Recipes', 'easy-paleo-recipes', 'Paleo diet made simple', 'Easy Paleo Recipes - Simple Paleo Meals', 'Easy paleo recipes for ancestral eating. Simple grain-free, dairy-free paleo meals.', false),
('Easy Healthy Recipes', 'easy-healthy-recipes', 'Nutritious meals made simple', 'Easy Healthy Recipes - Simple Nutritious Meals', 'Easy healthy recipes that taste great. Simple, nutritious meals for a healthier lifestyle.', true),

-- MEAL TYPE CATEGORIES
('Easy Breakfast Recipes', 'easy-breakfast-recipes', 'Quick morning meal ideas', 'Easy Breakfast Recipes - Quick Morning Meals', 'Easy breakfast recipes to start your day. Quick pancakes, eggs, and morning meals.', true),
('Easy Lunch Recipes', 'easy-lunch-recipes', 'Midday meals made simple', 'Easy Lunch Recipes - Quick Lunch Ideas', 'Easy lunch recipes for work, school, or home. Quick, satisfying midday meals.', true),
('Easy Dinner Recipes', 'easy-dinner-recipes', 'Weeknight dinner solutions', 'Easy Dinner Recipes - Quick Weeknight Meals', 'Easy dinner recipes ready in 30 minutes or less. Perfect for busy weeknights and family meals.', true),
('Easy Snack Recipes', 'easy-snack-recipes', 'Quick bites and appetizers', 'Easy Snack Recipes - Quick Snacks & Appetizers', 'Easy snack recipes for any time. Quick appetizers, party snacks, and healthy bites.', false),
('Easy Dessert Recipes', 'easy-dessert-recipes', 'Simple sweet treats', 'Easy Dessert Recipes - Simple Sweet Treats', 'Easy dessert recipes for any occasion. Quick puddings, simple cakes, and impressive treats made easy.', true),

-- BAKING CATEGORIES
('Easy Cake Recipes', 'easy-cake-recipes', 'Simple cakes for celebrations', 'Easy Cake Recipes - Simple Cakes Anyone Can Make', 'Easy cake recipes for beginners with step-by-step instructions. Perfect for birthdays and celebrations.', true),
('Easy Cookie Recipes', 'easy-cookie-recipes', 'Quick homemade cookies', 'Easy Cookie Recipes - Quick & Simple Cookies', 'Simple cookie recipes with few ingredients. Perfect for beginners and kids to bake together.', true),
('Easy Muffin Recipes', 'easy-muffin-recipes', 'Quick breakfast and snack muffins', 'Easy Muffin Recipes - Quick Breakfast Muffins', 'Easy muffin recipes for breakfast and snacks. Simple blueberry, chocolate chip, and healthy muffins.', false),
('Easy Pie Recipes', 'easy-pie-recipes', 'Simple pies and tarts', 'Easy Pie Recipes - Simple Homemade Pies', 'Easy pie recipes for beginners. Simple fruit pies, cream pies, and savory tarts.', false),
('Easy Baking Recipes', 'easy-baking-recipes', 'Simple baking for beginners', 'Easy Baking Recipes - Simple Baking for Beginners', 'Easy baking recipes perfect for beginners. Simple breads, muffins, and treats anyone can make.', true),

-- COOKING METHOD CATEGORIES
('Easy Slow Cooker Recipes', 'easy-slow-cooker-recipes', 'Set and forget meals', 'Easy Slow Cooker Recipes - Set & Forget Meals', 'Easy slow cooker recipes for busy families. Set it and forget it meals that cook while you work.', true),
('Easy Air Fryer Recipes', 'easy-air-fryer-recipes', 'Quick crispy dishes', 'Easy Air Fryer Recipes - Quick Crispy Meals', 'Easy air fryer recipes for crispy, delicious meals. Quick cooking with less oil and mess.', true),
('Easy Instant Pot Recipes', 'easy-instant-pot-recipes', 'Pressure cooker favorites', 'Easy Instant Pot Recipes - Quick Pressure Cooker Meals', 'Easy Instant Pot recipes for quick meals. Simple pressure cooker dishes ready in minutes.', true),
('Easy Skillet Recipes', 'easy-skillet-recipes', 'One-pan dinner solutions', 'Easy Skillet Recipes - One-Pan Dinners', 'Easy skillet recipes for one-pan meals. Simple dinners with minimal cleanup required.', false),
('Easy Sheet Pan Recipes', 'easy-sheet-pan-recipes', 'Everything on one tray', 'Easy Sheet Pan Recipes - One-Tray Dinners', 'Easy sheet pan recipes for complete meals. Everything cooks together on one tray for easy cleanup.', false),
('Easy Grilling Recipes', 'easy-grilling-recipes', 'Simple BBQ and grill favorites', 'Easy Grilling Recipes - Simple BBQ & Grill Meals', 'Easy grilling recipes for BBQ season. Simple grilled meats, vegetables, and outdoor cooking.', false),
('Easy No Bake Recipes', 'easy-no-bake-recipes', 'No oven required treats', 'Easy No Bake Recipes - No Oven Required Desserts', 'Easy no bake recipes for summer. Simple desserts and treats that require no baking.', false),

-- OCCASION & SPECIAL CATEGORIES
('Easy Party Recipes', 'easy-party-recipes', 'Crowd-pleasing party foods', 'Easy Party Recipes - Simple Party Foods', 'Easy party recipes for entertaining. Simple appetizers, party snacks, and crowd-pleasing dishes.', false),
('Easy Holiday Recipes', 'easy-holiday-recipes', 'Festive dishes simplified', 'Easy Holiday Recipes - Simple Holiday Cooking', 'Easy holiday recipes for festive occasions. Simple Christmas, Thanksgiving, and holiday dishes.', false),
('Easy Kid Friendly Recipes', 'easy-kid-friendly-recipes', 'Meals kids will actually eat', 'Easy Kid Friendly Recipes - Simple Kids Meals', 'Easy kid friendly recipes that children love. Simple, nutritious meals for picky eaters.', true),
('Easy Date Night Recipes', 'easy-date-night-recipes', 'Romantic dinners made simple', 'Easy Date Night Recipes - Simple Romantic Dinners', 'Easy date night recipes for romance at home. Simple elegant meals for special occasions.', false),
('Easy Meal Prep Recipes', 'easy-meal-prep-recipes', 'Make-ahead meal solutions', 'Easy Meal Prep Recipes - Simple Make-Ahead Meals', 'Easy meal prep recipes for busy weeks. Simple make-ahead breakfasts, lunches, and dinners.', true),

-- SOUP & COMFORT FOOD
('Easy Soup Recipes', 'easy-soup-recipes', 'Comforting soups made simple', 'Easy Soup Recipes - Simple Comfort Soups', 'Easy soup recipes perfect for cold days. Simple, warming, and nutritious soup recipes.', true),
('Easy Stew Recipes', 'easy-stew-recipes', 'Hearty one-pot meals', 'Easy Stew Recipes - Simple Hearty Stews', 'Easy stew recipes for comfort food. Simple beef, chicken, and vegetable stews for cold days.', false),
('Easy Casserole Recipes', 'easy-casserole-recipes', 'One-dish family meals', 'Easy Casserole Recipes - Simple One-Dish Meals', 'Easy casserole recipes for family dinners. Simple one-dish meals perfect for busy weeknights.', true),
('Easy Comfort Food Recipes', 'easy-comfort-food-recipes', 'Feel-good favorites simplified', 'Easy Comfort Food Recipes - Simple Comfort Meals', 'Easy comfort food recipes for cozy nights. Simple mac and cheese, meatloaf, and comfort classics.', false),

-- INTERNATIONAL SMALL PLATES
('Easy Tapas Recipes', 'easy-tapas-recipes', 'Spanish small plates at home', 'Easy Tapas Recipes - Simple Spanish Small Plates', 'Easy tapas recipes for entertaining. Simple Spanish appetizers and small plates for sharing.', false),
('Easy Appetizer Recipes', 'easy-appetizer-recipes', 'Perfect party starters', 'Easy Appetizer Recipes - Simple Party Starters', 'Easy appetizer recipes for entertaining. Simple finger foods, dips, and party starters.', true);

-- Verify the insert
SELECT COUNT(*) as total_categories FROM categories;
SELECT name FROM categories WHERE featured = true ORDER BY name;