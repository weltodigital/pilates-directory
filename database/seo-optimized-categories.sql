-- Clear existing categories and add comprehensive SEO-optimized categories
DELETE FROM recipe_categories;
DELETE FROM categories;

-- SEO-OPTIMIZED RECIPE CATEGORIES
-- Each category targets high-traffic keywords with optimized titles and descriptions for Google ranking

INSERT INTO categories (name, slug, description, seo_title, seo_description, featured) VALUES

-- HIGH-TRAFFIC FOOD TYPE CATEGORIES
('Easy Chicken Recipes', 'easy-chicken-recipes',
'Quick and simple chicken recipes perfect for weeknight dinners. From crispy baked chicken to creamy chicken casseroles, discover delicious chicken dishes anyone can make in 30 minutes or less.',
'Easy Chicken Recipes - Quick & Delicious Chicken Dinners | Ed''s Easy Meals',
'Discover 100+ easy chicken recipes for weeknight dinners. Quick, healthy, and delicious chicken dishes ready in 30 minutes. Perfect for busy families and beginners.',
true),

('Easy Beef Recipes', 'easy-beef-recipes',
'Simple beef recipes for every occasion. From quick ground beef dinners to tender slow-cooked roasts, learn how to cook delicious beef dishes with minimal prep time.',
'Easy Beef Recipes - Quick Ground Beef & Steak Dinners | Ed''s Easy Meals',
'Master easy beef recipes with our step-by-step guides. Quick ground beef dinners, one-pot meals, and tender steaks perfect for weeknight cooking.',
true),

('Easy Pasta Recipes', 'easy-pasta-recipes',
'Quick pasta recipes ready in 20 minutes or less. From creamy carbonara to fresh pesto dishes, discover simple pasta dinners that taste like restaurant quality.',
'Easy Pasta Recipes - Quick 20-Minute Pasta Dinners | Ed''s Easy Meals',
'100+ easy pasta recipes ready in 20 minutes. Creamy, cheesy, and fresh pasta dishes perfect for quick weeknight dinners and meal prep.',
true),

('Easy Fish Recipes', 'easy-fish-recipes',
'Simple fish and seafood recipes for healthy weeknight dinners. Baked salmon, pan-seared cod, and quick shrimp dishes that cook in under 20 minutes.',
'Easy Fish Recipes - Healthy Seafood Dinners in 20 Minutes | Ed''s Easy Meals',
'Healthy easy fish recipes for quick dinners. Baked salmon, pan-seared fish, and seafood dishes ready in 20 minutes with simple ingredients.',
true),

('Easy Pork Recipes', 'easy-pork-recipes',
'Delicious pork recipes for every meal. Quick pork chops, slow-cooker pulled pork, and tender pork tenderloin dishes that are simple to prepare.',
'Easy Pork Recipes - Quick Pork Chops & Tenderloin Dinners | Ed''s Easy Meals',
'Easy pork recipes for quick dinners. Juicy pork chops, slow-cooker meals, and tender pork dishes with simple ingredients and minimal prep.',
true),

-- CUISINE-BASED CATEGORIES
('Easy Italian Recipes', 'easy-italian-recipes',
'Authentic Italian recipes made simple. Classic pasta dishes, easy pizza recipes, and traditional Italian comfort food you can make at home in 30 minutes.',
'Easy Italian Recipes - Authentic Italian Cooking Made Simple | Ed''s Easy Meals',
'Authentic easy Italian recipes for home cooks. Classic pasta, pizza, risotto, and Italian comfort food with simple ingredients and step-by-step instructions.',
true),

('Easy Mexican Recipes', 'easy-mexican-recipes',
'Quick Mexican food recipes bursting with flavor. Easy tacos, quesadillas, enchiladas, and Mexican-inspired dinners ready in 30 minutes or less.',
'Easy Mexican Recipes - Quick Tacos, Enchiladas & Mexican Food | Ed''s Easy Meals',
'Delicious easy Mexican recipes for quick dinners. Authentic tacos, enchiladas, quesadillas, and Mexican comfort food made simple.',
true),

('Easy Asian Recipes', 'easy-asian-recipes',
'Simple Asian-inspired recipes for home cooking. Quick stir-fries, easy fried rice, noodle dishes, and Asian comfort food with authentic flavors.',
'Easy Asian Recipes - Quick Stir-Fry & Asian Dinners | Ed''s Easy Meals',
'Easy Asian recipes for quick weeknight dinners. Stir-fries, fried rice, noodle dishes, and Asian comfort food with simple ingredients.',
true),

