-- Easy Meals Directory Database Schema
-- Optimized for SEO and recipe content management

-- Categories table for organizing recipes
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tags table for flexible recipe tagging
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Main recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  ingredients JSONB NOT NULL, -- Array of ingredient objects with amounts
  instructions JSONB NOT NULL, -- Array of instruction steps
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  total_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  calories_per_serving INTEGER,

  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  featured_image_url TEXT,
  featured_image_alt TEXT,

  -- Content fields
  tips TEXT,
  variations TEXT,
  storage_instructions TEXT,

  -- Ratings and engagement
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Status and publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,

  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Junction table for recipe-category relationships (many-to-many)
CREATE TABLE recipe_categories (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, category_id)
);

-- Junction table for recipe-tag relationships (many-to-many)
CREATE TABLE recipe_tags (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- Nutrition information table
CREATE TABLE recipe_nutrition (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE UNIQUE,
  calories INTEGER,
  protein DECIMAL(5,2), -- grams
  carbs DECIMAL(5,2), -- grams
  fat DECIMAL(5,2), -- grams
  fiber DECIMAL(5,2), -- grams
  sugar DECIMAL(5,2), -- grams
  sodium DECIMAL(7,2), -- milligrams
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recipe images table for multiple images per recipe
CREATE TABLE recipe_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collections table for featured recipe collections
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Junction table for collection-recipe relationships
CREATE TABLE collection_recipes (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, recipe_id)
);

-- Create indexes for performance
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_featured ON recipes(featured);
CREATE INDEX idx_recipes_published_at ON recipes(published_at);
CREATE INDEX idx_recipes_rating ON recipes(rating);
CREATE INDEX idx_recipes_view_count ON recipes(view_count);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_featured ON categories(featured);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_recipe_categories_recipe_id ON recipe_categories(recipe_id);
CREATE INDEX idx_recipe_categories_category_id ON recipe_categories(category_id);
CREATE INDEX idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag_id ON recipe_tags(tag_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipe_nutrition_updated_at BEFORE UPDATE ON recipe_nutrition FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories based on your target keywords
INSERT INTO categories (name, slug, description, seo_title, seo_description, featured) VALUES
('Easy Recipes', 'easy-recipes', 'Simple and quick recipes for busy people', 'Easy Recipes - Simple & Quick Meals | Ed''s Easy Meals', 'Discover easy recipes that anyone can make. Quick, simple meals with minimal ingredients and maximum flavor.', true),
('Easy Cake Recipes', 'easy-cake-recipes', 'Simple cake recipes perfect for beginners', 'Easy Cake Recipes - Simple Cakes Anyone Can Make', 'Easy cake recipes for beginners with step-by-step instructions. Perfect for birthdays, celebrations, or weekend baking.', true),
('Easy Cookie Recipes', 'easy-cookie-recipes', 'Quick and simple cookie recipes', 'Easy Cookie Recipes - Quick & Simple Cookies', 'Simple cookie recipes with few ingredients. Perfect for beginners and kids to bake together.', true),
('Easy Pasta Recipes', 'easy-pasta-recipes', 'Quick pasta dishes for any occasion', 'Easy Pasta Recipes - Quick Pasta Dishes', 'Easy pasta recipes ready in under 30 minutes. From creamy sauces to simple tomato dishes.', true),
('Easy Dessert Recipes', 'easy-dessert-recipes', 'Simple desserts that impress', 'Easy Dessert Recipes - Simple Sweet Treats', 'Easy dessert recipes for any occasion. Quick puddings, simple cakes, and impressive treats made easy.', true),
('Easy Vegetarian Recipes', 'easy-vegetarian-recipes', 'Plant-based meals made simple', 'Easy Vegetarian Recipes - Simple Plant-Based Meals', 'Easy vegetarian recipes packed with flavor. Healthy, simple, and satisfying plant-based dishes.', true),
('Easy Chicken Recipes', 'easy-chicken-recipes', 'Simple chicken dishes for dinner', 'Easy Chicken Recipes - Quick Chicken Dinners', 'Easy chicken recipes for weeknight dinners. Simple, flavorful, and family-friendly chicken dishes.', true),
('Easy Slow Cooker Recipes', 'easy-slow-cooker-recipes', 'Set and forget slow cooker meals', 'Easy Slow Cooker Recipes - Set & Forget Meals', 'Easy slow cooker recipes for busy families. Set it and forget it meals that cook while you work.', true),
('Easy Baking Recipes', 'easy-baking-recipes', 'Simple baking for beginners', 'Easy Baking Recipes - Simple Baking for Beginners', 'Easy baking recipes perfect for beginners. Simple breads, muffins, and treats anyone can make.', true),
('Easy Dinner Recipes', 'easy-dinner-recipes', 'Quick weeknight dinner solutions', 'Easy Dinner Recipes - Quick Weeknight Meals', 'Easy dinner recipes ready in 30 minutes or less. Perfect for busy weeknights and family meals.', true),
('Easy Vegan Recipes', 'easy-vegan-recipes', 'Plant-based recipes made simple', 'Easy Vegan Recipes - Simple Plant-Based Cooking', 'Easy vegan recipes that are delicious and satisfying. Simple plant-based meals for everyone.', false),
('Easy Soup Recipes', 'easy-soup-recipes', 'Comforting soups made simple', 'Easy Soup Recipes - Simple Comfort Soups', 'Easy soup recipes perfect for cold days. Simple, warming, and nutritious soup recipes.', false),
('Easy Air Fryer Recipes', 'easy-air-fryer-recipes', 'Quick air fryer meals', 'Easy Air Fryer Recipes - Quick Crispy Meals', 'Easy air fryer recipes for crispy, delicious meals. Quick cooking with less oil.', false),
('Easy Lunch Recipes', 'easy-lunch-recipes', 'Quick lunch ideas', 'Easy Lunch Recipes - Quick Lunch Ideas', 'Easy lunch recipes for work, school, or home. Quick, satisfying midday meals.', false),
('Easy Healthy Recipes', 'easy-healthy-recipes', 'Nutritious meals made simple', 'Easy Healthy Recipes - Simple Nutritious Meals', 'Easy healthy recipes that taste great. Simple, nutritious meals for a healthier lifestyle.', false);

-- Insert common tags
INSERT INTO tags (name, slug) VALUES
('quick', 'quick'),
('30-minute', '30-minute'),
('one-pot', 'one-pot'),
('no-bake', 'no-bake'),
('gluten-free', 'gluten-free'),
('dairy-free', 'dairy-free'),
('low-carb', 'low-carb'),
('high-protein', 'high-protein'),
('kid-friendly', 'kid-friendly'),
('freezer-friendly', 'freezer-friendly'),
('meal-prep', 'meal-prep'),
('budget-friendly', 'budget-friendly'),
('beginner', 'beginner'),
('comfort-food', 'comfort-food'),
('seasonal', 'seasonal');