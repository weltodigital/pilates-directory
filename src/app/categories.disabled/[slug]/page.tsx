import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, ChefHat, Timer, Utensils, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Metadata } from 'next'

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  difficulty: string;
  calories_per_serving: number;
  featured_image_url: string;
  featured_image_alt: string;
  categories?: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  seo_title: string;
  seo_description: string;
}

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !category) {
    return null;
  }

  return category;
}

async function getCategoryRecipes(categoryId: string): Promise<Recipe[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // First get recipes that belong to this category
  const { data: categoryRecipes, error: categoryError } = await supabase
    .from('recipe_categories')
    .select('recipe_id')
    .eq('category_id', categoryId);

  if (categoryError || !categoryRecipes || categoryRecipes.length === 0) {
    console.error('Error fetching category recipes:', categoryError);
    return [];
  }

  const recipeIds = categoryRecipes.map(rc => rc.recipe_id);

  // Then get full recipe data with ALL categories for each recipe
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      id, title, slug, description, prep_time, cook_time, total_time,
      servings, difficulty, calories_per_serving, featured_image_url, featured_image_alt,
      recipe_categories(
        categories(
          id,
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .in('id', recipeIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching category recipes:', error);
    return [];
  }

  // Transform the data to include all categories for each recipe
  const recipesWithCategories = recipes?.map(recipe => ({
    ...recipe,
    categories: recipe.recipe_categories?.map((rc: any) => rc.categories) || []
  })) || [];

  return recipesWithCategories;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    return {
      title: 'Category Not Found - Ed\'s Easy Meals',
      description: 'The recipe category you\'re looking for could not be found.'
    };
  }

  return {
    title: category.seo_title || `${category.name} - Ed's Easy Meals`,
    description: category.seo_description || category.description,
    openGraph: {
      title: category.seo_title || `${category.name} - Ed's Easy Meals`,
      description: category.seo_description || category.description
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const recipes = await getCategoryRecipes(category.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-jakarta">
            {category.name}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            {category.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>{recipes.length} recipes available</span>
          </div>
        </div>

        {/* Recipes Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
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
                        {recipe.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="inline-block px-2 py-1 text-xs bg-[#fec52b] text-black rounded-full hover:bg-[#e5b327] transition-colors"
                          >
                            {cat.name.replace('Easy ', '').replace(' Recipes', '')}
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
            <ChefHat className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We're working on adding more recipes to this category. Check back soon!
            </p>
            <Button asChild>
              <Link href="/">Browse All Recipes</Link>
            </Button>
          </div>
        )}

        {/* Back to Categories */}
        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <Link href="/#browse-categories" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Browse All Categories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}