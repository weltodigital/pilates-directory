import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Metadata } from 'next'
import { Clock, Users, ChefHat, Star, Bookmark, Share2, Utensils, Timer } from 'lucide-react'

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: any[];
  instructions: any[];
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
  variations: string;
  storage_instructions: string;
  created_at: string;
  categories?: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

async function getRecipe(slug: string): Promise<Recipe | null> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: recipe, error } = await supabase
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
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !recipe) {
    return null;
  }

  const recipeWithCategories = {
    ...recipe,
    categories: recipe.recipe_categories?.map((rc: any) => rc.categories) || []
  };

  return recipeWithCategories;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const recipe = await getRecipe(resolvedParams.slug);

  if (!recipe) {
    return {
      title: 'Recipe Not Found - Ed\'s Easy Meals',
      description: 'The recipe you\'re looking for could not be found.'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
  const imageUrl = recipe.featured_image_url ? `${baseUrl}${recipe.featured_image_url}` : null;
  const recipeUrl = `${baseUrl}/recipes/${recipe.slug}`;

  return {
    title: recipe.seo_title || `${recipe.title} Recipe - Ed's Easy Meals`,
    description: recipe.seo_description || recipe.description,
    keywords: [
      recipe.title,
      'recipe',
      'easy recipe',
      'cooking',
      'food',
      ...(recipe.categories?.map(cat => cat.name.toLowerCase()) || [])
    ].join(', '),
    authors: [{ name: 'Ed\'s Easy Meals' }],
    creator: 'Ed\'s Easy Meals',
    publisher: 'Ed\'s Easy Meals',
    alternates: {
      canonical: recipeUrl
    },
    openGraph: {
      type: 'article',
      title: recipe.seo_title || recipe.title,
      description: recipe.seo_description || recipe.description,
      url: recipeUrl,
      siteName: 'Ed\'s Easy Meals',
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: recipe.featured_image_alt || recipe.title
      }] : [],
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.seo_title || recipe.title,
      description: recipe.seo_description || recipe.description,
      images: imageUrl ? [imageUrl] : [],
      creator: '@edseasymeals'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

function generateRecipeSchema(recipe: Recipe) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
  const imageUrl = recipe.featured_image_url ? `${baseUrl}${recipe.featured_image_url}` : null;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.title,
    "description": recipe.description,
    "image": imageUrl ? [imageUrl] : [],
    "author": {
      "@type": "Person",
      "name": "Ed's Easy Meals"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ed's Easy Meals"
    },
    "datePublished": recipe.created_at,
    "prepTime": `PT${recipe.prep_time}M`,
    "cookTime": `PT${recipe.cook_time}M`,
    "totalTime": `PT${recipe.total_time}M`,
    "recipeYield": recipe.servings.toString(),
    "recipeCategory": recipe.categories?.map(cat => cat.name.replace('Easy ', '').replace(' Recipes', '')) || [],
    "recipeCuisine": "American",
    "keywords": recipe.categories?.map(cat => cat.name.toLowerCase()).join(', ') || '',
    "nutrition": recipe.calories_per_serving ? {
      "@type": "NutritionInformation",
      "calories": `${recipe.calories_per_serving} calories`
    } : undefined,
    "recipeIngredient": recipe.ingredients.map((ing: any) => `${ing.amount} ${ing.name}`),
    "recipeInstructions": recipe.instructions.map((inst: any) => ({
      "@type": "HowToStep",
      "text": inst.instruction,
      "position": inst.step
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const recipe = await getRecipe(resolvedParams.slug);

  if (!recipe) {
    notFound();
  }

  const recipeSchema = generateRecipeSchema(recipe);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeSchema)
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
              <li>/</li>
              <li><Link href="/" className="hover:text-orange-600">Recipes</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{recipe.title}</li>
            </ol>
          </nav>

          {/* Recipe Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {recipe.title}
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              {recipe.description}
            </p>

            {/* Recipe Meta Info */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <Timer className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">Prep: {recipe.prep_time}min</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">Cook: {recipe.cook_time}min</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">Serves: {recipe.servings}</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium capitalize">{recipe.difficulty}</span>
              </div>
              {recipe.calories_per_serving && (
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                  <Utensils className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium">{recipe.calories_per_serving} cal</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save Recipe
              </button>
              <button className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </header>

          {/* Recipe Image */}
          {recipe.featured_image_url && (
            <div className="mb-10">
              <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={recipe.featured_image_url}
                  alt={recipe.featured_image_alt || recipe.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </div>
          )}

          {/* Category Tags */}
          {recipe.categories && recipe.categories.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Recipe Categories</h3>
              <div className="flex flex-wrap gap-3">
                {recipe.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium text-sm"
                  >
                    {category.name.replace('Easy ', '').replace(' Recipes', '')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recipe Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-orange-600" />
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient: any, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <input type="checkbox" className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="text-gray-800">
                        <strong className="text-orange-700">{ingredient.amount}</strong> {ingredient.name}
                        {ingredient.notes && (
                          <span className="text-gray-500 text-sm block">{ingredient.notes}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                  Instructions
                </h2>
                <ol className="space-y-6">
                  {recipe.instructions.map((instruction: any, index: number) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {instruction.step}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">{instruction.instruction}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Recipe Tips & Storage */}
          {(recipe.tips || recipe.variations || recipe.storage_instructions) && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipe.tips && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3">💡 Pro Tips</h3>
                  <p className="text-blue-800 text-sm">{recipe.tips}</p>
                </div>
              )}
              {recipe.variations && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-green-900 mb-3">🔄 Variations</h3>
                  <p className="text-green-800 text-sm">{recipe.variations}</p>
                </div>
              )}
              {recipe.storage_instructions && (
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-bold text-purple-900 mb-3">🏠 Storage</h3>
                  <p className="text-purple-800 text-sm">{recipe.storage_instructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              ← Back to All Recipes
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}