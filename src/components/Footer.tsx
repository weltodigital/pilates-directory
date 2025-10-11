import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface County {
  id: string;
  name: string;
  slug: string;
  butcher_count: number;
}

async function getFeaturedCounties(): Promise<County[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('public_locations')
    .select('id, name, slug, butcher_count')
    .eq('type', 'county')
    .gt('butcher_count', 0)
    .order('butcher_count', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching counties:', error);
    return [];
  }

  return data || [];
}

export default async function Footer() {
  const counties = await getFeaturedCounties();

  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold text-purple-400 font-jakarta">
                Pilates Classes Near
              </div>
            </Link>
            <p className="text-slate-400 text-sm">
              The UK's most trusted directory for finding the best pilates studios and classes near you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-jakarta text-purple-400">Popular Locations</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {counties.slice(0, 6).map((county) => (
                <li key={county.id}>
                  <Link href={`/${county.slug}`} className="hover:text-purple-400 transition-colors">
                    Pilates in {county.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-jakarta text-purple-400">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="mailto:hello@pilatesclassesnear.com" className="hover:text-purple-400 transition-colors">Contact</a></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-purple-400 transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2025 Pilates Classes Near. All rights reserved. Find the best pilates studios and classes across the UK.</p>
        </div>
      </div>
    </footer>
  )
}