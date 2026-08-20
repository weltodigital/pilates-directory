'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: Breadcrumb[];
}

const NAV_LINKS = [
  { label: 'Browse locations', href: '/#browse-counties' },
  { label: 'Featured studios', href: '/#featured-studios' },
]

export default function Header({ breadcrumbs }: HeaderProps = {}) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <div className="shell">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="Pilates Classes Near — home">
            <Image
              src="/Pilates Classes Near.png"
              alt="Pilates Classes Near"
              width={200}
              height={60}
              className="h-10 w-auto sm:h-11"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/#browse-counties" className="pill-brand px-5 py-2.5">
            Find a studio
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="border-t border-line py-3">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-ink-faint" aria-hidden="true">/</span>
                  )}
                  {breadcrumb.href ? (
                    <Link href={breadcrumb.href} className="link-quiet">
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-ink" aria-current="page">
                      {breadcrumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </header>
  )
}
