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
          * { box-sizing: border-box !important; }
          body, h1, h2, h3, h4, h5, h6, p, ul, ol, li { margin: 0; padding: 0; }
          html, body {
            font-family: 'Inter', sans-serif !important;
            line-height: 1.6 !important;
            color: #1e293b !important;
            background-color: #ffffff !important;
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
          }
          footer {
            background-color: #0f172a !important;
            color: #ffffff !important;
            padding: 3rem 0 !important;
            margin-top: 4rem !important;
          }
          .container {
            max-width: 1400px !important;
            margin: 0 auto !important;
            padding: 0 1.5rem !important;
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

          /* All Page Layouts */
          .page-container {
            background: #ffffff !important;
            min-height: 100vh !important;
          }

          /* Headers and Typography */
          h1, h2, h3, h4, h5, h6 {
            color: #1e293b !important;
            font-weight: 600 !important;
            margin-bottom: 1rem !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          h1 { font-size: 2.5rem !important; line-height: 1.2 !important; }
          h2 { font-size: 2rem !important; line-height: 1.3 !important; }
          h3 { font-size: 1.5rem !important; line-height: 1.4 !important; }
          h4 { font-size: 1.25rem !important; }

          p {
            color: #4b5563 !important;
            line-height: 1.6 !important;
            margin-bottom: 1rem !important;
          }

          /* Page Header Section */
          .page-header {
            background: #ffffff !important;
            padding: 2rem 0 !important;
            margin-bottom: 1.5rem !important;
          }

          /* Content Sections */
          .content-section {
            background: #ffffff !important;
            padding: 1.5rem !important;
            margin-bottom: 1.5rem !important;
            border-radius: 0.75rem !important;
            border: 1px solid #f1f5f9 !important;
          }

          /* Card Layouts */
          .studio-card, .location-card {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 0.75rem !important;
            padding: 0 !important;
            margin-bottom: 1.5rem !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
            overflow: hidden !important;
          }

          .studio-card > *:not(:first-child), .location-card > *:not(:first-child) {
            padding: 1.5rem !important;
          }

          .studio-card:hover, .location-card:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
            transform: translateY(-2px) !important;
            border-color: #c4b5fd !important;
          }

          /* Grid Layouts */
          .studios-grid, .locations-grid {
            display: grid !important;
            gap: 1.5rem !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 2rem !important;
          }

          @media (min-width: 768px) {
            .studios-grid, .locations-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (min-width: 1024px) {
            .studios-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }

          /* Studio Card Content */
          .studio-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            margin-bottom: 1rem !important;
          }

          .studio-name {
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            color: #1e293b !important;
            margin-bottom: 0.25rem !important;
          }

          .studio-location {
            color: #6b7280 !important;
            font-size: 0.875rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.25rem !important;
          }

          .studio-rating {
            display: flex !important;
            align-items: center !important;
            gap: 0.25rem !important;
            color: #f59e0b !important;
            font-weight: 500 !important;
            font-size: 0.875rem !important;
          }

          /* Studio Details */
          .studio-details {
            margin: 1rem 0 !important;
          }

          .studio-detail-item {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            color: #6b7280 !important;
            font-size: 0.875rem !important;
          }

          /* Class Types */
          .class-types {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
            margin: 1rem 0 !important;
          }

          .class-type-badge {
            background: #f3e8ff !important;
            color: #7c3aed !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 1rem !important;
            font-size: 0.75rem !important;
            font-weight: 500 !important;
          }

          /* Action Buttons */
          .studio-actions {
            display: flex !important;
            gap: 0.75rem !important;
            margin-top: 1rem !important;
          }

          .btn-primary {
            background: #9333ea !important;
            color: #ffffff !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 0.5rem !important;
            border: none !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            transition: background-color 0.2s !important;
            cursor: pointer !important;
          }

          .btn-primary:hover {
            background: #7c3aed !important;
            color: #ffffff !important;
          }

          .btn-secondary {
            background: transparent !important;
            color: #9333ea !important;
            padding: 0.75rem 1.5rem !important;
            border: 1px solid #9333ea !important;
            border-radius: 0.5rem !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }

          .btn-secondary:hover {
            background: #9333ea !important;
            color: #ffffff !important;
            border-color: #9333ea !important;
          }

          /* Meta Information */
          .meta-badges {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 0.75rem !important;
            margin-bottom: 1.5rem !important;
          }

          .meta-badge {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            background: #f1f5f9 !important;
            color: #475569 !important;
            padding: 0.5rem 1rem !important;
            border-radius: 2rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
          }

          .meta-badge.primary {
            background: #ede9fe !important;
            color: #7c3aed !important;
          }

          .meta-badge.success {
            background: #dcfce7 !important;
            color: #16a34a !important;
          }

          .meta-badge.warning {
            background: #fef3c7 !important;
            color: #d97706 !important;
          }

          /* Sidebar Styles */
          .sidebar {
            background: #ffffff !important;
            padding: 1.5rem !important;
            border-radius: 0.75rem !important;
            border: 1px solid #f1f5f9 !important;
            margin-bottom: 1.5rem !important;
          }

          .sidebar h3 {
            color: #7c3aed !important;
            margin-bottom: 1rem !important;
            font-size: 1.125rem !important;
          }

          .sidebar ul {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .sidebar li {
            margin-bottom: 0.5rem !important;
          }

          .sidebar a {
            color: #6b7280 !important;
            text-decoration: none !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 0.5rem 0 !important;
            transition: color 0.2s !important;
          }

          .sidebar a:hover {
            color: #9333ea !important;
          }

          /* FAQ Styles */
          .faq-section {
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%) !important;
            padding: 2rem !important;
            border-radius: 0.75rem !important;
            margin-bottom: 2rem !important;
          }

          .faq-item {
            margin-bottom: 1.5rem !important;
          }

          .faq-question {
            font-weight: 600 !important;
            color: #1e293b !important;
            margin-bottom: 0.5rem !important;
          }

          .faq-answer {
            color: #4b5563 !important;
            line-height: 1.6 !important;
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
