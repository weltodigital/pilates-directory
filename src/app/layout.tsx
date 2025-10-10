import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
})

export const metadata: Metadata = {
  title: 'Ed\'s Easy Meals - Simple Recipes Anyone Can Make | Easy Cooking Made Simple',
  description: 'Discover thousands of easy recipes with step-by-step instructions. From easy dinner recipes to simple desserts, find quick meals that anyone can cook.',
  keywords: 'easy recipes, easy dinner recipes, easy cake recipes, easy cookie recipes, easy pasta recipes, easy chicken recipes, easy dessert recipes, easy baking recipes, simple recipes, quick recipes, beginner recipes',
  openGraph: {
    title: 'Ed\'s Easy Meals - Simple Recipes Anyone Can Make',
    description: 'Discover thousands of easy recipes with step-by-step instructions. From easy dinner recipes to simple desserts, find quick meals that anyone can cook.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Ed\'s Easy Meals',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ed\'s Easy Meals - Simple Recipes Anyone Can Make',
    description: 'Discover thousands of easy recipes with step-by-step instructions. From easy dinner recipes to simple desserts, find quick meals that anyone can cook.',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${plusJakarta.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