('Easy Indian Recipes', 'easy-indian-recipes',
'Flavorful Indian recipes simplified for home cooking. Easy curry dishes, quick dal recipes, and aromatic Indian comfort food in 30 minutes.',
'Easy Indian Recipes - Quick Curry & Indian Comfort Food | Ed''s Easy Meals',
'Simple Indian recipes for home cooks. Easy curry, dal, rice dishes, and Indian comfort food with authentic spices and flavors.',
true),

('Easy Mediterranean Recipes', 'easy-mediterranean-recipes',
'Healthy Mediterranean diet recipes made simple. Fresh salads, grilled vegetables, olive oil-based dishes, and Mediterranean comfort food.',
'Easy Mediterranean Recipes - Healthy Mediterranean Diet Meals | Ed''s Easy Meals',
'Healthy easy Mediterranean recipes for the Mediterranean diet. Fresh, flavorful meals with olive oil, vegetables, and lean proteins.',
true),

-- MEAL TYPE CATEGORIES
('Easy Breakfast Recipes', 'easy-breakfast-recipes',
'Quick breakfast recipes to start your day right. Easy pancakes, healthy smoothie bowls, overnight oats, and breakfast dishes ready in 15 minutes.',
'Easy Breakfast Recipes - Quick Morning Meals in 15 Minutes | Ed''s Easy Meals',
'Quick easy breakfast recipes for busy mornings. Healthy pancakes, smoothie bowls, overnight oats, and breakfast dishes ready in 15 minutes.',
true),

('Easy Lunch Recipes', 'easy-lunch-recipes',
'Simple lunch recipes perfect for work or home. Quick sandwiches, fresh salads, soup recipes, and satisfying lunch dishes ready in 20 minutes.',
'Easy Lunch Recipes - Quick Work Lunches & Light Meals | Ed''s Easy Meals',
'Easy lunch recipes for work and home. Quick sandwiches, fresh salads, soups, and satisfying lunch dishes ready in 20 minutes.',
true),

('Easy Dinner Recipes', 'easy-dinner-recipes',
'Quick dinner recipes for busy weeknights. One-pot meals, 30-minute dinners, and family-friendly recipes that everyone will love.',
'Easy Dinner Recipes - Quick 30-Minute Weeknight Dinners | Ed''s Easy Meals',
'Quick easy dinner recipes for weeknight meals. 30-minute dinners, one-pot meals, and family-friendly recipes perfect for busy schedules.',
true),

('Easy Snack Recipes', 'easy-snack-recipes',
'Healthy snack recipes for any time of day. Quick energy bites, simple dips, healthy crackers, and satisfying snacks ready in 10 minutes.',
'Easy Snack Recipes - Quick Healthy Snacks in 10 Minutes | Ed''s Easy Meals',
'Healthy easy snack recipes for quick energy. Simple dips, energy bites, healthy crackers, and satisfying snacks ready in 10 minutes.',
true),

-- DIETARY CATEGORIES
('Easy Vegetarian Recipes', 'easy-vegetarian-recipes',
'Delicious vegetarian recipes packed with flavor. Meatless Monday meals, plant-based proteins, and satisfying vegetarian dinners for everyone.',
'Easy Vegetarian Recipes - Meatless Meals & Plant-Based Dinners | Ed''s Easy Meals',
'Delicious easy vegetarian recipes for meatless meals. Plant-based proteins, satisfying vegetarian dinners, and healthy meatless options.',
true),

('Easy Vegan Recipes', 'easy-vegan-recipes',
'Simple vegan recipes that taste amazing. Plant-based meals, dairy-free alternatives, and vegan comfort food that''s easy to make at home.',
'Easy Vegan Recipes - Plant-Based Meals & Dairy-Free Cooking | Ed''s Easy Meals',
'Easy vegan recipes for plant-based eating. Dairy-free meals, vegan comfort food, and simple plant-based recipes for everyday cooking.',
true),

('Easy Keto Recipes', 'easy-keto-recipes',
'Low-carb keto recipes for the ketogenic diet. High-fat, low-carb meals, keto-friendly snacks, and satisfying keto dishes under 10g carbs.',
'Easy Keto Recipes - Low-Carb Ketogenic Diet Meals | Ed''s Easy Meals',
'Easy keto recipes for the ketogenic diet. Low-carb, high-fat meals under 10g carbs. Keto-friendly dinners, snacks, and meal prep ideas.',
true),

