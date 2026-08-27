import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Pilates Classes Near',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * The admin area shares no chrome with the public site: no header, no footer,
 * nothing that could be mistaken for a page a visitor is meant to reach.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface-sunken">{children}</div>
}
