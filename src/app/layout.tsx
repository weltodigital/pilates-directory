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
  title: 'Pilates Classes Near - Find The Best Pilates Studios Near You | #1 UK Directory',
  description: 'Discover the UK\'s best pilates studios with live class schedules, verified reviews, and instant booking. Find reformer, mat, and clinical pilates classes near you.',
  keywords: 'pilates, reformer pilates, mat pilates, clinical pilates, fitness, UK, studios, classes, instructors, booking, reviews, London, Manchester, Edinburgh, Birmingham',
  openGraph: {
    title: 'Pilates Classes Near - Find The Best Pilates Studios Near You',
    description: 'Discover the UK\'s best pilates studios with live class schedules, verified reviews, and instant booking.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Pilates Classes Near',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilates Classes Near - Find The Best Pilates Studios Near You',
    description: 'Discover the UK\'s best pilates studios with live class schedules, verified reviews, and instant booking.',
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
