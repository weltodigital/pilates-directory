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
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
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
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      padding: '3rem 0',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <Link href="/" style={{
              display: 'inline-block',
              marginBottom: '1rem',
              textDecoration: 'none'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#c4b5fd',
                fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif'
              }}>
                Pilates Classes Near
              </div>
            </Link>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              The UK's most trusted directory for finding the best pilates studios and classes near you.
            </p>
          </div>
          <div>
            <h4 style={{
              fontWeight: '600',
              marginBottom: '1rem',
              fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
              color: '#c4b5fd',
              fontSize: '1rem'
            }}>Popular Locations</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {counties.slice(0, 6).map((county) => (
                <li key={county.id} style={{ marginBottom: '0.5rem' }}>
                  <Link href={`/${county.slug}`} style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c4b5fd'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                    Pilates in {county.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{
              fontWeight: '600',
              marginBottom: '1rem',
              fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
              color: '#c4b5fd',
              fontSize: '1rem'
            }}>Company</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="mailto:hello@pilatesclassesnear.com" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>Contact</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/privacy-policy" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>Privacy Policy</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/terms-of-service" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>Terms of Service</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/sitemap.xml" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #1e293b',
          marginTop: '2rem',
          paddingTop: '2rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#94a3b8'
        }}>
          <p>&copy; 2025 Pilates Classes Near. All rights reserved. Find the best pilates studios and classes across the UK.</p>
        </div>
      </div>
    </footer>
  )
}