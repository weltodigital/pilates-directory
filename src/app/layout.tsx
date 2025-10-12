import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import './minimal.css'
import './force-styles.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
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
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box !important; margin: 0 !important; padding: 0 !important; }
          html, body {
            font-family: 'Inter', sans-serif !important;
            line-height: 1.6 !important;
            color: #1e293b !important;
            background-color: #f8fafc !important;
            min-height: 100vh !important;
          }
          .hero-gradient {
            min-height: 100vh !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .hero-title {
            font-size: 3rem !important;
            font-weight: 800 !important;
            color: #ffffff !important;
            text-align: center !important;
            margin-bottom: 1.5rem !important;
          }
          .hero-subtitle {
            font-size: 1.25rem !important;
            color: #e2e8f0 !important;
            text-align: center !important;
            margin-bottom: 2rem !important;
          }
          nav {
            background-color: #ffffff !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 1rem !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }
          footer {
            background-color: #0f172a !important;
            color: #ffffff !important;
            padding: 3rem 0 !important;
            margin-top: 4rem !important;
          }
          .container {
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 0 1rem !important;
          }
          .grid {
            display: grid !important;
            gap: 2rem !important;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
          }
          .card {
            background: #ffffff !important;
            border-radius: 0.5rem !important;
            padding: 2rem !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
          }
          button, .btn {
            background-color: #9333ea !important;
            color: #ffffff !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 0.375rem !important;
            border: none !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            text-decoration: none !important;
          }
          button:hover, .btn:hover {
            background-color: #7c3aed !important;
          }
        `}} />
      </head>
      <body className={`${inter.className} ${plusJakarta.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