('Easy Gluten-Free Recipes', 'easy-gluten-free-recipes',
'Delicious gluten-free recipes for celiac and gluten sensitivity. Wheat-free alternatives, gluten-free pasta, bread, and comfort food recipes.',
'Easy Gluten-Free Recipes - Wheat-Free Meals & Celiac-Friendly | Ed''s Easy Meals',
'Easy gluten-free recipes for celiac disease and gluten sensitivity. Wheat-free meals, gluten-free pasta, bread, and comfort food.',
true),

('Easy Paleo Recipes', 'easy-paleo-recipes',
'Simple paleo diet recipes with whole foods. Grain-free, dairy-free meals following paleo principles with natural ingredients.',
'Easy Paleo Recipes - Grain-Free Paleo Diet Meals | Ed''s Easy Meals',
'Easy paleo recipes for the paleo diet. Grain-free, dairy-free meals with whole foods and natural ingredients following paleo principles.',
true),

-- COOKING METHOD CATEGORIES
('Easy One-Pot Recipes', 'easy-one-pot-recipes',
'Simple one-pot meals with minimal cleanup. Skillet dinners, one-pan recipes, and complete meals cooked in a single pot or pan.',
'Easy One-Pot Recipes - Minimal Cleanup Skillet Dinners | Ed''s Easy Meals',
'Easy one-pot recipes for minimal cleanup. Complete skillet dinners, one-pan meals, and simple recipes cooked in a single pot.',
true),

('Easy Slow Cooker Recipes', 'easy-slow-cooker-recipes',
'Set-and-forget slow cooker recipes. Crock pot meals, slow-cooked stews, and tender meats that cook while you''re away.',
'Easy Slow Cooker Recipes - Set & Forget Crock Pot Meals | Ed''s Easy Meals',
'Easy slow cooker recipes for set-and-forget meals. Crock pot dinners, slow-cooked stews, and tender meats ready when you get home.',
true),

('Easy Air Fryer Recipes', 'easy-air-fryer-recipes',
'Quick air fryer recipes for crispy results. Healthy fried foods, air fryer vegetables, and crispy proteins with less oil.',
'Easy Air Fryer Recipes - Crispy Healthy Air Fried Foods | Ed''s Easy Meals',
'Easy air fryer recipes for crispy, healthy results. Air fried vegetables, crispy proteins, and healthy "fried" foods with less oil.',
true),

('Easy Instant Pot Recipes', 'easy-instant-pot-recipes',
'Quick Instant Pot pressure cooker recipes. Fast rice dishes, tender meats, and complete meals ready in 30 minutes or less.',
'Easy Instant Pot Recipes - Quick Pressure Cooker Meals | Ed''s Easy Meals',
'Easy Instant Pot recipes for quick pressure cooking. Fast rice dishes, tender meats, and complete meals ready in 30 minutes.',
true),

('Easy Baked Recipes', 'easy-baked-recipes',
'Simple baked recipes for the oven. Sheet pan dinners, baked chicken, roasted vegetables, and easy oven meals with minimal prep.',
'Easy Baked Recipes - Sheet Pan Dinners & Oven Meals | Ed''s Easy Meals',
'Easy baked recipes for simple oven cooking. Sheet pan dinners, baked proteins, roasted vegetables, and oven meals with minimal prep.',
true),

-- DESSERT CATEGORIES
('Easy Dessert Recipes', 'easy-dessert-recipes',
'Quick dessert recipes for sweet treats. Simple cakes, easy cookies, no-bake desserts, and sweet treats ready in 30 minutes.',
'Easy Dessert Recipes - Quick Sweet Treats & Simple Cakes | Ed''s Easy Meals',
'Easy dessert recipes for quick sweet treats. Simple cakes, easy cookies, no-bake desserts, and sweet treats ready in 30 minutes.',
true),

('Easy Cake Recipes', 'easy-cake-recipes',
'Simple cake recipes from scratch. One-bowl cakes, easy frosting, and moist cake recipes perfect for beginners and celebrations.',
'Easy Cake Recipes - Simple Homemade Cakes from Scratch | Ed''s Easy Meals',
'Easy cake recipes for homemade cakes from scratch. One-bowl cakes, simple frosting, and moist cake recipes perfect for beginners.',
true),

