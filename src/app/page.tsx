import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, ChefHat, Timer, Utensils } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import SEOSchemaMarkup from '@/components/SEOSchemaMarkup'

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: any;
  instructions: any;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  difficulty: string;
  calories_per_serving: number;
  seo_title: string;
  seo_description: string;
  featured_image_url: string;
  featured_image_alt: string;
  tips: string;
  featured: boolean;
  categories?: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  seo_title: string;
  seo_description: string;
  featured: boolean;
}

async function getFeaturedRecipes(): Promise<Recipe[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_categories!inner(
        categories(
          id,
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured recipes:', error);
    return [];
  }

  // Transform the data to include categories directly on recipes
  const recipesWithCategories = recipes?.map(recipe => ({
    ...recipe,
    categories: recipe.recipe_categories?.map((rc: any) => rc.categories) || []
  })) || [];

  return recipesWithCategories;
}

async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

// Helper function to categorize recipes by type
function categorizeRecipes(categories: Category[]) {
  const timeBasedKeywords = ['5-minute', '10-minute', '15-minute', '20-minute', '25-minute', '30-minute', '35-minute', '40-minute', '45-minute'];
  const ingredientKeywords = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey', 'lamb', 'bacon', 'sausage', 'ham', 'duck', 'potato', 'sweet-potato', 'carrot', 'beet', 'broccoli', 'cauliflower', 'brussels-sprouts', 'cabbage', 'spinach', 'kale', 'lettuce', 'tomato', 'bell-pepper', 'eggplant', 'zucchini', 'butternut-squash', 'acorn-squash', 'onion', 'garlic', 'mushroom', 'corn', 'pea', 'asparagus', 'artichoke', 'lemon', 'orange', 'lime', 'grapefruit', 'peach', 'cherry', 'plum', 'apricot', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'cranberry', 'pineapple', 'mango', 'coconut', 'banana', 'apple', 'pear', 'watermelon', 'cantaloupe', 'grape', 'avocado', 'kiwi', 'tofu', 'lentil', 'egg', 'cheese', 'halloumi', 'chorizo', 'pumpkin', 'quinoa', 'chickpea', 'marrow', 'leek', 'pork-belly', 'red-cabbage', 'blackcurrant', 'quince', 'steak', 'tuna', 'cod', 'tilapia', 'crab', 'lobster', 'scallop', 'mahi-mahi', 'halibut'];
  const cuisineKeywords = ['italian', 'mexican', 'asian', 'indian', 'chinese', 'thai', 'japanese', 'korean', 'french', 'spanish', 'greek', 'mediterranean', 'american', 'british', 'german', 'moroccan', 'middle-eastern', 'brazilian', 'turkish', 'vietnamese', 'ethiopian', 'peruvian', 'caribbean', 'cuban', 'southern', 'cajun', 'australian', 'scandinavian', 'polish', 'filipino', 'malaysian'];
  const dishTypeKeywords = ['soup', 'salad', 'smoothie', 'green-smoothie', 'ramen', 'pasta', 'pizza', 'stir-fry', 'curry', 'stew', 'casserole', 'chicken-casserole', 'traybake', 'quiche', 'burger', 'wrap', 'sandwich', 'noodle', 'rice', 'gnocchi', 'spaghetti', 'orzo', 'tapas', 'canape', 'dip', 'cheesecake', 'dessert', 'breakfast', 'lunch', 'dinner', 'appetizer', 'snack', 'side-dish', 'main-course', 'vegetarian', 'vegan', 'puff-pastry', 'chicken-curry', 'one-pot', 'air-fryer', 'cake', 'no-cook', 'family'];
  const occasionKeywords = ['christmas', 'thanksgiving', 'easter', 'halloween', 'new-year', 'birthday', 'anniversary', 'wedding', 'baby-shower', 'party', 'game-day', 'picnic', 'bbq', 'brunch', 'weeknight', 'weekend', 'summer', 'winter', 'date-night', 'student'];
  const healthKeywords = ['high-protein', 'low-carb', 'high-fiber', 'healthy-fat', 'low-calorie', 'high-calorie', 'gluten-free', 'dairy-free', 'sugar-free', 'keto', 'paleo', 'mediterranean', 'anti-inflammatory', 'detox', 'energy-boosting'];

  const timeCategories = categories.filter(cat =>
    timeBasedKeywords.some(keyword => cat.slug.includes(keyword))
  );

  const ingredientCategories = categories.filter(cat =>
    ingredientKeywords.some(keyword => cat.slug.includes(keyword))
  );

  const cuisineCategories = categories.filter(cat =>
    cuisineKeywords.some(keyword => cat.slug.includes(keyword))
  );

  const dishTypeCategories = categories.filter(cat =>
    dishTypeKeywords.some(keyword => cat.slug.includes(keyword))
  );

  const occasionCategories = categories.filter(cat =>
    occasionKeywords.some(keyword => cat.slug.includes(keyword))
  );

  const healthCategories = categories.filter(cat =>
    healthKeywords.some(keyword => cat.slug.includes(keyword))
  );

  // Get all used category IDs to find uncategorized ones
  const usedIds = new Set([
    ...timeCategories.map(cat => cat.id),
    ...ingredientCategories.map(cat => cat.id),
    ...cuisineCategories.map(cat => cat.id),
    ...dishTypeCategories.map(cat => cat.id),
    ...occasionCategories.map(cat => cat.id),
    ...healthCategories.map(cat => cat.id)
  ]);

  // Find uncategorized categories
  const otherCategories = categories.filter(cat => !usedIds.has(cat.id));

  return {
    timeCategories, // Show all time categories
    ingredientCategories, // Show all ingredient categories
    cuisineCategories, // Show all cuisine categories
    dishTypeCategories, // Show all dish type categories
    occasionCategories, // Show all occasion categories
    healthCategories, // Show all health categories
    otherCategories // Show any remaining uncategorized categories
  };
}

export default async function Home() {
  // Get featured recipes and all categories
  const [featuredRecipes, allCategories] = await Promise.all([
    getFeaturedRecipes(),
    getAllCategories()
  ]);

  // Categorize recipes by type
  const {
    timeCategories,
    ingredientCategories,
    cuisineCategories,
    dishTypeCategories,
    occasionCategories,
    healthCategories,
    otherCategories
  } = categorizeRecipes(allCategories);

  return (
    <div>
      <SEOSchemaMarkup page="home" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/eds-easy-meals-hero.png)',
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-white mb-6 font-jakarta drop-shadow-lg">
              Easy Recipes Anyone Can Make
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Discover thousands of simple, delicious recipes with step-by-step instructions. From quick dinners to easy desserts - cooking made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3 bg-[#fec52b] hover:bg-[#e5b327] text-black border-0 shadow-lg font-semibold" asChild>
                <Link href="#browse-categories">Browse All Recipes</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" asChild>
                <Link href="#featured-recipes">View Featured Recipes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Featured Recipes */}
        <div id="featured-recipes" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
            Featured Easy Recipes
          </h2>
          {featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Recipe Image */}
                  {recipe.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={recipe.featured_image_url}
                        alt={recipe.featured_image_alt || recipe.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-xl">{recipe.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <ChefHat className="h-4 w-4" />
                      {recipe.difficulty} • {recipe.total_time} mins
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Recipe Stats */}
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4" />
                          <span>{recipe.prep_time}m prep</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.cook_time}m cook</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>

                      {/* Calories */}
                      {recipe.calories_per_serving && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Utensils className="h-4 w-4" />
                          <span>{recipe.calories_per_serving} calories per serving</span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {recipe.description}
                      </p>

                      {/* Category Tags */}
                      {recipe.categories && recipe.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {recipe.categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                              className="inline-block px-2 py-1 text-xs bg-[#fec52b] text-black rounded-full hover:bg-[#e5b327] transition-colors"
                            >
                              {category.name.replace('Easy ', '').replace(' Recipes', '')}
                            </Link>
                          ))}
                        </div>
                      )}


                      {/* Action Button */}
                      <div className="pt-2">
                        <Button size="sm" className="w-full bg-[#b0512e] hover:bg-[#8e4224] text-white" asChild>
                          <Link href={`/recipes/${recipe.slug}`}>
                            View Recipe
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No featured recipes available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Recipe Categories by Type */}
        <div id="browse-categories" className="mb-16 space-y-16">

          {/* Easy Recipes By Time */}
          {timeCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                Easy Recipes By Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {timeCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Easy Recipes By Ingredient */}
          {ingredientCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                Easy Recipes By Ingredient
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {ingredientCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Easy Recipes By Cuisine */}
          {cuisineCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                Easy Recipes By Cuisine
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cuisineCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Easy Recipes By Dish Type */}
          {dishTypeCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                Easy Recipes By Dish Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dishTypeCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Easy Recipes By Occasion */}
          {occasionCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                Easy Recipes By Occasion
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {occasionCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Easy Healthy Recipes */}
          {healthCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                Easy Healthy Recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {healthCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Categories */}
          {otherCategories.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center font-jakarta">
                More Easy Recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="hover:text-[#b0512e] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[#b0512e] hover:text-[#8e4224] text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View Recipes
                      <ChefHat className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#b0512e] to-[#8e4224] rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 font-jakarta">Ready to Start Cooking Easy Meals?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of home cooks who trust Ed's Easy Meals for simple, delicious recipes that anyone can make
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3 bg-[#fec52b] hover:bg-[#e5b327] text-black font-semibold" asChild>
              <Link href="#browse-categories">Browse All Recipes</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" asChild>
              <Link href="#featured-recipes">View Featured Recipes</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}