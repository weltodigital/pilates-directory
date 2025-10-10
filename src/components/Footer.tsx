import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Category {
  id: string;
  name: string;
  slug: string;
  featured: boolean;
}

async function getFeaturedCategories(): Promise<Category[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, featured')
    .eq('featured', true)
    .order('name')
    .limit(8);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export default async function Footer() {
  const categories = await getFeaturedCategories();

  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold text-[#fec52b] font-jakarta">
                Ed's Easy Meals
              </div>
            </Link>
            <p className="text-slate-400 text-sm">
              The internet's most trusted source for easy, delicious recipes that anyone can make.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-jakarta text-[#fec52b]">Popular Recipe Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.slug}`} className="hover:text-[#fec52b] transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-jakarta text-[#fec52b]">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="mailto:hello@edseasymeals.com" className="hover:text-[#fec52b] transition-colors">Contact</a></li>
              <li><Link href="/privacy-policy" className="hover:text-[#fec52b] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-[#fec52b] transition-colors">Terms of Service</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-[#fec52b] transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2025 Ed's Easy Meals. All rights reserved. The internet's most trusted source for easy, delicious recipes that anyone can make.</p>
        </div>
      </div>
    </footer>
  )
}