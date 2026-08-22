import type { Metadata } from 'next'
import { Geist, Fraunces } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  // Makes every relative canonical, Open Graph and Twitter URL absolute.
  // Without it Next warns and social crawlers can receive relative paths.
  metadataBase: new URL('https://www.pilatesclassesnear.com'),
  // Kept near 60 characters so it is not truncated in results, leading with
  // the phrase people actually search.
  title: 'Find Pilates Studios Near You | UK Pilates Directory',
  description: 'Discover the UK\'s best pilates studios with live class schedules, verified reviews, and instant booking. Find reformer, mat, and clinical pilates classes near you.',
  keywords: 'pilates, reformer pilates, mat pilates, clinical pilates, fitness, UK, studios, classes, instructors, booking, reviews, London, Manchester, Edinburgh, Birmingham',
  openGraph: {
    title: 'Pilates Classes Near - Find The Best Pilates Studios Near You',
    description: 'Discover the UK\'s best pilates studios with live class schedules, verified reviews, and instant booking.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Pilates Classes Near',
    url: '/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'A reformer pilates class in a UK studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilates Classes Near - Find The Best Pilates Studios Near You',
    description: 'Discover the UK\'s best pilates studios with live class schedules, verified reviews, and instant booking.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  )
}
