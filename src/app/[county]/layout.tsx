import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import '../globals.css'
import '../minimal.css'
import '../force-styles.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
})

export default function CountyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}