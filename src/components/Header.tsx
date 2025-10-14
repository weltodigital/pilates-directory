'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export default function Header({ breadcrumbs }: HeaderProps = {}) {
  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}>
              <Image
                src="/Pilates Classes Near.png"
                alt="Pilates Classes Near"
                width={200}
                height={60}
                style={{ height: '3rem', width: 'auto' }}
                priority
              />
            </Link>
          </div>

          <Link
            href="/#browse-counties"
            className="browse-locations-btn"
            style={{
              backgroundColor: '#9333ea',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'background-color 0.2s ease'
            }}
          >
            Browse Locations
          </Link>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '0.75rem',
            marginTop: '1rem'
          }}>
            <nav style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <ol style={{
                display: 'flex',
                gap: '0.5rem',
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}>
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {index > 0 && (
                      <span style={{ color: '#d1d5db' }}>/</span>
                    )}
                    {breadcrumb.href ? (
                      <Link href={breadcrumb.href} style={{
                        color: '#9333ea',
                        textDecoration: 'none'
                      }}>
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span style={{ color: '#1f2937' }}>
                        {breadcrumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}