('Easy Cookie Recipes', 'easy-cookie-recipes',
'Quick cookie recipes for fresh-baked treats. Chocolate chip cookies, sugar cookies, and easy cookie recipes ready in 20 minutes.',
'Easy Cookie Recipes - Quick Homemade Cookies in 20 Minutes | Ed''s Easy Meals',
'Easy cookie recipes for homemade treats. Quick chocolate chip cookies, sugar cookies, and fresh-baked cookies ready in 20 minutes.',
true),

-- COMFORT FOOD CATEGORIES
('Easy Comfort Food Recipes', 'easy-comfort-food-recipes',
'Classic comfort food recipes made simple. Mac and cheese, meatloaf, casseroles, and cozy comfort food dishes for family dinners.',
'Easy Comfort Food Recipes - Classic Mac & Cheese, Casseroles | Ed''s Easy Meals',
'Easy comfort food recipes for cozy family dinners. Classic mac and cheese, meatloaf, casseroles, and comforting dishes made simple.',
true),

('Easy Soup Recipes', 'easy-soup-recipes',
'Hearty soup recipes for any season. Quick chicken soup, vegetable soups, and comforting soup recipes ready in 30 minutes.',
'Easy Soup Recipes - Quick Chicken Soup & Hearty Soups | Ed''s Easy Meals',
'Easy soup recipes for hearty, comforting meals. Quick chicken soup, vegetable soups, and warming soup recipes ready in 30 minutes.',
true),

('Easy Casserole Recipes', 'easy-casserole-recipes',
'Simple casserole recipes for family meals. One-dish dinners, make-ahead casseroles, and baked comfort food perfect for meal prep.',
'Easy Casserole Recipes - One-Dish Family Dinners & Meal Prep | Ed''s Easy Meals',
'Easy casserole recipes for family dinners. One-dish meals, make-ahead casseroles, and baked comfort food perfect for meal prep.',
true),

-- SEASONAL CATEGORIES
('Easy Summer Recipes', 'easy-summer-recipes',
'Light summer recipes for hot weather. Grilled foods, fresh salads, cold soups, and no-cook meals perfect for summer entertaining.',
'Easy Summer Recipes - Grilled Foods & No-Cook Summer Meals | Ed''s Easy Meals',
'Easy summer recipes for hot weather cooking. Grilled foods, fresh salads, cold soups, and no-cook meals perfect for summer.',
true),

('Easy Winter Recipes', 'easy-winter-recipes',
'Warming winter recipes for cold days. Hearty stews, hot soups, comfort food, and cozy winter meals to warm you up.',
'Easy Winter Recipes - Hearty Stews & Warming Winter Comfort Food | Ed''s Easy Meals',
'Easy winter recipes for cold weather comfort. Hearty stews, hot soups, warming comfort food, and cozy winter meals.',
true),

-- HEALTHY CATEGORIES
('Easy Healthy Recipes', 'easy-healthy-recipes',
'Nutritious healthy recipes that taste great. Low-calorie meals, nutrient-dense foods, and healthy dinner ideas for clean eating.',
'Easy Healthy Recipes - Low-Calorie Meals & Clean Eating | Ed''s Easy Meals',
'Easy healthy recipes for nutritious meals. Low-calorie dinners, nutrient-dense foods, and healthy eating ideas for clean living.',
true),

('Easy Low-Calorie Recipes', 'easy-low-calorie-recipes',
'Delicious low-calorie recipes for weight loss. Light meals under 400 calories, healthy substitutions, and satisfying diet-friendly foods.',
'Easy Low-Calorie Recipes - Weight Loss Meals Under 400 Calories | Ed''s Easy Meals',
'Easy low-calorie recipes for weight loss. Light meals under 400 calories, healthy substitutions, and satisfying diet-friendly foods.',
true),

-- QUICK COOKING CATEGORIES
('Easy 15-Minute Recipes', 'easy-15-minute-recipes',
'Super quick recipes ready in 15 minutes or less. Fast meals, quick snacks, and express cooking for busy schedules.',
'Easy 15-Minute Recipes - Super Quick Meals for Busy Schedules | Ed''s Easy Meals',
'Easy 15-minute recipes for super quick meals. Fast dinners, quick snacks, and express cooking perfect for busy schedules.',
true),

('Easy 30-Minute Recipes', 'easy-30-minute-recipes',
'Quick 30-minute meals for weeknight dinners. Fast cooking techniques, simple ingredients, and complete meals ready in half an hour.',
'Easy 30-Minute Recipes - Quick Weeknight Dinners | Ed''s Easy Meals',
'Easy 30-minute recipes for quick weeknight dinners. Fast cooking techniques, simple ingredients, and complete meals in 30 minutes.',
true),

