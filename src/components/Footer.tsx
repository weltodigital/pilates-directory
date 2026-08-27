import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface County {
  id: string;
  name: string;
  slug: string;
  butcher_count: number;
}

async function getFeaturedCounties(): Promise<County[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error('Supabase env vars missing; skipping footer counties.');
    return [];
  }

  const supabase = createClient(url, key);

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

const COMPANY_LINKS = [
  { label: 'For studio owners', href: '/for-studios' },
  { label: 'Add your studio', href: '/add-studio' },
  { label: 'Studio sign in', href: '/studio-login' },
  { label: 'Contact', href: 'mailto:pilatesclassesnear@weltodigital.com' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Sitemap', href: '/sitemap.xml' },
]

export default async function Footer() {
  const counties = await getFeaturedCounties();

  return (
    <footer className="mt-24 border-t border-line bg-surface-sunken">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-block" aria-label="Pilates Classes Near — home">
              <Image
                src="/Pilates Classes Near.png"
                alt="Pilates Classes Near"
                width={200}
                height={60}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              The UK&apos;s most trusted directory for finding the best pilates
              studios and classes near you.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-ink-faint">
              Built in the UK · Updated weekly
            </p>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Popular locations
            </h4>
            <ul className="mt-5 space-y-3">
              {counties.slice(0, 6).map((county) => (
                <li key={county.id}>
                  <Link href={`/${county.slug}`} className="link-quiet text-sm">
                    Pilates in {county.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Company
            </h4>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('mailto:') ? (
                    <a href={link.href} className="link-quiet text-sm">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="link-quiet text-sm">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="text-sm text-ink-faint">
            &copy; {new Date().getFullYear()} Pilates Classes Near. All rights
            reserved. Find the best pilates studios and classes across the UK.
          </p>
        </div>
      </div>
    </footer>
  )
}