-- FAMILY-FRIENDLY CATEGORIES
('Easy Family Recipes', 'easy-family-recipes',
'Kid-friendly family recipes everyone will love. Large batch meals, picky eater solutions, and family dinner ideas for busy parents.',
'Easy Family Recipes - Kid-Friendly Meals for Busy Parents | Ed''s Easy Meals',
'Easy family recipes for busy parents. Kid-friendly meals, large batch cooking, and family dinner ideas everyone will love.',
true),

('Easy Kid-Friendly Recipes', 'easy-kid-friendly-recipes',
'Simple recipes kids will actually eat. Hidden vegetables, fun presentations, and nutritious meals disguised as kid favorites.',
'Easy Kid-Friendly Recipes - Healthy Meals Kids Will Actually Eat | Ed''s Easy Meals',
'Easy kid-friendly recipes children will love. Hidden vegetables, fun presentations, and nutritious meals disguised as favorites.',
true),

-- SPECIAL OCCASION CATEGORIES
('Easy Holiday Recipes', 'easy-holiday-recipes',
'Simple holiday recipes for special occasions. Easy Thanksgiving dishes, Christmas cookies, and festive holiday meals made simple.',
'Easy Holiday Recipes - Simple Thanksgiving & Christmas Meals | Ed''s Easy Meals',
'Easy holiday recipes for festive occasions. Simple Thanksgiving dishes, Christmas cookies, and holiday meals made easy.',
true),

('Easy Party Recipes', 'easy-party-recipes',
'Quick party food and appetizers. Easy finger foods, crowd-pleasing appetizers, and party dishes that feed a crowd.',
'Easy Party Recipes - Quick Appetizers & Crowd-Pleasing Party Food | Ed''s Easy Meals',
'Easy party recipes for entertaining. Quick finger foods, crowd-pleasing appetizers, and party dishes perfect for gatherings.',
true),

-- BREAD & BAKING CATEGORIES
('Easy Bread Recipes', 'easy-bread-recipes',
'Simple bread recipes for homemade bread. No-knead breads, quick bread recipes, and easy yeast breads for beginners.',
'Easy Bread Recipes - No-Knead Homemade Bread for Beginners | Ed''s Easy Meals',
'Easy bread recipes for homemade bread baking. No-knead breads, quick bread recipes, and simple yeast breads for beginners.',
true),

('Easy Muffin Recipes', 'easy-muffin-recipes',
'Quick muffin recipes for breakfast and snacks. Blueberry muffins, banana muffins, and healthy muffin recipes ready in 30 minutes.',
'Easy Muffin Recipes - Quick Blueberry & Banana Muffins | Ed''s Easy Meals',
'Easy muffin recipes for quick breakfast treats. Blueberry muffins, banana muffins, and healthy muffin recipes in 30 minutes.',
true),

-- INGREDIENT-SPECIFIC CATEGORIES
('Easy Rice Recipes', 'easy-rice-recipes',
'Simple rice dishes for every meal. Fried rice, rice bowls, rice casseroles, and creative ways to use leftover rice.',
'Easy Rice Recipes - Fried Rice, Rice Bowls & Leftover Rice Ideas | Ed''s Easy Meals',
'Easy rice recipes for every meal. Quick fried rice, rice bowls, casseroles, and creative ways to use leftover rice.',
true),

('Easy Potato Recipes', 'easy-potato-recipes',
'Delicious potato recipes beyond basic boiling. Roasted potatoes, potato casseroles, mashed potatoes, and creative potato dishes.',
'Easy Potato Recipes - Roasted Potatoes & Creative Potato Dishes | Ed''s Easy Meals',
'Easy potato recipes beyond the basics. Roasted potatoes, potato casseroles, creative mashed potatoes, and delicious potato dishes.',
true),

('Easy Egg Recipes', 'easy-egg-recipes',
'Versatile egg recipes for any meal. Scrambled eggs, egg sandwiches, frittatas, and creative ways to cook with eggs.',
'Easy Egg Recipes - Scrambled Eggs, Frittatas & Egg Dishes | Ed''s Easy Meals',
'Easy egg recipes for versatile meals. Perfect scrambled eggs, frittatas, egg sandwiches, and creative ways to cook with eggs.',
true);

-- Verify the insert
SELECT COUNT(*) as total_categories FROM categories;
SELECT name, featured FROM categories WHERE featured = true ORDER BY name;